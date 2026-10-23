/** G4 social presentation layer. Ancestral is deliberately not translated or explained in-game. */
export type SocialMood = 'calm' | 'tired' | 'resentful';
export function isNight(hour:number):boolean { return hour >= 20 || hour < 6; }
export function socialUtterance(id:string, second:number, language:'es'|'en', mood:SocialMood, alone:boolean): {kind:'thought'|'speech'; text:string} | null {
  if (!id || !id.trim()) return null;
  // Distinct non-numeric NPC IDs need distinct schedules as well. Previously
  // all such IDs fell back to 1, synchronizing their dialogue unnaturally.
  const digits=id.replace(/\D/g,'');
  let hash=0;
  for (const char of id) hash=(Math.imul(hash,31)+char.charCodeAt(0))>>>0;
  const numeric=digits ? Number(digits) : NaN;
  const n=Number.isSafeInteger(numeric) && numeric>0 ? numeric : (hash%997)+1;
  if (!Number.isFinite(second) || second < 0) return null;
  const slot=Math.floor(second/11);
  if ((slot+n)%4!==0) return null;
  if (alone || (slot+n)%3===0) {
    // Fictional ancestral vocabulary: do not expose its grammar or provenance.
    const ancestral=['Mui…','Fehe…','Kilu…','Gaihu…'];
    return {kind:'thought',text:ancestral[(slot+n)%ancestral.length]};
  }
  const phrases=mood==='resentful' ? ['En el mercado habrá mucho por intercambiar.','Podremos guardar madera trabajada.'] : mood==='tired' ? ['Después de descansar ordenaré el almacén.','Mañana podremos recoger frutos.'] : ['Guardaremos alimentos para otros días.','El almacén será útil para el poblado.'];
  const english=mood==='resentful' ? ['There will be plenty to trade at the market.','We can store worked timber.'] : mood==='tired' ? ['After resting I will tidy the storehouse.','Tomorrow we can gather fruit.'] : ['We will store food for another day.','The storehouse will help the village.'];
  return {kind:'speech',text:(language==='es'?phrases:english)[(slot+n)%2]};
}
export function attributedCommander(_directPlayerSelection:boolean):'Mui' { return 'Mui'; }

/** Night is quiet by default; only an explicit active assignment overrides it. */
export function mayWorkAtNight(hour:number, explicitOrder:boolean):boolean {
  return !isNight(hour) || explicitOrder;
}
export function shouldPauseAutonomousWork(hour:number, explicitOrder:boolean):boolean {
  return isNight(hour) && !explicitOrder;
}

/** Deterministic, bounded social state; no claim of generative cognition. */
export type SocialState = { trustMui:number; resentment:number; fatigueComplaints:number; lastOrderHour:number };
export function initialSocialState():SocialState { return {trustMui:65,resentment:0,fatigueComplaints:0,lastOrderHour:-1}; }
/** Imported saves can contain invalid counters; keep the social simulation finite. */
function boundedSocial(value:number, fallback:number):number {
  return Number.isFinite(value) ? Math.max(0,Math.min(100,value)) : fallback;
}
export function registerMuiOrder(state:SocialState, hour:number, fatigue:number, forcedNight:boolean):SocialState {
  const safeFatigue=boundedSocial(fatigue,0);
  const pressure=(forcedNight?16:0)+(safeFatigue>=70?12:safeFatigue>=45?5:0);
  const resentment=Math.max(0,Math.min(100,boundedSocial(state.resentment,0)+pressure-(pressure===0?2:0)));
  const complaints=Number.isFinite(state.fatigueComplaints) ? Math.max(0,Math.min(Number.MAX_SAFE_INTEGER,Math.floor(state.fatigueComplaints))) : 0;
  return {trustMui:Math.max(0,Math.min(100,boundedSocial(state.trustMui,65)-(pressure>=12?4:0)+(pressure===0?1:0))),resentment,
    fatigueComplaints:Math.min(Number.MAX_SAFE_INTEGER,complaints+(pressure>=12?1:0)),lastOrderHour:Number.isFinite(hour)?hour:-1};
}
export function restSocialState(state:SocialState, hours:number):SocialState {
  const recovery=Number.isFinite(hours)?Math.max(0,Math.min(24,hours)):0;
  return {...state,resentment:Math.max(0,boundedSocial(state.resentment,0)-recovery*2),trustMui:Math.min(100,boundedSocial(state.trustMui,65)+recovery/3)};
}
export function socialReaction(state:SocialState):'cooperative'|'complaint'|'refusal-risk' {
  const resentment=boundedSocial(state?.resentment,0);
  return resentment>=80?'refusal-risk':resentment>=35?'complaint':'cooperative';
}

