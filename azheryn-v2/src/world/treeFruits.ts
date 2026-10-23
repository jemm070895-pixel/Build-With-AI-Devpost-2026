/** Chapter 1 visual fruit varieties. Deterministic by persistent tree ID; no new save fields. */
export const CHAPTER1_FRUITS = [
  {id:"guava", nameEs:"Guayaba", nameEn:"Guava", skin:"#b8cf64", shade:"#779342", shape:"round"},
  {id:"mango", nameEs:"Mango", nameEn:"Mango", skin:"#efb44b", shade:"#cb7134", shape:"oval"},
  {id:"jobo", nameEs:"Jobo", nameEn:"Yellow mombin", skin:"#e6c751", shade:"#aa9c39", shape:"small"},
] as const;
/** Stable FNV-1a hash: works for UUIDs, text IDs and very long numeric IDs. */
export function stableTreeSeed(treeId:string):number {
  let hash = 2166136261;
  for (let i = 0; i < treeId.length; i++) {
    hash = Math.imul(hash ^ treeId.charCodeAt(i), 16777619);
  }
  return hash >>> 0;
}
export function fruitForTreeId(treeId:string) {
  return CHAPTER1_FRUITS[stableTreeSeed(treeId) % CHAPTER1_FRUITS.length];
}

// Avoid allocating a fresh array for every visible fruit tree on every frame.
// Bound the cache because world regeneration can introduce new tree IDs.
const FRUIT_POSITION_CACHE_LIMIT = 512;
const fruitPositionCache = new Map<string, readonly (readonly [number, number])[]>();

/** Fruit positions are fixed for each tree and remain within the painted canopy. */
export function fruitPositionsForTreeId(treeId:string): readonly (readonly [number,number])[] {
  const cached=fruitPositionCache.get(treeId);
  if(cached) {
    // LRU: frequently visible trees must not be evicted by distant trees.
    fruitPositionCache.delete(treeId);
    fruitPositionCache.set(treeId,cached);
    return cached;
  }
  const hash=stableTreeSeed(treeId);
  // Use independent hash bits: variety already uses hash % 3.
  // Reusing that remainder made every guava/mango/jobo have exactly 3/4/5 fruits.
  const mixed = Math.imul(hash ^ (hash >>> 16), 0x7feb352d) >>> 0;
  const count=3+((mixed >>> 12)%3);
  const positions: [number,number][]=[];
  // Fibonacci phyllotaxis: the golden angle separates neighboring fruits.
  // Square-root radius distributes points by canopy area rather than rings.
  // The seed rotates each tree without introducing frame-dependent randomness.
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const rotation = ((hash >>> 8) / 0x1000000) * 2 * Math.PI;
  const canopyRadius = 0.49;
  for(let i=0;i<count;i++) {
    const angle = rotation + i * goldenAngle;
    const radius = canopyRadius * Math.sqrt((i + 0.5) / count);
    positions.push(Object.freeze([
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.75,
    ]) as [number,number]);
  }
  const result=Object.freeze(positions);
  if(fruitPositionCache.size>=FRUIT_POSITION_CACHE_LIMIT){
    const oldest=fruitPositionCache.keys().next().value;
    if(oldest!==undefined)fruitPositionCache.delete(oldest);
  }
  fruitPositionCache.set(treeId,result);
  return result;
}
