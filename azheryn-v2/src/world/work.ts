export type WorkOrder = { kind: "logging"; x: number; y: number };

export type WorkerTaskState = {
  order: WorkOrder | null;
  progress: number;
};

export type LogState = {
  id: string;
  x: number;
  y: number;
  nefite: number;
  processed: false;
  transportersRequired: number;
  stockpiled: boolean;
  usedForStorehouse?: boolean;
};

export function createLoggingOrder(x: number, y: number): WorkOrder {
  return { kind: "logging", x, y };
}

export function advanceLogging(progress: number, seconds: number, secondsPerTree = 2.2) {
  const next = progress + Math.max(0, seconds);
  return {
    progress: next >= secondsPerTree ? 0 : next,
    completedTree: next >= secondsPerTree,
  };
}

export function createFelledLog(id: string, x: number, y: number): LogState {
  return { id, x, y, nefite: 1, processed: false, transportersRequired: 2, stockpiled: false };
}


export type WorkTrait = "steady" | "orderly" | "helpful" | "reluctant";

export type OutdoorStockpile = {
  x: number;
  y: number;
  radius: number;
};

export function createOutdoorStockpile(x: number, y: number, radius = 28): OutdoorStockpile {
  return { x, y, radius };
}

export function shouldVolunteerForLogHaul(trait: WorkTrait, nearbyLogs: number): boolean {
  if (nearbyLogs <= 0) return false;
  if (trait === "orderly" || trait === "helpful") return true;
  if (trait === "steady") return nearbyLogs >= 4;
  return false;
}


export type FoundingWorkProfile = {
  characterId: string;
  primary: WorkTrait;
  secondary: WorkTrait;
  fatigue: number;
  fatigueLimit: number;
  recoveryRate: number;
};

export const G1_FOUNDING_WORK_PROFILES: FoundingWorkProfile[] = [
  { characterId: "guard-1", primary: "steady", secondary: "helpful", fatigue: 0, fatigueLimit: 2100, recoveryRate: 4.0 },
  { characterId: "guard-2", primary: "orderly", secondary: "steady", fatigue: 0, fatigueLimit: 2000, recoveryRate: 4.2 },
  { characterId: "guard-3", primary: "helpful", secondary: "steady", fatigue: 0, fatigueLimit: 2250, recoveryRate: 3.9 },
  { characterId: "guard-4", primary: "reluctant", secondary: "helpful", fatigue: 0, fatigueLimit: 1900, recoveryRate: 4.3 },
  { characterId: "guard-5", primary: "steady", secondary: "orderly", fatigue: 0, fatigueLimit: 2350, recoveryRate: 3.8 },
  { characterId: "guard-6", primary: "helpful", secondary: "orderly", fatigue: 0, fatigueLimit: 2150, recoveryRate: 4.1 },
  { characterId: "guard-7", primary: "orderly", secondary: "reluctant", fatigue: 0, fatigueLimit: 2050, recoveryRate: 4.4 },
];

export function advanceFatigue(profile: FoundingWorkProfile, workingSeconds: number) {
  const fatigue = Math.min(profile.fatigueLimit, profile.fatigue + Math.max(0, workingSeconds));
  return { ...profile, fatigue, needsRest: fatigue >= profile.fatigueLimit };
}

export const MUI_G1_AUTONOMY = {
  enabled: true,
  directPlayerOrderPriority: true,
  basicNeedInterruptions: ["fatigue"] as const,
};


export function fatiguePerformance(profile: FoundingWorkProfile) {
  const ratio = profile.fatigue / profile.fatigueLimit;
  if (ratio >= 1) return 0;
  if (ratio >= 0.85) return 0.45;
  if (ratio >= 0.65) return 0.7;
  return 1;
}

export function recoverFatigue(profile: FoundingWorkProfile, restingSeconds: number) {
  return { ...profile, fatigue: Math.max(0, profile.fatigue - Math.max(0, restingSeconds) * profile.recoveryRate) };
}

export function g1FatigueDecision(profile: FoundingWorkProfile) {
  const performance = fatiguePerformance(profile);
  if (performance === 0) return profile.primary === "reluctant" ? "leave_task_temporarily" : "rest";
  if (performance <= 0.45 && profile.primary === "reluctant") return "leave_task_temporarily";
  return "continue";
}


export type RememberedTask = {
  kind: "logging" | "hauling";
  x: number;
  y: number;
} | null;

