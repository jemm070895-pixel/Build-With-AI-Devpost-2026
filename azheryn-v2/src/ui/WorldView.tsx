import { isNight, socialUtterance, shouldPauseAutonomousWork, initialSocialState, registerMuiOrder, restSocialState, socialReaction, socialEvent, autonomousWorkDecision, autonomousConstructionDecision, autonomousProtestIntensity, conversationTurn, conversationSpeaker, pairedDialogue, pairedConversationUtterance, bubbleLayout, placeSocialBubble, socialBubbleConnector, socialConnectorUnobstructed, groupDialogueTone, groupDialogueLine, socialDialogueVariant, contextualPairDialogue, sharedPairMood, type SocialState } from "../world/socialLife";
import { decodePortableSave, exportPortableSave, installPortableSave } from "../world/saveTransfer";
import { BACKUP_SUFFIX, readChapterSave, writeChapterSave } from "../world/saveSlots";
import { recoverStorehouse } from "../world/saveRecovery";
import { materialPlan, supplyMilestones } from "../world/materialPlanner";
import { PEACEFUL_ANIMALS, animalAvoidance } from "../world/peacefulWildlife";
import { speciesForIndex, speciesForTree } from "../world/treeSpecies";
import { fruitForTreeId, fruitPositionsForTreeId, stableTreeSeed } from "../world/treeFruits";
import { useEffect, useRef, useState } from "react";
import { STOREHOUSE_G1, createStorehouseSite, commitStorehouseLogs, type StorehouseSite } from "../world/storehouse";
import { clampCamera, MAX_ZOOM, MIN_ZOOM, type CameraState } from "../world/camera";
import { clamp } from "../world/noise";
import {
  BAKE_SCALE,
  createPainter,
  DETAIL_ZOOM,
  HAZE,
  type BakedWorld,
} from "../world/renderer";
import { createWorld } from "../world/terrain";
import { createClimateClock, weatherLabel, type ClimateSnapshot } from "../world/climate";
import { advanceSurvival, survivalDecision, advanceLogging, createFelledLog, createLoggingOrder, reserveNearestTreeInZone, reserveRememberedLoggingTree, loggingZoneExhausted, fellReservedWorkTree, createOutdoorStockpile, nearestUnstockpiledLog, stockpileSlot, STOCKPILE_CAPACITY, g1CanJoinHaul, chooseG1Haulers, chooseG1SpontaneousHelper, g1CanPerceiveWork, g1ShareWorkKnowledge, g1KnowledgeIsCurrent, type G1WorkKnowledge, g1ProfileForCharacter, G1_FOUNDING_WORK_PROFILES, advanceFatigue, recoverFatigue, fatiguePerformance, g1FatigueDecision, readyToResumeRememberedTask, type FoundingWorkProfile, type OutdoorStockpile, type G1HaulState, type G1WorkTree, type LogState, type WorkOrder } from "../world/work";

type FoundingCharacter = { social?: SocialState; socialRestSeconds?: number; survival?: { hunger:number; thirst:number; danger:number }; id: string; mui: boolean; x: number; y: number; tx: number; ty: number; selected: boolean; order?: WorkOrder; previousOrder?: WorkOrder; work?: number; treeId?: string; loggingZone?: {x:number;y:number}; pendingLoggingZone?: {x:number;y:number}; fatigue?: FoundingWorkProfile; resting?: boolean; manualMove?: boolean; knowledge?: G1WorkKnowledge; helpingNotice?: string; needTrip?: {kind:"water"|"food"; phase:"outbound"|"return"; homeX:number; homeY:number; remaining:number; foodKey?:number} };

const FOUNDING_OFFSETS: [number, number][] = [[0,-22],[-24,-8],[24,-8],[-34,12],[34,12],[-18,28],[18,28],[0,38]];

const PAN_SPEED = 700;
const CHARACTER_SPEED = 8;
const MOVE_KEYS: Record<string, [number, number]> = {
  w: [0, -1],
  arrowup: [0, -1],
  s: [0, 1],
  arrowdown: [0, 1],
  a: [-1, 0],
  arrowleft: [-1, 0],
  d: [1, 0],
  arrowright: [1, 0],
};

