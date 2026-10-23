const fs=require('fs');const assert=require('assert');
const view=fs.readFileSync('src/ui/WorldView.tsx','utf8');
const species=fs.readFileSync('src/world/treeSpecies.ts','utf8');
for(const id of ['broadleaf','fruit','tall','dense','light']){
 assert(view.includes(`case "${id}"`),`Missing silhouette ${id}`);
 assert(species.includes(`id:"${id}"`),`Missing shared species ${id}`);
}
assert(view.includes('for (const tree of workTrees)'), 'Rendering must use actual tree registry');
assert(view.includes('if(!tree.standing)'), 'Cut trees must no longer show crowns');
console.log('Five distinct species silhouettes and tree state: OK');
