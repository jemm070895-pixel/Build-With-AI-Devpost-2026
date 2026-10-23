const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('El acumulador social se reinicia cuando el personaje deja de descansar',()=>{
  assert.match(source,/const restingNow = !ch\.mui && !ch\.needTrip && !ch\.order/);
  assert.match(source,/!haul\?\.workerIds\.includes\(ch\.id\)/);
  assert.match(source,/if \(!restingNow && ch\.socialRestSeconds\) ch\.socialRestSeconds = 0/);
});