/** A severe, low-trust guard may independently decline *unassigned* communal work.
 * Direct player orders (understood as Mui's) always take precedence.
 * This does not cancel existing tasks, hauling pairs, or essential survival trips. */
export function autonomousWorkDecision(state:SocialState | null | undefined, explicitlyOrdered:boolean):'work'|'protest' {
  if (explicitlyOrdered || !state) return 'work';
  return boundedSocial(state.resentment,0)>=95 && boundedSocial(state.trustMui,65)<=15 ? 'protest' : 'work';
}

/** An idle guard can independently defer communal construction when exhausted.
 * This never overrides a direct order, a running job, or an essential trip.
 * Extreme distrust is handled by autonomousWorkDecision separately. */
export function autonomousConstructionDecision(fatigue:number, fatigueLimit:number, explicitlyOrdered:boolean):'build'|'recover' {
  if (explicitlyOrdered) return 'build';
  // Fatigue is measured in accumulated work seconds, not percentage points.
  // A threshold of 85 raw units would incorrectly sideline guards after ~85 s.
  const ratio = Number.isFinite(fatigue) && Number.isFinite(fatigueLimit) && fatigueLimit > 0
    ? Math.max(0, fatigue) / fatigueLimit : 0;
  return ratio >= 0.85 ? 'recover' : 'build';
}

/** Autonomous, visual-only protest intensity: complaints are subtle, severe
 * resentment is clearer, and fatigue alone never becomes an accusation.
 * This does not refuse or cancel player orders. */
export function autonomousProtestIntensity(state:SocialState | null | undefined, fatigue:number, resting:boolean, busy:boolean):number {
  if (!state || resting || busy) return 0;
  const resentment=boundedSocial(state.resentment,0);
  const tired=boundedSocial(fatigue,0);
  if (resentment<35) return 0;
  const severity=resentment>=80 ? 1 : (resentment-35)/90+0.25;
  return Math.max(0,Math.min(1,severity*(tired>=70 ? 0.65 : 1)));
}

/** Social pressure remains advisory: the player retains control until refusal gameplay is approved. */
export type SocialEvent = { kind:'support'|'complaint'|'warning'; target:'Mui'; intensity:number; textEs:string; textEn:string };
export function socialEvent(state:SocialState):SocialEvent | null {
  const reaction=socialReaction(state);
  const intensity=boundedSocial(state?.resentment,0);
  if(reaction==='cooperative') return null;
  if(reaction==='refusal-risk') return {kind:'warning',target:'Mui',intensity,textEs:'Conviene descansar antes de preparar el almacén.',textEn:'We should rest before preparing the storehouse.'};
  return {kind:'complaint',target:'Mui',intensity,textEs:'Tenemos mucho que preparar para el mercado.',textEn:'We have plenty to prepare for the market.'};
}
/** Stable conversational slot for a pair, independent of rendering frame rate. */
export function conversationTurn(a:string,b:string,seconds:number):boolean {
  if(a===b || !a?.trim() || !b?.trim() || !Number.isFinite(seconds) || seconds<0) return false;
  const pair=[a,b].sort().join('|');
  let hash=0;for(const c of pair)hash=(hash*31+c.charCodeAt(0))>>>0;
  return (Math.floor(Math.max(0,seconds)/13)+hash)%5===0;
}

