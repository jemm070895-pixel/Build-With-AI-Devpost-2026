import { BACKUP_SUFFIX, isUsableChapterSave } from './saveSlots';

/** Portable Chapter 1 save: validated before writing anything to local storage. */
export function decodePortableSave(text: string): Record<string, unknown> | null {
  if (text.length > 8_000_000) return null;
  try {
    const value: unknown = JSON.parse(text);
    return isUsableChapterSave(value) ? value : null;
  } catch { return null; }
}

export function exportPortableSave(storage: Pick<Storage, 'getItem'>, key: string): string | null {
  try {
    // Export a valid backup when the primary slot is missing or corrupted.
    const primary = storage.getItem(key);
    const valid = primary ? decodePortableSave(primary) : null;
    const backup = valid ? null : storage.getItem(key + BACKUP_SUFFIX);
    const selected = valid ?? (backup ? decodePortableSave(backup) : null);
    return selected ? JSON.stringify(selected, null, 2) : null;
  } catch { return null; }
}

/** Install an imported save without discarding a valid existing backup.
 * On storage failure, restore the prior slots where possible. */
export function installPortableSave(
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>, key: string, value: Record<string, unknown>
): boolean {
  if (!isUsableChapterSave(value)) return false;
  const oldPrimary = storage.getItem(key);
  const oldBackup = storage.getItem(key + BACKUP_SUFFIX);
  try {
    // Keep the previous valid game as a recovery slot.
    const previous = oldPrimary && decodePortableSave(oldPrimary);
    const fallback = oldBackup && decodePortableSave(oldBackup);
    if (previous || fallback) storage.setItem(key + BACKUP_SUFFIX, JSON.stringify(previous ?? fallback));
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    try {
      if (oldPrimary === null) storage.removeItem(key); else storage.setItem(key, oldPrimary);
      if (oldBackup === null) storage.removeItem(key + BACKUP_SUFFIX); else storage.setItem(key + BACKUP_SUFFIX, oldBackup);
    } catch { /* Storage may be unavailable: report failure without claiming success. */ }
    return false;
  }
}
