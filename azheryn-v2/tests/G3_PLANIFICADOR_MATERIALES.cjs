const assert=require('node:assert/strict');
const fs=require('node:fs');
const src=fs.readFileSync('src/ui/WorldView.tsx','utf8');
for(const fragment of ['Planificador de materiales','Materials planner','materials.remaining','materials.toGather','Supply still needed','Next: place a stockpile','Keep two guards available','Move available guards near the site']) assert.ok(src.includes(fragment),`Missing: ${fragment}`);
const planner=fs.readFileSync('src/world/materialPlanner.ts','utf8');
assert.match(planner,/loose-inTransit/);
assert.match(planner,/remaining-available-awaitingPickup-inTransit/);
console.log('G3 material planner: 10 checks OK');