/** Keep speech readable and avoid clipping beyond the viewport. */
export function bubbleLayout(centerX:number, topY:number, measuredWidth:number, viewportWidth:number, viewportHeight:number, scale=1) {
  const vw=Math.max(0,Number.isFinite(viewportWidth)?viewportWidth:0);
  const vh=Math.max(0,Number.isFinite(viewportHeight)?viewportHeight:0);
  const margin=vw>=24?6:0;
  const width=Math.min(Math.max(0,vw-2*margin),Math.max(44,(Number.isFinite(measuredWidth)?measuredWidth:0)+16),240);
  const lines=Math.max(1,Math.min(3,Math.ceil(Math.max(0,measuredWidth)/(Math.max(1,width-16)))));
  const height=Math.min(8+lines*17,vh);
  const x=Math.max(margin,Math.min(vw-margin-width,(Number.isFinite(centerX)?centerX:0)-width/2));
  const y=Math.max(0,Math.min(vh-height,Number.isFinite(topY)?topY:0));
  return {x,y,width,height,fontSize:Math.max(10,Math.min(15,10*scale))};
}

/** Pair dialogue alternates speakers in stable time slots, avoiding simultaneous replies. */
export function conversationSpeaker(a:string,b:string,seconds:number):string | null {
  if (!conversationTurn(a,b,seconds)) return null;
  const pair=[a,b].sort();
  return pair[Math.floor(Math.max(0,seconds)/13)%2];
}

/** A paired exchange has one speaker and a distinct reply on the next active slot. */
export function pairedDialogue(a:string,b:string,seconds:number,language:'es'|'en',resentful:boolean): {speaker:string;text:string}|null {
  const speaker=conversationSpeaker(a,b,seconds);
  if(!speaker) return null;
  const first=[a,b].sort()[0]===speaker;
  const es=resentful ? ['¿Qué llevaremos al mercado?','Madera y alimentos conservados.'] : ['¿Cómo va el trabajo?','Avanzamos juntos.'];
  const en=resentful ? ['What shall we take to market?','Timber and preserved food.'] : ['How is the work going?','We are making progress together.'];
  return {speaker,text:(language==='es'?es:en)[first?0:1]};
}

/** A dialogue slot is reserved for both members of a pair, even when only one speaks. */
export function pairedConversationUtterance(a:string,b:string,seconds:number,language:'es'|'en',resentful:boolean,observer:string): {kind:'speech';text:string}|null {
  if (!conversationTurn(a,b,seconds)) return null;
  const exchange=pairedDialogue(a,b,seconds,language,resentful);
  return exchange?.speaker===observer ? {kind:'speech',text:exchange.text} : null;
}

/** Safe, deterministic group mood aggregation. No automatic refusal is triggered. */
export function groupSocialClimate(states:readonly SocialState[]): {mood:'calm'|'uneasy'|'tense'; complaints:number; averageResentment:number} {
  const valid=states.filter(s=>s && Number.isFinite(s.resentment));
  if(!valid.length) return {mood:'calm',complaints:0,averageResentment:0};
  const averageResentment=valid.reduce((sum,s)=>sum+Math.max(0,Math.min(100,s.resentment)),0)/valid.length;
  const complaints=valid.filter(s=>Math.max(0,Math.min(100,s.resentment))>=35).length;
  return {mood:averageResentment>=65?'tense':averageResentment>=30?'uneasy':'calm',complaints,averageResentment};
}


/** Group atmosphere influences dialogue only; it never silently cancels orders. */
export function groupDialogueTone(states:readonly SocialState[]): 'neutral'|'concerned'|'solidarity' {
  const climate=groupSocialClimate(states);
  if(climate.mood==='tense' && climate.complaints>=2) return 'solidarity';
  if(climate.mood!=='calm' && climate.complaints>=1) return 'concerned';
  return 'neutral';
}
export function groupDialogueLine(tone:'neutral'|'concerned'|'solidarity',language:'es'|'en'):string|null {
  if(tone==='neutral') return null;
  if(tone==='solidarity') return language==='es'?'Podríamos organizar juntos el almacén.':'We could organize the storehouse together.';
  return language==='es'?'Mañana podremos preparar provisiones.':'Tomorrow we can prepare supplies.';
}

