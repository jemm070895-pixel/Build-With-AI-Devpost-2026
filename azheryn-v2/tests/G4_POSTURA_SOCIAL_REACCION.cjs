const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('postura tensa solo para guardias despiertos, inactivos y descontentos',()=>{
  assert.match(source,/const visiblyUpset = !ch\.mui && !ch\.resting && !visiblyTired/);
  assert.match(source,/!moving && !working && !building && !hauling/);
  assert.match(source,/socialReaction\(ch\.social\) !== 'cooperative'/);
  assert.match(source,/const idleArmY = visiblyTired \? -7 : visiblyUpset \? -13 : -11/);
});
