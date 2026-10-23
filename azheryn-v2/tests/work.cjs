"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.G1_NPC_COMMUNICATION_RADIUS = exports.G1_MIN_DECISION_HOLD_SECONDS = exports.G1_LOCAL_WORK_PERCEPTION_RADIUS = exports.MUI_G1_WORK_PROFILE = exports.G1_LOGGING_ZONE_RADIUS = exports.MUI_G1_AUTONOMY = exports.G1_FOUNDING_WORK_PROFILES = void 0;
exports.createLoggingOrder = createLoggingOrder;
exports.advanceLogging = advanceLogging;
exports.createFelledLog = createFelledLog;
exports.createOutdoorStockpile = createOutdoorStockpile;
exports.shouldVolunteerForLogHaul = shouldVolunteerForLogHaul;
exports.advanceFatigue = advanceFatigue;
exports.fatiguePerformance = fatiguePerformance;
exports.recoverFatigue = recoverFatigue;
exports.g1FatigueDecision = g1FatigueDecision;
exports.rememberTaskForRest = rememberTaskForRest;
exports.shouldOfferSpontaneousHelp = shouldOfferSpontaneousHelp;
exports.g1ReactionToLowInitiative = g1ReactionToLowInitiative;
exports.readyToResumeRememberedTask = readyToResumeRememberedTask;
exports.canOfferNearbyHelp = canOfferNearbyHelp;
exports.directOrderWorkModifier = directOrderWorkModifier;
exports.reserveNearestWorkTree = reserveNearestWorkTree;
exports.fellReservedWorkTree = fellReservedWorkTree;
exports.reserveNearestTreeInZone = reserveNearestTreeInZone;
exports.loggingZoneExhausted = loggingZoneExhausted;
exports.nearestUnstockpiledLog = nearestUnstockpiledLog;
exports.stockpileSlot = stockpileSlot;
exports.g1CanJoinHaul = g1CanJoinHaul;
exports.g1HaulPriority = g1HaulPriority;
exports.chooseG1Haulers = chooseG1Haulers;
exports.g1SpontaneousWorkPriority = g1SpontaneousWorkPriority;
exports.chooseG1SpontaneousHelper = chooseG1SpontaneousHelper;
exports.chooseG1AutonomousOpportunity = chooseG1AutonomousOpportunity;
exports.g1ContinuityAllowsReassignment = g1ContinuityAllowsReassignment;
exports.g1ProfileForCharacter = g1ProfileForCharacter;
exports.g1CanPerceiveWork = g1CanPerceiveWork;
exports.g1WorkPriority = g1WorkPriority;
exports.g1MayReconsiderDecision = g1MayReconsiderDecision;
exports.g1CanCommunicate = g1CanCommunicate;
exports.g1ShareWorkKnowledge = g1ShareWorkKnowledge;
exports.g1KnowledgeIsCurrent = g1KnowledgeIsCurrent;
function createLoggingOrder(x, y) {
    return { kind: "logging", x, y };
}
function advanceLogging(progress, seconds, secondsPerTree = 2.2) {
    const next = progress + Math.max(0, seconds);
    return {
        progress: next >= secondsPerTree ? 0 : next,
        completedTree: next >= secondsPerTree,
    };
}
function createFelledLog(id, x, y) {
    return { id, x, y, nefite: 1, processed: false, transportersRequired: 2, stockpiled: false };
}
function createOutdoorStockpile(x, y, radius = 28) {
    return { x, y, radius };
}
function shouldVolunteerForLogHaul(trait, nearbyLogs) {
    if (nearbyLogs <= 0)
        return false;
    if (trait === "orderly" || trait === "helpful")
        return true;
    if (trait === "steady")
        return nearbyLogs >= 4;
    return false;
}
exports.G1_FOUNDING_WORK_PROFILES = [
    { characterId: "guard-1", primary: "steady", secondary: "helpful", fatigue: 0, fatigueLimit: 2100, recoveryRate: 4.0 },
    { characterId: "guard-2", primary: "orderly", secondary: "steady", fatigue: 0, fatigueLimit: 2000, recoveryRate: 4.2 },
    { characterId: "guard-3", primary: "helpful", secondary: "steady", fatigue: 0, fatigueLimit: 2250, recoveryRate: 3.9 },
    { characterId: "guard-4", primary: "reluctant", secondary: "helpful", fatigue: 0, fatigueLimit: 1900, recoveryRate: 4.3 },
    { characterId: "guard-5", primary: "steady", secondary: "orderly", fatigue: 0, fatigueLimit: 2350, recoveryRate: 3.8 },
    { characterId: "guard-6", primary: "helpful", secondary: "orderly", fatigue: 0, fatigueLimit: 2150, recoveryRate: 4.1 },
    { characterId: "guard-7", primary: "orderly", secondary: "reluctant", fatigue: 0, fatigueLimit: 2050, recoveryRate: 4.4 },
];
function advanceFatigue(profile, workingSeconds) {
    const fatigue = Math.min(profile.fatigueLimit, profile.fatigue + Math.max(0, workingSeconds));
    return { ...profile, fatigue, needsRest: fatigue >= profile.fatigueLimit };
}
exports.MUI_G1_AUTONOMY = {
    enabled: true,
    directPlayerOrderPriority: true,
    basicNeedInterruptions: ["fatigue"],
};
function fatiguePerformance(profile) {
    const ratio = profile.fatigue / profile.fatigueLimit;
    if (ratio >= 1)
        return 0;
    if (ratio >= 0.85)
        return 0.45;
    if (ratio >= 0.65)
        return 0.7;
    return 1;
}
function recoverFatigue(profile, restingSeconds) {
    return { ...profile, fatigue: Math.max(0, profile.fatigue - Math.max(0, restingSeconds) * profile.recoveryRate) };
}
function g1FatigueDecision(profile) {
    const performance = fatiguePerformance(profile);
    if (performance === 0)
        return profile.primary === "reluctant" ? "leave_task_temporarily" : "rest";
    if (performance <= 0.45 && profile.primary === "reluctant")
        return "leave_task_temporarily";
    return "continue";
}
function rememberTaskForRest(kind, x, y) {
    return { kind, x, y };
}
function shouldOfferSpontaneousHelp(profile, heavyLogNeedsHelp, cooldownReady) {
    return heavyLogNeedsHelp && cooldownReady && (profile.primary === "helpful" || profile.secondary === "helpful");
}
function g1ReactionToLowInitiative(profile) {
    return profile.primary === "orderly" || profile.primary === "steady" ? "ask_help" : "ignore";
}
function readyToResumeRememberedTask(profile) {
    return fatiguePerformance(profile) >= 1;
}
function canOfferNearbyHelp(profile, distance, ownTaskUrgent, needsRest) {
    if (ownTaskUrgent || needsRest || distance > 36)
        return false;
    return profile.primary === "helpful" || profile.secondary === "helpful";
}
function directOrderWorkModifier(profile) {
    return {
        obeysDirectOrder: true,
        performance: fatiguePerformance(profile),
        mayPause: profile.primary === "reluctant",
        prefersOrder: profile.primary === "orderly" || profile.secondary === "orderly",
        mayOfferHelp: profile.primary === "helpful" || profile.secondary === "helpful",
    };
}
function reserveNearestWorkTree(trees, workerId, x, y) {
    const available = trees.filter(t => t.standing && !t.reservedBy);
    let best = null, distance = Infinity;
    for (const tree of available) {
        const d = Math.hypot(tree.x - x, tree.y - y);
        if (d < distance) {
            best = tree;
            distance = d;
        }
    }
    if (best)
        best.reservedBy = workerId;
    return best;
}
function fellReservedWorkTree(tree, workerId) {
    if (!tree.standing || tree.reservedBy !== workerId)
        return false;
    tree.standing = false;
    tree.reservedBy = null;
    return true;
}
exports.G1_LOGGING_ZONE_RADIUS = 90;
function reserveNearestTreeInZone(trees, workerId, zoneX, zoneY) {
    const candidates = trees.filter(t => t.standing && !t.reservedBy && Math.hypot(t.x - zoneX, t.y - zoneY) <= exports.G1_LOGGING_ZONE_RADIUS);
    let best = null, distance = Infinity;
    for (const tree of candidates) {
        const d = Math.hypot(tree.x - zoneX, tree.y - zoneY);
        if (d < distance) {
            best = tree;
            distance = d;
        }
    }
    if (best)
        best.reservedBy = workerId;
    return best;
}
function loggingZoneExhausted(trees, zoneX, zoneY) {
    return !trees.some(t => t.standing && Math.hypot(t.x - zoneX, t.y - zoneY) <= exports.G1_LOGGING_ZONE_RADIUS);
}
function nearestUnstockpiledLog(logs, x, y) {
    let best = null;
    let distance = Infinity;
    for (const log of logs) {
        if (log.stockpiled)
            continue;
        const d = Math.hypot(log.x - x, log.y - y);
        if (d < distance) {
            best = log;
            distance = d;
        }
    }
    return best;
}
function stockpileSlot(stockpile, index) {
  const safeIndex = Number.isFinite(index) ? Math.max(0, Math.floor(index)) : 0;
  // Keep every position in a fixed rectangular footprint. Extend the grid
  // without wrapping when more logs arrive; old saves retain their coordinates.
  const safeRadius = Number.isFinite(stockpile.radius) ? Math.max(0, stockpile.radius) : 0;
  const halfWidth = safeRadius * 0.64;
  const halfHeight = safeRadius * 0.48;
  const columns = Math.max(1, Math.floor(halfWidth * 2 / 3.5));
  const rows = Math.max(1, Math.ceil(91 / columns));
  const col = safeIndex % columns;
  const row = Math.floor(safeIndex / columns);
  // Distinct compact layers for overflow. Never wrap back onto an occupied slot.
  // Keep the entire stack inside the rectangular marking, even for legacy saves.
  const layer = Math.floor(row / rows);
  const localRow = row % rows;
  const x = columns === 1 ? 0 : (col / (columns - 1) * 2 - 1) * halfWidth;
  const y = rows === 1 ? 0 : (localRow / (rows - 1) * 2 - 1) * halfHeight;
  const inset = layer === 0 ? 0 : (1 - Math.pow(0.5, layer)) * 0.04;
  return { x: stockpile.x + x * (1 - inset),
           y: stockpile.y + y * (1 - inset) };
}