/** Deterministic social variety without changing orders or inventing ancestral grammar. */
export function socialDialogueVariant(id:string, seconds:number, language:'es'|'en', mood:SocialMood):string|null {
  if(!id?.trim() || !Number.isFinite(seconds) || seconds<0) return null;
  const tick=Math.floor(seconds/17);
  let seed=0; for(const c of id) seed=(seed*33+c.charCodeAt(0))>>>0;
  const lines={
    es:{calm:['¿Necesitas ayuda?','Voy a revisar la madera.','Nos vemos junto a la fogata.'],tired:['Me pesan los brazos.','Descansaré cuando termine.','Esta noche necesito dormir.'],resentful:['En mi pueblo guardábamos frutos secos.','La madera servirá para construir mesas.','Quisiera conocer otros mercados.']},
    en:{calm:['Do you need help?','I will check the timber.','See you by the fire.'],tired:['My arms are aching.','I will rest when finished.','I need sleep tonight.'],resentful:['In my village we stored dried fruit.','The timber will make good tables.','I would like to visit other markets.']}
  };
  return lines[language][mood][(seed+tick)%3];
}

/** G4: stable conversational context. A pair shares a topic and response, rather than unrelated lines. */
export function contextualPairDialogue(a:string,b:string,seconds:number,language:'es'|'en',mood:SocialMood):{speaker:string;text:string}|null {
  const speaker=conversationSpeaker(a,b,seconds);
  if(!speaker) return null;
  const sorted=[a,b].sort();
  // An active exchange occurs every five 13-second slots. Keep the
  // question and its next reply on the same topic, even at cycle boundaries.
  const slot=Math.floor(seconds/13);
  const pair=sorted.join('|');
  let hash=0; for(const c of pair) hash=(hash*31+c.charCodeAt(0))>>>0;
  const phase=(5-hash%5)%5;
  const activeIndex=Math.floor((slot-phase)/5);
  const responder=activeIndex%2!==0;
  const topic=Math.floor(activeIndex/2)%3;
  const es={
    calm:[['¿Qué pondremos en el almacén?','Alimentos y madera trabajada.'],['¿Conoces algún mercado?','En mi pueblo había uno pequeño.'],['¿Qué construiremos después?','Quizá bancos y estantes.']],
    tired:[['¿Cómo conservaban los alimentos?','Los secábamos al sol.'],['¿Qué recuerdas de tu casa?','El olor del pan por la mañana.'],['¿Irás al mercado?','Cuando tengamos provisiones.']],
    resentful:[['¿Qué guardaremos primero?','Frutos y semillas secas.'],['¿Cómo era tu pueblo?','Había un mercado junto al río.'],['¿Y la madera trabajada?','La dejaremos bajo techo.']]
  };
  const en={
    calm:[['What will we put in the storehouse?','Food and worked timber.'],['Do you know any markets?','My village had a small one.'],['What shall we build next?','Perhaps benches and shelves.']],
    tired:[['How did you preserve food?','We dried it in the sun.'],['What do you remember of home?','The smell of bread in the morning.'],['Will you go to market?','Once we have supplies.']],
    resentful:[['What shall we store first?','Dried fruit and seeds.'],['What was your village like?','There was a market by the river.'],['And the worked timber?','We will keep it under a roof.']]
  };
  return {speaker,text:(language==='es'?es:en)[mood][topic][responder?1:0]};
}

/** Both participants must select the same conversational topic and tone. */
export function sharedPairMood(a:SocialMood,b:SocialMood):SocialMood {
  if(a==='resentful' || b==='resentful') return 'resentful';
  if(a==='tired' || b==='tired') return 'tired';
  return 'calm';
}

