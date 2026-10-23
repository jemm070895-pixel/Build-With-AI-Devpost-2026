/** Shared species definitions: thousands of instances reference these five templates. */
export const TREE_SPECIES = [
  {id:"broadleaf", nameEs:"Frondoso", nameEn:"Broadleaf", crown:"#245b34", highlight:"#3c8249", fruit:false, crownRadius:10},
  {id:"fruit", nameEs:"Frutal", nameEn:"Fruit tree", crown:"#41702f", highlight:"#77a342", fruit:true, crownRadius:9},
  {id:"tall", nameEs:"Árbol alto", nameEn:"Tall tree", crown:"#1c553c", highlight:"#317b55", fruit:false, crownRadius:11},
  {id:"dense", nameEs:"Árbol denso", nameEn:"Dense tree", crown:"#28502c", highlight:"#3e7540", fruit:false, crownRadius:12},
  {id:"light", nameEs:"Árbol claro", nameEn:"Light tree", crown:"#557339", highlight:"#81994d", fruit:false, crownRadius:8},
] as const;
export type TreeSpeciesId = typeof TREE_SPECIES[number]["id"];
export function speciesForIndex(index:number) { return TREE_SPECIES[Math.abs(Math.trunc(index)) % TREE_SPECIES.length]; }
export function speciesForTree(speciesId?:string) { return TREE_SPECIES.find(species=>species.id===speciesId) ?? TREE_SPECIES[0]; }
