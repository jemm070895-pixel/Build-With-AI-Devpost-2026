const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
const work=fs.readFileSync(path.join(__dirname,'../src/world/work.ts'),'utf8');
const ui=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
for(const token of ['advanceSurvival','survivalDecision','communicateDanger','cooperativeHaulReady']) assert.ok(work.includes('function '+token),`Future module missing: ${token}`);
assert.ok(!ui.includes('survivalPriority==="escape"'),'Danger escape remains deferred');
console.log('Survival helpers present; hunger/thirst gameplay integration remains pending');