/** Find an on-screen position for a speech bubble without covering an earlier bubble. */
export function placeSocialBubble(
  preferred:{x:number;y:number;width:number;height:number},
  occupied:readonly {x:number;y:number;width:number;height:number}[],
  viewportWidth:number,viewportHeight:number
):{x:number;y:number;width:number;height:number}|null {
  if (![preferred.x,preferred.y,preferred.width,preferred.height,viewportWidth,viewportHeight].every(Number.isFinite)) return null;
  if (preferred.width<=0 || preferred.height<=0 || viewportWidth<preferred.width || viewportHeight<preferred.height) return null;
  const x=Math.max(0,Math.min(viewportWidth-preferred.width,preferred.x));
  const y=Math.max(0,Math.min(viewportHeight-preferred.height,preferred.y));
  const overlaps=(a:{x:number;y:number;width:number;height:number},b:{x:number;y:number;width:number;height:number})=>
    a.x < b.x+b.width+3 && a.x+a.width+3>b.x && a.y<b.y+b.height+3 && a.y+a.height+3>b.y;
  // Try nearby vertical positions first, keeping the bubble inside the screen.
  for (let step=0;step<=5;step++) {
    const candidate={x,y:Math.max(0,Math.min(viewportHeight-preferred.height,y-step*(preferred.height+5))),width:preferred.width,height:preferred.height};
    if (!occupied.some(other=>overlaps(candidate,other))) return candidate;
  }
  // When there is no room above (for example near the top edge), try below.
  // Keep the same horizontal anchor so speech stays associated with its NPC.
  for (let step=1;step<=5;step++) {
    const nextY=y+step*(preferred.height+5);
    if (nextY+preferred.height>viewportHeight) break;
    const candidate={x,y:nextY,width:preferred.width,height:preferred.height};
    if (!occupied.some(other=>overlaps(candidate,other))) return candidate;
  }
  // On crowded rows, use adjacent columns before hiding a valid utterance.
  // Alternate right/left so bubbles remain as close as possible to the speaker.
  const stride=preferred.width+5;
  for (let step=1;step<=5;step++) {
    for (const direction of [1,-1]) {
      const nextX=x+direction*step*stride;
      if (nextX<0 || nextX+preferred.width>viewportWidth) continue;
      const candidate={x:nextX,y,width:preferred.width,height:preferred.height};
      if (!occupied.some(other=>overlaps(candidate,other))) return candidate;
    }
  }
  // A final diagonal search recovers space in irregular crowds, without
  // moving a bubble off-screen or covering another speaker's message.
  for (let column=1;column<=5;column++) {
    for (const direction of [1,-1]) {
      const nextX=x+direction*column*stride;
      if (nextX<0 || nextX+preferred.width>viewportWidth) continue;
      for (let row=1;row<=5;row++) {
        for (const vertical of [-1,1]) {
          const nextY=y+vertical*row*(preferred.height+5);
          if (nextY<0 || nextY+preferred.height>viewportHeight) continue;
          const candidate={x:nextX,y:nextY,width:preferred.width,height:preferred.height};
          if (!occupied.some(other=>overlaps(candidate,other))) return candidate;
        }
      }
    }
  }
  // Most remaining free spaces start immediately after an occupied edge.
  // Try those exact coordinates before the expensive pixel-by-pixel fallback.
  // This keeps crowded mobile layouts responsive as the NPC count grows.
  const edgeXs=new Set<number>([0,Math.floor(viewportWidth-preferred.width)]);
  const edgeYs=new Set<number>([0,Math.floor(viewportHeight-preferred.height)]);
  for(const rect of occupied){
    if(![rect.x,rect.y,rect.width,rect.height].every(Number.isFinite) || rect.width<=0 || rect.height<=0) continue;
    edgeXs.add(Math.ceil(rect.x+rect.width+3));
    edgeXs.add(Math.floor(rect.x-preferred.width-3));
    edgeYs.add(Math.ceil(rect.y+rect.height+3));
    edgeYs.add(Math.floor(rect.y-preferred.height-3));
  }
  const orderedXs=[...edgeXs].filter(v=>v>=0 && v+preferred.width<=viewportWidth).sort((a,b)=>Math.abs(a-x)-Math.abs(b-x));
  const orderedYs=[...edgeYs].filter(v=>v>=0 && v+preferred.height<=viewportHeight).sort((a,b)=>Math.abs(a-y)-Math.abs(b-y));
  for(const cy of orderedYs){
    for(const cx of orderedXs){
      const candidate={x:cx,y:cy,width:preferred.width,height:preferred.height};
      if(!occupied.some(other=>overlaps(candidate,other))) return candidate;
    }
  }
  // Dense layouts may leave a valid narrow gap between the fixed-stride
  // candidates. Scan remaining horizontal positions only as a last resort.
  // This is bounded by the visible viewport and avoids searching off-screen.
  const maxX=Math.floor(viewportWidth-preferred.width);
  const maxY=Math.floor(viewportHeight-preferred.height);
  const stepX=1; // Narrow gaps can be only one or two pixels wide.
  const stepY=Math.max(1,Math.floor(preferred.height/2));
  // Always inspect the bottom boundary: the stride may skip the only free row.
  const scanRows=Array.from(new Set([...Array.from({length:Math.floor(maxY/stepY)+1},(_,i)=>i*stepY),maxY]));
  for (const dy of scanRows) {
    for (let dx=0;dx<=maxX;dx+=stepX) {
      const candidate={x:dx,y:dy,width:preferred.width,height:preferred.height};
      if (!occupied.some(other=>overlaps(candidate,other))) return candidate;
    }
  }
  return null; // Better to omit a crowded bubble than obscure other dialogue.
}

