/** Deterministic fruit utilities for example trees. */
export const CHAPTER1_FRUITS = [
  {id:"guava", nameEs:"Guayaba", nameEn:"Guava", skin:"#b8cf64", shade:"#779342", shape:"round"},
  {id:"mango", nameEs:"Mango", nameEn:"Mango", skin:"#efb44b", shade:"#cb7134", shape:"oval"},
  {id:"jobo", nameEs:"Jobo", nameEn:"Yellow mombin", skin:"#e6c751", shade:"#aa9c39", shape:"small"},
] as const;
export function stableTreeSeed(treeId:string):number {
  let hash = 2166136261;
  for (let i = 0; i < treeId.length; i++) hash = Math.imul(hash ^ treeId.charCodeAt(i), 16777619);
  return hash >>> 0;
}
export function fruitForTreeId(treeId:string) {
  return CHAPTER1_FRUITS[stableTreeSeed(treeId) % CHAPTER1_FRUITS.length];
}
const FRUIT_POSITION_CACHE_LIMIT = 512;
const fruitPositionCache = new Map<string, readonly (readonly [number, number])[]>();
export function fruitPositionsForTreeId(treeId:string): readonly (readonly [number,number])[] {
  const cached=fruitPositionCache.get(treeId);
  if(cached) { fruitPositionCache.delete(treeId); fruitPositionCache.set(treeId,cached); return cached; }
  const seed=stableTreeSeed(treeId);
  const count=3 + (seed % 3);
  const angleOffset=((seed>>>5)%6283)/1000;
  const goldenAngle=Math.PI*(3-Math.sqrt(5));
  const positions: [number,number][]=[];
  for(let i=0;i<count;i++){
    const radius=0.22 + 0.57*Math.sqrt((i+0.5)/count);
    const angle=i*goldenAngle+angleOffset;
    positions.push([Math.cos(angle)*radius,Math.sin(angle)*radius]);
  }
  fruitPositionCache.set(treeId,positions);
  if(fruitPositionCache.size>FRUIT_POSITION_CACHE_LIMIT) fruitPositionCache.delete(fruitPositionCache.keys().next().value!);
  return positions;
}
