/** Plano didáctico G1/O1: no certifica estabilidad estructural. */
export const STOREHOUSE_G1 = {
  outer: { lengthM: 5, widthM: 3 },
  inner: { lengthM: 4.6, widthM: 2.6 },
  wallHeightM: 2.7,
  originalLog: { lengthM: 3, diameterM: 0.2, burialM: 0.3 },
  reinforcedPost: { lengthM: 3, burialM: 0.5, exposedM: 2.5 },
  lintel: { lengthM: 1.4, diameterM: 0.2, count: 2 },
  openings: {
    door: { side: "front-short", widthM: 0.8, bottomM: 0, topM: 2.7, noDoorLeaf: true },
    rear: { widthM: 1, bottomM: 1, heightM: 1.7 },
    left: { widthM: 1, bottomM: 1, heightM: 1.5, alongLongWallFromM: 2 },
    right: { widthM: 1, bottomM: 1, heightM: 1.5, alongLongWallFromM: 2 },
  },
  roof: { parallelAcrossWidth: true, logCount: 25, logLengthM: 3, supportEachSideM: 0.2 },
  breakdown: { roof: 25, front: 9, rear: 10.5, left: 23, right: 23 },
  logsRequired: 91,
  unlimitedOutdoorLogProduction: true,
  processedWoodAndFoodStorageEnabled: false,
  futureStorageCapacityUnits: 500,
} as const;

export function storehouseProgress(availableWholeLogs: number, committedWholeLogs = 0) {
  const available = Math.max(0, Math.floor(Number.isFinite(availableWholeLogs) ? availableWholeLogs : 0));
  const committed = Math.max(0, Math.min(STOREHOUSE_G1.logsRequired, Math.floor(Number.isFinite(committedWholeLogs) ? committedWholeLogs : 0)));
  const remaining = STOREHOUSE_G1.logsRequired - committed;
  return { available, committed, remaining, canComplete: committed === STOREHOUSE_G1.logsRequired, canCommit: Math.min(available, remaining), surplus: Math.max(0, available - remaining) };
}

export type StorehouseSite = { x:number; y:number; committed:number; progressSeconds:number; complete:boolean; turned?:boolean };
export function createStorehouseSite(x:number,y:number):StorehouseSite { return {x,y,committed:0,progressSeconds:0,complete:false}; }
/** One free worker installs at most one prepared log per 3 simulation seconds. */
export function commitStorehouseLogs(site:StorehouseSite,available:number,dt:number):StorehouseSite {
  // Saved completion flags are advisory: the installed-log count is authoritative.
  // Recover from interrupted/corrupt saves instead of freezing an unfinished site.
  const existing = Number.isFinite(site.committed) ? Math.max(0, Math.min(STOREHOUSE_G1.logsRequired, Math.floor(site.committed))) : 0;
  if (existing >= STOREHOUSE_G1.logsRequired) return {...site, committed:STOREHOUSE_G1.logsRequired, progressSeconds:0, complete:true};
  const normalized = {...site, committed:existing, complete:false};
  if (!Number.isFinite(dt) || dt<=0 || !Number.isFinite(available) || available<1) return normalized;
  const safeProgress = Number.isFinite(site.progressSeconds) && site.progressSeconds >= 0 ? site.progressSeconds : 0;
  // Never bank unlimited work time when only a few logs are available.
  // Otherwise later deliveries can be installed instantly without construction time.
  const progressSeconds=Math.min(safeProgress+dt,Math.max(0,Math.floor(available))*3);
  const units=Math.min(Math.max(0,Math.floor(available)),Math.floor(progressSeconds/3),STOREHOUSE_G1.logsRequired-existing);
  const committed=existing+units;
  return {...normalized,committed,progressSeconds:progressSeconds-units*3,complete:committed===STOREHOUSE_G1.logsRequired};
}