export function WorldView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const importSaveRef = useRef<HTMLInputElement>(null);
  const transferKey = "azheryn-v2-g1-o1-save-v1";
  const manualSaveRef = useRef<(() => boolean) | null>(null);
  const saveManually = () => {
    const ok = manualSaveRef.current?.() ?? false;
    window.alert(ok ? t("Partida guardada. Podrás recuperarla al volver a abrir el juego.", "Game saved. You can resume it next time.") : t("No se pudo guardar la partida.", "Could not save the game."));
  };
  const exportSave = () => {
    manualSaveRef.current?.();
    const content = exportPortableSave(localStorage, transferKey);
    if (!content) { window.alert(t("No hay una partida válida para exportar.", "No valid save to export.")); return; }
    const url = URL.createObjectURL(new Blob([content], {type:"application/json"}));
    const link = document.createElement("a"); link.href = url; link.download = "azheryn-capitulo-1-partida.json"; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const importSave = async (file: File | undefined) => {
    if (!file) return;
    try {
      if (file.size > 8_000_000) throw Error("size");
      const value = decodePortableSave(await file.text());
      if (!value) throw Error("format");
      if (!window.confirm(t("¿Restaurar esta partida? Reemplazará el progreso actual.", "Restore this save? It will replace current progress."))) return;
      if (!installPortableSave(localStorage, transferKey, value)) throw Error("storage");
      window.location.reload();
    } catch { window.alert(t("Archivo inválido o almacenamiento no disponible.", "Invalid file or storage unavailable.")); }
    finally { if (importSaveRef.current) importSaveRef.current.value = ""; }
  };
  const [ready, setReady] = useState(false);
  const [language, setLanguage] = useState<"es" | "en">(() => { try { return localStorage.getItem("azheryn-language") === "en" ? "en" : "es"; } catch { return "es"; } });
  const t = (es:string,en:string) => language === "es" ? es : en;
  // Canvas rendering callbacks outlive React renders: always read the current UI language.
  const dialogueLanguageRef = useRef<"es" | "en">(language);
  dialogueLanguageRef.current = language;
  // Simulation notices are stored independently of the interface language.
  // Translate them at render time so switching ES/EN updates existing notices.
  const localizedNotice = (message:string) => {
    if (language === "es") return message.replace(" / Logging area exhausted", "").replace(/^Logging assigned to (\d+) character\(s\)$/, "Tala asignada a $1 guardia(s)");
    const exact:Record<string,string> = {
      "Ya existe una obra de almacén":"A storehouse construction site already exists",
      "Partida local recuperada":"Local save restored",
      "Partida recuperada desde respaldo":"Game restored from backup",
      "Haz clic en un árbol para talarlo o en el terreno del bosque para talar una zona":"Click a tree to fell only that tree, or forest ground to log a zone",
      "No hay árboles libres en esta zona":"No available trees in this area",
      "Obra marcada: 91 troncos del acopio y NPC disponibles":"Construction site marked: 91 stockpiled logs and available NPCs",
      "Zona de acopio marcada":"Stockpile area marked",
      "Los personajes seleccionados están atendiendo sus necesidades":"Selected characters are attending to their needs",
      "Este árbol ya está asignado a otro personaje":"This tree is already assigned to another character",
      "Tala en espera: trasladar troncos al acopio":"Logging paused: move logs to the stockpile",
      "Zona de tala agotada":"Logging area exhausted",
      "¡Almacén construido! Capítulo 1 completado":"Storehouse built! Chapter 1 completed",
      "Selecciona dónde construir el almacén":"Choose where to build the storehouse",
      "Selecciona dónde marcar el acopio":"Choose where to mark the stockpile",
      "Haz clic en el terreno para mover el grupo":"Click terrain to move the squad",
      "Haz clic en el bosque para ordenar la tala":"Click the forest to order logging",
      "Haz clic en el terreno para marcar el acopio":"Click terrain to mark the stockpile",
      "Haz clic en el terreno para colocar el almacén":"Click terrain to place the storehouse",
    };
    if(exact[message]) return exact[message];
    return message.replace(/^Tala asignada: (\d+); en espera: (\d+)$/, "Logging assigned: $1; queued: $2")
      .replace(/^Árbol (.+) marcado para tala por (.+)$/, "Tree $1 marked for felling by $2")
      .replace(/^Tala asignada a (\d+) guardia\(s\)$/, "Logging assigned to $1 character(s)");
  };
  const [logsCount, setLogsCount] = useState({total:0, outdoor:0, waiting:0, stockpilePlaced:false, hauling:false, busyGuards:0, loggers:0, builders:0, collecting:0});
  const [showPlan, setShowPlan] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showSquad, setShowSquad] = useState(false);
  const [squadChosen, setSquadChosen] = useState<string | null>(null);
  const [companionPrompt, setCompanionPrompt] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showConstruction, setShowConstruction] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selection, setSelection] = useState({count:0,mui:false,guards:0});
  const [orderMode, setOrderMode] = useState<"none"|"move"|"logging">("none");
  const orderModeRef = useRef<"none"|"move"|"logging">("none");
  const [buildingMode, setBuildingMode] = useState(false);
  const buildingModeRef = useRef(false);
  const [storehouseTurned, setStorehouseTurned] = useState(false);
  const storehouseTurnedRef = useRef(false);
  const [roofVisible, setRoofVisible] = useState(true);
  const roofVisibleRef = useRef(true);
  const [buildingProgress, setBuildingProgress] = useState({committed:0, complete:false, placed:false});
  const [showChapterVictory, setShowChapterVictory] = useState(false);
  const victoryShownRef = useRef(false);
  const materials = materialPlan(buildingProgress.committed, logsCount.outdoor, logsCount.waiting, logsCount.hauling);
  const milestones = supplyMilestones(buildingProgress.committed, logsCount.outdoor, logsCount.waiting, logsCount.hauling);
  const [online, setOnline] = useState(() => typeof navigator !== "undefined" ? navigator.onLine : false);
  const [climate, setClimate] = useState<ClimateSnapshot | null>(null);
  const [timeSpeed, setTimeSpeed] = useState<0 | 1 | 2 | 4>(1);
  const timeSpeedRef = useRef<0 | 1 | 2 | 4>(1);
  const lastRunningSpeedRef = useRef<1 | 2 | 4>(1);
  const [loggingTarget, setLoggingTarget] = useState<{x:number;y:number} | null>(null);
  const [workNotice, setWorkNotice] = useState<string | null>(null);
  const [stockpileMode, setStockpileMode] = useState(false);
  const [campfireMode, setCampfireMode] = useState(false);
  const [campfirePlaced, setCampfirePlaced] = useState(false);
  const campfireModeRef = useRef(false);
  const stockpileModeRef = useRef(false);
  const loggingTargetRef = useRef<{x:number;y:number} | null>(null);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const world = createWorld();
    const painter = createPainter(world);
    const climateClock = createClimateClock(world.seed);
    climateClock.setSpeed(timeSpeed);
    setClimate(climateClock.snapshot());

    let baked: BakedWorld | null = null;
    let frame = 0;
    let dirty = true;
    let last = performance.now();
    let climateSnapshotElapsed = 0;
    let dragging = false;
    let marquee: {startX:number;startY:number;endX:number;endY:number}|null = null;
    let lastX = 0;
    let lastY = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    const keys = new Set<string>();
    const cam: CameraState = { x: 0, y: 0, zoom: 1 };
    let characters: FoundingCharacter[] = [];
    // Orders from the player are understood by guards as orders from Mui.
    // Social pressure is persisted on each guard; it never silently overrides an order.
    const recordMuiCommand = (ch: FoundingCharacter) => {
      if (ch.mui) return;
      const hour=climateClock.snapshot().hour;
      ch.social=registerMuiOrder(ch.social ?? initialSocialState(), hour, ch.fatigue?.fatigue ?? 0, isNight(hour));
    };
    const publishSelection = () => { const squad=characters.filter(ch=>ch.selected); setSelection({count:squad.length,mui:squad.some(ch=>ch.mui),guards:squad.filter(ch=>!ch.mui).length}); };
    const onSquadAction=(event:Event)=>{const action=(event as CustomEvent<{action:string}>).detail?.action; if(action==="all")characters.forEach(ch=>ch.selected=true); else if(action==="guards")characters.forEach(ch=>ch.selected=!ch.mui); else if(action==="mui")characters.forEach(ch=>ch.selected=ch.mui); else if(action==="clear")characters.forEach(ch=>ch.selected=false); publishSelection();dirty=true;};
    window.addEventListener("azheryn-squad-action",onSquadAction);
    const onIndividualSquad=(event:Event)=>{
      const id=(event as CustomEvent<{id:string}>).detail?.id;
      const chosen=characters.find(ch=>ch.id===id);
      if(!chosen)return;
      if(manualHaulPrimary && !manualHaulHelper && id!==manualHaulPrimary){
        const primary=characters.find(ch=>ch.id===manualHaulPrimary);
        if(chosen.resting || chosen.needTrip || chosen.order || isAnyHauler(chosen.id) || isQueuedWorker(chosen.id)){
          setWorkNotice(t("Ese compañero está ocupado. Selecciona otro.","That companion is busy. Choose another."));return;
        }
        manualHaulHelper=id;manualHaulWaitingForLog=true;setCompanionPrompt(false);
        characters.forEach(ch=>ch.selected=ch.id===primary?.id || ch.id===id);
        publishSelection();setWorkNotice(t("Pareja lista. Haz clic en un tronco caído.","Pair ready. Click a fallen log."));dirty=true;return;
      }
      const sole=chosen.selected && characters.filter(ch=>ch.selected).length===1;
      characters.forEach(ch=>ch.selected=!sole && ch.id===id);
      setSquadChosen(sole?null:id);publishSelection();dirty=true;
    };
    window.addEventListener("azheryn-squad-individual",onIndividualSquad);
    const onSquadHaul=(event:Event)=>{
      const id=(event as CustomEvent<{id:string}>).detail?.id;
      const primary=characters.find(ch=>ch.id===id) ?? characters.find(ch=>ch.selected);
      if(!primary){setWorkNotice(t("Selecciona primero un personaje.","Select a character first."));return;}
      if(primary.resting || primary.needTrip || primary.order || isAnyHauler(primary.id) || isQueuedWorker(primary.id)){
        setWorkNotice(t("Ese personaje está ocupado.","That character is busy."));return;
      }
      if(!stockpile){setWorkNotice(t("Primero coloca el acopio.","Place the stockpile first."));return;}
      manualHaulPrimary=primary.id;manualHaulHelper=null;manualHaulWaitingForLog=false;
      setCompanionPrompt(true);setWorkNotice(t("Necesita un compañero. Elige a Mui u otro guardia en Personajes.","A companion is needed. Choose Mui or another guard in Characters."));dirty=true;
    };
    window.addEventListener("azheryn-squad-haul",onSquadHaul);
    let felledLogs: LogState[] = [];
    let workTrees: G1WorkTree[] = [];
    let stockpile: OutdoorStockpile | null = null;
    let campfire: {x:number;y:number} | null = null;
    let muiLastWander=0;
    let muiHome={x:0,y:0};
    let storehouse: StorehouseSite | null = null;
    let manualHaulPrimary: string | null = null;
    let manualHaulHelper: string | null = null;
    let manualHaulWaitingForLog = false;
    let haul: G1HaulState | null = null;
    // Manual orders wait their turn instead of cancelling an existing pair.
    const queuedHauls: {logId:string; workerIds:[string,string]}[] = [];
    // A direct player hauling order is a continuing assignment, not a one-log job.
    const continuousHaulers = new Set<string>();
    const keepHauling = (pair: FoundingCharacter[]) => {
      if (!stockpile || pair.length!==2 || !pair.every(ch=>continuousHaulers.has(ch.id))) return;
      if (felledLogs.filter(l=>l.stockpiled&&!l.usedForStorehouse).length>=STOCKPILE_CAPACITY) return;
      const next=felledLogs.filter(l=>!l.stockpiled&&!l.usedForStorehouse&&!isQueuedLog(l.id) && haul?.logId!==l.id)
        .sort((a,b)=>Math.hypot(a.x-pair[0].x,a.y-pair[0].y)-Math.hypot(b.x-pair[0].x,b.y-pair[0].y))[0];
      if (!next) return;
      queuedHauls.push({logId:next.id,workerIds:[pair[0].id,pair[1].id]});
      pair.forEach(ch=>{ch.tx=next.x;ch.ty=next.y;});
    };
    // Independent secondary hauling pairs run alongside the original carrier pair.
    const parallelHauls: (G1HaulState & {originX:number;originY:number;stalled:number;lastPositions:Record<string,{x:number;y:number}>})[] = [];
    const isParallelWorker=(id:string)=>parallelHauls.some(job=>job.workerIds.includes(id));
    const isParallelLog=(id:string)=>parallelHauls.some(job=>job.logId===id);
    const isAnyHauler=(id:string)=>Boolean(haul?.workerIds.includes(id)) || isParallelWorker(id);
    const cancelParallel=(job:typeof parallelHauls[number])=>{
      const log=felledLogs.find(l=>l.id===job.logId);
      if(log && !log.stockpiled){log.x=job.originX;log.y=job.originY;}
      for(const ch of characters.filter(ch=>job.workerIds.includes(ch.id))){ch.tx=ch.x;ch.ty=ch.y;}
      const index=parallelHauls.indexOf(job);if(index>=0)parallelHauls.splice(index,1);
      dirty=true;
    };
    const isQueuedWorker=(id:string)=>queuedHauls.some(job=>job.workerIds.includes(id)) || isParallelWorker(id);
    const isQueuedLog=(id:string)=>queuedHauls.some(job=>job.logId===id) || isParallelLog(id);
    let haulOrigin: {x:number;y:number} | null = null;
    let haulStallSeconds = 0;
    let haulLastDistance = Number.POSITIVE_INFINITY;
    let haulLastPositions: Record<string, {x:number;y:number}> = {};
    let knowledgeClock = 0;
    // Wildlife animation follows simulated time, so pausing the game also freezes fauna.
    let wildlifeSimulationSeconds = 0;
    const SAVE_KEY = "azheryn-v2-g1-o1-save-v1";
    const saveGame = (): boolean => {
      if (!baked || characters.length !== 8) return false;
      return writeChapterSave(localStorage, SAVE_KEY, {
        version: 1, characters, felledLogs, workTrees, stockpile, campfire, storehouse,
        camera: {x:cam.x,y:cam.y,zoom:cam.zoom}, savedAt:Date.now()
      });
    };
    // Only the explicit Save button writes progress; closing the tab does not.
    manualSaveRef.current = saveGame;
    const onPageHide = () => { keys.clear(); };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") { keys.clear(); resetInterruptedGestures(); }
      else { last = performance.now(); dirty = true; }
    };
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onVisibilityChange);
    const project = (u: number, v: number) => ({ x: (u - v) * 14 + (baked?.ox ?? 0), y: (u + v) * 13 + (baked?.oy ?? 0) - 24 });
    const toScreen = (p: {x:number;y:number}) => ({ x: (p.x - cam.x) * cam.zoom + width / 2, y: (p.y - cam.y) * cam.zoom + height / 2 });
    const insideWorld = (x:number,y:number) => baked ? {x:clamp(x,0,baked.width),y:clamp(y,0,baked.height)} : {x,y};
    // Wildlife paths are local offsets around the map centre, not absolute canvas coordinates.
    // Both rendering and the animal locator must use the same world-space conversion.
    const wildlifeWorldPosition = (animal: (typeof PEACEFUL_ANIMALS)[number], seconds: number) => {
      const originX = baked?.ox ?? 0, originY = baked?.centerY ?? 0;
      const local = animalAvoidance(animal, seconds, characters.map(ch => ({ x: ch.x - originX, y: ch.y - originY })));
      return { x: (baked?.ox ?? 0) + local.x, y: (baked?.centerY ?? 0) + local.y, alert: local.alert };
    };
    // Select a real water tile instead of an arbitrary offset. Water is sampled
    // from the generated terrain; food remains a separate pending system.
    const nearestWaterDestination = (x:number,y:number) => {
      let best: {x:number;y:number} | null = null;
      let distance = Infinity;
      for (let gy=0; gy<world.size; gy+=2) for (let gx=0; gx<world.size; gx+=2) {
        if (!world.tiles[gy*world.size+gx]?.water) continue;
        const p=project(gx,gy);
        const d=(p.x-x)**2+(p.y-y)**2;
        if(d<distance){distance=d;best=p;}
      }
      return best ? insideWorld(best.x,best.y) : null;
    };
    // Recolección G1/O1: puntos físicos de vegetación comestible simplificada.
    // No representa caza ni inventarios; cada punto tiene recursos agotables.
    const foodPatches = new Map<number,number>();
    for (let gy=2;gy<world.size-2;gy+=4) for(let gx=2;gx<world.size-2;gx+=4){
      const tile=world.tiles[gy*world.size+gx];
      if(!tile.water && tile.meadow>0.45 && tile.wet<0.8) foodPatches.set(gy*world.size+gx,3);
    }
    const nearestFoodDestination=(x:number,y:number)=>{
      let best:{x:number;y:number;key:number}|null=null, distance=Infinity;
      for(const [key,remaining] of foodPatches){
        if(remaining<=0)continue;
        const p=project(key%world.size,Math.floor(key/world.size));
        const d=(p.x-x)**2+(p.y-y)**2;
        if(d<distance){distance=d;best={...p,key};}
      }
      return best;
    };
    // One tree registry controls rendering, picking, logging and saved state.
    // No independent decorative tree sprites: every visible tree can be ordered to fell.
    const drawWorkTrees = () => {
      // One simulation snapshot per tree-render pass, not one per tree.
      const sunlight=climateClock.snapshot();
      const shadowStrength=Math.max(0,Math.min(.26,sunlight.light*.24*(1-sunlight.cloud*.55)));
      const solarHour=sunlight.hour+sunlight.minute/60;
      const solarProgress=Math.max(0,Math.min(1,(solarHour-6)/12));
      for (const tree of workTrees) {
        const s=toScreen(tree), z=cam.zoom;
        if(s.x < -32*z || s.y < -42*z || s.x > width+32*z || s.y > height+42*z)continue;
        if(!tree.standing){
          // Cleared trees leave open ground: no persistent stump or root sprite.
          continue;
        }
        const species=speciesForTree(tree.speciesId);
        // G3: grounded, directionally lit shadows; deterministic per-tree variation.
        // Shadows are culled with their owning tree and disappear after felling.
        if(shadowStrength>.015){
          // Tree shadows follow the simulated sun, not real elapsed time.
          // Pausing the game freezes their direction; advancing game time moves them.
          const shadowX=(1-2*solarProgress)*13*z;
          const shadowY=(5+5*Math.abs(solarProgress-.5)*2)*z;
          ctx.save();
          ctx.fillStyle=`rgba(18,35,19,${shadowStrength.toFixed(3)})`;
          ctx.beginPath();
          ctx.ellipse(s.x+shadowX,s.y+shadowY,(species.crownRadius*1.35+4)*z,Math.max(3,species.crownRadius*.48)*z,-.2,0,Math.PI*2);
          ctx.fill();
          ctx.restore();
        }
        // G2 trunk: dark bark, sunlit edge and a visible root collar.
        ctx.fillStyle="#4a3020";ctx.fillRect(s.x-3*z,s.y-16*z,6*z,18*z);
        ctx.fillStyle="#91653c";ctx.fillRect(s.x-1.8*z,s.y-16*z,1.5*z,17*z);
        ctx.strokeStyle="rgba(42,26,16,.6)";ctx.lineWidth=Math.max(.7,z*.7);
        ctx.beginPath();ctx.moveTo(s.x+1*z,s.y-14*z);ctx.lineTo(s.x+.3*z,s.y-7*z);ctx.lineTo(s.x+1.5*z,s.y-3*z);ctx.stroke();
        ctx.fillStyle="#5c3a24";ctx.beginPath();ctx.ellipse(s.x,s.y+1*z,5*z,2*z,0,0,Math.PI*2);ctx.fill();
        // G4: bark relief and exposed root forks, drawn only on near-camera trees.
        // These belong to the actual selectable tree; no decorative duplicates.
        if (z >= 1.05) {
          ctx.save();
          ctx.strokeStyle="rgba(28,20,13,.42)";
          ctx.lineWidth=Math.max(.65,z*.48);
          for (let groove=0;groove<3;groove++) {
            const gx=s.x+(-1.55+groove*1.4)*z;
            const gy=s.y-(14-groove*2)*z;
            ctx.beginPath();ctx.moveTo(gx,gy);
            ctx.lineTo(gx+(.35-groove*.18)*z,gy+5*z);
            ctx.lineTo(gx+(.05+groove*.12)*z,gy+9*z);ctx.stroke();
          }
          ctx.strokeStyle="rgba(87,55,31,.75)";
          ctx.lineWidth=Math.max(.8,z*1.15);
          ctx.beginPath();ctx.moveTo(s.x-1.5*z,s.y-2*z);
          ctx.quadraticCurveTo(s.x-4*z,s.y+.2*z,s.x-6.5*z,s.y+1.5*z);
          ctx.moveTo(s.x+1.4*z,s.y-2*z);
          ctx.quadraticCurveTo(s.x+4*z,s.y+.2*z,s.x+6.5*z,s.y+1.2*z);
          ctx.stroke();ctx.restore();
        }
        // Five shared silhouettes: each tree remains an independently selectable instance.
        const cx=s.x, cy=s.y-20*z, r=species.crownRadius*z;
        ctx.fillStyle=species.crown;ctx.beginPath();
        switch(species.id){
          case "broadleaf": // Wide, irregular deciduous canopy.
            ctx.ellipse(cx,cy+2*z,r*1.45,r*.83,0,0,Math.PI*2);break;
          case "fruit": // Low, three-lobed fruit tree.
            ctx.arc(cx-r*.55,cy+r*.12,r*.72,0,Math.PI*2);
            ctx.arc(cx+r*.55,cy+r*.12,r*.72,0,Math.PI*2);
            ctx.arc(cx,cy-r*.45,r*.79,0,Math.PI*2);break;
          case "tall": // Tall, pointed conifer.
            ctx.moveTo(cx,cy-r*1.85);ctx.lineTo(cx+r*.92,cy+r*.9);
            ctx.lineTo(cx-r*.92,cy+r*.9);ctx.closePath();break;
          case "dense": // Deep, compact, uneven canopy.
            for(let i=0;i<9;i++){const a=i*Math.PI*2/9;const rr=r*(i%2?1.05:.87);const x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr*.95;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
            ctx.closePath();break;
          case "light": // Slender, elongated light canopy.
            ctx.ellipse(cx,cy-r*.25,r*.65,r*1.55,-.12,0,Math.PI*2);break;
        }
        ctx.fill();
        // Canopy volume: separate shadow and sunlit clusters, varied deterministically by tree ID.
        const seed = stableTreeSeed(tree.id);
        const glint = ((seed * 37) % 13) / 13;
        ctx.fillStyle="rgba(12,36,18,.24)";
        ctx.beginPath();ctx.ellipse(cx+r*.25,cy+r*.32,r*.53,r*.30,.18,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=species.highlight;
        ctx.beginPath();ctx.ellipse(cx-r*(.24+glint*.16),cy-r*.40,r*.33,r*.20,-.3,0,Math.PI*2);ctx.fill();
        // G4 foliage microdetail: zoom-gated leaf/needle facets, deterministic per tree.
        // Facets stay inside the existing canopy and do not create unselectable trees.
        if(z >= 0.78){
          const facets=z>=1.45?11:5;
          for(let k=0;k<facets;k++){
            const a=(seed*0.71+k*2.39996);
            const radial=.18+.57*((seed*17+k*7)%13)/13;
            const fx=cx+Math.cos(a)*r*radial*.88;
            const fy=cy+Math.sin(a)*r*radial*.59;
            ctx.strokeStyle=k%3===0?"rgba(222,239,174,.28)":"rgba(17,48,24,.25)";
            ctx.lineWidth=Math.max(.65,z*.8);
            ctx.beginPath();ctx.moveTo(fx-2*z,fy+z);ctx.lineTo(fx+2*z,fy-z);ctx.stroke();
          }
        }
        if(species.id === "tall") {
          ctx.strokeStyle="rgba(195,223,173,.30)";ctx.lineWidth=Math.max(1,z);
          ctx.beginPath();ctx.moveTo(cx,cy-r*1.5);ctx.lineTo(cx-r*.35,cy+r*.55);ctx.stroke();
        }
        if(species.fruit && z>=.65){
          // Three recognizable tropical fruits, attached only to real standing fruit trees.
          // Tree ID determines variety across reloads; zoom culling avoids tiny noisy dots.
          const fruit=fruitForTreeId(tree.id);
          for(const [dx,dy] of fruitPositionsForTreeId(tree.id)){
            const px=cx+dx*r,py=cy+dy*r;
            // Each fruit hangs from a short branch directed toward the canopy center.
            // This avoids the detached vertical strokes visible at close zoom.
            const stemX=px+(cx-px)*.20,stemY=py+(cy-py)*.20-1.2*z;
            ctx.strokeStyle="#5b6130";ctx.lineWidth=Math.max(.6,.75*z);
            ctx.beginPath();ctx.moveTo(stemX,stemY);ctx.quadraticCurveTo(px,py-3.1*z,px,py-z);ctx.stroke();
            // Tiny leaf at the stalk, with a fixed orientation (no per-frame randomness).
            if(z>=1.05){
              ctx.fillStyle="rgba(111,151,67,.88)";ctx.beginPath();
              ctx.ellipse(stemX-1.15*z,stemY-.4*z,1.45*z,.58*z,-.35,0,Math.PI*2);ctx.fill();
            }
            // G5: a small contact shadow seats the fruit in the foliage instead
            // of making it look like a bright sticker pasted on the canopy.
            // Scale and offset follow zoom; no animation or extra climate queries.
            ctx.fillStyle="rgba(17,43,19,.30)";
            ctx.beginPath();
            ctx.ellipse(px+1.05*z,py+1.55*z,2.15*z,1.25*z,-.22,0,Math.PI*2);
            ctx.fill();
            ctx.fillStyle=fruit.shade;ctx.beginPath();
            if(fruit.shape==="oval")ctx.ellipse(px+.4*z,py+.5*z,1.7*z,2.45*z,.3,0,Math.PI*2);
            else if(fruit.shape==="small")ctx.ellipse(px,py,1.25*z,1.55*z,0,0,Math.PI*2);
            else ctx.arc(px,py,1.85*z,0,Math.PI*2);
            ctx.fill();
            // Species-scaled highlights: a round glint looked oversized on small jobos
            // and did not follow the elongated silhouette of a mango.
            ctx.fillStyle=fruit.skin;ctx.beginPath();
            if(fruit.shape==="oval")ctx.ellipse(px-.35*z,py-.6*z,.65*z,1.05*z,.3,0,Math.PI*2);
            else if(fruit.shape==="small")ctx.ellipse(px-.35*z,py-.45*z,.42*z,.55*z,0,0,Math.PI*2);
            else ctx.arc(px-.5*z,py-.5*z,.85*z,0,Math.PI*2);
            ctx.fill();
          }
        }
        if(tree.reservedBy){
          ctx.strokeStyle="#f6c453";ctx.lineWidth=Math.max(2,2*z);
          ctx.beginPath();ctx.arc(s.x,s.y-20*z,13*z,0,Math.PI*2);ctx.stroke();
        }
      }
    };
    const drawStockpile = () => { if(!stockpile)return; const s=toScreen(stockpile); ctx.strokeStyle="#c9a66b";ctx.lineWidth=2;ctx.setLineDash([6,5]);ctx.strokeRect(s.x-stockpile.radius*0.95*cam.zoom,s.y-stockpile.radius*0.78*cam.zoom,stockpile.radius*1.9*cam.zoom,stockpile.radius*1.56*cam.zoom);ctx.setLineDash([]); };
    const drawStorehouse = () => {
      if (!storehouse) return;
      const center=toScreen(storehouse);
      const scale=cam.zoom;
      const left=center.x-50*scale, top=center.y-30*scale;
      const wallW=100*scale, wallH=60*scale;
      const installed=storehouse.committed;
      ctx.save();
      if (storehouse.turned) { ctx.translate(center.x,center.y);ctx.rotate(Math.PI/2);ctx.translate(-center.x,-center.y); }
      // G2: the construction site has a grounded footprint, timber shadows and
      // a visible foundation even before the first log is delivered.
      ctx.save();
      ctx.fillStyle="rgba(27,23,16,.22)";
      ctx.beginPath();ctx.ellipse(center.x+5*scale,center.y+8*scale,58*scale,36*scale,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="rgba(115,89,56,.23)";
      ctx.fillRect(left,top,wallW,wallH);
      ctx.strokeStyle="rgba(225,197,141,.55)";
      ctx.lineWidth=Math.max(1,1.5*scale);
      ctx.strokeRect(left+3*scale,top+3*scale,wallW-6*scale,wallH-6*scale);
      ctx.restore();
      const drawPost=(x:number,y:number,h:number)=>{
        ctx.strokeStyle="#624226";ctx.lineWidth=Math.max(2,3.5*scale);
        ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-h);ctx.stroke();
      };
      ctx.strokeStyle="#d8b57d";ctx.lineWidth=2;
      ctx.setLineDash([5,5]);ctx.strokeRect(left,top,wallW,wallH);ctx.setLineDash([]);
      // G1/O1: front and rear on short ends; lateral openings at 2–3 m.
      // Visual progress uses 66 wall stages plus 25 roof stages; the material
      // ledger remains authoritative for the 91 whole source logs.
      const wallUnits=Math.min(installed,66);
      for(let i=0;i<wallUnits;i++){
        const side=i<9?0:i<20?1:i<43?2:3;
        const local=side===0?i:side===1?i-9:side===2?i-20:i-43;
        const count=side===0?9:side===1?11:23;
        // Short walls are vertical in the plan (left/right of screen).
        const x=side===0?left:side===1?left+wallW:left+(local+.5)*wallW/count;
        const y=side===0||side===1?top+(local+.5)*wallH/count:(side===2?top:top+wallH);
        // Full-height door on front short wall; rear window; two lateral windows.
        if(side===0 && local>=3 && local<=5)continue;
        if(side===1 && local>=4 && local<=6)continue;
        if(side>=2 && local>=9 && local<=13)continue;
        drawPost(x,y,side>=2&&(local===8||local===14)?13*scale:15*scale);
      }
      // Rustic 1.4 m lintels on each lateral opening, visible before roof.
      if(wallUnits>=43){
        ctx.strokeStyle="#75502e";ctx.lineWidth=Math.max(3,4*scale);
        for(const y of [top,top+wallH]){
          ctx.beginPath();ctx.moveTo(left+wallW*.36,y-12*scale);
          ctx.lineTo(left+wallW*.64,y-12*scale);ctx.stroke();
        }
      }
      // G4: construction details follow the authoritative installed-log count.
      // No extra materials are consumed: these are presentation-only details.
      if (installed > 0 && scale >= .65) {
        const braceCount=Math.min(8,Math.floor(installed/8));
        ctx.save();
        ctx.strokeStyle="rgba(68,43,24,.72)";
        ctx.lineWidth=Math.max(1,1.6*scale);
        for(let b=0;b<braceCount;b++){
          const bx=left+(b+1)*wallW/9;
          const by= b%2===0 ? top+5*scale : top+wallH-5*scale;
          ctx.beginPath();ctx.moveTo(bx-4*scale,by-5*scale);
          ctx.lineTo(bx+4*scale,by+5*scale);ctx.stroke();
          ctx.fillStyle="#3f3023";
          ctx.beginPath();ctx.arc(bx,by,Math.max(.8,1.1*scale),0,Math.PI*2);ctx.fill();
        }
        // Peg joints appear only after their associated wall sections exist.
        // Alternating light and shadow gives the timber frame visible depth.
        const pegCount=Math.min(12,Math.floor(wallUnits/5));
        for(let i=0;i<pegCount;i++){
          const px=left+(i+.7)*wallW/13;
          const py=i%2===0 ? top+2.5*scale : top+wallH-2.5*scale;
          ctx.fillStyle="#c5a174";
          ctx.beginPath();ctx.arc(px-0.6*scale,py-0.6*scale,Math.max(.7,1.2*scale),0,Math.PI*2);ctx.fill();
          ctx.fillStyle="#49321e";
          ctx.beginPath();ctx.arc(px+0.5*scale,py+0.5*scale,Math.max(.5,.75*scale),0,Math.PI*2);ctx.fill();
        }
        // Timber offcuts accumulate beside the worksite as walls progress.
        const scraps=Math.min(6,Math.floor(installed/12));
        for(let i=0;i<scraps;i++){
          const sx=left+(i+1)*wallW/8,sy=top+wallH+7*scale+(i%2)*3*scale;
          ctx.strokeStyle=i%2 ? "#795332" : "#a47a49";
          ctx.lineWidth=Math.max(1.5,2.5*scale);
          ctx.beginPath();ctx.moveTo(sx-3*scale,sy);ctx.lineTo(sx+4*scale,sy-1.5*scale);ctx.stroke();
        }
        ctx.restore();
      }
      // G4: visible assembly milestones. Cross-bracing is installed only after
      // enough real logs have been committed; it never changes the 91-log ledger.
      // The diagonal supports make the growing frame readable at low zoom.
      if (installed >= 24 && scale >= .55) {
        const frameStages = Math.min(4, Math.floor((installed - 16) / 12));
        ctx.save();
        ctx.lineCap = "round";
        for (let stage = 0; stage < frameStages; stage++) {
          const sideX = stage % 2 === 0 ? left + 8 * scale : left + wallW - 8 * scale;
          const upperY = top + (stage < 2 ? 9 : 29) * scale;
          const lowerY = upperY + 19 * scale;
          const slant = (stage % 2 === 0 ? 1 : -1) * 11 * scale;
          ctx.strokeStyle = "rgba(44,29,17,.5)";
          ctx.lineWidth = Math.max(2, 3.5 * scale);
          ctx.beginPath();ctx.moveTo(sideX + 2 * scale, upperY + 2 * scale);
          ctx.lineTo(sideX + slant + 2 * scale, lowerY + 2 * scale);ctx.stroke();
          ctx.strokeStyle = "#a67b49";
          ctx.lineWidth = Math.max(1.5, 2.2 * scale);
          ctx.beginPath();ctx.moveTo(sideX, upperY);
          ctx.lineTo(sideX + slant, lowerY);ctx.stroke();
        }
        ctx.restore();
      }
      const roofUnits=Math.max(0,Math.min(25,installed-66));
      if(roofUnits>0 && (!storehouse.complete || roofVisibleRef.current)){
        // G2: roof timbers cast a soft shadow onto the unfinished interior.
        ctx.fillStyle=`rgba(35,25,18,${Math.min(.34,.08+roofUnits*.009)})`;
        ctx.fillRect(left+3*scale,top+4*scale,wallW-6*scale,wallH-8*scale);
      }
      for(let i=0;i<(storehouse.complete && !roofVisibleRef.current ? 0 : roofUnits);i++){
        const x=left+(i+.5)*wallW/25;
        ctx.strokeStyle="#86603a";ctx.lineWidth=Math.max(2,3.5*scale);
        ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,top+wallH);ctx.stroke();
        ctx.fillStyle="#b78b55";ctx.beginPath();ctx.arc(x,top+wallH,Math.max(1.5,2*scale),0,Math.PI*2);ctx.fill();
        // G4: each installed roof timber gains a sunlit edge and a bark-grain
        // line; neither is drawn before its corresponding log is committed.
        if(scale>=.7){
          ctx.strokeStyle="rgba(221,177,112,.68)";
          ctx.lineWidth=Math.max(.6,.8*scale);
          ctx.beginPath();ctx.moveTo(x-1.1*scale,top+2*scale);
          ctx.lineTo(x-1.1*scale,top+wallH-2*scale);ctx.stroke();
          ctx.strokeStyle="rgba(65,40,23,.43)";
          ctx.beginPath();ctx.moveTo(x+1.1*scale,top+6*scale);
          ctx.lineTo(x+1.1*scale,top+wallH-6*scale);ctx.stroke();
        }
      }
      // G4: wooden roof fastening pins appear as the actual beams arrive.
      // They are presentation-only and use no additional material inventory.
      if(roofUnits>0 && scale>=1 && (!storehouse.complete || roofVisibleRef.current)){
        ctx.save();
        for(let i=0;i<roofUnits;i++){
          const px=left+(i+.5)*wallW/25;
          for(const py of [top+5*scale,top+wallH-5*scale]){
            ctx.fillStyle="rgba(43,30,20,.78)";
            ctx.beginPath();ctx.arc(px+.5*scale,py+.6*scale,Math.max(.6,.95*scale),0,Math.PI*2);ctx.fill();
            ctx.fillStyle="rgba(203,158,99,.85)";
            ctx.beginPath();ctx.arc(px-.35*scale,py-.35*scale,Math.max(.5,.65*scale),0,Math.PI*2);ctx.fill();
          }
        }
        ctx.restore();
      }
      if(storehouse.complete && !roofVisibleRef.current){
        ctx.fillStyle="rgba(202,169,113,.13)";ctx.fillRect(left+5*scale,top+5*scale,wallW-10*scale,wallH-10*scale);
        ctx.strokeStyle="rgba(248,221,166,.7)";ctx.lineWidth=Math.max(2,2*scale);ctx.strokeRect(left+5*scale,top+5*scale,wallW-10*scale,wallH-10*scale);
      }
      ctx.restore();
      const progressLabel=storehouse.complete?"✓ 91/91":`${installed}/91`;
      ctx.save();ctx.font="bold 12px sans-serif";ctx.textAlign="center";
      const labelX=Math.max(36,Math.min(width-36,left+wallW/2));
      const labelY=Math.max(26,top-24*scale);
      const labelW=Math.max(56,ctx.measureText(progressLabel).width+18);
      ctx.fillStyle="rgba(20,42,39,.88)";ctx.beginPath();ctx.roundRect(labelX-labelW/2,labelY-16,labelW,22,7);ctx.fill();
      ctx.fillStyle="#fff0d4";ctx.fillText(progressLabel,labelX,labelY);ctx.restore();
    };
    const drawLogs = () => {
      // Display stored timber as two triangular, upright-end stacks.
      let storedIndex = 0;
      for (const log of felledLogs) {
        if (log.usedForStorehouse) continue;
        const slot = log.stockpiled && stockpile ? stockpileSlot(stockpile, storedIndex++) : null;
        const s=toScreen(slot ?? log),z=cam.zoom;
        if(s.x < -22*z || s.x > width+22*z || s.y < -12*z || s.y > height+12*z)continue;
        if (slot) {
          const lift = slot.level * 3.3*z;
          const baseY=s.y-lift;
          ctx.fillStyle="rgba(25,18,9,.25)";ctx.beginPath();ctx.ellipse(s.x,s.y+2*z,4*z,2*z,0,0,Math.PI*2);ctx.fill();
          ctx.fillStyle="#80532d";ctx.fillRect(s.x-2.5*z,baseY-9*z,5*z,10*z);
          ctx.fillStyle="#bb8a53";ctx.beginPath();ctx.ellipse(s.x,baseY-9*z,2.5*z,1.8*z,0,0,Math.PI*2);ctx.fill();
          ctx.strokeStyle="#4c321e";ctx.lineWidth=Math.max(.7,z*.7);ctx.stroke();
          continue;
        }
        ctx.strokeStyle="rgba(24,20,14,.24)";ctx.lineWidth=Math.max(2,7*z);
        ctx.beginPath();ctx.moveTo(s.x-10*z,s.y+2*z);ctx.lineTo(s.x+10*z,s.y+2*z);ctx.stroke();
        ctx.strokeStyle="#6b4423";ctx.lineWidth=Math.max(2,5*z);
        ctx.beginPath();ctx.moveTo(s.x-10*z,s.y);ctx.lineTo(s.x+10*z,s.y);ctx.stroke();
        if(z>=.75){
          ctx.strokeStyle="rgba(207,164,105,.65)";ctx.lineWidth=Math.max(.65,z);
          ctx.beginPath();ctx.moveTo(s.x-9*z,s.y-1.2*z);ctx.lineTo(s.x+9*z,s.y-1.2*z);ctx.stroke();
          ctx.fillStyle="#b78b59";
          for(const dx of [-10,10]){ctx.beginPath();ctx.ellipse(s.x+dx*z,s.y,1.9*z,2.5*z,0,0,Math.PI*2);ctx.fill();}
        }
      }
    };
    // G2: articulated canvas figures. The Fehe is a short bladed tool,
    // carried at the hip and raised only during a logging action.
    const drawCampfire = () => {
      // User-placed campfire is independent of guard movement.
      if (!campfire) return;
      const s=toScreen(campfire);
      const z=cam.zoom;
      ctx.save();
      ctx.fillStyle="#493529";ctx.beginPath();ctx.ellipse(s.x,s.y,8*z,4*z,0,0,Math.PI*2);ctx.fill();
      for(let i=0;i<5;i++){const a=i*Math.PI*2/5;ctx.fillStyle="#8d8170";ctx.beginPath();ctx.arc(s.x+Math.cos(a)*7*z,s.y+Math.sin(a)*4*z,2.2*z,0,Math.PI*2);ctx.fill();}
      ctx.strokeStyle="#765033";ctx.lineWidth=2*z;ctx.beginPath();ctx.moveTo(s.x-5*z,s.y-2*z);ctx.lineTo(s.x+5*z,s.y+2*z);ctx.moveTo(s.x+5*z,s.y-2*z);ctx.lineTo(s.x-5*z,s.y+2*z);ctx.stroke();
      // An uncovered campfire cannot stay alight in rain or storms.
      if(isNight(climateClock.snapshot().hour) && climateClock.snapshot().rain < .16){
        const fireTime = reducedMotionFrame ? 0 : wildlifeSimulationSeconds * 1000;
        const pulse=1+Math.sin(fireTime/270)*.12;
        ctx.fillStyle="rgba(255,151,43,.14)";ctx.beginPath();ctx.arc(s.x,s.y,24*z*pulse,0,Math.PI*2);ctx.fill();
        // Two flame layers, ember glow and intermittent sparks, all visual-only.
        ctx.fillStyle="rgba(255,75,17,.50)";ctx.beginPath();ctx.arc(s.x,s.y-2*z,5*z*pulse,0,Math.PI*2);ctx.fill();
        const flicker=fireTime/330;
        for(let k=0;k<4;k++){
          const lift=(flicker*.8+k*2.1)%9;
          const drift=Math.sin(flicker*.6+k*2.4)*3;
          ctx.fillStyle=`rgba(255,${160+k*17},67,${(.55-lift*.045).toFixed(3)})`;
          ctx.beginPath();ctx.arc(s.x+drift*z,s.y-(5+lift)*z,Math.max(.5,.95-lift*.065)*z,0,Math.PI*2);ctx.fill();
        }
        ctx.fillStyle="#ffae45";ctx.beginPath();ctx.moveTo(s.x-4*z,s.y);ctx.quadraticCurveTo(s.x-3*z,s.y-13*z*pulse,s.x,s.y-16*z*pulse);ctx.quadraticCurveTo(s.x+7*z,s.y-6*z,s.x+4*z,s.y);ctx.fill();
      }
      // G4: a restrained, wind-drifting smoke column connects the fire to
      // the environment. Zoom-gated and capped at six translucent wisps;
      // it never changes weather, visibility, or NPC behavior.
      if (z >= .85) {
        const smokeTime=(reducedMotionFrame ? 0 : wildlifeSimulationSeconds)/1.8;
        const smokeCloud=climateClock.snapshot().cloud;
        ctx.save();
        for(let i=0;i<6;i++){
          const age=(smokeTime*.34+i/6)%1;
          const drift=(Math.sin(smokeTime*.65+i*1.7)*2+age*(5+smokeCloud*3))*z;
          const rise=(8+age*31)*z;
          const opacity=(1-age)*Math.min(.15,.10+smokeCloud*.04);
          ctx.fillStyle=`rgba(153,148,134,${opacity.toFixed(3)})`;
          ctx.beginPath();
          ctx.ellipse(s.x+drift,s.y-rise,(2+age*5)*z,(1.8+age*3.8)*z,-.22,0,Math.PI*2);
          ctx.fill();
        }
        ctx.restore();
      }
      ctx.restore();
    };
    const drawCharacters = () => {
      // One climate sample per character pass keeps all cast shadows coherent.
      const characterSun = climateClock.snapshot();
      const characterDaylight = Math.max(0, Math.min(1, (characterSun.light - .18) / .62));
      const characterShadowAlpha = characterDaylight * (1 - characterSun.cloud * .65) * .19;
      const characterSolarHour = characterSun.hour + characterSun.minute / 60;
      const characterSolarProgress = Math.max(0, Math.min(1, (characterSolarHour - 6) / 12));
      const occupiedSocialBubbles: {x:number;y:number;width:number;height:number}[] = [];
      // Cache each NPC neighborhood once per frame. Pair detection previously
      // re-sorted every candidate's neighbors for every rendered character.
      const npcNeighborhoods = new Map<string, typeof characters>();
      for (const member of characters) {
        if (member.mui) continue;
        const neighbors = characters.filter(other=>other!==member && !other.mui && Math.hypot(other.x-member.x,other.y-member.y)<11)
          .sort((a,b)=>Math.hypot(a.x-member.x,a.y-member.y)-Math.hypot(b.x-member.x,b.y-member.y) || a.id.localeCompare(b.id));
        npcNeighborhoods.set(member.id,neighbors);
      }
      // Character gestures use simulation time: pause freezes walking, work and dust.
      // Reduced-motion mode keeps character poses still without affecting their tasks.
      const phase = reducedMotionFrame ? 0 : wildlifeSimulationSeconds * (1000 / 220);
      const now = performance.now();
      for (const ch of characters) {
        const s = toScreen({x: ch.x, y: ch.y});
        const z = cam.zoom;
        if (s.x < -35 || s.x > width + 35 || s.y < -65 || s.y > height + 35) continue;
        const moving = Math.hypot(ch.tx-ch.x, ch.ty-ch.y) > 0.5;
        const stride = moving ? Math.sin(phase + Number(ch.id.replace(/\D/g, "")) * 1.7) * 2.7*z : 0;
        const hauling = haul?.active && haul.phase === "delivering" && haul.workerIds.includes(ch.id);
        const logging = ch.order?.kind === "logging";
        const working = logging && !moving && !ch.resting && !ch.needTrip;
        // G2: visible construction gestures only for idle guards at an active site.
        // This is presentation only; commitStorehouseLogs remains authoritative.
        const building = !isNight(characterSun.hour) && !ch.mui && Boolean(storehouse && !storehouse.complete && stockpile) &&
          !moving && !ch.order && !ch.resting && !ch.needTrip &&
          !isAnyHauler(ch.id) &&
          Math.hypot(ch.x-storehouse!.x,ch.y-storehouse!.y) <= 8;
        const buildPulse = building ? Math.sin(phase*.55 + Number(ch.id.replace(/\D/g, ""))) : 0;
        const swing = working ? Math.sin(phase * 0.75) : 0;
        const facing = Math.abs(ch.tx-ch.x) > .2 ? Math.sign(ch.tx-ch.x) : 1;
        const line = (x1:number,y1:number,x2:number,y2:number,color:string,w:number) => {
          ctx.strokeStyle=color; ctx.lineWidth=Math.max(1,w*z);ctx.lineCap="round";
          ctx.beginPath();ctx.moveTo(s.x+x1*z,s.y+y1*z);ctx.lineTo(s.x+x2*z,s.y+y2*z);ctx.stroke();
        };
        // G4: time-of-day cast shadows share the sun direction with the trees.
        // Weather softens the silhouette; night keeps only a faint contact shadow.
        // This is presentation-only and does not alter AI, movement or hit areas.
        if (characterShadowAlpha > .012) {
          const shadowDx = (1 - 2 * characterSolarProgress) * 11 * z;
          const shadowDy = (4 + 4 * Math.abs(characterSolarProgress - .5) * 2) * z;
          ctx.save();
          ctx.fillStyle = `rgba(18,29,22,${characterShadowAlpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.ellipse(s.x + shadowDx, s.y + shadowDy, 8.5*z, 2.6*z, -.15, 0, Math.PI*2);
          ctx.fill();
          ctx.restore();
        }
        // Contact shadow anchors each character to the terrain, even while moving.
        ctx.fillStyle="rgba(15,25,15,.30)";ctx.beginPath();ctx.ellipse(s.x,s.y+3*z,7*z,2.5*z,0,0,Math.PI*2);ctx.fill();
        // Subtle deterministic footsteps; no particle allocations or simulation state.
        if (moving && !hauling && z >= .75) {
          const step = Math.sin(phase + Number(ch.id.replace(/\D/g, "")) * 1.7);
          const dust = Math.max(0, Math.abs(step)-.65) / .35;
          if(dust>.05){
            ctx.fillStyle=`rgba(180,157,111,${Math.min(.23,dust*.18)})`;
            ctx.beginPath();ctx.ellipse(s.x-facing*5*z,s.y+2*z,3.5*z,1.3*z,0,0,Math.PI*2);ctx.fill();
          }
        }
        if(ch.selected){ctx.strokeStyle=ch.mui?"#ffe17b":"#e4f0ce";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(s.x,s.y+3*z,9*z,4*z,0,0,Math.PI*2);ctx.stroke();}
        // Boots and separate walking legs.
        line(-2,-9,-3+stride,-1,"#3b3026",2.8);
        line(2,-9,3-stride,-1,"#3b3026",2.8);
        line(-3+stride,-1,-5+stride,0,"#241e19",2.2);
        line(3-stride,-1,5-stride,0,"#241e19",2.2);
        // Character silhouettes follow the approved Mui and seven-guard reference sheet.
        const guardIndex = Math.max(0, Number(ch.id.replace(/\D/g, "")) - 1);
        const guardTunics = ["#514840", "#5b5047", "#41484b", "#5d4a3d", "#4a403b", "#655449", "#53463d"];
        const guardHair = ["#241b19", "#aa8560", "#242321", "#77543a", "#29211d", "#544036", "#977250"];
        const tunicColor = ch.mui ? "#292b38" : guardTunics[guardIndex % 7];
        const hairColor = ch.mui ? "#241d1b" : guardHair[guardIndex % 7];
        // Cloak shoulders and collar keep the original game scale readable.
        ctx.fillStyle = ch.mui ? "#222936" : "#303036";
        ctx.beginPath();ctx.moveTo(s.x-5.7*z,s.y-19*z);ctx.lineTo(s.x+5.7*z,s.y-19*z);
        ctx.lineTo(s.x+3.5*z,s.y-11*z);ctx.lineTo(s.x-3.5*z,s.y-11*z);ctx.closePath();ctx.fill();
        // Tunic and belt: Mui has a recognizable violet sash.
        ctx.fillStyle=tunicColor;
        ctx.beginPath();ctx.moveTo(s.x-4*z,s.y-20*z);ctx.lineTo(s.x+4*z,s.y-20*z);ctx.lineTo(s.x+4.8*z,s.y-9*z);ctx.lineTo(s.x-4.8*z,s.y-9*z);ctx.closePath();ctx.fill();
        // G4: cloth volume follows the tunic silhouette. At close zoom the
        // light-facing shoulder catches a muted highlight and the opposite
        // side retains a narrow fold shadow; distant characters skip details.
        if (z >= .85) {
          ctx.fillStyle = ch.mui ? "rgba(178,161,201,.20)" : "rgba(226,201,160,.13)";
          ctx.beginPath();ctx.moveTo(s.x-3.5*z,s.y-19*z);
          ctx.lineTo(s.x-1.9*z,s.y-18.5*z);
          ctx.lineTo(s.x-1.2*z,s.y-10.2*z);
          ctx.lineTo(s.x-3.8*z,s.y-10*z);ctx.closePath();ctx.fill();
          ctx.fillStyle="rgba(15,13,18,.20)";
          ctx.beginPath();ctx.moveTo(s.x+2.8*z,s.y-19*z);
          ctx.lineTo(s.x+4*z,s.y-18.5*z);
          ctx.lineTo(s.x+4.6*z,s.y-9.5*z);
          ctx.lineTo(s.x+3.2*z,s.y-10*z);ctx.closePath();ctx.fill();
        }
        // G4: close-range hand-stitched hem, belt buckle and two cloth seams.
        // Purely decorative: no changes to silhouettes, gear or character state.
        if (z >= 1.05) {
          ctx.strokeStyle = ch.mui ? "rgba(190,171,207,.40)" : "rgba(203,180,147,.34)";
          ctx.lineWidth = Math.max(.55, .58*z);
          ctx.setLineDash([1.15*z,1.55*z]);
          ctx.beginPath();ctx.moveTo(s.x-3.8*z,s.y-9.8*z);
          ctx.lineTo(s.x+3.8*z,s.y-9.8*z);ctx.stroke();
          ctx.setLineDash([]);
          line(-.7,-18,-.5,-14,"rgba(20,16,17,.19)",.55);
          line(1.4,-17,1.65,-13,"rgba(20,16,17,.14)",.55);
        }
        line(-4,-12,4,-12,ch.mui?"#d9b568":"#493b2c",1.5);
        if (z >= .95) {
          ctx.fillStyle = ch.mui ? "#e3c57b" : "#b5a184";
          ctx.fillRect(s.x-.95*z,s.y-12.85*z,1.9*z,1.65*z);
          ctx.fillStyle = "#4b392b";
          ctx.fillRect(s.x-.35*z,s.y-12.4*z,.7*z,.7*z);
        }
        // Cross-body strap, tunic seam and simple cloth folds.
        line(-3,-19,3,-11,ch.mui?"#b8a083":"#51432f",.8);
        line(-2,-10,-2,-13,"rgba(25,20,18,.32)",.8);
        ctx.fillStyle=ch.mui?"#b9a4ce":"#97876c";
        ctx.fillRect(s.x-2.6*z,s.y-18*z,1.1*z,2.3*z);
        // G4: exhausted, idle guards lower their arms; active work and Mui's
        // canonical weapon pose remain unchanged. This is visual only.
        const visiblyTired = !ch.mui && !working && !building && !hauling &&
          ((ch.fatigue?.fatigue ?? 0) >= 70 || ch.resting);
        // An upset, awake guard holds a subtly tense idle stance; fatigue and
        // work poses take precedence. This does not affect orders or pathfinding.
        const visiblyUpset = !ch.mui && !ch.resting && !visiblyTired &&
          !moving && !working && !building && !hauling &&
          Boolean(ch.social && socialReaction(ch.social) !== 'cooperative');
        const idleArmY = visiblyTired ? -7 : visiblyUpset ? -13 : -11;
        // A restrained, staggered idle gesture gives frustrated guards body
        // language without issuing, cancelling or refusing any player order.
        // Keep the Fehe hand steady: only the empty arm moves.
        const gestureCycle = (now / 1000 + guardIndex * 2.37) % 11;
        const protestIntensity = autonomousProtestIntensity(ch.social, ch.fatigue?.fatigue ?? 0,
          Boolean(ch.resting), Boolean(moving || working || building || hauling));
        const complaintGesture = visiblyUpset && gestureCycle < 1.6
          ? Math.sin(gestureCycle / 1.6 * Math.PI) * 3.5 * protestIntensity : 0;
        // Arms and a visible Fehe with the canonical violet mineral blade.
        line(-4,-19,-6-complaintGesture,idleArmY-complaintGesture*.45,"#b68a66",2.6);
        const handX=working?facing*(7+4*swing):facing*6;
        const handY=working?-20-5*swing:building?-14-5*buildPulse:hauling?-17:idleArmY;
        line(4,-19,handX,handY,"#b68a66",2.6);
        // While hauling, the Fehe remains sheathed at the belt: the hand carries the log.
        if (hauling) {
          line(-3,-11,-6,-14,"#503521",1.6);
          ctx.fillStyle="#aeb6b6";
          ctx.beginPath();ctx.moveTo(s.x-6*z,s.y-14*z);ctx.lineTo(s.x-7*z,s.y-20*z);ctx.lineTo(s.x-5*z,s.y-19*z);ctx.closePath();ctx.fill();
        }
        line(handX,handY,handX+1.5,handY-3,"#503521",1.6);
        // Fehe canonica: silueta de hoja triangular, punta frontal y seis puntas por lado.
        // Referencia exacta: public/intro/Fehe_original.jpeg (aprobada por el creador).
        if (!hauling) {
          ctx.save();
          ctx.translate(s.x + (handX + facing * 2.4) * z, s.y + (handY - 4.5) * z);
          ctx.rotate(facing * .14);
          const bladeH = 10 * z; // 17 cm de hoja
          const bladeW = 3.2 * z;
          ctx.fillStyle = "#3e205e";
          ctx.strokeStyle = "#a477d2";
          ctx.lineWidth = Math.max(.45, .6 * z);
          ctx.beginPath();
          ctx.moveTo(0, -bladeH);
          for (let j = 1; j <= 6; j++) {
            const yy = -bladeH + j * (bladeH * .78 / 7);
            const ww = bladeW * (j / 7);
            ctx.lineTo(ww * .66, yy - .65 * z);
            ctx.lineTo(ww * 1.22, yy + .12 * z);
            ctx.lineTo(ww * .78, yy + .6 * z);
          }
          ctx.lineTo(bladeW * .48, 0);
          ctx.lineTo(-bladeW * .48, 0);
          for (let j = 6; j >= 1; j--) {
            const yy = -bladeH + j * (bladeH * .78 / 7);
            const ww = bladeW * (j / 7);
            ctx.lineTo(-ww * .78, yy + .6 * z);
            ctx.lineTo(-ww * 1.22, yy + .12 * z);
            ctx.lineTo(-ww * .66, yy - .65 * z);
          }
          ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = "#8b62b4";ctx.beginPath();ctx.moveTo(0,-bladeH);ctx.lineTo(0,0);ctx.stroke();
          // Mango de fibra vegetal marron, no empunadura metalica.
          const handleH = bladeH * (13 / 17); // 13 cm de mango; largo total 30 cm
          ctx.fillStyle = "#493024";ctx.fillRect(-.95*z,0,1.9*z,handleH);
          ctx.strokeStyle = "#a08060";
          for(let k=0;k<6;k++){const wrapY=(k+.3)*handleH/6;ctx.beginPath();ctx.moveTo(-.95*z,wrapY);ctx.lineTo(.95*z,wrapY+handleH/7);ctx.stroke();}
          ctx.restore();
        }
        // G2 construction: the free hand lifts a timber into position.
        // No extra material is created by the drawing routine.
        if(building){
          line(-4,-19,-7,-15-3*buildPulse,"#b68a66",2.6);
          ctx.save();
          ctx.translate(s.x+facing*8*z,s.y+(-18-5*buildPulse)*z);
          ctx.rotate(buildPulse*.14);
          ctx.fillStyle="#77502e";
          ctx.fillRect(-7*z,-2*z,14*z,4*z);
          ctx.strokeStyle="#b18a54";ctx.lineWidth=Math.max(.7,z*.7);
          ctx.strokeRect(-7*z,-2*z,14*z,4*z);
          ctx.restore();
        }
        // G2 impact cue: only while actually chopping, near the target tree.
        // Visual effect only; resource creation remains controlled by simulation.
        if(working && z >= .8 && Math.sin(now/165) > .90){
          const ix=s.x+facing*13*z, iy=s.y-15*z;
          ctx.strokeStyle="rgba(226,199,139,.8)";ctx.lineWidth=Math.max(.7,z);
          for(let i=0;i<3;i++){
            const a=(i-1)*.65;
            ctx.beginPath();ctx.moveTo(ix,iy);ctx.lineTo(ix+(5+2*i)*Math.cos(a)*z,iy+(5+2*i)*Math.sin(a)*z);ctx.stroke();
          }
        }
        // G4: subtle idle breathing and a lowered head while resting. Animation
        // affects only presentation, never fatigue, orders, or the Fehe geometry.
        const idleBreathing = !moving && !working && !building && !hauling;
        const breath = idleBreathing ? Math.sin(phase * .12 + guardIndex * .7) * .24 : 0;
        const headDip = !ch.mui && ch.resting ? 1.25 : 0;
        const headY = -27 + headDip + breath;
        // Non-disruptive autonomous body language; no order refusal or gameplay changes.
        const expressiveIdle = !ch.mui && idleBreathing && !ch.resting;
        const socialDisposition = expressiveIdle && ch.social ? socialReaction(ch.social) : 'cooperative';
        const expressionClock = now / 1000 + guardIndex * 1.83;
        const protestWindow = expressionClock % 9.5;
        const protestShake = socialDisposition !== 'cooperative' && protestWindow < 1.1
          ? Math.sin(protestWindow * Math.PI * 5) * .9 : 0;
        const tiredNod = expressiveIdle && socialDisposition === 'cooperative' && (ch.fatigue?.fatigue ?? 0) >= 65
          ? Math.max(0, Math.sin(expressionClock * 1.1)) * .45 : 0;
        // G4: small, staggered idle glances; resting guards do not scan.
        // The offset is purely visual and does not change movement or AI perception.
        const glanceCycle = (now / 1000 + guardIndex * 2.13) % (7.4 + (guardIndex % 4) * .9);
        const glance = idleBreathing && !ch.resting && socialDisposition === 'cooperative' && glanceCycle > 2.2 && glanceCycle < 4.8
          ? Math.sin((glanceCycle - 2.2) / 2.6 * Math.PI) * (guardIndex % 2 === 0 ? 1 : -1) * .65
          : 0;
        const expressiveGlance = glance + protestShake;
        const expressiveHeadY = headY + tiredNod;
        // Neck, head, hair, and subtle face direction.
        line(0,-21,0,-23+headDip+breath,"#b68a66",2.3);
        // Gentle facial volume: lit cheek and shaded jaw are zoom-gated so
        // distant characters retain their original clear silhouette.
        ctx.fillStyle="#bd9270";ctx.beginPath();ctx.ellipse(s.x+expressiveGlance*z,s.y+expressiveHeadY*z,3.8*z,4.6*z,0,0,Math.PI*2);ctx.fill();
        if(z>=1.25){
          ctx.save();
          ctx.beginPath();ctx.ellipse(s.x+expressiveGlance*z,s.y+expressiveHeadY*z,3.8*z,4.6*z,0,0,Math.PI*2);ctx.clip();
          ctx.fillStyle="rgba(255,218,166,.16)";
          ctx.beginPath();ctx.ellipse(s.x+(expressiveGlance-1.25)*z,s.y+(expressiveHeadY-.65)*z,1.55*z,2.55*z,-.18,0,Math.PI*2);ctx.fill();
          ctx.fillStyle="rgba(65,37,28,.16)";
          ctx.beginPath();ctx.ellipse(s.x+(expressiveGlance+2.8)*z,s.y+(expressiveHeadY+2.4)*z,2.1*z,2.65*z,0,0,Math.PI*2);ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle=hairColor;
        ctx.beginPath();ctx.ellipse(s.x+expressiveGlance*z,s.y+(expressiveHeadY-2.5)*z,3.9*z,2.4*z,0,Math.PI,Math.PI*2);ctx.fill();
        // Facing cue, hairline and tunic collar.
        if(z>=1.1){
          // G4: asynchronous, brief idle blinks keep the camp from looking static.
          // Resting guards keep their eyes closed; no simulation state is changed.
          const blinkCycle = (now / 1000 + guardIndex * 1.37) % (3.8 + (guardIndex % 3) * .65);
          const eyesClosed = (!ch.mui && ch.resting) || (idleBreathing && blinkCycle < .13);
          ctx.fillStyle="#2b221e";
          if (eyesClosed) {
            ctx.fillRect(s.x+(facing*1.2+expressiveGlance)*z,s.y+expressiveHeadY*z,1.5*z,.32*z);
          } else {
            ctx.fillRect(s.x+(facing*1.4+expressiveGlance)*z,s.y+expressiveHeadY*z,.8*z,.8*z);
          }
          // G4: restrained facial expression communicates social state without
          // changing orders, dialogue timing, fatigue or NPC decisions.
          // Resting guards keep a neutral, relaxed brow.
          const facialReaction = !ch.mui && !ch.resting && ch.social
            ? socialReaction(ch.social) : 'cooperative';
          const browY = expressiveHeadY - (facialReaction === 'refusal-risk' ? 1.9 : 1.55);
          ctx.strokeStyle = facialReaction === 'cooperative' ? '#574031' : '#493126';
          ctx.lineWidth = Math.max(.55, z * .48);
          ctx.beginPath();
          ctx.moveTo(s.x+(facing*.7+expressiveGlance)*z,s.y+(browY+(facialReaction==='cooperative' ? 0 : -.35))*z);
          ctx.lineTo(s.x+(facing*2.35+expressiveGlance)*z,s.y+(browY+(facialReaction==='cooperative' ? 0 : .35))*z);
          ctx.stroke();
          ctx.strokeStyle="#76533f";ctx.lineWidth=Math.max(.6,z*.55);
          ctx.beginPath();ctx.moveTo(s.x+(facing*1.5+expressiveGlance)*z,s.y+(expressiveHeadY+2.4)*z);ctx.lineTo(s.x+(facing*2.5+expressiveGlance)*z,s.y+(expressiveHeadY+2.2)*z);ctx.stroke();
        }
        line(-1.7,-20,1.7,-20,ch.mui?"#ddc79a":"#b8a184",.9);
        if(!ch.mui && z>=.85 && s.x>=-190 && s.x<=canvas.width+190 && s.y>=-30 && s.y<=canvas.height+90){
          // Off-screen NPCs cannot display useful dialogue; skip their costly social search.
          const nearby=npcNeighborhoods.get(ch.id) ?? [];
          const alone=nearby.length===0;
          const mood=ch.social && socialReaction(ch.social)!=="cooperative"?"resentful":((ch.fatigue?.fatigue ?? 0)>50 || ch.resting)?'tired':'calm';
          const seconds=knowledgeClock;
          const social=ch.social ? socialEvent(ch.social) : null;
          // A sleeping guard cannot participate in a spoken exchange.
          // Keep the solitary ancestral-thought path available during rest.
          // A pair must be mutually nearest among *awake* guards. Otherwise a
          // third guard can steal a turn, or a resting neighbor can block it.
          const awakeNearby=nearby.filter(other=>!other.resting);
          const partner=!ch.resting ? awakeNearby.find(other=>{
            const theirNearest=npcNeighborhoods.get(other.id)?.find(candidate=>!candidate.resting);
            return theirNearest?.id===ch.id && awakeNearby[0]?.id===other.id;
          }) : undefined;
          const base=socialUtterance(ch.id,seconds,dialogueLanguageRef.current,mood,alone);
          const pairedSlot=partner!==undefined && conversationTurn(ch.id,partner.id,seconds);
          // Sleeping guards do not contribute spoken complaints to an awake group.
          const groupTone=groupDialogueTone([ch,...nearby].filter(member=>!member.resting && member.social).map(member=>member.social!));
          const partnerMood = partner ? (partner.social && socialReaction(partner.social)!=='cooperative' ? 'resentful' : ((partner.fatigue?.fatigue ?? 0)>50 || partner.resting) ? 'tired' : 'calm') : mood;
          const pairMood = sharedPairMood(mood,partnerMood);
          const pairLine=partner ? contextualPairDialogue(ch.id,partner.id,seconds,dialogueLanguageRef.current,pairMood) : null;
          const exchange=pairLine?.speaker===ch.id ? {kind:'speech' as const,text:pairLine.text} : null;
          const collectiveLine=groupDialogueLine(groupTone,dialogueLanguageRef.current);
          // Never replace a paired question/answer with an unrelated group slogan.
          const contextualExchange=exchange;
          const variedText=socialDialogueVariant(ch.id,seconds,dialogueLanguageRef.current,mood);
          const variedBase=base?.kind==='speech' && variedText ? {...base,text:variedText} : base;
          const ambientLine=variedBase?.kind==='speech' && collectiveLine && social ? {...variedBase,text:collectiveLine} : variedBase;
          const utterance=pairedSlot ? contextualExchange : ambientLine;
          // Paired dialogue uses a shared emotional tone for both speakers.
          const bubbleMood=pairedSlot && contextualExchange ? pairMood : mood;
          if(utterance){
            // Resting guards may think, but cannot speak aloud while asleep.
            // Keep the existing social state and dialogue schedule unchanged.
            if (ch.resting && utterance.kind === 'speech') continue;
            ctx.save();ctx.font=`${Math.max(10,10*z)}px sans-serif`;
            const text=utterance.text;const layout=bubbleLayout(s.x,s.y-54*z,ctx.measureText(text).width,canvas.width,canvas.height,z);
            const placement=placeSocialBubble(layout,occupiedSocialBubbles,canvas.width,canvas.height);
            if (!placement) { ctx.restore(); continue; }
            occupiedSocialBubbles.push(placement);
            // During a visible paired exchange, the speaker briefly directs
            // their gaze toward the partner. This is a render-only social cue:
            // it never changes navigation, assignments or simulation state.
            if (utterance.kind === 'speech' && pairedSlot && partner && z >= 1.1 && !ch.resting) {
              const partnerScreen = toScreen(partner);
              const attentionDirection = Math.sign(partnerScreen.x - s.x);
              if (attentionDirection !== 0 && Number.isFinite(partnerScreen.x)) {
                ctx.save();
                ctx.fillStyle = '#2b221e';
                ctx.beginPath();
                ctx.ellipse(s.x + (expressiveGlance + attentionDirection * 1.65) * z,
                  s.y + expressiveHeadY * z, .55 * z, .42 * z, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
              }
            }
            // Articulate only when the speech bubble is actually displayed.
            // Crowded screens may suppress a bubble; the character must not
            // appear to speak silently because of a discarded placement.
            // G4: visible speakers articulate subtly; ancestral thoughts stay silent.
            // The cue is render-only and does not alter conversation or NPC state.
            if (utterance.kind === 'speech' && z >= 1.1 && !ch.resting) {
              const mouthOpen = (Math.floor(now / 175 + guardIndex * 3) % 3) !== 0;
              ctx.save();
              ctx.fillStyle = '#54352c';
              ctx.beginPath();
              ctx.ellipse(s.x+(facing*2+expressiveGlance)*z,s.y+(expressiveHeadY+2.35)*z,
                .75*z,(mouthOpen ? .68 : .19)*z,0,0,Math.PI*2);
              ctx.fill();
              ctx.restore();
            }
            const {x:bx,y:by,width:w}=placement;
            // A subtle tether keeps displaced dialogue associated with its speaker.
            const connector=socialBubbleConnector(placement,{x:s.x,y:s.y-34*z});
            if(connector && socialConnectorUnobstructed(connector,occupiedSocialBubbles.slice(0,-1))){
              ctx.strokeStyle=utterance.kind==='thought'?'rgba(154,139,108,.55)':'rgba(192,203,199,.55)';
              ctx.lineWidth=Math.max(.7,Math.min(1.4,z));
              ctx.beginPath();ctx.moveTo(connector.x,connector.y);ctx.lineTo(connector.toX,connector.toY);ctx.stroke();
            }
            ctx.fillStyle=utterance.kind==='thought'?'rgba(239,233,211,.94)':'rgba(23,42,51,.94)';
            ctx.beginPath();ctx.roundRect(bx,by,w,layout.height,8);ctx.fill();
            // G4: subtle, legible emotional cue. Thoughts keep their own appearance.
            if(utterance.kind==='speech' && bubbleMood!=='calm'){
              ctx.strokeStyle=bubbleMood==='resentful'?'#d8a18a':'#b6c5d0';
              ctx.lineWidth=Math.max(1,Math.min(2,z));
              ctx.stroke();
            }
            ctx.fillStyle=utterance.kind==='thought'?'#24343b':'#f5e9ce';ctx.textAlign='center';ctx.font=`${layout.fontSize}px sans-serif`;
            // Wrap speech instead of silently shrinking/clipping it to a single line.
            const words=text.split(/\s+/);const lines:string[]=[];let current='';
            for(const word of words){const candidate=current?`${current} ${word}`:word;
              if(current && ctx.measureText(candidate).width>w-16 && lines.length<2){lines.push(current);current=word;}
              else current=candidate;
            }
            if(current)lines.push(current);
            const lineHeight=17;const firstBaseline=by+(layout.height-(lines.length-1)*lineHeight)/2+layout.fontSize*.34;
            lines.forEach((line,index)=>ctx.fillText(line,bx+w/2,firstBaseline+index*lineHeight,Math.max(8,w-12)));
            ctx.restore();
          }
        }
      }
    };

    // G2: a single shared log appears between the two workers while they carry it.
    // The source log remains at its origin until delivery is committed by the simulation.
    const drawCarriedLog = (job: G1HaulState | null) => {
      if (!job?.active || job.phase !== "delivering") return;
      const pair = characters.filter(ch => job.workerIds.includes(ch.id));
      if (pair.length !== 2) return;
      // Render guards on opposite sides of the load, even when their
      // navigation targets converge. This is visual-only and does not alter delivery.
      const centerX=(pair[0].x+pair[1].x)/2, centerY=(pair[0].y+pair[1].y)/2;
      const a = toScreen({x:centerX-1.25,y:centerY}), b = toScreen({x:centerX+1.25,y:centerY});
      const z = cam.zoom;
      const midX = (a.x + b.x) / 2, midY = (a.y + b.y) / 2 - 15*z;
      const tilt = Math.atan2(b.y-a.y,b.x-a.x);
      ctx.save();ctx.translate(midX,midY);ctx.rotate(tilt);
      ctx.fillStyle = "#4e321f";ctx.fillRect(-14*z,-3*z,28*z,7*z);
      ctx.fillStyle = "#a47748";ctx.fillRect(-14*z,-3*z,28*z,2*z);
      ctx.fillStyle = "#c0965c";
      for(const end of [-14,14]){ctx.beginPath();ctx.ellipse(end*z,.5*z,2.6*z,3.4*z,0,0,Math.PI*2);ctx.fill();}
      ctx.restore();
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Ignore transient zero-sized layouts during mobile rotation or tab restore.
      if (rect.width < 1 || rect.height < 1) return;
      width = rect.width;
      height = rect.height;
      // G3 mobile: cap the backing-buffer pixel count. High-DPI phones can
      // otherwise allocate several million pixels on every orientation change.
      const nativeDpr = Math.max(1, window.devicePixelRatio || 1);
      // G4: adaptive canvas quality: prioritize crisp laptop imagery while
      // preserving a conservative pixel budget on touch/mobile devices.
      const compactTouch = window.matchMedia("(pointer: coarse)").matches && Math.min(rect.width, rect.height) < 900;
      const maxPixels = 2_000_000; // G3 guaranteed mobile budget
      const renderPixelBudget = compactTouch ? maxPixels : 3_500_000;
      const pixelBudgetDpr = Math.sqrt(maxPixels / Math.max(1, width * height)) * Math.sqrt(renderPixelBudget / maxPixels);
      dpr = Math.max(0.75, Math.min(nativeDpr, 2, pixelBudgetDpr));
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dirty = true;
    };

    // Vista general: imagen ya dibujada. Vista cercana: se dibuja solo la zona visible, siempre nítida.
    const drawBaked = (b: BakedWorld) => {
      const z = cam.zoom;
      const sx = cam.x - width / (2 * z);
      const sy = cam.y - height / (2 * z);
      const x0 = Math.max(0, sx);
      const y0 = Math.max(0, sy);
      const x1 = Math.min(b.width, sx + width / z);
      const y1 = Math.min(b.height, sy + height / z);
      if (x1 <= x0 || y1 <= y0) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        b.canvas,
        x0 * BAKE_SCALE,
        y0 * BAKE_SCALE,
        (x1 - x0) * BAKE_SCALE,
        (y1 - y0) * BAKE_SCALE,
        (x0 - sx) * z,
        (y0 - sy) * z,
        (x1 - x0) * z,
        (y1 - y0) * z,
      );
    };

    // G2: low-cost, world-anchored ground detail. The grid is deterministic,
    // so grass and small stones never jump when the camera moves. Culling and
    // a zoom threshold prevent overdraw when viewing the entire settlement.
    const drawGroundDetail = () => {
      const z = cam.zoom;
      if (z < 0.85) return;
      const spacing = 34;
      const left = cam.x - width / (2*z), right = cam.x + width / (2*z);
      const top = cam.y - height / (2*z), bottom = cam.y + height / (2*z);
      const minX=Math.floor(left/spacing)-1, maxX=Math.ceil(right/spacing)+1;
      const minY=Math.floor(top/spacing)-1, maxY=Math.ceil(bottom/spacing)+1;
      // Hard cap prevents pathological cost on unusually large canvases.
      let drawn=0;
      for(let gy=minY;gy<=maxY && drawn<480;gy++) for(let gx=minX;gx<=maxX && drawn<480;gx++){
        const seed=((gx*73856093)^(gy*19349663))>>>0;
        if(seed%5===0)continue;
        const x=gx*spacing+(seed%19)-9;
        const y=gy*spacing+((seed>>>8)%19)-9;
        // Ground grass and stones must never float over river water or beyond
        // the generated map. Reuse the same inverse projection as rain puddles.
        const groundU=(x-(baked?.ox??0))/14;
        const groundV=(y-(baked?.oy??0)+24)/13;
        const groundX=Math.round((groundU+groundV)/2);
        const groundY=Math.round((groundV-groundU)/2);
        if(groundX<0||groundY<0||groundX>=world.size||groundY>=world.size)continue;
        const detailTile=world.tiles[groundY*world.size+groundX];
        if(!detailTile||detailTile.water)continue;
        const p=toScreen({x,y});
        if(p.x<0||p.x>width||p.y<0||p.y>height)continue;
        drawn++;
        // Match micro-details to the actual biome: rocky ground gets pebbles,
        // meadows get grass, and wet soil has fewer dry seed heads.
        const rockyDetail = detailTile.rock > 0.60;
        const wetDetail = detailTile.wet > 0.70;
        const pebbleDetail = rockyDetail ? seed % 3 !== 0 : seed % 7 === 0;
        if(pebbleDetail){
          ctx.fillStyle=rockyDetail ? "rgba(107,103,91,.40)" : "rgba(98,91,71,.28)";
          ctx.beginPath();ctx.ellipse(p.x,p.y,2.1*z,1.0*z,.2,0,Math.PI*2);ctx.fill();
        }else{
          ctx.strokeStyle=wetDetail ? "rgba(56,104,70,.29)" : detailTile.meadow > .62 ? "rgba(125,155,72,.32)" : seed%3===0 ? "rgba(48,84,43,.27)" : "rgba(119,143,76,.23)";
          ctx.lineWidth=Math.max(.6,.8*z);
          ctx.beginPath();ctx.moveTo(p.x,p.y);
          ctx.lineTo(p.x-2*z,p.y-4*z);
          ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+2*z,p.y-3*z);ctx.stroke();
          // G4 close-up: additional blades, seed heads and fallen leaves;
          // deterministic per cell and omitted at low zoom for mobile GPUs.
          if (z >= 1.35) {
            ctx.beginPath();
            ctx.moveTo(p.x+1.2*z,p.y);
            ctx.quadraticCurveTo(p.x+3*z,p.y-3*z,p.x+1.4*z,p.y-6*z);
            ctx.moveTo(p.x-1.1*z,p.y);
            ctx.quadraticCurveTo(p.x-3*z,p.y-2*z,p.x-4*z,p.y-4.5*z);
            ctx.stroke();
            if (!wetDetail && seed % 13 === 1) {
              ctx.fillStyle = "rgba(179,154,83,.48)";
              ctx.beginPath();ctx.ellipse(p.x+1.4*z,p.y-6*z,1.1*z,.65*z,.35,0,Math.PI*2);ctx.fill();
            }
          }
          // Damp soil supports short reeds; use deterministic cell seeds so
          // their positions do not flicker as the camera moves.
          // The water exclusion above prevents reeds from growing in the river.
          if (wetDetail && z >= 1.15 && seed % 7 === 2) {
            ctx.save();
            ctx.strokeStyle = "rgba(59,101,68,.52)";
            ctx.lineWidth = Math.max(.7, .85*z);
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(p.x-2*z,p.y+1*z);
            ctx.quadraticCurveTo(p.x-4*z,p.y-5*z,p.x-2.5*z,p.y-9*z);
            ctx.moveTo(p.x+1*z,p.y+1*z);
            ctx.quadraticCurveTo(p.x+3*z,p.y-4*z,p.x+4*z,p.y-7*z);
            ctx.stroke();
            ctx.fillStyle = "rgba(103,83,49,.48)";
            ctx.beginPath(); ctx.ellipse(p.x-2.5*z,p.y-9*z,.75*z,2*z,-.18,0,Math.PI*2);ctx.fill();
            ctx.restore();
          }
          if (!wetDetail && z >= 1.55 && seed % 11 === 2) {
            ctx.fillStyle = seed % 2 ? "rgba(147,108,54,.45)" : "rgba(110,130,65,.46)";
            ctx.beginPath();
            ctx.ellipse(p.x+5*z,p.y+3*z,3.1*z,1.2*z,-.45,0,Math.PI*2);ctx.fill();
            ctx.strokeStyle = "rgba(66,73,42,.35)";
            ctx.beginPath();ctx.moveTo(p.x+3*z,p.y+4*z);ctx.lineTo(p.x+7*z,p.y+2*z);ctx.stroke();
          }
        }
      }
    };

    // G4: rain-darkened ground and restrained puddle reflections. These are
    // screen-space highlights anchored to world coordinates (no visual sliding
    // when panning). Sparse cells and a zoom gate bound the draw cost.
    const drawG4WetGround = (rain:number, light:number) => {
      if (rain < .12 || cam.zoom < .9) return;
      const z=cam.zoom;
      const spacing=91;
      const left=cam.x-width/(2*z), right=cam.x+width/(2*z);
      const top=cam.y-height/(2*z), bottom=cam.y+height/(2*z);
      const minX=Math.floor(left/spacing), maxX=Math.ceil(right/spacing);
      const minY=Math.floor(top/spacing), maxY=Math.ceil(bottom/spacing);
      let count=0;
      ctx.save();
      for(let gy=minY;gy<=maxY && count<110;gy++) for(let gx=minX;gx<=maxX && count<110;gx++){
        const seed=((gx*73856093)^(gy*19349663))>>>0;
        if(seed%4!==1)continue;
        const x=gx*spacing+(seed%43)-21;
        const y=gy*spacing+((seed>>>8)%43)-21;
        // World-space puddles belong on damp land, never on river tiles,
        // dry rock or outside the generated terrain. Invert project(u,v).
        const projectedU=(x-(baked?.ox??0))/14;
        const projectedV=(y-(baked?.oy??0)+24)/13;
        const tileX=Math.round((projectedU+projectedV)/2);
        const tileY=Math.round((projectedV-projectedU)/2);
        if(tileX<0||tileY<0||tileX>=world.size||tileY>=world.size)continue;
        const groundTile=world.tiles[tileY*world.size+tileX];
        if(!groundTile||groundTile.water||groundTile.wet<.18)continue;
        const p=toScreen({x,y});
        if(p.x<0||p.x>width||p.y<0||p.y>height)continue;
        count++;
        const w=(5+(seed%7))*z, h=(1.2+(seed%3)*.45)*z;
        ctx.fillStyle=`rgba(23,43,47,${Math.min(.22,rain*.16).toFixed(3)})`;
        ctx.beginPath();ctx.ellipse(p.x,p.y,w,h,-.08,0,Math.PI*2);ctx.fill();
        if(light>.25){
          ctx.strokeStyle=`rgba(206,223,213,${Math.min(.24,rain*light*.23).toFixed(3)})`;
          ctx.lineWidth=Math.max(.6,z*.65);
          ctx.beginPath();ctx.moveTo(p.x-w*.6,p.y-h*.1);
          ctx.quadraticCurveTo(p.x,p.y-h*.65,p.x+w*.42,p.y-h*.2);ctx.stroke();
        }
      }
      ctx.restore();
    };

    // G4: restrained current glints on actual river tiles. Sample the fixed
    // terrain grid, not screen coordinates, so ripples never float over land.
    // Cap draw calls and skip distant zoom levels on smaller devices.
    const drawG4RiverGlints = (light:number, cloud:number) => {
      if (cam.zoom < 1.05 || light < .12) return;
      const z=cam.zoom;
      const reduced=reducedMotionFrame;
      const phase=reduced?0:wildlifeSimulationSeconds/1.85;
      const alpha=Math.min(.30,Math.max(.045,light*(1-cloud*.5)*.27));
      let drawn=0;
      const limit=width<480?22:68;
      ctx.save();
      ctx.lineWidth=Math.max(.7,z*.65);
      ctx.strokeStyle=`rgba(214,235,229,${alpha.toFixed(3)})`;
      for(let gy=2;gy<world.size-2 && drawn<limit;gy+=3){
        for(let gx=2;gx<world.size-2 && drawn<limit;gx+=3){
          const seed=((gx*73856093)^(gy*19349663))>>>0;
          if(seed%5!==0 || !world.tiles[gy*world.size+gx]?.water)continue;
          const p=toScreen(project(gx,gy));
          if(p.x<12||p.x>width-12||p.y<12||p.y>height-12)continue;
          const drift=Math.sin(phase+seed%17)*2.2*z;
          const span=(3+seed%4)*z;
          ctx.beginPath();
          ctx.moveTo(p.x-span*.65+drift,p.y);
          ctx.quadraticCurveTo(p.x+drift,p.y-z*.75,p.x+span+drift,p.y-z*.25);
          ctx.stroke();
          drawn++;
        }
      }
      ctx.restore();
    };

    // G4: subtle canopy light shafts. Purely visual, bounded by viewport,
    // and frozen (not hidden) for reduced-motion users.
    const drawG4CanopyLight = (light:number, cloud:number) => {
      if (light < .45 || cloud > .75 || width < 480) return;
      const strength = Math.min(.055, (light-.45)*.095) * (1-cloud);
      const phase = reducedMotionFrame ? 0 : wildlifeSimulationSeconds/12;
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let i=0; i<4; i++) {
        const x = ((i*0.29 + .08 + Math.sin(phase+i)*.015)%1)*width;
        const gradient=ctx.createLinearGradient(x,0,x+width*.13,height*.8);
        gradient.addColorStop(0,`rgba(255,243,193,${strength})`);
        gradient.addColorStop(1,"rgba(255,243,193,0)");
        ctx.fillStyle=gradient;
        ctx.beginPath();
        ctx.moveTo(x,0);ctx.lineTo(x+width*.045,0);
        ctx.lineTo(x+width*.20,height*.8);ctx.lineTo(x+width*.09,height*.8);
        ctx.closePath();ctx.fill();
      }
      ctx.restore();
    };

    // G3: environmental atmosphere, independent from gameplay simulation.
    // Cloud shadows drift across the ground; twilight brings sparse fireflies
    // along the wooded clearing, without adding lights or new player actions.
    const drawG3Atmosphere = (light:number, cloud:number) => {
      const now=reducedMotionFrame ? 0 : wildlifeSimulationSeconds;
      const z=cam.zoom;
      if (light>.22 && cloud>.12) {
        ctx.save();
        ctx.fillStyle=`rgba(31,43,48,${Math.min(.115,cloud*.11)*Math.min(1,light*2)})`;
        const drift=now*1.6;
        for(let i=0;i<7;i++){
          const wx=((i*163+drift)%1050)-525;
          const wy=((i*137)%740)-370;
          const p=toScreen({x:wx,y:wy});
          const rx=Math.max(35,105*z),ry=Math.max(12,30*z);
          if(p.x+rx<0||p.x-rx>width||p.y+ry<0||p.y-ry>height)continue;
          ctx.beginPath();ctx.ellipse(p.x,p.y,rx,ry,-.18,0,Math.PI*2);ctx.fill();
        }
        ctx.restore();
      }
      if(light<.45 && light>.07){
        const twilight=Math.min(1,(.45-light)*5,(light-.07)*9);
        ctx.save();
        for(let i=0;i<34;i++){
          const wx=((i*131+37)%620)-310;
          const wy=((i*179+91)%540)-270;
          // Keep glimmers out of the central open area and river channel.
          if(Math.hypot(wx,wy)<85 || Math.abs(wx)<17)continue;
          const p=toScreen({x:wx,y:wy});
          if(p.x<0||p.x>width||p.y<0||p.y>height)continue;
          const flicker=.55+.45*Math.sin(now*1.4+i*2.31);
          ctx.fillStyle=`rgba(231,240,151,${(twilight*flicker*.68).toFixed(3)})`;
          ctx.beginPath();ctx.arc(p.x+Math.sin(now*.5+i)*3*z,p.y+Math.cos(now*.65+i)*2*z,Math.max(.8,1.5*z),0,Math.PI*2);ctx.fill();
        }
        ctx.restore();
      }
    };

    // G3 weather pass: restrained fog banks and rain impact rings. Screen-space
    // effects are bounded and animated; they do not change terrain or physics.
    const drawG3WeatherDetails = (rain:number, cloud:number, light:number) => {
      // Keep the weather visible but freeze decorative movement for accessibility.
      const reduceWeatherMotion = reducedMotionFrame;
      const time=reduceWeatherMotion ? 0 : wildlifeSimulationSeconds;
      if (cloud>.45 && rain<.18) {
        ctx.save();
        const opacity=Math.min(.10,(cloud-.45)*.17)*(1-Math.max(0,light-.8));
        for(let i=0;i<5;i++){
          const x=((i*233+time*5)%(width+280))-140;
          const y=height*(.28+i*.13);
          const grad=ctx.createRadialGradient(x,y,2,x,y,Math.max(80,width*.32));
          grad.addColorStop(0,`rgba(210,222,220,${opacity})`);
          grad.addColorStop(1,'rgba(210,222,220,0)');
          ctx.fillStyle=grad;
          ctx.beginPath();ctx.ellipse(x,y,Math.max(80,width*.32),28+cloud*25,0,0,Math.PI*2);ctx.fill();
        }
        ctx.restore();
      }
      if(rain>.12){
        ctx.save();
        ctx.strokeStyle=`rgba(207,231,240,${Math.min(.32,rain*.24)})`;
        ctx.lineWidth=1;
        const count=Math.min(48,Math.floor(rain*45));
        for(let i=0;i<count;i++){
          const x=((i*127.7)%Math.max(1,width));
          const y=((i*73.3)%Math.max(1,height));
          const phase=(time*.8+i*.37)%1;
          ctx.beginPath();
          ctx.ellipse(x,y,2+phase*8,1+phase*3,0,0,Math.PI*2);
          ctx.stroke();
        }
        ctx.restore();
      }
    };

    // G3 wildlife is decorative and peaceful: it never blocks orders or changes saves.
    const drawPeacefulWildlife = (wildlifeLight: ReturnType<typeof climateClock.snapshot>) => {
      const time = wildlifeSimulationSeconds;
      // Keep wildlife navigation intact while honoring the player's reduced-motion setting.
      // Only decorative micro-animations are paused; positions and avoidance still update.
      const reduceWildlifeMotion = reducedMotionFrame;
      // One climate sample per frame: animal shadows share the same daylight as the forest.
      const wildlifeShadowLight = Math.max(0, Math.min(1, wildlifeLight.light * (1 - wildlifeLight.cloud * .6)));
      for (const animal of PEACEFUL_ANIMALS) {
        const worldPosition = wildlifeWorldPosition(animal, time);
        const p = toScreen(worldPosition);
        if (p.x < -45 || p.x > width + 45 || p.y < -45 || p.y > height + 45) continue;
        const scale = Math.max(.85, Math.min(2, cam.zoom));
        const future = wildlifeWorldPosition(animal, time + .2);
        const facing = future.x >= worldPosition.x ? 1 : -1;
        const motionTime = reduceWildlifeMotion ? 0 : time;
        const hopping = animal.kind === "rabbit" && !reduceWildlifeMotion ? Math.abs(Math.sin(motionTime * (worldPosition.alert ? 6 : 3.2) + animal.phase)) * 3 : 0;
        // Birds have a small independent flight altitude; ground shadows stay
        // anchored instead of rising with the animal. Reduced motion freezes bobbing.
        const flightHeight = animal.kind === "bird" ? 9 + (reduceWildlifeMotion ? 0 : Math.sin(motionTime * 1.8 + animal.phase) * 2) : 0;
        const bodyLift = hopping + flightHeight;
        ctx.save(); ctx.translate(p.x, p.y - bodyLift * scale); ctx.scale(scale * facing, scale);
        // Contact shadows soften and widen as the animal rises above the ground.
        const shadowAlpha = animal.kind === "bird" ? .11 : animal.kind === "rabbit" ? Math.max(.09,.20-hopping*.025) : .20;
        // Two-layer ground shadow: a broad, faint penumbra and a smaller core.
        // The shadow stays at ground level even when rabbits hop or birds fly.
        // Daylight/cloud cover drives both layers without extra climate reads.
        const shadowWidth = animal.kind === "bird" ? 10 : animal.kind === "rabbit" ? 9 : 12;
        const shadowHeight = animal.kind === "bird" ? 2.2 : 3;
        ctx.fillStyle = `rgba(15,26,17,${(shadowAlpha * wildlifeShadowLight * .34).toFixed(3)})`;
        ctx.beginPath(); ctx.ellipse(0, 3+bodyLift, shadowWidth * 1.42, shadowHeight * 1.7, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = `rgba(15,26,17,${(shadowAlpha * wildlifeShadowLight * .74).toFixed(3)})`;
        ctx.beginPath(); ctx.ellipse(0, 3+bodyLift, shadowWidth, shadowHeight, 0, 0, Math.PI*2); ctx.fill();
        // G4: distinct wildlife silhouettes, animated anatomy and close-up detailing.
        // Decorative only: no new hunting, collisions or AI decisions.
        const detailed = cam.zoom >= 1.05;
        if (animal.kind === "bird") {
          const flap = Math.sin(motionTime * 7 + animal.phase);
          ctx.strokeStyle = "#b9a47c"; ctx.lineWidth = 3; ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(-2,-6); ctx.quadraticCurveTo(-9,-14-flap*5,-15,-9-flap*8);
          ctx.moveTo(2,-6); ctx.quadraticCurveTo(9,-14-flap*5,15,-9-flap*8); ctx.stroke();
          // Layered primary feathers follow the wing stroke, not a static fan.
          // Close camera only: no extra simulation work for distant birds.
          if (detailed) {
            ctx.strokeStyle="rgba(222,205,164,.88)";
            ctx.lineWidth=1.25;
            for (const side of [-1,1]) {
              for (let feather=0;feather<4;feather++) {
                const span=7+feather*2.15;
                const wingY=-12-flap*(4+feather*1.15);
                ctx.beginPath();
                ctx.moveTo(side*(3+feather*1.7),-9-flap*2);
                ctx.quadraticCurveTo(side*(span+2),wingY-2,side*(span+3),wingY+3);
                ctx.stroke();
              }
            }
          }
          // Near-camera wing coverts: small overlapping feathers soften the
          // silhouette and move with each wing instead of floating in place.
          if (detailed) {
            ctx.save();
            ctx.lineCap="round";
            for (const side of [-1,1]) {
              for (let covert=0;covert<3;covert++) {
                const rootX=side*(4+covert*2.4);
                const lift=flap*(2.5+covert*1.15);
                ctx.strokeStyle=covert===0 ? "rgba(231,214,176,.68)" : "rgba(66,57,42,.58)";
                ctx.lineWidth=1.65-covert*.17;
                ctx.beginPath();
                ctx.moveTo(rootX,-8-lift);
                ctx.quadraticCurveTo(rootX+side*2.1,-10-lift,rootX+side*4,-8.5-lift);
                ctx.stroke();
              }
            }
            ctx.restore();
          }
          // Wing-tip shading follows the flap and adds depth at close zoom.
          // The two short strokes stay inside the existing bird canvas pass.
          if (detailed) {
            ctx.save();
            ctx.lineCap="round";
            ctx.lineWidth=2;
            ctx.strokeStyle="rgba(49,44,36,.62)";
            for (const side of [-1,1]) {
              ctx.beginPath();
              ctx.moveTo(side*12,-10-flap*6);
              ctx.quadraticCurveTo(side*15,-10-flap*7,side*17,-8-flap*8);
              ctx.stroke();
            }
            ctx.restore();
          }
          const birdCoat=ctx.createLinearGradient(-4,-12,5,0);
          birdCoat.addColorStop(0,"#9d8b66");birdCoat.addColorStop(.6,"#665a40");birdCoat.addColorStop(1,"#403c32");
          ctx.fillStyle = birdCoat; ctx.beginPath(); ctx.ellipse(0,-6,4,6,0,0,Math.PI*2); ctx.fill();
          ctx.fillStyle = "#8b7a55"; ctx.beginPath(); ctx.ellipse(0,-9,3,3.5,0,0,Math.PI*2); ctx.fill();
          ctx.fillStyle = "#d2a35e"; ctx.beginPath(); ctx.moveTo(2,-9);ctx.lineTo(7,-8);ctx.lineTo(2,-7);ctx.fill();
          if (detailed) {
            // Short fan-shaped tail feathers remain attached to the body.
            ctx.strokeStyle="#a08b64";ctx.lineWidth=1.4;ctx.lineCap="round";
            for (const tail of [-2,0,2]) {
              ctx.beginPath();ctx.moveTo(-2,-2);ctx.lineTo(-8,-1+tail);ctx.stroke();
            }
          }
          if (detailed) {
            ctx.strokeStyle="#e2d1a6";ctx.lineWidth=.75;
            for (const side of [-1,1]) {ctx.beginPath();ctx.moveTo(side*6,-11-flap*3);ctx.lineTo(side*12,-9-flap*6);ctx.stroke();}
            ctx.fillStyle="#211f19";ctx.fillRect(1,-11,1,1);
          }
        } else if (animal.kind === "deer") {
          const gait = Math.sin(motionTime*3 + animal.phase)*1.8;
          ctx.strokeStyle="#604630";ctx.lineWidth=2.4;ctx.lineCap="round";
          for (const [x,offset] of [[-7,gait],[-3,-gait],[5,-gait],[8,gait]]) {
            ctx.beginPath();ctx.moveTo(x,-7);ctx.lineTo(x+offset*.4,0);ctx.lineTo(x+offset*.5+1,2);ctx.stroke();
          }
          // A softly shaded back and belly give the deer volume without textures.
          const deerCoat=ctx.createLinearGradient(0,-18,0,-5);
          deerCoat.addColorStop(0,"#735033");deerCoat.addColorStop(.42,"#ad7d4c");deerCoat.addColorStop(1,"#c49a67");
          ctx.fillStyle=deerCoat;ctx.beginPath();ctx.ellipse(0,-11,12,6,0,0,Math.PI*2);ctx.fill();
          ctx.fillStyle="#d0a46c";ctx.beginPath();ctx.ellipse(1,-9,8,2.4,0,0,Math.PI*2);ctx.fill();
          // Close-range dappled coat markings follow the torso, never the terrain.
          // Fixed positions avoid flicker and keep the canvas draw cost bounded.
          if (detailed) {
            ctx.save();
            ctx.beginPath();ctx.ellipse(0,-11,11.5,5.6,0,0,Math.PI*2);ctx.clip();
            ctx.fillStyle="rgba(236,207,156,.48)";
            for (const [spotX,spotY,spotR] of [[-8,-13,.85],[-5,-15,.65],[-3,-11,.9],[0,-14,.7],[3,-12,.8],[6,-14,.65],[8,-11,.65]]) {
              ctx.beginPath();ctx.ellipse(spotX,spotY,spotR,spotR*.65,-.25,0,Math.PI*2);ctx.fill();
            }
            ctx.restore();
          }
          if (detailed) {
            // A short tail flicks independently of the walking gait.
            const tailFlick=Math.sin(motionTime*2.1+animal.phase)*1.7;
            ctx.fillStyle="#8c6646";ctx.beginPath();
            ctx.moveTo(-10,-14);ctx.quadraticCurveTo(-16,-17+tailFlick,-15,-11+tailFlick);
            ctx.lineTo(-10,-10);ctx.closePath();ctx.fill();
            ctx.fillStyle="#e5d4b8";ctx.beginPath();ctx.ellipse(-14,-12+tailFlick,1.5,2,0,0,Math.PI*2);ctx.fill();
          }
          ctx.strokeStyle="#8b663f";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(8,-13);ctx.lineTo(12,-21);ctx.stroke();
          ctx.fillStyle="#b58a55";ctx.beginPath();ctx.ellipse(14,-21,5,3.5,-.3,0,Math.PI*2);ctx.fill();
          ctx.beginPath();ctx.moveTo(11,-23);ctx.lineTo(9,-28);ctx.lineTo(15,-24);ctx.lineTo(18,-28);ctx.lineTo(19,-22);ctx.fill();
          // Nearby deer blink briefly on an individual, deterministic cycle.
          const deerBlink = detailed && !reduceWildlifeMotion && ((motionTime + animal.phase * 3.1) % 6.7 < .13);
          ctx.fillStyle="#29231d";
          if (deerBlink) {ctx.fillRect(16,-21.5,1.5,.45);} else {ctx.fillRect(16,-22,1.5,1.5);}
          if (detailed) {
            // Separate ear tips and a pale throat distinguish the deer head
            // without changing its silhouette, collision or movement.
            // The ears swivel separately to listen for nearby movement.
            // Deterministic phases prevent all deer from twitching together.
            const leftEarTwitch=Math.sin(motionTime*1.9+animal.phase*2.7)*1.3;
            const rightEarTwitch=Math.sin(motionTime*2.3+animal.phase*1.4+1.7)*1.1;
            ctx.fillStyle="#e0b98a";
            ctx.beginPath();ctx.moveTo(10,-24);ctx.lineTo(8+leftEarTwitch,-29);ctx.lineTo(13,-25);ctx.fill();
            ctx.beginPath();ctx.moveTo(17,-24);ctx.lineTo(20+rightEarTwitch,-29);ctx.lineTo(19,-23);ctx.fill();
            ctx.strokeStyle="rgba(233,207,164,.78)";ctx.lineWidth=1.1;
            ctx.beginPath();ctx.moveTo(11,-19);ctx.quadraticCurveTo(10,-15,8,-14);ctx.stroke();
            ctx.fillStyle="#32261e";ctx.beginPath();ctx.arc(18,-20,1.1,0,Math.PI*2);ctx.fill();
          }
          if (detailed) {
            // Ground-contact occlusion under each hoof follows the leg gait.
            // It is drawn before the hoof marks and remains purely decorative.
            ctx.fillStyle="rgba(28,29,20,.16)";
            for (const [x,offset] of [[-7,gait],[-3,-gait],[5,-gait],[8,gait]]) {
              const footX=x+offset*.5+1;
              ctx.beginPath();ctx.ellipse(footX,3.1,2.1,0.7,0,0,Math.PI*2);ctx.fill();
            }
          }
          if (detailed) {
            // Dark split hooves follow the animated legs, not the torso.
            ctx.strokeStyle="#302820";ctx.lineWidth=1.5;
            for (const [x,offset] of [[-7,gait],[-3,-gait],[5,-gait],[8,gait]]) {
              const hoofX=x+offset*.5+1;
              ctx.beginPath();ctx.moveTo(hoofX-1,2);ctx.lineTo(hoofX+1,2);ctx.stroke();
            }
          }
          if (detailed) {
            ctx.strokeStyle="#6c5136";ctx.lineWidth=1.1;
            for (const antler of [-1,1]) {ctx.beginPath();ctx.moveTo(13+antler*2,-25);ctx.lineTo(13+antler*5,-33);ctx.lineTo(13+antler*8,-35);ctx.moveTo(13+antler*5,-30);ctx.lineTo(13+antler*3,-34);ctx.stroke();}
            ctx.fillStyle="#e6c59a";ctx.beginPath();ctx.ellipse(-9,-10,2.4,2,0,0,Math.PI*2);ctx.fill();
          }
        } else {
          const earBob = Math.sin(motionTime*5+animal.phase)*.8;
          // Rabbit fur has a darker back and a light underside.
          const rabbitCoat=ctx.createLinearGradient(0,-12,0,0);
          rabbitCoat.addColorStop(0,"#827665");rabbitCoat.addColorStop(.55,"#a99c8a");rabbitCoat.addColorStop(1,"#ddd1bf");
          // Subtle breathing changes the body contour without moving the animal.
          const breath=reduceWildlifeMotion ? 1 : 1+Math.sin(motionTime*1.7+animal.phase)*.025;
          ctx.fillStyle=rabbitCoat;ctx.beginPath();ctx.ellipse(-2,-6,8,5*breath,0,0,Math.PI*2);ctx.fill();
          // Close-up fur strands follow the rabbit silhouette; deterministic and cheap.
          if (detailed) {
            ctx.save();
            ctx.beginPath();ctx.ellipse(-2,-6,8,5*breath,0,0,Math.PI*2);ctx.clip();
            ctx.strokeStyle="rgba(239,226,204,.38)";ctx.lineWidth=.55;
            for (let strand=0;strand<15;strand++) {
              const fx=-9+(strand%5)*3.2;
              const fy=-10+Math.floor(strand/5)*3;
              ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx-1.1,fy-1.6);ctx.stroke();
            }
            ctx.restore();
          }
          ctx.fillStyle="#c9bcab";ctx.beginPath();ctx.ellipse(6,-9,4.5,4,0,0,Math.PI*2);ctx.fill();
          ctx.beginPath();ctx.ellipse(4,-17+earBob,1.9,7,-.15,0,Math.PI*2);
          ctx.ellipse(9,-17-earBob,1.9,7,.12,0,Math.PI*2);ctx.fill();
          ctx.fillStyle="#b88785";ctx.beginPath();ctx.ellipse(4,-17+earBob,0.8,4.7,-.15,0,Math.PI*2);ctx.ellipse(9,-17-earBob,.8,4.7,.12,0,Math.PI*2);ctx.fill();
          ctx.fillStyle="#e4d8c6";ctx.beginPath();ctx.arc(-10,-7,3,0,Math.PI*2);ctx.fill();
          // Rabbit blinking is independent of the deer and guard animations.
          const rabbitBlink = detailed && !reduceWildlifeMotion && ((motionTime + animal.phase * 2.3) % 5.3 < .12);
          ctx.fillStyle="#29251f";
          if (rabbitBlink) {ctx.fillRect(8,-9.5,1.3,.4);} else {ctx.fillRect(8,-10,1.3,1.3);}
          if (detailed) {
            ctx.strokeStyle="#e2d6c5";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-4,-2);ctx.lineTo(-6,0);ctx.moveTo(3,-3);ctx.lineTo(5,0);ctx.stroke();
            // Fine whiskers and nose are visible only at close zoom.
            ctx.fillStyle="#82655e";ctx.beginPath();ctx.arc(10,-7,1,0,Math.PI*2);ctx.fill();
            ctx.strokeStyle="rgba(232,219,202,.85)";ctx.lineWidth=.6;
            // Whiskers respond subtly to breathing instead of staying rigid.
            const whiskerTwitch=Math.sin(motionTime*3.1+animal.phase)*.65;
            for (const side of [-1,1]) {ctx.beginPath();ctx.moveTo(10,-7);ctx.lineTo(14,-7+side*2.4+whiskerTwitch);ctx.stroke();}
          }
        }
        ctx.restore();
      }
    };

    // G4: atmospheric edge shading at dusk and night. A single radial gradient
    // gives the clearing depth without extra per-object lighting passes.
    // Keep the centre legible and avoid a bright artificial night source.
    // Updated once per paint: all weather, fauna and sunlight effects use the same accessibility state.
    let reducedMotionFrame = false;
    const drawG4NightVignette = (light:number, cloud:number) => {
      const dusk=Math.max(0,Math.min(1,(.52-light)/.52));
      if (dusk<=0 || width<=0 || height<=0) return;
      const edgeOpacity=Math.min(.25,dusk*(.17+cloud*.08));
      const radius=Math.hypot(width,height)*.67;
      ctx.save();
      const shade=ctx.createRadialGradient(width*.5,height*.48,radius*.16,width*.5,height*.48,radius);
      shade.addColorStop(0,"rgba(12,19,33,0)");
      shade.addColorStop(.58,`rgba(12,19,33,${(edgeOpacity*.12).toFixed(3)})`);
      shade.addColorStop(1,`rgba(12,19,33,${edgeOpacity.toFixed(3)})`);
      ctx.fillStyle=shade;
      ctx.fillRect(0,0,width,height);
      ctx.restore();
    };

    // G5: navigational minimap uses the actual generated terrain and world positions.
    // Cardinal directions stay fixed; the camera marker moves as the player pans.
    let minimapLastDraw = -Infinity;
    const drawMinimap = (now: number) => {
      if (!baked || now - minimapLastDraw < 200) return;
      const mapCanvas = minimapRef.current;
      const mapCtx = mapCanvas?.getContext("2d");
      if (!mapCanvas || !mapCtx) return;
      minimapLastDraw = now;
      const size = mapCanvas.width;
      const center = size / 2;
      const margin = 12;
      const extent = (world.size - 1) * 14;
      const yExtent = (world.size - 1) * 26;
      const mapX = (x:number) => center + (x - (baked?.ox ?? 0)) / (extent * 2) * (size - margin * 2);
      const mapY = (y:number) => center + (y - ((baked?.oy ?? 0) - 24 + yExtent / 2)) / yExtent * (size - margin * 2);
      mapCtx.clearRect(0, 0, size, size);
      // Clip terrain and moving markers to the circular compass face.
      // Canvas CSS border-radius alone does not prevent off-map marker drawing
      // from overlapping the compass rim on all rendering paths.
      mapCtx.save();
      mapCtx.beginPath();
      mapCtx.arc(center, center, center - 3, 0, Math.PI * 2);
      mapCtx.clip();
      mapCtx.fillStyle = "#253c2d";
      mapCtx.fillRect(0, 0, size, size);
      // Sample actual water and vegetation; no invented roads, settlements or geography.
      // Scale the sampling to the map size: dense terrain on small worlds,
      // bounded drawing cost on larger ones. Adjacent patches overlap slightly
      // to avoid dark checkerboard gaps between sampled terrain tiles.
      const terrainStep = Math.max(1, Math.ceil(world.size / 85));
      const patchWidth = Math.max(2.8, terrainStep * 14 / (extent * 2) * (size - margin * 2) * 2.2);
      const patchHeight = Math.max(2.8, terrainStep * 26 / yExtent * (size - margin * 2) * 1.4);
      for (let gy = 0; gy < world.size; gy += terrainStep) {
        for (let gx = 0; gx < world.size; gx += terrainStep) {
          const tile = world.tiles[gy * world.size + gx];
          if (!tile) continue;
          const point = project(gx, gy);
          const x = mapX(point.x), y = mapY(point.y);
          // Derive colors from actual terrain fields rather than a decorative checker pattern.
          // A lighter clearing, deep forest and exposed stone remain legible at small sizes.
          const landColor = tile.rock > 0.64 ? "#898779"
            : tile.clear > 0.62 || tile.meadow > 0.62 ? "#819a5c"
            : tile.forest > 0.60 ? "#274d37"
            : tile.wet > 0.70 ? "#486d55" : "#54784b";
          mapCtx.fillStyle = tile.water ? "#4d96a7" : landColor;
          mapCtx.fillRect(x - patchWidth / 2, y - patchHeight / 2, patchWidth, patchHeight);
        }
      }
      // Plot real standing trees in the same projected coordinates as the world.
      // Sampling limits cost while preserving actual clearing and forest outlines.
      mapCtx.fillStyle = "rgba(15,48,32,.72)";
      const sample = Math.max(1, Math.ceil(workTrees.length / 3500));
      for (let i=0; i<workTrees.length; i+=sample) {
        const tree=workTrees[i];
        if (!tree.standing) continue;
        const px=mapX(tree.x),py=mapY(tree.y);
        mapCtx.fillRect(px-0.55,py-0.65,1.1,1.3);
      }
      // Visible game landmarks, not arbitrary icons from the reference mockup.
      const marker = (x:number,y:number,color:string,radius:number) => {
        mapCtx.beginPath(); mapCtx.arc(mapX(x),mapY(y),radius,0,Math.PI*2);
        mapCtx.fillStyle=color; mapCtx.fill();
        mapCtx.strokeStyle="#162b25"; mapCtx.lineWidth=1; mapCtx.stroke();
      };
      // Distinct landmark silhouettes remain recognizable without relying on color.
      const landmark = (x: number, y: number, kind: "stockpile" | "storehouse" | "campfire") => {
        const px = mapX(x), py = mapY(y);
        mapCtx.save();
        mapCtx.lineWidth = 1.1;
        mapCtx.strokeStyle = "#142a22";
        mapCtx.fillStyle = kind === "stockpile" ? "#c99b61" : kind === "storehouse" ? "#e9c17a" : "#f59e53";
        mapCtx.beginPath();
        if (kind === "stockpile") mapCtx.rect(px - 3.5, py - 2.5, 7, 5);
        else if (kind === "storehouse") mapCtx.rect(px - 4.5, py - 3.5, 9, 7);
        else { mapCtx.moveTo(px, py - 4); mapCtx.lineTo(px + 3.5, py + 3); mapCtx.lineTo(px - 3.5, py + 3); mapCtx.closePath(); }
        mapCtx.fill(); mapCtx.stroke();
        if (kind === "storehouse") {
          mapCtx.beginPath(); mapCtx.moveTo(px - 4.5, py - 3.5); mapCtx.lineTo(px, py - 6); mapCtx.lineTo(px + 4.5, py - 3.5); mapCtx.stroke();
        }
        mapCtx.restore();
      };
      if (stockpile) landmark(stockpile.x, stockpile.y, "stockpile");
      if (storehouse) landmark(storehouse.x, storehouse.y, "storehouse");
      if (campfire) landmark(campfire.x, campfire.y, "campfire");
      for (const ch of characters) marker(ch.x,ch.y,ch.mui ? "#f9e6a7" : "#d3dfc7",ch.mui ? 3.6 : 1.8);
      // Mui's distinct outer ring stays recognizable among nearby guards.
      const mui = characters.find(ch => ch.mui);
      if (mui) {
        mapCtx.beginPath(); mapCtx.arc(mapX(mui.x),mapY(mui.y),5.7,0,Math.PI*2);
        mapCtx.strokeStyle="#fff3c9"; mapCtx.lineWidth=1.4; mapCtx.stroke();
      }
      // Viewport center: a camera reticle, independent of the player position.
      const cx=mapX(cam.x), cy=mapY(cam.y);
      mapCtx.strokeStyle="#f8e8c7"; mapCtx.lineWidth=1.4;
      mapCtx.beginPath(); mapCtx.moveTo(cx-5,cy);mapCtx.lineTo(cx+5,cy);
      mapCtx.moveTo(cx,cy-5);mapCtx.lineTo(cx,cy+5);mapCtx.stroke();
      mapCtx.restore();
    };

    // G6.25: non-destructive placement shadow. The pointer determines the site;
    // only a click confirms construction. The preview never changes world state.
    let animalFocusIndex=0;
    let placementPointer: {x:number;y:number} | null = null;
    const drawPlacementPreview = () => {
      if (!placementPointer || !baked) return;
      const kind = buildingModeRef.current ? "storehouse" : stockpileModeRef.current ? "stockpile" : campfireModeRef.current ? "campfire" : null;
      if (!kind) return;
      const wx=cam.x+(placementPointer.x-width/2)/cam.zoom;
      const wy=cam.y+(placementPointer.y-height/2)/cam.zoom;
      const q=insideWorld(wx,wy);
      const x=width/2+(q.x-cam.x)*cam.zoom;
      const y=height/2+(q.y-cam.y)*cam.zoom;
      const z=cam.zoom;
      ctx.save();
      ctx.fillStyle="rgba(108,224,169,.25)";
      ctx.strokeStyle="rgba(228,255,235,.95)";
      ctx.lineWidth=2;
      ctx.setLineDash([7,5]);
      if(kind==="storehouse") {
        if(storehouseTurnedRef.current){ctx.translate(x,y);ctx.rotate(Math.PI/2);ctx.translate(-x,-y);}
        ctx.fillRect(x-50*z,y-30*z,100*z,60*z);
        ctx.strokeRect(x-50*z,y-30*z,100*z,60*z);
        // The short south wall contains the open doorway.
        ctx.beginPath();ctx.moveTo(x-50*z,y+30*z);ctx.lineTo(x-13*z,y+30*z);
        ctx.moveTo(x+13*z,y+30*z);ctx.lineTo(x+50*z,y+30*z);ctx.stroke();
      } else if(kind==="stockpile") {
        ctx.fillRect(x-32*z,y-23*z,64*z,46*z);
        ctx.strokeRect(x-32*z,y-23*z,64*z,46*z);
        ctx.setLineDash([]);
        for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(x-23*z,y+i*7*z);ctx.lineTo(x+23*z,y+i*7*z);ctx.stroke();}
      } else {
        ctx.beginPath();ctx.arc(x,y,13*z,0,Math.PI*2);ctx.fill();ctx.stroke();
        ctx.beginPath();ctx.moveTo(x-17*z,y-17*z);ctx.lineTo(x+17*z,y+17*z);
        ctx.moveTo(x+17*z,y-17*z);ctx.lineTo(x-17*z,y+17*z);ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();
    };
    const draw = () => {
      reducedMotionFrame = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      ctx.fillStyle = `rgb(${HAZE[0]},${HAZE[1]},${HAZE[2]})`;
      ctx.fillRect(0, 0, width, height);
      if (!baked) return;
      if (cam.zoom >= DETAIL_ZOOM) painter.drawDetail(ctx, cam, width, height, dpr);
      else drawBaked(baked);
      drawGroundDetail();
      // One coherent climate snapshot for terrain, sunlight, and final atmosphere.
      const g3Weather=climateClock.snapshot();
      drawG4WetGround(g3Weather.rain,g3Weather.light);
      drawG4RiverGlints(g3Weather.light,g3Weather.cloud);
      drawG3Atmosphere(g3Weather.light,g3Weather.cloud);
      drawG4CanopyLight(g3Weather.light,g3Weather.cloud);
      // G2 ambient sunlight: warm daylight, cool dawn/dusk. A single transparent
      // screen overlay avoids thousands of per-object lighting calculations.
      const daylight = g3Weather;
      if (daylight.light > .30) {
        const warmth = Math.max(0,Math.min(.085,(daylight.light-.30)*.11)) * (1-daylight.cloud*.65);
        ctx.fillStyle=`rgba(255,218,151,${warmth})`;
        ctx.fillRect(0,0,width,height);
      }
      drawStockpile(); drawStorehouse(); drawCampfire();
      drawLogs();
      drawCharacters();
      drawCarriedLog(haul);
      for(const job of parallelHauls)drawCarriedLog(job);
      // Tree trunks and raised canopies occlude characters walking behind them.
      // This is a lightweight 2.5D depth cue without switching engines.
      drawWorkTrees();
      drawPeacefulWildlife(g3Weather);
      const cs = g3Weather;
      const darkness = Math.max(0, 1 - cs.light) * 0.68 + cs.cloud * 0.12;
      if (darkness > 0.02) {
        ctx.fillStyle = `rgba(18,28,48,${Math.min(0.72, darkness)})`;
        ctx.fillRect(0, 0, width, height);
      }
      drawG4NightVignette(cs.light,cs.cloud);
      drawG3WeatherDetails(cs.rain,cs.cloud,cs.light);
      drawMinimap(performance.now());
      if (cs.rain > 0) {
        // Rain is drawn after the night overlay; attenuate its brightness so
        // precipitation does not glow unnaturally after sunset.
        const rainVisibility = Math.max(0.22, Math.min(1, cs.light * 0.82 + 0.18));
        ctx.strokeStyle = `rgba(210,230,245,${((0.18 + cs.rain * 0.35) * rainVisibility).toFixed(3)})`;
        ctx.lineWidth = 1;
        const count = Math.floor(30 + cs.rain * 80);
        const reduceRainMotion = reducedMotionFrame;
        // Capture one clock sample per frame: every drop shares the same time,
        // avoiding repeated high-resolution clock reads inside the rain loop.
        const rainFrameTime = reduceRainMotion ? 0 : wildlifeSimulationSeconds * 1000;
        const rainOffsetX = Math.floor(rainFrameTime / 30) * 11;
        const rainOffsetY = Math.floor(rainFrameTime / 20) * 17;
        const rainWidth = Math.max(1, width);
        const rainHeight = Math.max(1, height);
        // Batch rain streaks into one canvas path. Individual beginPath/stroke
        // calls multiplied by every drop were costly on mobile GPUs.
        ctx.beginPath();
        for (let i = 0; i < count; i++) {
          const x = (i * 97 + rainOffsetX) % rainWidth;
          const y = (i * 53 + rainOffsetY) % rainHeight;
          ctx.moveTo(x, y);
          ctx.lineTo(x - 5, y + 11);
        }
        ctx.stroke();
        dirty = true;
      }
    };

    // Stop both carriers when a haul is interrupted; do not leave ghost destinations.
    const cancelHaul = () => {
      if (!haul) return;
      for (const worker of characters) {
        if (haul.workerIds.includes(worker.id)) {
          worker.tx = worker.x;
          worker.ty = worker.y;
        }
      }
      if(haulOrigin){const log=felledLogs.find(l=>l.id===haul?.logId);if(log&&!log.stockpiled){log.x=haulOrigin.x;log.y=haulOrigin.y;}}
      haulOrigin=null;
      haulStallSeconds=0;haulLastDistance=Number.POSITIVE_INFINITY;haulLastPositions={};
      haul = null;
      dirty=true;
    };

    const cancelWorkerHaul=(id:string)=>{
      // Keep a manual collecting assignment through temporary rest.
      if(haul?.workerIds.includes(id))cancelHaul();
      for(const job of [...parallelHauls])if(job.workerIds.includes(id))cancelParallel(job);
    };

    // A completed storehouse is a solid ground-level building, not walkable terrain.
    // Roof artwork never becomes a navigation surface. Preserve access through the
    // front opening (short end); NPCs cannot simply cross the interior.
    const moveAroundFinishedStorehouse = (ch: FoundingCharacter, nx: number, ny: number) => {
      if (!storehouse?.complete) return {x:nx,y:ny};
      const sx=storehouse.x, sy=storehouse.y;
      const halfX=51, halfY=31;
      const inside=(x:number,y:number)=>Math.abs(x-sx)<halfX&&Math.abs(y-sy)<halfY;
      if (!inside(nx,ny)) return {x:nx,y:ny};
      // Workers standing on the site at the instant the roof finishes are
      // displaced to the nearest exterior edge instead of standing on its roof.
      if(inside(ch.x,ch.y)) {
        const distances=[{d:Math.abs(ch.x-(sx-halfX)),x:sx-halfX-1,y:ch.y},{d:Math.abs(ch.x-(sx+halfX)),x:sx+halfX+1,y:ch.y},{d:Math.abs(ch.y-(sy-halfY)),x:ch.x,y:sy-halfY-1},{d:Math.abs(ch.y-(sy+halfY)),x:ch.x,y:sy+halfY+1}];
        distances.sort((a,b)=>a.d-b.d);
        return {x:distances[0].x,y:distances[0].y};
      }
      // Slide along the exterior wall. This prevents climbing onto the roof.
      const slideX={x:nx,y:ch.y},slideY={x:ch.x,y:ny};
      if(!inside(slideX.x,slideX.y))return slideX;
      if(!inside(slideY.x,slideY.y))return slideY;
      return {x:ch.x,y:ch.y};
    };

    const releaseTree = (ch: FoundingCharacter) => {
      if(ch.treeId){const tree=workTrees.find(t=>t.id===ch.treeId);if(tree?.reservedBy===ch.id)tree.reservedBy=null;}
      ch.treeId=undefined;
      ch.work=0;
      ch.helpingNotice=undefined;
    };

    const tick = (now: number) => {
      // Do not simulate or paint an invisible tab; mobile browsers may throttle RAF.
      if (document.visibilityState === "hidden") { last = now; frame = requestAnimationFrame(tick); return; }
      const elapsed = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      // Pausing freezes agents, fatigue, logging and transport without losing the render loop.
      const dt = elapsed * timeSpeedRef.current;
      wildlifeSimulationSeconds += dt;
      climateClock.setSpeed(timeSpeedRef.current);
      // Climate clock applies the selected speed internally; never multiply it twice.
      climateClock.tick(elapsed);
      // One immutable weather snapshot per simulation frame: all NPC work
      // decisions share the same daylight state, avoiding repeated allocations.
      const frameClimate = climateClock.snapshot();
      if(timeSpeedRef.current!==0) knowledgeClock += dt;
      // Snapshot cadence uses real elapsed time, not speed-scaled simulation time.
      // Otherwise ×4 can refresh the UI four times as often, and Pausa can freeze stale visuals.
      climateSnapshotElapsed += elapsed;
      if (climateSnapshotElapsed >= 0.5) {
        climateSnapshotElapsed %= 0.5;
        setLogsCount({total:felledLogs.filter(l=>!l.usedForStorehouse).length,outdoor:felledLogs.filter(l=>l.stockpiled&&!l.usedForStorehouse).length,waiting:felledLogs.filter(l=>!l.stockpiled&&!l.usedForStorehouse).length,stockpilePlaced:Boolean(stockpile),hauling:Boolean(haul?.active),busyGuards:characters.filter(ch=>!ch.mui && (Boolean(ch.order)||Boolean(ch.treeId))).length,loggers:characters.filter(ch=>!ch.mui && (Boolean(ch.treeId)||ch.order?.kind==="logging")).length,builders:storehouse&&!storehouse.complete?characters.filter(ch=>!ch.mui&&!ch.resting&&!ch.needTrip&&!ch.order&&!isAnyHauler(ch.id)&&Math.hypot(ch.x-storehouse!.x,ch.y-storehouse!.y)<=8).length:0,collecting:characters.filter(ch=>!ch.mui&&Boolean(isAnyHauler(ch.id))).length});
        if (storehouse) setBuildingProgress({committed:storehouse.committed,complete:storehouse.complete,placed:true});
        if (dt > 0) {
          setClimate(frameClimate);
          dirty = true;
        }
      }

      if (dt>0 && !isNight(frameClimate.hour) && storehouse && !storehouse.complete) {
        const available=felledLogs.filter(l=>l.stockpiled && !l.usedForStorehouse);
        // A guard must physically reach the building site before installing logs.
        // Keep hauling and survival trips higher priority than construction.
        const waitingLogs=available.length>0;
        // Avoid oscillating between construction and collection when logs remain in the forest.
        // Two guards must remain available for the next hauling pair.
        const pendingCollection=felledLogs.some(l=>!l.stockpiled && !l.usedForStorehouse);
        const idleForConstruction=characters.filter(ch=>!ch.mui && !ch.resting && !ch.needTrip && !ch.order && !isAnyHauler(ch.id) && autonomousWorkDecision(ch.social,false)==="work" && autonomousConstructionDecision(ch.fatigue?.fatigue ?? 0,ch.fatigue?.fatigueLimit ?? 0,false)==="build");
        // Reserve a hauling pair only when collection is not already underway.
        // Otherwise the active pair is already occupied and remaining idle guards
        // should be free to build; reserving two more causes builder starvation.
        const reserveForHauling=pendingCollection && !haul ? 2 : 0;
        // Reserve the closest available pair to the waiting log, not the first
        // guards in array order. Otherwise construction can repeatedly redirect
        // the guards that are already walking to collect that log.
        const waitingLog=pendingCollection && !haul && stockpile
          ? nearestUnstockpiledLog(felledLogs,stockpile.x,stockpile.y) : null;
        const haulerIds=new Set(waitingLog
          ? [...idleForConstruction].filter(ch=>g1CanJoinHaul(ch.x,ch.y,waitingLog.x,waitingLog.y,ch.fatigue)).sort((a,b)=> {
              // Keep guards already travelling to this log reserved for hauling.
              // Otherwise construction can redirect them before they arrive.
              const aAssigned=Math.hypot(a.tx-waitingLog.x,a.ty-waitingLog.y)<1 ? 0 : 1;
              const bAssigned=Math.hypot(b.tx-waitingLog.x,b.ty-waitingLog.y)<1 ? 0 : 1;
              return aAssigned-bAssigned || Math.hypot(a.x-waitingLog.x,a.y-waitingLog.y)-Math.hypot(b.x-waitingLog.x,b.y-waitingLog.y);
            })
              .slice(0,reserveForHauling).map(ch=>ch.id)
          : []);
        const builderIds=new Set(idleForConstruction.filter(ch=>!haulerIds.has(ch.id)).map(ch=>ch.id));
        if (waitingLogs) {
          for (const ch of characters) {
            if (!builderIds.has(ch.id)) continue;
            // An unassigned builder must reach the site even if its previous
            // movement destination was elsewhere. Reserved haulers are excluded.
            // Reassign only when outside the work radius, avoiding jitter.
            if (Math.hypot(ch.x-storehouse.x,ch.y-storehouse.y)>7 &&
                Math.hypot(ch.tx-storehouse.x,ch.ty-storehouse.y)>1) {
              ch.tx=storehouse.x;ch.ty=storehouse.y;dirty=true;
            }
          }
        }
        const workers=characters.filter(ch=>!ch.mui && !ch.resting && !ch.needTrip && !ch.order && !isAnyHauler(ch.id) && builderIds.has(ch.id) && Math.hypot(ch.tx-ch.x,ch.ty-ch.y)<2 && Math.hypot(ch.x-storehouse!.x,ch.y-storehouse!.y)<=8).length;
        if (workers>0 && available.length>0) {
          const before=storehouse.committed;
          storehouse=commitStorehouseLogs(storehouse,available.length,dt*workers);
          const consumed=storehouse.committed-before;
          for(let i=0;i<consumed;i++) available[i].usedForStorehouse=true;
          if(storehouse.complete){setWorkNotice("¡Almacén construido! Capítulo 1 completado");if(!victoryShownRef.current){victoryShownRef.current=true;setShowChapterVictory(true);}}
          dirty=true;
        }
      }
      if (dt>0 && baked && characters.length) {
        let moving = false;
        for (const ch of characters) {
          // Only uninterrupted rest earns social recovery. A task, supply trip,
          // or daytime activity must not carry partial rest into a later night.
          // A rest flag alone is insufficient: the guard may still be moving
          // to a destination. Reset partial credit until actually stationary.
          const restingNow = !ch.mui && !ch.needTrip && !ch.order &&
            !isAnyHauler(ch.id) &&
            Math.hypot(ch.tx-ch.x,ch.ty-ch.y) <= 1 &&
            (ch.resting === true || shouldPauseAutonomousWork(frameClimate.hour, false));
          if (!restingNow && ch.socialRestSeconds) ch.socialRestSeconds = 0;
          // A protesting guard chooses to pause communal work while idle.
          // Existing and direct Mui orders are never cancelled by this decision.
          if (!ch.mui && !ch.order && !ch.needTrip && !isAnyHauler(ch.id) &&
              autonomousWorkDecision(ch.social,false)==="protest" && Math.hypot(ch.tx-ch.x,ch.ty-ch.y)<=1) {
            ch.socialRestSeconds=(ch.socialRestSeconds ?? 0)+dt;
            if(ch.socialRestSeconds>=60){
              const minutes=Math.floor(ch.socialRestSeconds/60);
              ch.socialRestSeconds-=minutes*60;
              ch.social=restSocialState(ch.social ?? initialSocialState(),minutes/60);
              dirty=true;
            }
          }
          // G1/O1: necesidades autónomas; peligros jugables permanecen desactivados.
          if (!ch.mui) {
            ch.survival = advanceSurvival(ch.survival ?? {hunger:0,thirst:0,danger:0},dt);
            if (ch.needTrip) {
              const trip=ch.needTrip;
              if (Math.hypot(ch.x-ch.tx,ch.y-ch.ty)<2) {
                if (trip.phase==="outbound") {
                  trip.remaining-=dt;
                  if (trip.remaining<=0) {
                    const foodAvailable=trip.kind!=="food" || (trip.foodKey!==undefined && (foodPatches.get(trip.foodKey)??0)>0);
                    if(foodAvailable){
                      if(trip.kind==="food" && trip.foodKey!==undefined) foodPatches.set(trip.foodKey,(foodPatches.get(trip.foodKey)??1)-1);
                      ch.survival={...ch.survival,[trip.kind==="water"?"thirst":"hunger"]:0};
                    }
                    trip.phase="return";ch.tx=trip.homeX;ch.ty=trip.homeY;
                  }
                } else {
                  ch.needTrip=undefined;
                  if(ch.pendingLoggingZone && !ch.order){const zone=ch.pendingLoggingZone;ch.pendingLoggingZone=undefined;ch.previousOrder=undefined;ch.loggingZone=zone;const tree=reserveNearestTreeInZone(workTrees,ch.id,zone.x,zone.y);if(tree){ch.treeId=tree.id;ch.order=createLoggingOrder(tree.x,tree.y);ch.tx=tree.x;ch.ty=tree.y;}else{ch.loggingZone=undefined;}dirty=true;}
                  if(ch.previousOrder && !ch.order){const order=ch.previousOrder;ch.previousOrder=undefined;const tree=reserveRememberedLoggingTree(workTrees,ch.id,order,ch.loggingZone);if(tree){ch.treeId=tree.id;ch.order=createLoggingOrder(tree.x,tree.y);ch.tx=tree.x;ch.ty=tree.y;}}
                }
              }
              // Las necesidades tienen prioridad sobre trabajo y descanso.
              const nx=ch.tx-ch.x,ny=ch.ty-ch.y,nd=Math.hypot(nx,ny);
              if(nd>1){const step=Math.min(nd,CHARACTER_SPEED*dt);const safe=moveAroundFinishedStorehouse(ch,ch.x+nx/nd*step,ch.y+ny/nd*step);ch.x=safe.x;ch.y=safe.y;moving=true;}
              continue;
            }
            const need=survivalDecision({...ch.survival,danger:0});
            if(need==="seek_water" || need==="seek_food") {
              if(isAnyHauler(ch.id))cancelWorkerHaul(ch.id);
              if(ch.order){ch.previousOrder=ch.order;releaseTree(ch);ch.order=undefined;}
              const homeX=ch.x,homeY=ch.y;
              // Búsqueda local mínima. El río y la recolección/caza requieren
              // integración física verificable antes de considerarlos completos.
              const foodTarget=need==="seek_food" ? nearestFoodDestination(ch.x,ch.y) : null;
              const target=need==="seek_water" ? nearestWaterDestination(ch.x,ch.y) : foodTarget;
              if(!target) { ch.tx=ch.x;ch.ty=ch.y;continue; }
              ch.needTrip={kind:need==="seek_water"?"water":"food",phase:"outbound",homeX,homeY,remaining:need==="seek_water"?4:9,foodKey:foodTarget?.key};
              ch.tx=target.x;ch.ty=target.y;dirty=true;continue;
            }
          }
          // At night autonomous duties pause. A direct order from Mui remains valid.
          // Survival trips above retain priority; fatigue recovery continues below.
          if (shouldPauseAutonomousWork(frameClimate.hour, Boolean(ch.order) || Boolean(ch.manualMove) || Boolean(isAnyHauler(ch.id)))) {
            // Hauling is still work until cancelled. Do not award social rest
            // for the same simulation tick that terminates a haul assignment.
            const wasHauling = Boolean(isAnyHauler(ch.id));
            if (wasHauling) cancelWorkerHaul(ch.id);
            // Nightly downtime must recover social pressure too: this branch
            // skips the ordinary resting update below.
            if (!ch.mui && !wasHauling && restingNow) {
              ch.socialRestSeconds=(ch.socialRestSeconds ?? 0)+dt;
              if(ch.socialRestSeconds>=60){
                const minutes=Math.floor(ch.socialRestSeconds/60);
                ch.socialRestSeconds-=minutes*60;
                ch.social=restSocialState(ch.social ?? initialSocialState(),minutes/60);
                dirty=true;
              }
            }
            // A cancelled haul was still active this tick; recovery begins next tick.
            if (ch.fatigue && !wasHauling && restingNow) ch.fatigue = recoverFatigue(ch.fatigue,dt);
            ch.tx=ch.x; ch.ty=ch.y;
            continue;
          }
          // A resting guard may have no fatigue record (e.g. older saves).
          // Social recovery must not depend on the optional fatigue system.
          if (!ch.fatigue && ch.resting && restingNow) {
            ch.socialRestSeconds=(ch.socialRestSeconds ?? 0)+dt;
            if(ch.socialRestSeconds>=60){
              const minutes=Math.floor(ch.socialRestSeconds/60);
              ch.socialRestSeconds-=minutes*60;
              ch.social=restSocialState(ch.social ?? initialSocialState(),minutes/60);
              dirty=true;
            }
          }
          if(ch.fatigue){
            if(ch.resting){
              if(restingNow) ch.socialRestSeconds=(ch.socialRestSeconds ?? 0)+dt;
              if((ch.socialRestSeconds ?? 0)>=60){const minutes=Math.floor((ch.socialRestSeconds ?? 0)/60);ch.socialRestSeconds ??= 0;ch.socialRestSeconds-=minutes*60;ch.social=restSocialState(ch.social ?? initialSocialState(),minutes/60);dirty=true;}
              ch.fatigue=recoverFatigue(ch.fatigue,dt);if(readyToResumeRememberedTask(ch.fatigue)){ch.resting=false;dirty=true;if(ch.pendingLoggingZone && !ch.order){const zone=ch.pendingLoggingZone;ch.pendingLoggingZone=undefined;ch.previousOrder=undefined;ch.loggingZone=zone;const tree=reserveNearestTreeInZone(workTrees,ch.id,zone.x,zone.y);if(tree){ch.treeId=tree.id;ch.order=createLoggingOrder(tree.x,tree.y);ch.tx=tree.x;ch.ty=tree.y;}else{ch.loggingZone=undefined;}dirty=true;}if(ch.previousOrder && !ch.order){const remembered=ch.previousOrder;ch.previousOrder=undefined;const tree=reserveRememberedLoggingTree(workTrees,ch.id,remembered,ch.loggingZone);if(tree){ch.treeId=tree.id;ch.order=createLoggingOrder(tree.x,tree.y);ch.tx=tree.x;ch.ty=tree.y;}else{ch.tx=ch.x;ch.ty=ch.y;}dirty=true;}}continue;}
            if(ch.order||isAnyHauler(ch.id)){ch.fatigue=advanceFatigue(ch.fatigue,dt);const decision=g1FatigueDecision(ch.fatigue);if(decision!=="continue"){if(ch.order)ch.previousOrder=ch.order;if(isAnyHauler(ch.id)) cancelWorkerHaul(ch.id);if(ch.order)releaseTree(ch);ch.order=undefined;ch.resting=true;ch.tx=ch.x;ch.ty=ch.y;dirty=true;continue;}}
          }
          // Validate a reserved tree before walking, not only after arriving.
          // Otherwise an obsolete logging order can send a guard across the map.
          if(ch.order?.kind==="logging"){
            const assignedTree=workTrees.find(t=>t.id===ch.treeId);
            if(!assignedTree || !assignedTree.standing || assignedTree.reservedBy!==ch.id){
              ch.order=undefined;
              releaseTree(ch);
              ch.tx=ch.x;ch.ty=ch.y;
              dirty=true;
              continue;
            }
          }
          // Mui walks naturally around the clearing when no player task is active.
          // A direct order always overrides this gentle idle behavior.
          if (ch.mui && !ch.order && !ch.needTrip && !isAnyHauler(ch.id) &&
              !isNight(frameClimate.hour) && Math.hypot(ch.tx-ch.x,ch.ty-ch.y)<1.2 &&
              wildlifeSimulationSeconds - muiLastWander > 18) {
            muiLastWander=wildlifeSimulationSeconds;
            const angle=wildlifeSimulationSeconds*.39;
            const radius=7+4*Math.sin(wildlifeSimulationSeconds*.17)**2;
            const nx=muiHome.x+Math.cos(angle)*radius;
            const ny=muiHome.y+Math.sin(angle)*radius;
            const next=insideWorld(nx,ny);
            ch.tx=next.x;ch.ty=next.y;
            dirty=true;
          }
          if(ch.manualMove && Math.hypot(ch.tx-ch.x,ch.ty-ch.y)<1.2){ch.manualMove=false;dirty=true;}
          // Quiet night gathering: idle characters take distinct places around the fire.
          // Active player orders, hauling, and survival trips always have priority.
          if (campfire && isNight(frameClimate.hour) && !ch.manualMove && !ch.order && !ch.needTrip &&
              !isAnyHauler(ch.id) && !ch.resting) {
            const slot = characters.findIndex(c=>c.id===ch.id);
            const angle = slot * (Math.PI * 2 / 8) - Math.PI / 2;
            const place = insideWorld(campfire.x + Math.cos(angle)*11, campfire.y + Math.sin(angle)*9);
            if (Math.hypot(ch.tx-place.x,ch.ty-place.y)>3) {ch.tx=place.x;ch.ty=place.y;}
          }
          // Idle characters do not walk into the same position. Working pairs
          // and builders are handled by their existing job-specific movement.
          const idle = !ch.manualMove && !ch.order && !ch.needTrip && !isAnyHauler(ch.id);
          if (idle) {
            for (const other of characters) {
              if (other.id===ch.id || Math.hypot(ch.tx-other.x,ch.ty-other.y)>=4.8) continue;
              const a = characters.findIndex(c=>c.id===ch.id)*2.39996;
              const q=insideWorld(ch.tx+Math.cos(a)*5,ch.ty+Math.sin(a)*5);
              ch.tx=q.x;ch.ty=q.y;break;
            }
          }
          const dx=ch.tx-ch.x, dy=ch.ty-ch.y, d=Math.hypot(dx,dy);
          if(d>1){ const step=Math.min(d,CHARACTER_SPEED*dt); const safe=moveAroundFinishedStorehouse(ch,ch.x+dx/d*step,ch.y+dy/d*step);ch.x=safe.x;ch.y=safe.y;moving=true; }
          else if(ch.order?.kind==="logging" && ch.treeId){
            const tree=workTrees.find(t=>t.id===ch.treeId);
            if(!tree || !tree.standing || tree.reservedBy!==ch.id){ch.order=undefined;releaseTree(ch);ch.tx=ch.x;ch.ty=ch.y;dirty=true;continue;}
            const performance=ch.fatigue?fatiguePerformance(ch.fatigue):1; const a=advanceLogging(ch.work??0,dt*performance); ch.work=a.progress;
            if(a.completedTree && (!stockpile || felledLogs.filter(l=>l.stockpiled&&!l.usedForStorehouse).length < STOCKPILE_CAPACITY) && fellReservedWorkTree(tree,ch.id)){felledLogs.push(createFelledLog(`log-${felledLogs.length+1}`,tree.x,tree.y));ch.work=0;const z=ch.loggingZone;const transportWaiting=Boolean(stockpile && nearestUnstockpiledLog(felledLogs,stockpile.x,stockpile.y));const next=z?reserveNearestTreeInZone(workTrees,ch.id,z.x,z.y):null;if(next){ch.treeId=next.id;ch.order=createLoggingOrder(next.x,next.y);ch.tx=next.x;ch.ty=next.y;}else{ch.order=undefined;ch.treeId=undefined;ch.helpingNotice=undefined;if(z&&loggingZoneExhausted(workTrees,z.x,z.y))setWorkNotice("Zona de tala agotada");else if(transportWaiting)setWorkNotice("Tala en espera: trasladar troncos al acopio");}dirty=true;}
          }
        }
        // Local observation and conversation only; reports retain their original timestamp.
        if(timeSpeedRef.current!==0) {
          for(const speaker of characters) {
            const info=speaker.knowledge;
            if(!info || !g1KnowledgeIsCurrent(info,knowledgeClock)) continue;
            for(const listener of characters) {
              if(listener===speaker || listener.order || listener.resting || listener.helpingNotice || Math.hypot(listener.tx-listener.x,listener.ty-listener.y)>1 || isAnyHauler(listener.id)) continue;
              if(listener.knowledge && g1KnowledgeIsCurrent(listener.knowledge,knowledgeClock) && listener.knowledge.observedAt>=info.observedAt) continue;
              const heard=g1ShareWorkKnowledge(info,speaker.id,speaker.x,speaker.y,listener.x,listener.y);
              if(heard) listener.knowledge=heard;
            }
          }
          for(const observer of characters) {
            const site=workTrees.find(t=>t.standing && !t.reservedBy && g1CanPerceiveWork(observer.x,observer.y,t.x,t.y));
            if(site && (!observer.knowledge || !g1KnowledgeIsCurrent(observer.knowledge,knowledgeClock))) {
              observer.knowledge={id:site.id,kind:"logging",x:site.x,y:site.y,observedAt:knowledgeClock,sourceCharacterId:observer.id};
            }
          }
          // Observations are informational only. The player must explicitly order
          // logging (single tree or work zone); NPCs never start felling on gossip.

        }
        // Resume player-assigned collecting pairs after their necessary rest.
        if(dt>0 && !isNight(frameClimate.hour) && stockpile && !haul && !queuedHauls.length){
          const persistent=characters.filter(ch=>continuousHaulers.has(ch.id) && !ch.resting && !ch.needTrip && !ch.order && !isAnyHauler(ch.id) && !isQueuedWorker(ch.id));
          const log=felledLogs.find(l=>!l.stockpiled && !l.usedForStorehouse && !isQueuedLog(l.id) && !isParallelLog(l.id));
          if(persistent.length>=2 && log && felledLogs.filter(l=>l.stockpiled&&!l.usedForStorehouse).length<STOCKPILE_CAPACITY){
            const pair=persistent.slice(0,2);
            queuedHauls.push({logId:log.id,workerIds:[pair[0].id, pair[1].id]});
            pair.forEach(ch=>{ch.tx=log.x;ch.ty=log.y;});
            dirty=true;
          }
        }
        if(dt>0 && !isNight(frameClimate.hour) && stockpile && !haul && queuedHauls.length){
          while(queuedHauls.length && !haul){
            const job=queuedHauls.shift()!;
            const log=felledLogs.find(l=>l.id===job.logId && !l.stockpiled && !l.usedForStorehouse);
            const pair=characters.filter(ch=>job.workerIds.includes(ch.id));
            if(!log || pair.length!==2 || pair.some(ch=>ch.resting || ch.needTrip || Boolean(ch.order)))continue;
            haulOrigin={x:log.x,y:log.y};
            haul={logId:log.id,workerIds:job.workerIds,destinationX:stockpile.x,destinationY:stockpile.y,active:true,phase:"collecting"};
            pair.forEach(ch=>{ch.tx=log.x;ch.ty=log.y;});
            haulStallSeconds=0;haulLastPositions={};dirty=true;
          }
        }
        if(dt>0 && !isNight(frameClimate.hour) && stockpile && !haul && !queuedHauls.length){const log=felledLogs.filter(l=>!l.stockpiled&&!l.usedForStorehouse&&!isQueuedLog(l.id)).sort((a,b)=>Math.hypot(a.x-stockpile!.x,a.y-stockpile!.y)-Math.hypot(b.x-stockpile!.x,b.y-stockpile!.y))[0];if(log){const available=characters.filter(ch=>!ch.mui && !ch.order && !ch.resting && !ch.needTrip && !isQueuedWorker(ch.id) && Math.hypot(ch.tx-ch.x,ch.ty-ch.y)<=1 && g1CanJoinHaul(ch.x,ch.y,log.x,log.y,ch.fatigue)).sort((a,b)=>Math.hypot(a.x-log.x,a.y-log.y)-Math.hypot(b.x-log.x,b.y-log.y));const ids=chooseG1Haulers(available.map(ch=>ch.id),G1_FOUNDING_WORK_PROFILES,log.transportersRequired);if(ids.length<log.transportersRequired){
          // Bring idle carriers to a distant fallen log. Without this rendezvous,
          // logs outside the guards' initial perception radius can never be hauled.
          const candidates=characters.filter(ch=>!ch.mui && !ch.order && !ch.resting && !ch.needTrip && !isAnyHauler(ch.id) && !isQueuedWorker(ch.id) && g1CanJoinHaul(ch.x,ch.y,log.x,log.y,ch.fatigue))
            .sort((a,b)=>{
              // Keep guards already sent toward this log ahead of newly idle guards.
              // Prevents rendezvous assignments oscillating each frame.
              const assignedA=Math.hypot(a.tx-log.x,a.ty-log.y)<=1?0:1;
              const assignedB=Math.hypot(b.tx-log.x,b.ty-log.y)<=1?0:1;
              return assignedA-assignedB || Math.hypot(a.x-log.x,a.y-log.y)-Math.hypot(b.x-log.x,b.y-log.y);
            });
          for(const worker of candidates.slice(0,log.transportersRequired)){
            if(Math.hypot(worker.x-log.x,worker.y-log.y)>3 && Math.hypot(worker.tx-log.x,worker.ty-log.y)>1){
              worker.tx=log.x;worker.ty=log.y;dirty=true;
            }
          }
        }
        if(ids.length===log.transportersRequired){const pair=characters.filter(ch=>ids.includes(ch.id));haulOrigin={x:log.x,y:log.y};haul={logId:log.id,workerIds:[ids[0],ids[1]],destinationX:stockpile.x,destinationY:stockpile.y,active:true,phase:"collecting"};pair.forEach(ch=>{ch.tx=log.x;ch.ty=log.y;});}}}
        // Every independent pair advances on the same simulation tick.
        if(dt>0 && stockpile){
          for(const job of [...parallelHauls]){
            const log=felledLogs.find(l=>l.id===job.logId);
            const pair=characters.filter(ch=>job.workerIds.includes(ch.id));
            if(!log || log.stockpiled || log.usedForStorehouse || felledLogs.filter(l=>l.stockpiled&&!l.usedForStorehouse).length>=STOCKPILE_CAPACITY || pair.length!==2 || pair.some(ch=>Boolean(ch.order))){cancelParallel(job);continue;}
            const target=job.phase==="collecting" ? {x:job.originX,y:job.originY} : {x:job.slotX??stockpile.x,y:job.slotY??stockpile.y};
            // The existing character movement system moves both carriers independently.
            if(job.phase==="collecting"){
              if(pair.every(ch=>Math.hypot(ch.x-target.x,ch.y-target.y)<2)){
                const reserved=parallelHauls.filter(h=>h.phase==="delivering").length + (haul?.phase==="delivering"?1:0);
                const slot=stockpileSlot(stockpile,felledLogs.filter(l=>l.stockpiled&&!l.usedForStorehouse).length+reserved);
                job.phase="delivering";job.slotX=slot.x;job.slotY=slot.y;
                pair.forEach((ch,i)=>{ch.tx=slot.x+(i===0?-1.25:1.25);ch.ty=slot.y;});dirty=true;
              }
            }else if(pair.every(ch=>Math.hypot(ch.x-target.x,ch.y-target.y)<2.5)){
              log.x=target.x;log.y=target.y;log.stockpiled=true;
              pair.forEach(ch=>{ch.tx=ch.x;ch.ty=ch.y;});
              parallelHauls.splice(parallelHauls.indexOf(job),1);keepHauling(pair);dirty=true;
            }else{
              log.x=(pair[0].x+pair[1].x)/2;log.y=(pair[0].y+pair[1].y)/2;dirty=true;
            }
            const moved=pair.some(ch=>{const old=job.lastPositions[ch.id];return !old||Math.hypot(ch.x-old.x,ch.y-old.y)>.015;});
            job.stalled=moved?0:job.stalled+dt;
            job.lastPositions=Object.fromEntries(pair.map(ch=>[ch.id,{x:ch.x,y:ch.y}]));
            if(job.stalled>25)cancelParallel(job);
          }
        }
        // Recover automatically if a hauling pair cannot make progress for 25 seconds.
        // Never mark a log delivered unless both workers reach its stockpile slot.
        if(dt>0 && haul?.active){
          const targetLog=felledLogs.find(l=>l.id===haul!.logId);
          const target=haul.phase==="collecting"?targetLog:{x:haul.slotX??haul.destinationX,y:haul.slotY??haul.destinationY};
          const carriers=characters.filter(ch=>haul!.workerIds.includes(ch.id));
          if(!target || carriers.length!==2 || targetLog?.stockpiled || targetLog?.usedForStorehouse || new Set(carriers.map(ch=>ch.id)).size!==2){
            // Missing log or missing guard: release the surviving worker instead of
            // leaving a permanent phantom hauling assignment.
            cancelHaul();
            setWorkNotice("Transporte reiniciado: carga o pareja no disponible");
            dirty=true;
          } else {
            // Track the slowest guard. A sum can conceal one stationary carrier
            // when the other is still walking, delaying recovery indefinitely.
            const distance=Math.max(...carriers.map(ch=>Math.hypot(ch.x-target.x,ch.y-target.y)));
            // Progress includes real movement even if a guard takes a detour around
            // obstacles. The old all-time distance minimum falsely timed out moving pairs.
            const moving=carriers.every(ch=>{
              // A carrier already at the target may wait; every other carrier
              // must continue making progress or the pair needs recovery.
              if(Math.hypot(ch.x-target.x,ch.y-target.y)<2) return true;
              const previous=haulLastPositions[ch.id];
              return !previous || Math.hypot(ch.x-previous.x,ch.y-previous.y)>0.015;
            });
            haulLastPositions=Object.fromEntries(carriers.map(ch=>[ch.id,{x:ch.x,y:ch.y}]));
            haulLastDistance=distance;
            if(moving) haulStallSeconds=0;
            else haulStallSeconds+=dt;
            if(haulStallSeconds>25){cancelHaul();setWorkNotice("Transporte reintentado: pareja bloqueada");dirty=true;}
          }
        }
        if(dt>0 && stockpile && haul?.active){
          const currentHaul = haul;
          const log = felledLogs.find(l=>l.id===currentHaul.logId);
          const pair = characters.filter(ch=>currentHaul.workerIds.includes(ch.id));
          if(!log || log.stockpiled || log.usedForStorehouse || felledLogs.filter(l=>l.stockpiled&&!l.usedForStorehouse).length>=STOCKPILE_CAPACITY || pair.length!==2 || new Set(pair.map(ch=>ch.id)).size!==2 || pair.some(ch=>ch.resting || ch.needTrip || Boolean(ch.order))){
            cancelHaul();
          } else if(currentHaul.phase==="collecting"){
            if(pair.every(ch=>Math.hypot(ch.x-log.x,ch.y-log.y)<2)){
              const slot=stockpileSlot(stockpile,felledLogs.filter(l=>l.stockpiled && !l.usedForStorehouse).length+parallelHauls.filter(h=>h.phase==="delivering").length);
              currentHaul.phase="delivering";
              haulStallSeconds=0;haulLastDistance=Number.POSITIVE_INFINITY;haulLastPositions={};
              currentHaul.slotX=slot.x;
              currentHaul.slotY=slot.y;
              pair.forEach((ch,i)=>{ch.tx=slot.x+(i===0?-1.25:1.25);ch.ty=slot.y;});
              dirty=true;
            }
          } else {
            const sx=currentHaul.slotX ?? stockpile.x;
            const sy=currentHaul.slotY ?? stockpile.y;
            if(pair.every(ch=>Math.hypot(ch.x-sx,ch.y-sy)<2)){
              log.x=sx;log.y=sy;log.stockpiled=true;
              haul=null;
              haulOrigin=null;
              haulStallSeconds=0;haulLastDistance=Number.POSITIVE_INFINITY;haulLastPositions={};
              pair.forEach(ch=>{ch.tx=ch.x;ch.ty=ch.y;});
              keepHauling(pair);
              // Once the stockpile is clear, idle loggers can resume their original zone.
              // Explicit player orders and resting workers are never overwritten.
              if(!nearestUnstockpiledLog(felledLogs,stockpile.x,stockpile.y)){
                for(const worker of characters){
                  if(worker.mui || worker.order || worker.resting || Math.hypot(worker.tx-worker.x,worker.ty-worker.y)>1 || !worker.loggingZone)continue;
                  const tree=reserveNearestTreeInZone(workTrees,worker.id,worker.loggingZone.x,worker.loggingZone.y);
                  if(!tree)continue;
                  worker.treeId=tree.id;
                  worker.order=createLoggingOrder(tree.x,tree.y);
                  worker.tx=tree.x;worker.ty=tree.y;
                }
              }
              dirty=true;
            } else {
              log.x=(pair[0].x+pair[1].x)/2;
              log.y=(pair[0].y+pair[1].y)/2;
              dirty=true;
            }
          }
        }
        if (moving) dirty = true;
      }
      if (baked && keys.size > 0) {
        let mx = 0;
        let my = 0;
        keys.forEach((k) => {
          const v = MOVE_KEYS[k];
          if (v) {
            mx += v[0];
            my += v[1];
          }
        });
        if (mx || my) {
          const len = Math.hypot(mx, my);
          cam.x += ((mx / len) * PAN_SPEED * elapsed) / cam.zoom;
          cam.y += ((my / len) * PAN_SPEED * elapsed) / cam.zoom;
          clampCamera(cam, baked);
          dirty = true;
        }
      }
      if (dirty) {
        dirty = false;
        draw();
        drawPlacementPreview();
        if(marquee){ctx.save();ctx.fillStyle="rgba(138,196,120,.14)";ctx.strokeStyle="#c5eaa5";ctx.lineWidth=2;ctx.setLineDash([6,4]);const x=Math.min(marquee.startX,marquee.endX),y=Math.min(marquee.startY,marquee.endY);ctx.fillRect(x,y,Math.abs(marquee.endX-marquee.startX),Math.abs(marquee.endY-marquee.startY));ctx.strokeRect(x,y,Math.abs(marquee.endX-marquee.startX),Math.abs(marquee.endY-marquee.startY));ctx.restore();}
      }
      frame = requestAnimationFrame(tick);
    };

    // G3 mobile: two-finger drag pans the world; pinching zooms around the
    // gesture midpoint. Single-finger taps keep the existing order semantics.
    const touchPoints = new Map<number, {x:number;y:number}>();
    let pinch: {x:number;y:number;distance:number} | null = null;
    let suppressTouchTap = false;
    const touchOrigins = new Map<number, {x:number;y:number}>();
    const TAP_TOLERANCE_PX = 12;
    const TAP_MAX_DURATION_MS = 650;
    const touchStartTimes = new Map<number, number>();
    // Track each finger independently: after a pinch, a remaining finger must
    // begin a fresh drag without jumping to its old position.
    let gestureWasMultitouch = false;
    // Single-finger drags pan the camera; a stationary release remains a tap.
    const touchLast = new Map<number, {x:number;y:number}>();
    const touchMidpoint = () => {
      const [a,b] = [...touchPoints.values()].slice(0,2);
      return {x:(a.x+b.x)/2,y:(a.y+b.y)/2,distance:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y))};
    };
    const onPointerDown = (e: PointerEvent, fromTouchTap = false) => {
      if (e.pointerType === "touch") {
        touchPoints.set(e.pointerId,{x:e.clientX,y:e.clientY});
        touchOrigins.set(e.pointerId,{x:e.clientX,y:e.clientY});
        touchStartTimes.set(e.pointerId,performance.now());
        touchLast.set(e.pointerId,{x:e.clientX,y:e.clientY});
        if (canvas.setPointerCapture && e.pointerId !== undefined) canvas.setPointerCapture(e.pointerId);
        if (touchPoints.size >= 2) {
          // Rebase on any finger-count change: no camera jump when a third finger lands.
          pinch=touchMidpoint(); suppressTouchTap=true; gestureWasMultitouch=true; dragging=false; marquee=null;
          dirty=true; return;
        }
        // A touch is a tap, not an immediate mouse-down command: wait until
        // pointerup so a second finger cannot accidentally place a building.
        return;
      }

      if (baked && e.button === 0 && e.shiftKey && !buildingModeRef.current && !stockpileModeRef.current && !campfireModeRef.current){const rect=canvas.getBoundingClientRect();marquee={startX:e.clientX-rect.left,startY:e.clientY-rect.top,endX:e.clientX-rect.left,endY:e.clientY-rect.top};canvas.setPointerCapture(e.pointerId);dirty=true;return;}
      if (baked && e.button === 0) {
        const rect=canvas.getBoundingClientRect(); const mx=e.clientX-rect.left, my=e.clientY-rect.top;
        if(campfireModeRef.current){const wx=cam.x+(mx-width/2)/cam.zoom,wy=cam.y+(my-height/2)/cam.zoom;campfire=insideWorld(wx,wy);setCampfirePlaced(true);campfireModeRef.current=false;setCampfireMode(false);setWorkNotice("Fogata colocada; se encenderá por la noche");dirty=true;return;}
        if(buildingModeRef.current){const wx=cam.x+(mx-width/2)/cam.zoom,wy=cam.y+(my-height/2)/cam.zoom;const q=insideWorld(wx,wy);if(storehouse){setWorkNotice("Ya existe una obra de almacén");buildingModeRef.current=false;setBuildingMode(false);return;}storehouse={...createStorehouseSite(q.x,q.y),turned:storehouseTurnedRef.current};buildingModeRef.current=false;setBuildingMode(false);setBuildingProgress({committed:0,complete:false,placed:true});setWorkNotice("Obra marcada: 91 troncos del acopio y NPC disponibles");dirty=true;return;}
        if(stockpileModeRef.current){loggingTargetRef.current=null;setLoggingTarget(null);const wx=cam.x+(mx-width/2)/cam.zoom,wy=cam.y+(my-height/2)/cam.zoom;if(haul)cancelHaul();const q=insideWorld(wx,wy);const margin=28;stockpile=createOutdoorStockpile(baked?clamp(q.x,Math.min(margin,baked.width/2),Math.max(margin,baked.width-margin)):q.x,baked?clamp(q.y,Math.min(margin,baked.height/2),Math.max(margin,baked.height-margin)):q.y);felledLogs.filter(log=>log.stockpiled).forEach((log,index)=>{const slot=stockpileSlot(stockpile!,index);log.x=slot.x;log.y=slot.y;});stockpileModeRef.current=false;setStockpileMode(false);setWorkNotice("Zona de acopio marcada");dirty=true;return;}
        let hit: FoundingCharacter | undefined; let best=fromTouchTap ? 32 : 18;
        for(const ch of characters){const s=toScreen(ch); const d=Math.hypot(mx-s.x,my-s.y); if(d<best){best=d;hit=ch;}}
        if(hit){
          if(manualHaulPrimary && !manualHaulHelper && hit.id!==manualHaulPrimary){
            window.dispatchEvent(new CustomEvent("azheryn-squad-individual",{detail:{id:hit.id}}));return;
          }
          // A previously selected terrain target must not be reused after changing the squad.
          loggingTargetRef.current=null;
          setLoggingTarget(null);
          if (e.shiftKey) {
            hit.selected = !hit.selected;
          } else {
            // Tap once to select, tap the same unit again to deselect.
            const wasSoleSelection = hit.selected && characters.filter(ch => ch.selected).length === 1;
            characters.forEach(ch => ch.selected = !wasSoleSelection && ch.id === hit!.id);
          }
          publishSelection();dirty=true; return;
        }
        const wx=cam.x+(mx-width/2)/cam.zoom, wy=cam.y+(my-height/2)/cam.zoom;
        const selected=characters.filter(ch=>ch.selected);
        // Clicking a work tree gives an exact tree order rather than a vague forest zone.
        // Each tree keeps its own persistent identity, standing state and reservation.
        const hitTree=workTrees.filter(tree=>tree.standing).filter(tree=>Math.abs(tree.x-wx)<30/cam.zoom && Math.abs(tree.y-wy)<30/cam.zoom).map(tree=>({tree, distance:Math.hypot(mx-toScreen(tree).x,my-(toScreen(tree).y-20*cam.zoom))})).sort((a,b)=>a.distance-b.distance)[0];
        // Direct hauling: select one NPC, then click a fallen log. Recruit the
        // nearest available helper (Mui or a guard) for a two-person carry.
        const hitLog = felledLogs.filter(log=>!log.stockpiled && !log.usedForStorehouse)
          .map(log=>({log,distance:Math.hypot(mx-toScreen(log).x,my-toScreen(log).y)}))
          .sort((a,b)=>a.distance-b.distance)[0];
        if(selected.length && hitLog && hitLog.distance<=Math.max(fromTouchTap?28:14,12*cam.zoom)){
          if(!stockpile){setWorkNotice(t("Primero coloca la zona de acopio","Place a stockpile first"));return;}
          if(haul?.logId===hitLog.log.id || isQueuedLog(hitLog.log.id)){setWorkNotice(t("Ese tronco ya está en transporte","That log is already being carried"));return;}
          const available=(ch:FoundingCharacter)=>!ch.needTrip && !ch.order && !isQueuedWorker(ch.id) && (!haul || !haul.workerIds.includes(ch.id));
          const primary=manualHaulWaitingForLog ? characters.find(ch=>ch.id===manualHaulPrimary && available(ch)) : selected.find(available);
          if(!primary){setWorkNotice(t("El personaje seleccionado no está disponible","Selected character is unavailable"));return;}
          const helper=manualHaulWaitingForLog
            ? characters.find(ch=>ch.id===manualHaulHelper && available(ch))
            : characters.filter(ch=>ch.id!==primary.id && available(ch))
              .sort((a,b)=>Math.hypot(a.x-hitLog.log.x,a.y-hitLog.log.y)-Math.hypot(b.x-hitLog.log.x,b.y-hitLog.log.y))[0];
          if(!helper){setWorkNotice(t("Se necesita otro personaje disponible para cargar el tronco","Another available character is needed to carry this log"));return;}
          for(const ch of [primary,helper]){recordMuiCommand(ch);ch.resting=false;ch.tx=hitLog.log.x;ch.ty=hitLog.log.y;continuousHaulers.add(ch.id);}
          manualHaulPrimary=null;manualHaulHelper=null;manualHaulWaitingForLog=false;setCompanionPrompt(false);
          if(haul){
            parallelHauls.push({logId:hitLog.log.id,workerIds:[primary.id,helper.id],destinationX:stockpile.x,destinationY:stockpile.y,active:true,phase:"collecting",originX:hitLog.log.x,originY:hitLog.log.y,stalled:0,lastPositions:{}});
          }else{
            haulOrigin={x:hitLog.log.x,y:hitLog.log.y};
            haul={logId:hitLog.log.id,workerIds:[primary.id,helper.id],destinationX:stockpile.x,destinationY:stockpile.y,active:true,phase:"collecting"};
            haulStallSeconds=0;haulLastDistance=Number.POSITIVE_INFINITY;haulLastPositions={};
          }
          orderModeRef.current="none";setOrderMode("none");
          setWorkNotice(t(`Transporte ordenado: ${primary.mui?"Mui":primary.id} y ${helper.mui?"Mui":helper.id} recogerán el tronco`,`Hauling ordered: ${primary.mui?"Mui":primary.id} and ${helper.mui?"Mui":helper.id} will collect the log`));
          dirty=true;return;
        }
        if(selected.length && hitTree && hitTree.distance<=Math.max(fromTouchTap ? 28 : 12,18*cam.zoom)){
          const available=selected.filter(ch=>!ch.needTrip && !ch.resting);
          const worker=available.find(ch=>ch.id===hitTree.tree.reservedBy) ?? available[0];
          if(!worker){setWorkNotice(t("Los personajes seleccionados están atendiendo sus necesidades","Selected characters are attending to their needs"));return;}
          if(hitTree.tree.reservedBy && hitTree.tree.reservedBy!==worker.id){setWorkNotice(t("Este árbol ya está asignado a otro personaje","This tree is already assigned to another character"));return;}
          if(isAnyHauler(worker.id))cancelHaul();
          if(worker.order)releaseTree(worker);
          worker.previousOrder=undefined;worker.pendingLoggingZone=undefined;worker.knowledge=undefined;
          worker.loggingZone={x:hitTree.tree.x,y:hitTree.tree.y}; // Continue with nearby trees until fatigue or interruption.
          hitTree.tree.reservedBy=worker.id;worker.treeId=hitTree.tree.id;
          recordMuiCommand(worker);worker.order=createLoggingOrder(hitTree.tree.x,hitTree.tree.y);
          worker.manualMove=false;worker.resting=false;worker.work=0;worker.tx=hitTree.tree.x;worker.ty=hitTree.tree.y;
          orderModeRef.current="none";setOrderMode("none");
          setWorkNotice(t(`Árbol ${hitTree.tree.id} marcado para tala por ${worker.mui?"Mui":worker.id}`,`Tree ${hitTree.tree.id} assigned to ${worker.mui?"Mui":worker.id}`));
          dirty=true;return;
        }
        if(selected.length){
          selected.forEach(ch=>{recordMuiCommand(ch);if(isAnyHauler(ch.id))cancelWorkerHaul(ch.id);if(ch.order){releaseTree(ch);ch.order=undefined;}ch.previousOrder=undefined;ch.pendingLoggingZone=undefined;ch.loggingZone=undefined;ch.knowledge=undefined;});
          if(orderModeRef.current === "logging") {
            window.dispatchEvent(new CustomEvent("azheryn-log-order",{detail:{x:wx,y:wy}}));
            orderModeRef.current="none";setOrderMode("none");dirty=true;return;
          }
          loggingTargetRef.current={x:wx,y:wy}; setLoggingTarget({x:wx,y:wy});
          orderModeRef.current="none";setOrderMode("none");
          const spread=[[0,0],[-14,-7],[14,-7],[-20,10],[20,10],[-10,18],[10,18],[0,25]]; selected.forEach((ch,i)=>{const q=insideWorld(wx+spread[i%spread.length][0],wy+spread[i%spread.length][1]);ch.tx=q.x;ch.ty=q.y;ch.manualMove=true;ch.resting=false;}); dirty=true; return; }
      }
      if(e.shiftKey && e.button===0){const rect=canvas.getBoundingClientRect();marquee={startX:e.clientX-rect.left,startY:e.clientY-rect.top,endX:e.clientX-rect.left,endY:e.clientY-rect.top};canvas.setPointerCapture(e.pointerId);dirty=true;return;}
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      const previewRect=canvas.getBoundingClientRect();
      placementPointer={x:e.clientX-previewRect.left,y:e.clientY-previewRect.top};
      if(buildingModeRef.current||stockpileModeRef.current||campfireModeRef.current)dirty=true;
      if(e.pointerType === "touch" && touchPoints.has(e.pointerId)) {
        const previous=touchLast.get(e.pointerId);
        touchPoints.set(e.pointerId,{x:e.clientX,y:e.clientY});
        touchLast.set(e.pointerId,{x:e.clientX,y:e.clientY});
        const origin=touchOrigins.get(e.pointerId);
        if(origin && Math.hypot(e.clientX-origin.x,e.clientY-origin.y)>TAP_TOLERANCE_PX) suppressTouchTap=true;
        if(touchPoints.size===1 && baked && origin && previous && suppressTouchTap && !pinch) {
          cam.x-=(e.clientX-previous.x)/cam.zoom;
          cam.y-=(e.clientY-previous.y)/cam.zoom;
          clampCamera(cam,baked); dirty=true;
        }
        if(touchPoints.size >= 2 && baked) {
          // Only the first two fingers control the camera; ignore extra fingers.
          const next=touchMidpoint();
          if(pinch) {
            const rect=canvas.getBoundingClientRect();
            const cx=next.x-rect.left-width/2, cy=next.y-rect.top-height/2;
            const before=cam.zoom;
            // Limit one-frame scale spikes from noisy touch hardware.
            const ratio=clamp(next.distance/pinch.distance,0.75,1.33);
            const after=clamp(before*ratio,MIN_ZOOM,MAX_ZOOM);
            cam.x+=(pinch.x-next.x)/before+cx/before-cx/after;
            cam.y+=(pinch.y-next.y)/before+cy/before-cy/after;
            cam.zoom=after;
            clampCamera(cam,baked); dirty=true;
          }
          pinch=next;
        }
        return;
      }

      if(marquee){const rect=canvas.getBoundingClientRect();marquee.endX=e.clientX-rect.left;marquee.endY=e.clientY-rect.top;dirty=true;return;}
      if (!dragging || !baked) return;
      cam.x -= (e.clientX - lastX) / cam.zoom;
      cam.y -= (e.clientY - lastY) / cam.zoom;
      lastX = e.clientX;
      lastY = e.clientY;
      clampCamera(cam, baked);
      dirty = true;
    };
    const onPointerUp = (e: PointerEvent) => {
      // A cancelled pointer is never a click, including when its coordinates
      // coincide with a selectable unit or construction site.
      if(e.type === "pointercancel") {
        resetInterruptedGestures();
        if(canvas.hasPointerCapture?.(e.pointerId))canvas.releasePointerCapture(e.pointerId);
        return;
      }
      if(e.pointerType === "touch") {
        const wasPinching=pinch!==null || touchPoints.size>1;
        const origin=touchOrigins.get(e.pointerId);
        const moved=!!origin && Math.hypot(e.clientX-origin.x,e.clientY-origin.y)>TAP_TOLERANCE_PX;
        const elapsed=performance.now()-(touchStartTimes.get(e.pointerId) ?? 0);
        touchStartTimes.delete(e.pointerId);
        touchOrigins.delete(e.pointerId);
        touchLast.delete(e.pointerId);
        touchPoints.delete(e.pointerId);
        if(touchPoints.size<2) {
          pinch=null;
          // The surviving finger is a new pan gesture, not a delayed tap.
          for (const [id,point] of touchPoints) {
            touchOrigins.set(id,{...point});
            touchStartTimes.set(id,performance.now());
            touchLast.set(id,{...point});
          }
        }
        if(canvas.hasPointerCapture?.(e.pointerId))canvas.releasePointerCapture(e.pointerId);
        if(!wasPinching && !moved && !suppressTouchTap && elapsed<=TAP_MAX_DURATION_MS && !gestureWasMultitouch && touchPoints.size===0 && e.type!=="pointercancel") {
          // Reuse the normal click/command logic for a single-finger tap.
          onPointerDown({clientX:e.clientX,clientY:e.clientY,button:0,pointerType:"mouse",shiftKey:false,detail:1} as PointerEvent, true);
        }
        // A completed pinch must not disable subsequent single-finger taps.
        if(touchPoints.size===0) { suppressTouchTap=false; gestureWasMultitouch=false; }
        return;
      }

      if(marquee){const r=marquee;marquee=null;const x1=Math.min(r.startX,r.endX),x2=Math.max(r.startX,r.endX),y1=Math.min(r.startY,r.endY),y2=Math.max(r.startY,r.endY);if(x2-x1>5&&y2-y1>5){characters.forEach(ch=>{const q=toScreen(ch);ch.selected=q.x>=x1&&q.x<=x2&&q.y>=y1&&q.y<=y2;});publishSelection();}dirty=true;}
      dragging = false;
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      canvas.style.cursor = "grab";
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!baked) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - width / 2;
      const my = e.clientY - rect.top - height / 2;
      const before = cam.zoom;
      const after = clamp(before * Math.exp(-e.deltaY * 0.0015), MIN_ZOOM, MAX_ZOOM);
      cam.x += mx / before - mx / after;
      cam.y += my / before - my / after;
      cam.zoom = after;
      clampCamera(cam, baked);
      dirty = true;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if(e.key.toLowerCase()==="r" && buildingModeRef.current){storehouseTurnedRef.current=!storehouseTurnedRef.current;setStorehouseTurned(storehouseTurnedRef.current);dirty=true;e.preventDefault();return;}
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target;
      if (target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;
      const k = e.key.toLowerCase();
      // G3: pause without losing the previously selected simulation speed.
      if (e.code === "Space" && !e.repeat) {
        const next = timeSpeedRef.current === 0 ? lastRunningSpeedRef.current : 0;
        if (next !== 0) lastRunningSpeedRef.current = next;
        timeSpeedRef.current = next;
        setTimeSpeed(next);
        e.preventDefault(); return;
      }
      if (k === "escape") {
        loggingTargetRef.current = null; setLoggingTarget(null);
        orderModeRef.current = "none"; setOrderMode("none");
        buildingModeRef.current = false; setBuildingMode(false);
        stockpileModeRef.current = false; setStockpileMode(false);
        setWorkNotice(null);
        e.preventDefault(); return;
      }
      // G3 camera accessibility: return to Mui without disrupting active orders.
      if (k === "h" && !e.repeat) {
        const mui = characters.find(ch => ch.mui);
        if (mui && baked) {
          cam.x = mui.x; cam.y = mui.y;
          clampCamera(cam, baked);
          dirty = true;
        }
        e.preventDefault(); return;
      }
      // Keyboard zoom mirrors mouse-wheel limits and preserves the camera center.
      if (["+", "=", "-", "_"].includes(e.key) && !e.repeat) {
        const factor = e.key === "+" || e.key === "=" ? 1.2 : 1 / 1.2;
        cam.zoom = clamp(cam.zoom * factor, MIN_ZOOM, MAX_ZOOM);
        if (baked) clampCamera(cam, baked);
        dirty = true;
        e.preventDefault(); return;
      }
      const squadShortcuts: Record<string,string> = {"1":"mui","2":"guards","3":"all","0":"clear"};
      if (squadShortcuts[k]) {
        window.dispatchEvent(new CustomEvent("azheryn-squad-action", {detail:{action:squadShortcuts[k]}}));
        e.preventDefault(); return;
      }
      if (k === "m" || k === "t") {
        // Keyboard commands must cancel pending placement modes; otherwise
        // the next terrain click unexpectedly places a stockpile or building.
        buildingModeRef.current = false; setBuildingMode(false);
        stockpileModeRef.current = false; setStockpileMode(false);
        loggingTargetRef.current = null; setLoggingTarget(null);
        const mode = k === "m" ? "move" : "logging";
        orderModeRef.current = mode;
        setOrderMode(mode);
        setWorkNotice(k === "m" ? t("Haz clic en el terreno para mover el grupo", "Click terrain to move the squad") : t("Selecciona un árbol o una zona de tala", "Select a tree or logging area"));
        e.preventDefault(); return;
      }
      if (MOVE_KEYS[k]) {
        keys.add(k);
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());
    const resetInterruptedGestures = () => { touchPoints.clear(); touchOrigins.clear(); touchStartTimes.clear(); touchLast.clear(); pinch=null; dragging=false; marquee=null; suppressTouchTap=false; gestureWasMultitouch=false; canvas.style.cursor="grab"; dirty=true; };
    const onBlur = () => { keys.clear(); resetInterruptedGestures(); };

    const onLogOrder=(e:Event)=>{
      const p=(e as CustomEvent<{x:number;y:number}>).detail;
      const squad=characters.filter(ch=>ch.selected);
      if(!squad.length)return;
      let assigned=0, queued=0;
      for(const ch of squad){
        recordMuiCommand(ch);
        if(ch.needTrip || ch.resting){
          // Preserve the active need/rest trip; execute the player's latest zone order afterward.
          ch.pendingLoggingZone={x:p.x,y:p.y};
          ch.previousOrder=undefined;
          queued++;
          continue;
        }
        if(isAnyHauler(ch.id))cancelWorkerHaul(ch.id);
        releaseTree(ch);
        ch.previousOrder=undefined;ch.pendingLoggingZone=undefined;ch.knowledge=undefined;
        ch.loggingZone={x:p.x,y:p.y};
        const tree=reserveNearestTreeInZone(workTrees,ch.id,p.x,p.y);
        if(!tree){ch.order=undefined;ch.loggingZone=undefined;ch.tx=ch.x;ch.ty=ch.y;continue;}
        ch.treeId=tree.id;ch.order=createLoggingOrder(tree.x,tree.y);
        assigned++;ch.work=0;
        const q=insideWorld(tree.x,tree.y);ch.tx=q.x;ch.ty=q.y;
      }
      setWorkNotice(assigned||queued
        ? t(`Tala asignada: ${assigned}; en espera: ${queued}`,`Logging assigned: ${assigned}; queued: ${queued}`)
        : t("No hay árboles libres en esta zona","No available trees in this area"));
      dirty=true;
    };
    const onFindAnimals=()=>{if(!baked)return;const a=PEACEFUL_ANIMALS[animalFocusIndex++ % PEACEFUL_ANIMALS.length];const pos=wildlifeWorldPosition(a,wildlifeSimulationSeconds);cam.x=pos.x;cam.y=pos.y;cam.zoom=Math.max(cam.zoom,1.35);clampCamera(cam,baked);dirty=true;setWorkNotice(t("Cámara centrada en un animal. Pulsa otra vez para ver el siguiente.","Camera centered on an animal. Tap again for the next."));};
    window.addEventListener("azheryn-find-animals",onFindAnimals);
    window.addEventListener("azheryn-log-order",onLogOrder);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("orientationchange", resize);
    resize();

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    window.addEventListener("pagehide", resetInterruptedGestures);
    frame = requestAnimationFrame(tick);

    // El mundo se genera tras el primer pintado para poder mostrar el mensaje de carga.
    const timer = window.setTimeout(() => {
      baked = painter.bake();
      cam.x = baked.clearing.x;
      cam.y = baked.clearing.y;
      cam.zoom = 1;
      characters = FOUNDING_OFFSETS.map((o,i) => { const p=project(world.clearing.x + o[0]/28, world.clearing.y + o[1]/26); const id=i===0?"mui":`guard-${i}`;const fp=g1ProfileForCharacter(id);return {id,mui:i===0,x:p.x,y:p.y,tx:p.x,ty:p.y,selected:false,fatigue:fp?{...fp}:undefined}; });
      muiHome={x:characters[0]?.x ?? 0,y:characters[0]?.y ?? 0};
      // G6.13: dense, irregular forest across approximately 80% of eligible land.
      // Every visible work tree is a real selectable/fellable tree, not a painted prop.
      // Water, the central clearing, and rocky ground remain free for gameplay.
      const initialTrees:G1WorkTree[] = [];
      const hashForest=(x:number,y:number,salt:number)=>{
        const n=Math.sin(x*127.1+y*311.7+salt*74.7)*43758.5453;
        return n-Math.floor(n);
      };
      for(let gy=2;gy<world.size-2;gy++) for(let gx=2;gx<world.size-2;gx++){
        const tile=world.tiles[gy*world.size+gx];
        if(!tile || tile.water || tile.rock>0.70)continue;
        const dist=Math.hypot(gx-world.clearing.x,gy-world.clearing.y);
        // Preserve the working clearing; irregular edges avoid a perfect ring.
        const clearingEdge=5.0+2.0*hashForest(Math.floor(gx/4),Math.floor(gy/4),1);
        if(dist<clearingEdge)continue;
        // Roughly four out of five usable forest cells hold a tree.
        // Coherent patches create thickets and occasional natural gaps.
        const patch=hashForest(Math.floor(gx/6),Math.floor(gy/6),2);
        const occupancy=patch<0.12?0.57:patch>0.86?0.96:0.84;
        if(hashForest(gx,gy,3)>occupancy)continue;
        const u=gx+(hashForest(gx,gy,4)-0.5)*0.64;
        const v=gy+(hashForest(gx,gy,5)-0.5)*0.64;
        const pos=project(u,v);
        const id=initialTrees.length+1;
        initialTrees.push({id:`tree-${id}`,x:pos.x,y:pos.y,standing:true,reservedBy:null,speciesId:speciesForIndex(id-1).id});
      }
      workTrees=initialTrees;
      // Restore only an explicitly saved session; no autosave is performed.
      const restored = readChapterSave(localStorage.getItem(SAVE_KEY), localStorage.getItem(SAVE_KEY + BACKUP_SUFFIX));
      if (restored) {
        const saved = restored.saved;
        characters = saved.characters as FoundingCharacter[];
        felledLogs = saved.felledLogs as LogState[];
        workTrees = saved.workTrees as G1WorkTree[];
        stockpile = (saved.stockpile as OutdoorStockpile | null) ?? null;
        campfire = (saved.campfire as {x:number;y:number} | null) ?? null;
        storehouse = recoverStorehouse(saved.storehouse);
        if(storehouse){storehouseTurnedRef.current=Boolean(storehouse.turned);setStorehouseTurned(Boolean(storehouse.turned));}
        const oldCam = saved.camera as Partial<CameraState> | undefined;
        if (oldCam && Number.isFinite(oldCam.x) && Number.isFinite(oldCam.y) && Number.isFinite(oldCam.zoom)) {
          cam.x = oldCam.x!; cam.y = oldCam.y!; cam.zoom = clamp(oldCam.zoom!,MIN_ZOOM,MAX_ZOOM);
        }
        setCampfirePlaced(Boolean(campfire));
        if (storehouse) setBuildingProgress({committed:storehouse.committed,complete:storehouse.complete,placed:true});
        publishSelection();
      }
      clampCamera(cam, baked);
      dirty = true;
      setReady(true);
    }, 30);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("orientationchange", resize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("pagehide", resetInterruptedGestures);
      window.removeEventListener("azheryn-find-animals",onFindAnimals);
      window.removeEventListener("azheryn-log-order",onLogOrder);
      window.removeEventListener("azheryn-squad-action",onSquadAction);
      window.removeEventListener("azheryn-squad-individual",onIndividualSquad);
      window.removeEventListener("azheryn-squad-haul",onSquadHaul);
      window.removeEventListener("pagehide", onPageHide);
      manualSaveRef.current = null;
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div className="world">
      <canvas ref={canvasRef} className="world-canvas" style={{touchAction:"none"}} />
      {showChapterVictory && <div className="azh-victory-backdrop" role="presentation">
        <section className="azh-victory-panel" role="dialog" aria-modal="true" aria-label={t("Capítulo 1 completado","Chapter 1 completed")}>
          <div className="azh-victory-emblem">✦ AZHERYN V2 ✦</div>
          <h2>{t("¡CAPÍTULO 1 COMPLETADO!","CHAPTER 1 COMPLETE!")}</h2>
          <p>{t("Mui y sus guardias han construido su primer almacén. La historia de AZHERYN apenas comienza…","Mui and the guards have built their first storehouse. The story of AZHERYN has only just begun…")}</p>
          <strong>{t("91 de 91 troncos instalados","91 of 91 logs installed")}</strong>
          <div className="azh-victory-future" aria-label={t("El futuro de AZHERYN","The future of AZHERYN")}>
            <h3>{t("El viaje apenas comienza", "The journey has only begun")}</h3>
            <p>{t("Este capítulo es la experiencia completa presentada al concurso. Sin embargo, representa menos del 1 % de la visión que imaginamos para AZHERYN: es el primer paso de un mundo mucho mayor.","This chapter is the complete experience submitted to the competition. Yet it represents less than 1% of the vision we imagine for AZHERYN: the first step into a much larger world.")}</p>
            <div className="azh-victory-future-grid">
              <div><span aria-hidden="true">🌾</span><b>{t("Alimentos y oficios","Food and crafts")}</b><small>{t("Cultivos, conservación, talleres y madera trabajada.","Farming, preservation, workshops and crafted timber.")}</small></div>
              <div><span aria-hidden="true">🏘️</span><b>{t("Pueblos y comunidades","Villages and communities")}</b><small>{t("Nuevos habitantes, hogares, relaciones y decisiones.","New settlers, homes, relationships and choices.")}</small></div>
              <div><span aria-hidden="true">⚖️</span><b>{t("Mercados y comercio","Markets and trade")}</b><small>{t("Intercambios, rutas, recursos y economía.","Trading, routes, resources and economy.")}</small></div>
              <div><span aria-hidden="true">♛</span><b>{t("Reinos y estrategia","Kingdoms and strategy")}</b><small>{t("Leyes, alianzas, territorios y grandes construcciones.","Laws, alliances, territories and ambitious building.")}</small></div>
            </div>
            <p className="azh-victory-future-note">{t("Los próximos capítulos se desarrollarán más adelante. Continuar permite explorar el asentamiento actual; no desbloquea todavía esos capítulos.","Future chapters will be developed later. Continue lets you explore your current settlement; it does not unlock those chapters yet.")}</p>
          </div>
          <div className="azh-victory-actions">
            <button type="button" onClick={()=>setShowChapterVictory(false)}>{t("Continuar","Continue")}</button>
            <button type="button" onClick={()=>{if(window.confirm(t("¿Reiniciar el capítulo desde cero?","Restart the chapter from the beginning?")))window.location.reload();}}>{t("Reiniciar capítulo","Restart chapter")}</button>
          </div>
        </section>
      </div>}
      <button type="button" className="g3-help-trigger" onClick={()=>setShowControls(true)} aria-label={t("Ver controles e instrucciones","Show controls and instructions")}>{"?"}</button>
      {showControls && <div className="g3-help-backdrop" role="presentation" onClick={()=>setShowControls(false)}>
        <section className="g3-help-panel" role="dialog" aria-modal="true" aria-label={t("Instrucciones del juego","Game instructions")} onClick={e=>e.stopPropagation()}>
          <header><h2>{t("Cómo jugar · Controles","How to play · Controls")}</h2><button type="button" onClick={()=>setShowControls(false)}>{t("Cerrar ✕","Close ✕")}</button></header>
          <h3>{t("Ordenador · Teclado y ratón","Computer · Keyboard and mouse")}</h3>
          <dl>
            <dt>W A S D / ↑ ← ↓ →</dt><dd>{t("Desplazar la cámara","Move camera")}</dd>
            <dt>H</dt><dd>{t("Centrar cámara en Mui","Center camera on Mui")}</dd>
            <dt>+ / −</dt><dd>{t("Acercar / alejar","Zoom in / out")}</dd>
            <dt>1 / 2 / 3 / 0</dt><dd>{t("Mui / guardias / todos / limpiar selección","Mui / guards / everyone / clear selection")}</dd>
            <dt>M / T</dt><dd>{t("Preparar orden de mover / talar","Prepare move / logging order")}</dd>
            <dt>Espacio / Esc</dt><dd>{t("Pausar o reanudar / cancelar orden pendiente","Pause or resume / cancel pending order")}</dd>
            <dt>{t("Clic / Shift + clic","Click / Shift + click")}</dt><dd>{t("Seleccionar / añadir o quitar unidades","Select / add or remove units")}</dd>
            <dt>{t("Shift + arrastrar","Shift + drag")}</dt><dd>{t("Seleccionar un grupo en un rectángulo","Select a group in a rectangle")}</dd>
            <dt>{t("Arrastrar / rueda","Drag / wheel")}</dt><dd>{t("Mover cámara / zoom","Pan camera / zoom")}</dd>
          </dl>
          <h3>{t("Teléfono · Pantalla táctil","Phone · Touch screen")}</h3>
          <p>{t("Toca un personaje para seleccionarlo. Arrastra el mapa para mover la cámara. Usa los botones visibles para seleccionar guardias, mover, talar, construir y pausar. En Construcción marca primero el acopio y después el almacén.","Tap a character to select. Drag the map to pan the camera. Use the on-screen buttons to select guards, move, log, build and pause. In Construction, place the stockpile first, then the storehouse.")}</p>
          <p>{t("Objetivo del capítulo: talar árboles, transportar los troncos en parejas y construir el almacén con 91 troncos.","Chapter goal: fell trees, transport logs in pairs and build the storehouse with 91 logs.")}</p>
        </section>
      </div>}
      <div className="world-options"><button type="button" onClick={()=>setShowOptions(v=>!v)} aria-expanded={showOptions}>{"⚙"}</button>{showOptions&&<div className="world-options-menu"><strong>{t("Opciones del juego","Game options")}</strong><label>{t("Idioma","Language")}</label><div><button type="button" onClick={()=>{setLanguage("es");localStorage.setItem("azheryn-language","es")}}>Español</button><button type="button" onClick={()=>{setLanguage("en");localStorage.setItem("azheryn-language","en")}}>English</button></div><p>{t("Shift + arrastrar: seleccionar varios personajes. Selecciona Talar: haz clic en un árbol o en una zona del bosque.","Shift + drag: select multiple characters. Choose Log: click a tree or a forest area.")}</p><div><button type="button" onClick={saveManually}>{t("Guardar partida", "Save game")}</button><button type="button" onClick={exportSave}>{t("Exportar partida", "Export save")}</button><button type="button" onClick={()=>importSaveRef.current?.click()}>{t("Importar partida", "Import save")}</button><input ref={importSaveRef} type="file" accept=".json,application/json" style={{display:"none"}} onChange={e=>{void importSave(e.target.files?.[0]);}} /></div><button type="button" onClick={()=>{if(window.confirm(t("¿Borrar la partida guardada y reiniciar?","Delete the saved game and restart?"))){localStorage.removeItem("azheryn-v2-g1-o1-save-v1");localStorage.removeItem("azheryn-v2-g1-o1-save-v1" + BACKUP_SUFFIX);window.location.reload();}}}>{t("Reiniciar partida","Restart game")}</button><button type="button" onClick={()=>setShowOptions(false)}>{t("Cerrar","Close")}</button></div>}</div>
      <div className="world-language" aria-label="Idioma / Language"><button type="button" aria-pressed={language === "es"} onClick={() => {setLanguage("es");try{localStorage.setItem("azheryn-language","es")}catch{}}}>ES</button><button type="button" aria-pressed={language === "en"} onClick={() => {setLanguage("en");try{localStorage.setItem("azheryn-language","en")}catch{}}}>EN</button></div>
      {buildingMode && <div className="storehouse-view-control placement-rotation"><button type="button" onClick={()=>{storehouseTurnedRef.current=!storehouseTurnedRef.current;setStorehouseTurned(storehouseTurnedRef.current);}}>{t("↻ Girar almacén 90°","↻ Rotate storehouse 90°")} · {storehouseTurned ? "│" : "─"}</button></div>}
      {buildingProgress.complete && <div className="storehouse-view-control"><button type="button" aria-pressed={!roofVisible} onClick={()=>{roofVisibleRef.current=!roofVisibleRef.current;setRoofVisible(roofVisibleRef.current);}}>{roofVisible ? t("⌂ Ver interior · quitar techo","⌂ See inside · hide roof") : t("⌂ Mostrar techo","⌂ Show roof")}</button></div>}
      <header className="strategy-topbar" aria-label={t("Panel de estrategia","Strategy panel")}>
        <div className="strategy-brand"><strong>AZHERYN</strong><small>{t("Capítulo 1 · Fundación","Chapter 1 · Foundation")}</small></div>
        <div className="strategy-stat" title={t("Personajes humanos","Human characters")}><span aria-hidden="true">♟</span><div><strong>8</strong><small>{t("Personajes","Characters")}</small></div></div>
        <div className="strategy-stat" title="Mui"><span aria-hidden="true">♛</span><div><strong>Mui</strong><small>{t("Activo","Active")}</small></div></div>
        <button type="button" className="strategy-stat animal-locator" title={t("Buscar animales: pulsa para centrar la cámara en cada animal","Find animals: click to focus each animal")} onClick={()=>window.dispatchEvent(new Event("azheryn-find-animals"))}><span aria-hidden="true">♧</span><div><strong>{PEACEFUL_ANIMALS.length}</strong><small>{t("Animales ↗","Animals ↗")}</small></div></button>
        <div className="strategy-stat" title={t("Guardias","Guards")}><span aria-hidden="true">♟</span><div><strong>7</strong><small>{t("Guardias","Guards")}</small></div></div>
        <div className="strategy-stat" title={t("Troncos talados disponibles","Available felled logs")}><span aria-hidden="true">▰</span><div><strong>{logsCount.total}</strong><small>{t("Troncos","Logs")}</small></div></div>
        <div className="strategy-stat" title={t("Troncos en acopio","Stockpiled logs")}><span aria-hidden="true">▤</span><div><strong>{logsCount.outdoor}/{STOCKPILE_CAPACITY}</strong><small>{t("Capacidad de acopio","Stockpile capacity")}</small></div></div>
        <div className={`strategy-stat strategy-progress ${buildingProgress.complete ? "strategy-progress-complete" : buildingProgress.committed >= 66 ? "strategy-progress-roof" : "strategy-progress-walls"}`}><span aria-hidden="true">⌂</span><div><strong>{buildingProgress.committed}/{STOREHOUSE_G1.logsRequired}</strong><small>{t("Almacén","Storehouse")} · {Math.round(100 * Math.min(STOREHOUSE_G1.logsRequired, Math.max(0, buildingProgress.committed)) / STOREHOUSE_G1.logsRequired)}%</small><small className="strategy-progress-phase" aria-live="off">{buildingProgress.complete ? t("✓ Terminado", "✓ Complete") : !buildingProgress.placed ? t("Sin colocar", "Not placed") : buildingProgress.committed >= 66 ? t("Cubierta · 25 troncos", "Roof · 25 logs") : t("Paredes · 66 troncos", "Walls · 66 logs")}</small><small className="strategy-progress-detail" aria-live="off">{!buildingProgress.placed ? t("Primero marca la obra", "Place the construction site first") : buildingProgress.complete ? t("91 de 91 troncos instalados", "91 of 91 logs installed") : buildingProgress.committed >= 66 ? `${t("Cubierta", "Roof")}: ${Math.min(25, Math.max(0, buildingProgress.committed - 66))}/25 · ${t("Faltan", "Remaining")}: ${Math.max(0, 91 - buildingProgress.committed)}` : `${t("Paredes", "Walls")}: ${Math.min(66, Math.max(0, buildingProgress.committed))}/66 · ${t("Faltan", "Remaining")}: ${Math.max(0, 66 - buildingProgress.committed)}`}</small><progress max={STOREHOUSE_G1.logsRequired} value={buildingProgress.committed} aria-label={t("Progreso de construcción del almacén", "Storehouse construction progress")} aria-valuetext={`${buildingProgress.committed} / ${STOREHOUSE_G1.logsRequired} ${t("troncos", "logs")}`}/></div></div>
        <div className="strategy-online" role="status" aria-label={online?t("Con conexión","Online"):t("Sin conexión","Offline")} title={online?t("Con conexión","Online"):t("Sin conexión","Offline")}>{online?"●":"○"}</div>
      </header>
      {showPlan && <section className="world-plan" aria-label={t("Plano didáctico del almacén","Educational storehouse blueprint")}>
        <strong>{t("Almacén rústico · Plano G1/O1","Rustic storehouse · Blueprint G1/O1")}</strong>
        <p>{t("Largo: 5,00 m · Ancho frontal/trasero: 2,60 m · Altura de paredes: 2,70 m.","Length: 5.00 m · Front/rear width: 2.60 m · Wall height: 2.70 m.")}</p>
        <svg viewBox="0 0 340 335" role="img" aria-label={t("Planta: puerta en pared frontal corta de 2,60 m; ventana en pared trasera corta; ventanas en los dos laterales largos de 5 m","Plan: door in short 2.60 m front wall, rear window in short rear wall, windows in both 5 m side walls")}>
          <text x="170" y="17" fill="white" fontSize="13" textAnchor="middle">{t("PLANTA · VISTA DESDE ARRIBA","FLOOR PLAN · TOP VIEW")}</text>
          <rect x="102" y="48" width="136" height="235" fill="#a47c4e" fillOpacity=".22" stroke="#b99261" strokeWidth="8" />
          <rect x="147" y="40" width="46" height="17" fill="#24352a" />
          <rect x="146" y="275" width="48" height="17" fill="#24352a" />
          <rect x="94" y="137" width="17" height="51" fill="#24352a" />
          <rect x="230" y="137" width="17" height="51" fill="#24352a" />
          <text x="170" y="35" textAnchor="middle" fill="white" fontSize="11">{t("TRASERA · ventana","REAR · window")}</text>
          <text x="170" y="307" textAnchor="middle" fill="white" fontSize="11">{t("FRONTAL · puerta","FRONT · door")}</text>
          <text x="170" y="323" textAnchor="middle" fill="#f2d7a3" fontSize="11">2,60 m</text>
          <text x="170" y="165" textAnchor="middle" fill="white" fontSize="13">5,00 m</text>
          <text x="170" y="183" textAnchor="middle" fill="white" fontSize="11">× 2,60 m</text>
          <text x="83" y="168" textAnchor="middle" fill="white" fontSize="11" transform="rotate(-90 83 168)">{t("Lateral 5 m","Side 5 m")}</text>
          <text x="261" y="168" textAnchor="middle" fill="white" fontSize="11" transform="rotate(90 261 168)">{t("Lateral 5 m","Side 5 m")}</text>
        </svg>
        <svg viewBox="0 0 350 360" role="img" aria-label={t("Alzados con alturas y huecos del almacén","Elevations with storehouse heights and openings")}>
          <text x="175" y="16" fill="white" textAnchor="middle" fontSize="13">{t("ALZADOS · ALTURAS","ELEVATIONS · HEIGHTS")}</text>
          <text x="12" y="39" fill="white" fontSize="11">{t("FRONTAL · 2,60 m","FRONT · 2.60 m")}</text>
          <rect x="20" y="49" width="135" height="99" fill="#b99261" fillOpacity=".22" stroke="#b99261" strokeWidth="5" />
          <rect x="68" y="49" width="40" height="99" fill="#24352a" />
          <text x="88" y="92" fill="white" fontSize="10" textAnchor="middle">{t("PUERTA","DOOR")}</text>
          <text x="88" y="105" fill="white" fontSize="10" textAnchor="middle">2,70 m</text>
          <text x="20" y="163" fill="white" fontSize="10">2,60 m</text>
          <text x="167" y="39" fill="white" fontSize="11">{t("TRASERA · 2,60 m","REAR · 2.60 m")}</text>
          <rect x="184" y="49" width="135" height="99" fill="#b99261" fillOpacity=".22" stroke="#b99261" strokeWidth="5" />
          <rect x="225" y="65" width="53" height="62" fill="#24352a" stroke="#e3c28b" strokeWidth="2" />
          <text x="251" y="91" fill="white" fontSize="10" textAnchor="middle">1,00 m</text>
          <text x="251" y="105" fill="white" fontSize="10" textAnchor="middle">× 1,70 m</text>
          <text x="185" y="163" fill="white" fontSize="10">2,60 m</text>
          <text x="12" y="191" fill="white" fontSize="11">{t("LATERALES · 5,00 m (ambos)","SIDE WALLS · 5.00 m (both)")}</text>
          <rect x="20" y="204" width="298" height="105" fill="#b99261" fillOpacity=".22" stroke="#b99261" strokeWidth="5" />
          <rect x="136" y="225" width="60" height="58" fill="#24352a" stroke="#e3c28b" strokeWidth="2" />
          <text x="166" y="248" fill="white" fontSize="11" textAnchor="middle">1,00 m</text>
          <text x="166" y="263" fill="white" fontSize="11" textAnchor="middle">× 1,50 m</text>
          <text x="20" y="326" fill="white" fontSize="11">5,00 m</text>
          <text x="319" y="266" fill="white" fontSize="10" transform="rotate(-90 319 266)">2,70 m</text>
          <text x="175" y="349" fill="#f2d7a3" fontSize="10" textAnchor="middle">{t("Altura visible de paredes: 2,70 m","Visible wall height: 2.70 m")}</text>
        </svg>
        <p>{t("Puerta sin hoja en frontal corto (abertura de 2,70 m de altura); ventana trasera 1,00 × 1,70 m; ventanas laterales 1,00 × 1,50 m. Techo: 25 troncos de 3 m.","Door without leaf in short front wall (2.70 m high opening); rear window 1.00 × 1.70 m; side windows 1.00 × 1.50 m. Roof: 25 logs of 3 m.")}</p>
        <p>{t("Despiece: cubierta 25 + frontal 9 + trasera 10,5 + laterales 23 + 23 = 90,5 → 91 troncos. Producción sin límite.","Log allocation: roof 25 + front 9 + rear 10.5 + sides 23 + 23 = 90.5 → 91 logs. Unlimited production.")}</p>
        <small>{t("Esquema de medidas: representa la distribución, no calcula cargas ni resistencia estructural.","Conceptual educational blueprint; structural resistance not yet simulated.")}</small>
      </section>}
      <button type="button" className="azh-mission-trigger" onClick={()=>setShowGuide(v=>!v)} aria-label={t("Abrir guía de misión", "Open mission guide")} aria-expanded={showGuide} title={t("Guía de misión", "Mission guide")}>
        <span aria-hidden="true">✦</span><span className="azh-mission-trigger-icon" aria-hidden="true">▤</span>
      </button>
      {showGuide && <div className="azh-mission-backdrop" onClick={()=>setShowGuide(false)}>
      <section className="g3-guide azh-mission-dialog" role="dialog" aria-modal="true" aria-label={t("Guía de misión · Capítulo 1","Mission guide · Chapter 1")} onClick={e=>e.stopPropagation()}>
        <p className="g3-mission-objective" role="status">{buildingProgress.complete ? t("Objetivo completado: almacén terminado (91/91).", "Goal complete: storehouse finished (91/91).") : !logsCount.stockpilePlaced ? t("Objetivo: coloca un acopio para los troncos.", "Goal: place a log stockpile.") : !campfirePlaced ? t("Objetivo: coloca la fogata.", "Goal: place the campfire.") : !buildingProgress.placed ? t("Objetivo: elige dónde construir el almacén.", "Goal: choose the storehouse location.") : t(`Objetivo: construir el almacén · ${buildingProgress.committed}/91 troncos.`, `Goal: build the storehouse · ${buildingProgress.committed}/91 logs.`)}</p>
        <div className="g3-guide-title"><strong>✦ {t("Diario de la misión · Capítulo 1","Mission journal · Chapter 1")}</strong><button type="button" onClick={()=>setShowGuide(false)} aria-label={t("Cerrar guía","Close guide")}>✕</button></div>
        <>
          <div className="g3-guide-steps">
            <span className={logsCount.stockpilePlaced?"done":""}>{t("1 · Acopio","1 · Stockpile")}</span>
            <span className={campfirePlaced?"done":""}>{t("2 · Fogata","2 · Campfire")}</span>
            <span className={buildingProgress.complete?"done":""}>{t("3 · Almacén","3 · Storehouse")}</span>
          </div>
          <div className="g3-operations" role="status" aria-live="off"><span>{t("Taladores","Loggers")}: <b>{logsCount.loggers}/7</b></span><span>{t("Constructores cerca","Builders nearby")}: <b>{logsCount.builders}</b></span><span>{t("Troncos por recoger","Logs awaiting pickup")}: <b>{materials.awaitingPickup}</b></span><span>{t("En tránsito","In transit")}: <b>{materials.inTransit}</b></span><span>{t("En acopio","Stockpiled")}: <b>{logsCount.outdoor}/{STOCKPILE_CAPACITY}</b></span><span>{t("Transportistas","Haulers")}: <b>{logsCount.collecting}/2</b></span><span>{t("Transporte","Hauling")}: <b>{logsCount.hauling?t("En curso","Active"):logsCount.waiting&&!logsCount.stockpilePlaced?t("Falta acopio","Place stockpile"):logsCount.waiting?t("Buscando pareja","Finding pair"):t("Sin pendientes","No pending logs")}</b></span></div>
          {buildingProgress.placed&&<div className="g3-progress" role="progressbar" aria-label={t("Progreso del almacén","Storehouse progress")} aria-valuemin={0} aria-valuemax={91} aria-valuenow={Math.min(91,buildingProgress.committed)}><div style={{width:`${Math.min(100,Math.max(0,buildingProgress.committed/91*100))}%`}} /></div>}
          <div className="g3-operations" role="status" aria-live="polite" aria-label={t("Planificador de materiales","Materials planner")}>
            <span>{t("Troncos que faltan","Logs remaining")}: <b>{materials.remaining}</b></span>
            <span>{t("Disponibles en acopio","Available in stockpile")}: <b>{logsCount.outdoor}/{STOCKPILE_CAPACITY}</b></span>
            <span>{t("Suministro por conseguir","Supply still needed")}: <b>{materials.toGather}</b></span>
          </div>
          {buildingProgress.placed && <div className="g3-operations" role="status" aria-live="off" aria-label={t("Etapas del suministro","Supply milestones")}>
            <span>{t("Construido","Built")}: <b>{milestones.builtPct}%</b></span>
            <span>{t("Listo para construir","Ready to build")}: <b>{milestones.readyPct}%</b></span>
            <span>{t("Madera asegurada","Timber secured")}: <b>{milestones.securedPct}%</b></span>
            <span>{t("Acciones pendientes","Pending actions")}: <b>{[milestones.needsLogging&&t("Talar","Log"),milestones.needsHauling&&t("Transportar","Haul"),milestones.needsBuilding&&t("Construir","Build")].filter(Boolean).join(" · ")||t("Ninguna","None")}</b></span>
          </div>}
          {!buildingProgress.complete && buildingProgress.placed && materials.remaining > 0 && <div className="g3-operations" role="status" aria-live="off" aria-label={t("Estado de suministros","Supply status")}>
            <span>{t("Cubierto por madera disponible","Covered by available timber")}: <b>{Math.min(materials.remaining, materials.available + materials.awaitingPickup + materials.inTransit)}/{materials.remaining}</b></span>
            <span>{t("En espera de transporte","Waiting for transport")}: <b>{materials.awaitingPickup}</b></span>
            {materials.toGather === 0 && <span>{t("Hay madera suficiente talada o acopiada para terminar la obra.","Enough timber is felled or stockpiled to finish the building.")}</span>}
            {materials.toGather > 0 && <span>{t("Faltan árboles por talar para completar el objetivo.","More trees must be felled to reach the target.")}</span>}
          </div>}
          {!buildingProgress.complete && <p className="g3-next-action" role="status">{!logsCount.stockpilePlaced
            ? t("Siguiente paso: coloca un acopio para que los guardias puedan transportar madera.","Next: place a stockpile so guards can carry logs.")
            : !buildingProgress.placed
              ? t("Siguiente paso: coloca el almacén donde quieres construirlo.","Next: choose the storehouse construction site.")
              : logsCount.outdoor > 0 && logsCount.builders === 0
                ? t("Hay madera almacenada. Acerca guardias libres a la obra para construir.","Logs are stockpiled. Move available guards near the site to build.")
                : logsCount.waiting > 0 && !logsCount.hauling
                  ? t("Hay troncos en el bosque esperando transporte. Deja dos guardias disponibles.","Logs await pickup in the forest. Keep two guards available.")
                  : logsCount.outdoor === 0 && logsCount.waiting === 0 && !logsCount.hauling
                    ? t("Necesitas más madera: selecciona guardias y ordena talar una zona.","More wood needed: select guards and order a logging zone.")
                    : t("La operación está en marcha. Vigila el acopio y la construcción.","Operations are underway. Watch the stockpile and construction.")}</p>}
          <p>{buildingProgress.complete?t("¡Almacén terminado!","Storehouse complete!"):!buildingProgress.placed?t("Marca el acopio, coloca la fogata y luego el almacén. Selecciona guardias para ordenar la tala.","Place the stockpile, campfire and then storehouse. Select guards to order logging."):t("Selecciona guardias y ordena talar árboles. Dos transportan cada tronco al acopio.","Select guards and order logging. Two carry each log to the stockpile.")}</p>
          <div className="g3-guide-actions">
            <button type="button" onClick={()=>{window.dispatchEvent(new CustomEvent("azheryn-squad-action",{detail:{action:"guards"}}));}}>{t("Seleccionar 7 guardias","Select 7 guards")}</button>



            <button type="button" disabled={selection.count===0} onClick={()=>{buildingModeRef.current=false;setBuildingMode(false);stockpileModeRef.current=false;setStockpileMode(false);orderModeRef.current="logging";setOrderMode("logging");setWorkNotice("Haz clic en un árbol para talarlo o en el terreno del bosque para talar una zona");}}>{t("Ordenar tala","Order logging")}</button>
            {(buildingMode||stockpileMode||orderMode!=="none")&&<button type="button" onClick={()=>{buildingModeRef.current=false;setBuildingMode(false);stockpileModeRef.current=false;setStockpileMode(false);orderModeRef.current="none";setOrderMode("none");setWorkNotice(null);}}>{t("Cancelar orden","Cancel command")}</button>}
          </div>
        </>
      </section></div>}
      <button type="button" className="azh-squad-toggle" aria-expanded={showSquad} onClick={()=>setShowSquad(v=>!v)}>{t("♟ Personajes","♟ Characters")}</button>
      {showSquad && <aside className="strategy-squad" aria-label={t("Control de personajes","Character control")}>
        <strong>{t("Personajes","Characters")} · {selection.count}/8</strong>
        <small>{t("Atajos: 1 Mui · 2 guardias · 3 todos · 0 ninguno · M mover · T talar · H centrar Mui · +/- zoom · Espacio pausa · Esc cancelar", "Shortcuts: 1 Mui · 2 guards · 3 all · 0 clear · M move · T log · H center Mui · +/- zoom · Space pause · Esc cancel")}</small>
        <span>{selection.mui ? "Mui · " : ""}{selection.guards} {t("guardias seleccionados","guards selected")}</span>
        <div className="founding-portraits" aria-label={t("Retratos de Mui y los siete guardias", "Portraits of Mui and the seven guards")}>
          {Array.from({length:8},(_,i)=><figure key={i} className="founding-portrait" onClick={()=>window.dispatchEvent(new CustomEvent("azheryn-squad-individual",{detail:{id:i===0?"mui":`guard-${i}`}}))} style={{cursor:"pointer",outline:squadChosen===(i===0?"mui":`guard-${i}`)?"2px solid #f2d7a3":undefined}} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();window.dispatchEvent(new CustomEvent("azheryn-squad-individual",{detail:{id:i===0?"mui":`guard-${i}`}}));}}}>
            <img src={i===0?"/characters/mui.webp":`/characters/guard-${i}.webp`} alt={i===0?"Mui":t(`Guardia ${i}`,`Guard ${i}`)} loading="lazy" />
            <figcaption>{i===0?"Mui":`${i}`}</figcaption>
          </figure>)}
        </div>
        <div className="strategy-squad-actions">
          <button type="button" onClick={()=>window.dispatchEvent(new CustomEvent("azheryn-squad-action",{detail:{action:"mui"}}))}>Mui</button>
          <button type="button" onClick={()=>window.dispatchEvent(new CustomEvent("azheryn-squad-action",{detail:{action:"guards"}}))}>{t("Guardias","Guards")}</button>
          <button type="button" onClick={()=>window.dispatchEvent(new CustomEvent("azheryn-squad-action",{detail:{action:"all"}}))}>{t("Todos","All")}</button>
          <button type="button" onClick={()=>window.dispatchEvent(new CustomEvent("azheryn-squad-action",{detail:{action:"clear"}}))}>{t("Ninguno","None")}</button>
        </div>
        {companionPrompt && <p role="status">{t("Este tronco necesita dos personas. Selecciona ahora otro retrato: Mui o un guardia.","This log needs two people. Select another portrait: Mui or a guard.")}</p>}
        {selection.count>0 && <div className="strategy-squad-actions">
          <button type="button" aria-pressed={orderMode==="move"} onClick={()=>{orderModeRef.current="move";setOrderMode("move");setWorkNotice(t("Haz clic en el terreno para mover el grupo","Click terrain to move the squad"));}}>{t("Mover","Move")}</button>
          <button type="button" onClick={()=>window.dispatchEvent(new CustomEvent("azheryn-squad-haul",{detail:{id:squadChosen??undefined}}))}>{t("Recolectar troncos","Collect logs")}</button>
          <button type="button" aria-pressed={orderMode==="logging"} onClick={()=>{orderModeRef.current="logging";setOrderMode("logging");setWorkNotice(t("Haz clic en un árbol para talarlo o en el terreno del bosque para talar una zona","Click a tree to fell only that tree, or forest ground to log a zone"));}}>{t("Talar","Log")}</button>
        </div>}
        <button type="button" className="azh-characters-close" onClick={()=>setShowSquad(false)}>{t("Cerrar personajes ✕", "Close characters ✕")}</button>
      </aside>}
      <div className="strategy-bottom" aria-label={t("Órdenes del juego","Game commands")}>
        <button type="button" className={showConstruction?"strategy-main active":"strategy-main"} aria-expanded={showConstruction} onClick={()=>setShowConstruction(v=>!v)}>{t("⚒ Construcción","⚒ Construction")}</button>
        {loggingTarget && <button type="button" className="strategy-main" onClick={() => {
          const p=loggingTargetRef.current; if(!p) return;
          window.dispatchEvent(new CustomEvent("azheryn-log-order",{detail:p}));
          loggingTargetRef.current=null;setLoggingTarget(null);
        }}>{t("♧ Talar árbol","♧ Fell tree")}</button>}
        <button type="button" className="strategy-main" onClick={()=>setShowPlan(v=>!v)}>{showPlan?t("Cerrar plano","Close blueprint"):t("▧ Ver plano","▧ Blueprint")}</button>
        {showConstruction && <div className="strategy-build-menu">
          <strong>{t("Construye tu asentamiento · Acopio → Fogata → Almacén","Build your settlement · Stockpile → Campfire → Storehouse")}</strong>
          <button type="button" onClick={()=>{buildingModeRef.current=false;setBuildingMode(false);stockpileModeRef.current=true;setStockpileMode(true);setShowConstruction(false);setWorkNotice(t("Haz clic en el terreno para marcar el acopio","Click terrain to mark the stockpile"));}}>{t("▤ Zona de acopio de troncos","▤ Log stockpile area")}<small>{t("Elige dónde reunir los troncos","Choose where to gather logs")}</small></button>
          <button type="button" disabled={!logsCount.stockpilePlaced || campfirePlaced} onClick={()=>{buildingModeRef.current=false;setBuildingMode(false);stockpileModeRef.current=false;setStockpileMode(false);orderModeRef.current="none";setOrderMode("none");campfireModeRef.current=true;setCampfireMode(true);setShowConstruction(false);setWorkNotice(t("Elige dónde hacer la fogata","Choose a campfire location"));}}>{t("♨ Fogata","♨ Campfire")}<small>{t("Segundo paso: coloca la fogata","Second step: place the campfire")}</small></button>
          <button type="button" disabled={buildingProgress.placed || !logsCount.stockpilePlaced || !campfirePlaced} onClick={()=>{stockpileModeRef.current=false;setStockpileMode(false);buildingModeRef.current=true;setBuildingMode(true);setShowConstruction(false);setWorkNotice(t("Selecciona dónde construir el almacén","Choose where to build the storehouse"));}}>{t("⌂ Almacén rústico · 91 troncos","⌂ Rustic storehouse · 91 logs")}<small>{t("Tercer paso: construye el almacén","Third step: build the storehouse")}</small></button>
          <p>{t("Almacén instalado:","Storehouse installed:")} {buildingProgress.committed}/91 · {t("En acopio:","Stockpiled:")} {logsCount.outdoor}</p>
        </div>}
      </div>
      {(buildingMode || stockpileMode || campfireMode || workNotice || buildingProgress.placed) && <div className="strategy-notice" role="status">{buildingMode?t("Haz clic en el terreno para colocar el almacén","Click terrain to place the storehouse"):campfireMode?t("Elige dónde hacer la fogata","Choose a campfire location"):stockpileMode?t("Haz clic en el terreno para marcar el acopio","Click terrain to mark the stockpile"):(workNotice ? localizedNotice(workNotice) : null) ?? (buildingProgress.complete?t("Capítulo 1 completado","Chapter 1 completed"):`${buildingProgress.committed}/91`)}</div>}
      <div className="world-compass world-compass-map" role="img" aria-label={t("Minimapa del terreno real: norte, sur, este, oeste; personajes y construcciones", "Real terrain minimap: north, south, east, west; characters and buildings")}><canvas ref={minimapRef} width={160} height={160} aria-hidden="true" /><span className="north">N</span><span className="west">{t("O","W")}</span><span className="east">E</span><span className="south">S</span></div>
      {climate && <div className="world-climate" aria-label={t("Tiempo y clima","Time and weather")}>
        <span>{t("Día","Day")} {climate.day} · {String(climate.hour).padStart(2,"0")}:{String(climate.minute).padStart(2,"0")} · {language === "es" ? ({clear:"Despejado",cloudy:"Nublado",rain:"Lluvia",storm:"Tormenta",fog:"Niebla"} as Record<string,string>)[String(climate.weather).toLowerCase()] ?? weatherLabel(climate.weather, "es") : weatherLabel(climate.weather, "en")}</span>
        <span className="world-speed" role="group" aria-label={t("Velocidad del tiempo","Time speed")}>{([0,1,2,4] as const).map(s => <button key={s} type="button" aria-pressed={timeSpeed===s} aria-label={s===0?t("Pausar simulación","Pause simulation"):t(`Velocidad ${s}`,`Speed ${s}`)} className={timeSpeed===s ? "active" : ""} onClick={() => { if (s !== 0) lastRunningSpeedRef.current = s; timeSpeedRef.current = s; setTimeSpeed(s); }}>{s===0 ? t("Pausa","Pause") : `×${s}`}</button>)}</span>
      </div>}

    </div>
  );
}
