import { STOREHOUSE_G1, type StorehouseSite } from './storehouse';

/** Normalize an untrusted or older local save before it enters the simulation. */
export function recoverStorehouse(raw: unknown): StorehouseSite | null {
  if (!raw || typeof raw !== 'object') return null;
  const s = raw as Record<string, unknown>;
  if (typeof s.x !== 'number' || !Number.isFinite(s.x) || typeof s.y !== 'number' || !Number.isFinite(s.y)) return null;
  const committed = typeof s.committed === 'number' && Number.isFinite(s.committed)
    ? Math.max(0, Math.min(STOREHOUSE_G1.logsRequired, Math.floor(s.committed))) : 0;
  const complete = committed === STOREHOUSE_G1.logsRequired;
  const progressSeconds = typeof s.progressSeconds === 'number' && Number.isFinite(s.progressSeconds)
    ? Math.max(0, Math.min(2.999, s.progressSeconds)) : 0;
  return { x: s.x, y: s.y, committed, progressSeconds: complete ? 0 : progressSeconds, complete };
}