export type G1SocialWorkState = {
  rememberedTask: RememberedTask;
  spontaneousHelpCooldown: number;
  lastSocialReaction: "none" | "ask_help" | "ignore";
};

export function rememberTaskForRest(kind: "logging" | "hauling", x: number, y: number): RememberedTask {
  return { kind, x, y };
}

export function shouldOfferSpontaneousHelp(profile: FoundingWorkProfile, heavyLogNeedsHelp: boolean, cooldownReady: boolean) {
  return heavyLogNeedsHelp && cooldownReady && (profile.primary === "helpful" || profile.secondary === "helpful");
}

export function g1ReactionToLowInitiative(profile: FoundingWorkProfile): "ask_help" | "ignore" {
  return profile.primary === "orderly" || profile.primary === "steady" ? "ask_help" : "ignore";
}


export function readyToResumeRememberedTask(profile: FoundingWorkProfile) {
  return fatiguePerformance(profile) >= 1;
}

export function canOfferNearbyHelp(profile: FoundingWorkProfile, distance: number, ownTaskUrgent: boolean, needsRest: boolean) {
  if (ownTaskUrgent || needsRest || distance > 36) return false;
  return profile.primary === "helpful" || profile.secondary === "helpful";
}

export function directOrderWorkModifier(profile: FoundingWorkProfile) {
  return {
    obeysDirectOrder: true,
    performance: fatiguePerformance(profile),
    mayPause: profile.primary === "reluctant",
    prefersOrder: profile.primary === "orderly" || profile.secondary === "orderly",
    mayOfferHelp: profile.primary === "helpful" || profile.secondary === "helpful",
  };
}


export type G1WorkTree = { id:string; x:number; y:number; standing:boolean; reservedBy:string|null; speciesId?:string };

export function reserveNearestWorkTree(trees:G1WorkTree[], workerId:string, x:number, y:number) {
  const available=trees.filter(t=>t.standing&&!t.reservedBy);
  let best:G1WorkTree|null=null, distance=Infinity;
  for(const tree of available){const d=Math.hypot(tree.x-x,tree.y-y);if(d<distance){best=tree;distance=d;}}
  if(best) best.reservedBy=workerId;
  return best;
}

export function fellReservedWorkTree(tree:G1WorkTree, workerId:string) {
  if(!tree.standing || tree.reservedBy!==workerId) return false;
  tree.standing=false; tree.reservedBy=null; return true;
}


export const G1_LOGGING_ZONE_RADIUS = 90;

export function reserveNearestTreeInZone(trees:G1WorkTree[], workerId:string, zoneX:number, zoneY:number) {
  const candidates=trees.filter(t=>t.standing&&!t.reservedBy&&Math.hypot(t.x-zoneX,t.y-zoneY)<=G1_LOGGING_ZONE_RADIUS);
  let best:G1WorkTree|null=null, distance=Infinity;
  for(const tree of candidates){const d=Math.hypot(tree.x-zoneX,tree.y-zoneY);if(d<distance){best=tree;distance=d;}}
  if(best) best.reservedBy=workerId;
  return best;
}

/** Resume an interrupted logging order without silently switching to a different tree. */
export function reserveRememberedLoggingTree(trees:G1WorkTree[], workerId:string, order:WorkOrder, zone?:{x:number;y:number}) {
  if (zone) return reserveNearestTreeInZone(trees,workerId,zone.x,zone.y);
  const exact=trees.find(t=>t.standing&&!t.reservedBy&&Math.hypot(t.x-order.x,t.y-order.y)<0.01);
  if(exact) exact.reservedBy=workerId;
  return exact ?? null;
}

export function loggingZoneExhausted(trees:G1WorkTree[], zoneX:number, zoneY:number) {
  return !trees.some(t=>t.standing&&Math.hypot(t.x-zoneX,t.y-zoneY)<=G1_LOGGING_ZONE_RADIUS);
}


export type G1HaulState = {
  logId: string;
  workerIds: [string, string];
  destinationX: number;
  destinationY: number;
  active: boolean;
  phase: "collecting" | "delivering";
  slotX?: number;
  slotY?: number;
};

export function nearestUnstockpiledLog(logs: LogState[], x: number, y: number) {
  let best: LogState | null = null;
  let distance = Infinity;
  for (const log of logs) {
    if (log.stockpiled) continue;
    const d = Math.hypot(log.x - x, log.y - y);
    if (d < distance) { best = log; distance = d; }
  }
  return best;
}