function g1CanJoinHaul(workerX, workerY, logX, logY, fatigue) {
    return (!fatigue || fatiguePerformance(fatigue) > 0.45); // Travel distance is not an arbitrary blocker: distant logs remain collectable.
}
function g1HaulPriority(profile) {
    if (!profile)
        return 0;
    if (profile.primary === "helpful" || profile.primary === "orderly")
        return 3;
    if (profile.secondary === "helpful" || profile.secondary === "orderly")
        return 2;
    if (profile.primary === "steady")
        return 1;
    return 0;
}
function chooseG1Haulers(availableCharacterIds, profiles, required = 2) {
    if (availableCharacterIds.length < required)
        return [];
    return [...availableCharacterIds]
        .sort((a, b) => {
        const pa = profiles.find(p => p.characterId === a);
        const pb = profiles.find(p => p.characterId === b);
        return g1HaulPriority(pb) - g1HaulPriority(pa);
    })
        .slice(0, required);
}
function g1SpontaneousWorkPriority(profile, opportunity, directOrder = false) {
    if (directOrder)
        return 100;
    if (profile.primary === "reluctant")
        return opportunity === "helping" ? 0 : 1;
    if (opportunity === "hauling" && (profile.primary === "orderly" || profile.secondary === "orderly"))
        return 4;
    if (opportunity === "helping" && (profile.primary === "helpful" || profile.secondary === "helpful"))
        return 4;
    if (opportunity === "logging" && profile.primary === "steady")
        return 3;
    return 2;
}
function chooseG1SpontaneousHelper(availableCharacterIds, profiles) {
    return [...availableCharacterIds]
        .map(id => ({ id, profile: profiles.find(p => p.characterId === id) }))
        .filter((v) => !!v.profile)
        .filter(v => g1SpontaneousWorkPriority(v.profile, "helping") > 0)
        .sort((a, b) => g1SpontaneousWorkPriority(b.profile, "helping") - g1SpontaneousWorkPriority(a.profile, "helping"))[0]?.id ?? null;
}
function chooseG1AutonomousOpportunity(profile, needs, directOrder = false) {
    if (directOrder || !profile || needs.length === 0)
        return null;
    return [...needs]
        .map(need => ({
        ...need,
        score: need.urgency + g1SpontaneousWorkPriority(profile, need.opportunity),
    }))
        .sort((a, b) => b.score - a.score)[0] ?? null;
}
function g1ContinuityAllowsReassignment(activeWorkers, minimumContinuityWorkers = 2) {
    return activeWorkers > minimumContinuityWorkers;
}
exports.MUI_G1_WORK_PROFILE = {
    characterId: "mui",
    primary: "steady",
    secondary: "steady",
    fatigue: 0,
    fatigueLimit: 940,
    recoveryRate: 4.0,
};
function g1ProfileForCharacter(characterId) {
    if (characterId === "mui")
        return exports.MUI_G1_WORK_PROFILE;
    return exports.G1_FOUNDING_WORK_PROFILES.find(p => p.characterId === characterId);
}
exports.G1_LOCAL_WORK_PERCEPTION_RADIUS = 72;
exports.G1_MIN_DECISION_HOLD_SECONDS = 8;
function g1CanPerceiveWork(fromX, fromY, workX, workY) {
    return Math.hypot(workX - fromX, workY - fromY) <= exports.G1_LOCAL_WORK_PERCEPTION_RADIUS;
}
function g1WorkPriority(context) {
    if (context.basicNeedInterrupt)
        return "basic_need";
    if (context.hasDirectOrder)
        return "direct_order";
    if (context.hasActiveTask)
        return "active_task";
    if (context.spontaneousHelpAvailable)
        return "spontaneous_help";
    return "idle";
}
function g1MayReconsiderDecision(secondsSinceDecision, currentTaskStillValid) {
    if (!currentTaskStillValid)
        return true;
    return secondsSinceDecision >= exports.G1_MIN_DECISION_HOLD_SECONDS;
}
exports.G1_NPC_COMMUNICATION_RADIUS = 24;
function g1CanCommunicate(ax, ay, bx, by) {
    return Math.hypot(bx - ax, by - ay) <= exports.G1_NPC_COMMUNICATION_RADIUS;
}
function g1ShareWorkKnowledge(knowledge, speakerId, speakerX, speakerY, listenerX, listenerY) {
    if (!g1CanCommunicate(speakerX, speakerY, listenerX, listenerY))
        return null;
    return { ...knowledge, sourceCharacterId: speakerId };
}
function g1KnowledgeIsCurrent(knowledge, now, maxAgeSeconds = 45) {
    return now >= knowledge.observedAt && now - knowledge.observedAt <= maxAgeSeconds;
}