/** Short connector for a displaced bubble, clamped to its nearest edge. */
export function socialBubbleConnector(bubble:{x:number;y:number;width:number;height:number},speaker:{x:number;y:number}):{x:number;y:number;toX:number;toY:number}|null {
  if (![bubble.x,bubble.y,bubble.width,bubble.height,speaker.x,speaker.y].every(Number.isFinite) || bubble.width<=0 || bubble.height<=0) return null;
  // If the speaker anchor is already inside the bubble, no tether is needed.
  // Otherwise a line would be painted through the text background.
  if (speaker.x>=bubble.x && speaker.x<=bubble.x+bubble.width && speaker.y>=bubble.y && speaker.y<=bubble.y+bubble.height) return null;
  // Connect to the first edge hit by a ray aimed at the bubble centre.
  // This avoids attaching diagonal tethers to an arbitrary corner.
  const cx=bubble.x+bubble.width/2, cy=bubble.y+bubble.height/2;
  const dx=cx-speaker.x, dy=cy-speaker.y;
  if (Math.abs(dx)<1e-9 && Math.abs(dy)<1e-9) return null;
  const hits:number[]=[];
  if(dx!==0){
    for(const edge of [bubble.x,bubble.x+bubble.width]){
      const t=(edge-speaker.x)/dx, y=speaker.y+t*dy;
      if(t>=0 && t<=1 && y>=bubble.y-1e-9 && y<=bubble.y+bubble.height+1e-9) hits.push(t);
    }
  }
  if(dy!==0){
    for(const edge of [bubble.y,bubble.y+bubble.height]){
      const t=(edge-speaker.y)/dy, x=speaker.x+t*dx;
      if(t>=0 && t<=1 && x>=bubble.x-1e-9 && x<=bubble.x+bubble.width+1e-9) hits.push(t);
    }
  }
  if(!hits.length) return null;
  const t=Math.min(...hits);
  const toX=speaker.x+t*dx, toY=speaker.y+t*dy;
  if(Math.hypot(toX-speaker.x,toY-speaker.y)<12) return null;
  return {x:speaker.x,y:speaker.y,toX,toY};
}

/** Keep tethers from crossing other dialogue bubbles in crowded scenes. */
export function socialConnectorUnobstructed(
  connector:{x:number;y:number;toX:number;toY:number},
  occupied:ReadonlyArray<{x:number;y:number;width:number;height:number}>
):boolean {
  if (![connector.x,connector.y,connector.toX,connector.toY].every(Number.isFinite)) return false;
  const dx=connector.toX-connector.x, dy=connector.toY-connector.y;
  return !occupied.some(rect=>{
    if (![rect.x,rect.y,rect.width,rect.height].every(Number.isFinite) || rect.width<=0 || rect.height<=0) return false;
    // Liang-Barsky segment clipping: intersection with rectangle interior.
    let lo=0,hi=1;
    const p=[-dx,dx,-dy,dy];
    const q=[connector.x-rect.x,rect.x+rect.width-connector.x,connector.y-rect.y,rect.y+rect.height-connector.y];
    for(let i=0;i<4;i++){
      if(p[i]===0){if(q[i]<0)return false;continue;}
      const t=q[i]/p[i];
      if(p[i]<0)lo=Math.max(lo,t);else hi=Math.min(hi,t);
      if(lo>hi)return false;
    }
    return lo<hi && hi>0 && lo<1;
  });
}