export const STOCKPILE_LAYER_COUNTS = [20,19,18,17,16,15,14,13] as const;
export const STOCKPILE_PER_STACK = 132;
export const STOCKPILE_CAPACITY = 264;
export function stockpileSlot(stockpile: OutdoorStockpile, index: number) {
  const i = Math.max(0, Math.min(STOCKPILE_CAPACITY-1, Math.floor(index)));
  const stack = Math.floor(i / STOCKPILE_PER_STACK);
  let within = i % STOCKPILE_PER_STACK;
  let level = 0;
  for (; level < STOCKPILE_LAYER_COUNTS.length - 1; level++) {
    if (within < STOCKPILE_LAYER_COUNTS[level]) break;
    within -= STOCKPILE_LAYER_COUNTS[level];
  }
  const count = STOCKPILE_LAYER_COUNTS[level];
  // Two triangular stacks; each tier is narrower and raised by 0.2m.
  const spacing = stockpile.radius * 0.043;
  return {
    x: stockpile.x + (stack === 0 ? -1 : 1) * stockpile.radius * 0.37 + (within - (count-1)/2)*spacing,
    y: stockpile.y + stockpile.radius*0.12 - level*stockpile.radius*0.043,
    level, stack, height: (level+1)*0.2,
  };
}

export function g1CanJoinHaul(workerX: number, workerY: number, logX: number, logY: number, fatigue: FoundingWorkProfile | undefined) {
  return !fatigue || (fatiguePerformance(fatigue) > 0.45 && g1FatigueDecision(fatigue) === "continue"); // Exclude workers about to abandon a haul; distance alone must not block distant logs.
}


export function g1HaulPriority(profile: FoundingWorkProfile | undefined) {
  if (!profile) return 0;
  if (profile.primary === "helpful" || profile.primary === "orderly") return 3;
  if (profile.secondary === "helpful" || profile.secondary === "orderly") return 2;
  if (profile.primary === "steady") return 1;
  return 0;
}

export function chooseG1Haulers(
  availableCharacterIds: string[],
  profiles: FoundingWorkProfile[],
  required = 2,
) {
  if (!Number.isInteger(required) || required < 1) return [];
  const uniqueIds = [...new Set(availableCharacterIds)];
  if (uniqueIds.length < required) return [];
  return uniqueIds
    .sort((a, b) => {
      const pa = profiles.find(p => p.characterId === a);
      const pb = profiles.find(p => p.characterId === b);
      return g1HaulPriority(pb) - g1HaulPriority(pa);
    })
    .slice(0, required);
}


export type G1WorkOpportunity = "logging" | "hauling" | "helping";

export function g1SpontaneousWorkPriority(
  profile: FoundingWorkProfile,
  opportunity: G1WorkOpportunity,
  directOrder = false,
) {
  if (directOrder) return 100;
  if (profile.primary === "reluctant") return opportunity === "helping" ? 0 : 1;
  if (opportunity === "hauling" && (profile.primary === "orderly" || profile.secondary === "orderly")) return 4;
  if (opportunity === "helping" && (profile.primary === "helpful" || profile.secondary === "helpful")) return 4;
  if (opportunity === "logging" && profile.primary === "steady") return 3;
  return 2;
}

export function chooseG1SpontaneousHelper(
  availableCharacterIds: string[],
  profiles: FoundingWorkProfile[],
) {
  return [...availableCharacterIds]
    .map(id => ({ id, profile: profiles.find(p => p.characterId === id) }))
    .filter((v): v is { id: string; profile: FoundingWorkProfile } => !!v.profile)
    .filter(v => g1SpontaneousWorkPriority(v.profile, "helping") > 0)
    .sort((a,b) => g1SpontaneousWorkPriority(b.profile, "helping") - g1SpontaneousWorkPriority(a.profile, "helping"))[0]?.id ?? null;
}


export type G1AutonomyNeed = {
  opportunity: G1WorkOpportunity;
  urgency: number;
};

export function chooseG1AutonomousOpportunity(
  profile: FoundingWorkProfile | undefined,
  needs: G1AutonomyNeed[],
  directOrder = false,
) {
  if (directOrder || !profile || needs.length === 0) return null;
  return [...needs]
    .map(need => ({
      ...need,
      score: need.urgency + g1SpontaneousWorkPriority(profile, need.opportunity),
    }))
    .sort((a,b) => b.score-a.score)[0] ?? null;
}

