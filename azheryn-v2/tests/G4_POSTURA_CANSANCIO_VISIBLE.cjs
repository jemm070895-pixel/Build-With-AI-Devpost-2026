const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('guardias agotados en reposo bajan los brazos sin alterar acciones',()=>{
  assert.match(source,/const visiblyTired = !ch\.mui && !working && !building && !hauling/);
  assert.match(source,/fatigue\?\.fatigue \?\? 0\) >= 70 \|\| ch\.resting/);
  assert.match(source,/const idleArmY = visiblyTired \? -7 : visiblyUpset \? -13 : -11/);
  assert.match(source,/hauling\?-17:idleArmY/);
});
