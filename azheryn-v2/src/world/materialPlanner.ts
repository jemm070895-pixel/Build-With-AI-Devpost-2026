/** A corrupted target must not make planning disagree with its milestones. */
function safeTarget(target:number) { return Number.isFinite(target) ? Math.max(1, Math.floor(target)) : 91; }

/** Pure counters for Chapter 1; hauling logs are already included in unstockpiled logs. */
export function materialPlan(committed:number, stockpiled:number, unstockpiled:number, hauling:boolean, target=91) {
  const count=(n:number)=>Number.isFinite(n)?Math.max(0,Math.floor(n)):0;
  const goal=safeTarget(target);
  const remaining=Math.max(0,goal-count(committed));
  const available=count(stockpiled);
  const loose=count(unstockpiled);
  const inTransit=hauling&&loose>0?1:0;
  const awaitingPickup=loose-inTransit;
  const toGather=Math.max(0,remaining-available-awaitingPickup-inTransit);
  return {remaining,available,inTransit,awaitingPickup,toGather};
}

/** Actionable milestones without assuming that felled logs have reached the stockpile. */
export function supplyMilestones(committed:number, stockpiled:number, unstockpiled:number, hauling:boolean, target=91) {
  const plan=materialPlan(committed,stockpiled,unstockpiled,hauling,target);
  const total=safeTarget(target);
  const built=Math.min(total,Number.isFinite(committed)?Math.max(0,Math.floor(committed)):0);
  const ready=Math.min(total,built+plan.available);
  const secured=Math.min(total,ready+plan.awaitingPickup+plan.inTransit);
  const pct=(n:number)=>Math.round(n/total*100);
  return {builtPct:pct(built),readyPct:pct(ready),securedPct:pct(secured),
    needsLogging:plan.toGather>0,needsHauling:plan.awaitingPickup+plan.inTransit>0,
    needsBuilding:plan.available>0&&plan.remaining>0};
}
