const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('No se conserva recuperación parcial cuando un guardia aún se desplaza',()=>{
  const begin=source.indexOf('const restingNow =');
  const end=source.indexOf('if (!restingNow',begin);
  assert.ok(begin>=0 && end>begin);
  const condition=source.slice(begin,end);
  assert.match(condition,/!ch\.needTrip && !ch\.order/);
  assert.match(condition,/!haul\?\.workerIds\.includes\(ch\.id\)/);
  assert.match(condition,/Math\.hypot\(ch\.tx-ch\.x,ch\.ty-ch\.y\) <= 1/);
});
