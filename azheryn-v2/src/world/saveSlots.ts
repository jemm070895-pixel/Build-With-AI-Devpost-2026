/** A second local snapshot protects the preceding autosave from an interrupted write. */
export const BACKUP_SUFFIX = '-backup';
export function isUsableChapterSave(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') return false;
  const s = value as Record<string, unknown>;
  if (s.version !== 1 || !Array.isArray(s.characters) || s.characters.length !== 8 ||
      !Array.isArray(s.felledLogs) || !Array.isArray(s.workTrees)) return false;
  return s.characters.every((ch: unknown) => ch !== null && typeof ch === 'object' &&
    typeof (ch as {id?:unknown}).id === 'string' &&
    ['x','y','tx','ty'].every(k => Number.isFinite((ch as Record<string,unknown>)[k]))) &&
    new Set(s.characters.map((ch:{id:string})=>ch.id)).size === 8 &&
    s.characters.filter((ch:{mui?:boolean})=>ch.mui === true).length === 1;
}
export function readChapterSave(primary: string | null, backup: string | null) {
  for (const [source, raw] of [['primary', primary], ['backup', backup]] as const) {
    if (!raw) continue;
    try { const value:unknown = JSON.parse(raw); if (isUsableChapterSave(value)) return {saved:value,source}; }
    catch { /* Try the previous snapshot. */ }
  }
  return null;
}

/** Write a checked snapshot without destroying the last valid recovery copy. */
export function writeChapterSave(storage: Pick<Storage, 'getItem' | 'setItem'>, key: string, snapshot: unknown): boolean {
  if (!isUsableChapterSave(snapshot)) return false;
  let serialized: string;
  try { serialized = JSON.stringify(snapshot); } catch { return false; }
  try {
    const previous = storage.getItem(key);
    // Validate the new payload before overwriting any recovery point.
    if (!readChapterSave(serialized, null)) return false;
    if (previous && readChapterSave(previous, null)) storage.setItem(key + BACKUP_SUFFIX, previous);
    storage.setItem(key, serialized);
    return storage.getItem(key) === serialized;
  } catch { return false; }
}

/** Restore the valid recovery snapshot to the primary slot after a damaged write.
 * The backup remains untouched so recovery never destroys its own fallback. */
export function repairChapterSave(storage: Pick<Storage, 'getItem' | 'setItem'>, key: string): 'primary' | 'backup' | 'none' {
  try {
    const current = readChapterSave(storage.getItem(key), storage.getItem(key + BACKUP_SUFFIX));
    if (!current) return 'none';
    if (current.source === 'backup') {
      const recovered = JSON.stringify(current.saved);
      try { storage.setItem(key, recovered); } catch { /* Keep the backup available. */ }
    }
    return current.source;
  } catch { return 'none'; }
}