export function g1ContinuityAllowsReassignment(activeWorkers: number, minimumContinuityWorkers = 2) {
  return activeWorkers > minimumContinuityWorkers;
}

export const MUI_G1_WORK_PROFILE: FoundingWorkProfile = {
  characterId: "mui",
  primary: "steady",
  secondary: "steady",
  fatigue: 0,
  fatigueLimit: 940,
  recoveryRate: 4.0,
};

export function g1ProfileForCharacter(characterId: string) {
  if (characterId === "mui") return MUI_G1_WORK_PROFILE;
  return G1_FOUNDING_WORK_PROFILES.find(p => p.characterId === characterId);
}


export const G1_LOCAL_WORK_PERCEPTION_RADIUS = 72;
export const G1_MIN_DECISION_HOLD_SECONDS = 8;

export function g1CanPerceiveWork(fromX:number, fromY:number, workX:number, workY:number) {
  return Math.hypot(workX-fromX, workY-fromY) <= G1_LOCAL_WORK_PERCEPTION_RADIUS;
}

export type G1PriorityContext = {
  basicNeedInterrupt: boolean;
  hasDirectOrder: boolean;
  hasActiveTask: boolean;
  spontaneousHelpAvailable: boolean;
};

export function g1WorkPriority(context:G1PriorityContext) {
  if (context.basicNeedInterrupt) return "basic_need";
  if (context.hasDirectOrder) return "direct_order";
  if (context.hasActiveTask) return "active_task";
  if (context.spontaneousHelpAvailable) return "spontaneous_help";
  return "idle";
}

export function g1MayReconsiderDecision(secondsSinceDecision:number, currentTaskStillValid:boolean) {
  if (!currentTaskStillValid) return true;
  return secondsSinceDecision >= G1_MIN_DECISION_HOLD_SECONDS;
}


export const G1_NPC_COMMUNICATION_RADIUS = 24;

export type G1WorkKnowledge = {
  id: string;
  kind: G1WorkOpportunity;
  x: number;
  y: number;
  observedAt: number;
  sourceCharacterId: string;
};

export function g1CanCommunicate(ax:number, ay:number, bx:number, by:number) {
  return Math.hypot(bx-ax, by-ay) <= G1_NPC_COMMUNICATION_RADIUS;
}

export function g1ShareWorkKnowledge(
  knowledge:G1WorkKnowledge,
  speakerId:string,
  speakerX:number,
  speakerY:number,
  listenerX:number,
  listenerY:number,
): G1WorkKnowledge | null {
  if (!g1CanCommunicate(speakerX,speakerY,listenerX,listenerY)) return null;
  return { ...knowledge, sourceCharacterId: speakerId };
}

export function g1KnowledgeIsCurrent(
  knowledge:G1WorkKnowledge,
  now:number,
  maxAgeSeconds=45,
) {
  return now >= knowledge.observedAt && now-knowledge.observedAt <= maxAgeSeconds;
}

// META 3 G1/O1: bounded deterministic bookkeeping. Physical resource and danger
// interactions remain gated until the world exposes verified entities.
export type SurvivalState = { hunger: number; thirst: number; danger: number };
export type SurvivalDecision = "escape" | "seek_water" | "seek_food" | "rest" | "work";
const boundedNeed = (value: number): number => Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
export function advanceSurvival(state: SurvivalState, seconds: number): SurvivalState {
  const dt = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  return { hunger: boundedNeed(boundedNeed(state.hunger) + dt / 240), thirst: boundedNeed(boundedNeed(state.thirst) + dt / 150), danger: boundedNeed(state.danger) };
}
export function survivalDecision(state: SurvivalState, fatigueRatio = 0): SurvivalDecision {
  if (boundedNeed(state.danger) >= 50) return "escape";
  if (boundedNeed(state.thirst) >= 75) return "seek_water";
  if (boundedNeed(state.hunger) >= 75) return "seek_food";
  if (Number.isFinite(fatigueRatio) && fatigueRatio >= 1) return "rest";
  return "work";
}
export function communicateDanger(danger: number, distance: number, radius = G1_NPC_COMMUNICATION_RADIUS): number {
  return Number.isFinite(distance) && Number.isFinite(radius) && radius >= 0 && distance >= 0 && distance <= radius ? boundedNeed(danger) : 0;
}
export function cooperativeHaulReady(availableWorkers: string[], required = 2): boolean {
  return Number.isInteger(required) && required > 0 && new Set(availableWorkers).size >= required;
}
