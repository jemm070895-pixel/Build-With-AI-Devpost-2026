const assert=require('node:assert/strict');
const fs=require('node:fs');
const planner=fs.readFileSync('src/world/materialPlanner.ts','utf8');
const ui=fs.readFileSync('src/ui/WorldView.tsx','utf8');
for(const x of ['supplyMilestones','builtPct','readyPct','securedPct','needsLogging','needsHauling','needsBuilding'])assert.ok(planner.includes(x),x);
for(const x of ['Etapas del suministro','Acciones pendientes','milestones.builtPct','milestones.securedPct','milestones.needsHauling'])assert.ok(ui.includes(x),x);
console.log('G3 supply milestones: 12 checks OK');
