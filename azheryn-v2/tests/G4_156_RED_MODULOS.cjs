const test=require('node:test');const assert=require('node:assert/strict');
const {audit}=require('../tools/audit-module-network.cjs');
test('all internal module connections resolve without cycles',()=>{const r=audit();assert.equal(r.unresolved.length,0);assert.equal(r.cycles.length,0);assert.ok(r.connections>=20);});
test('gameplay branches are connected to the world view',()=>{const r=audit();const connected=new Set(r.crossBranchConnections.filter(e=>e.from==='ui/WorldView.tsx').map(e=>e.to));for(const file of ['world/treeFruits.ts','world/treeSpecies.ts','world/peacefulWildlife.ts','world/climate.ts','world/storehouse.ts','world/work.ts','world/socialLife.ts','world/saveSlots.ts'])assert.ok(connected.has(file),`${file} disconnected`);});
