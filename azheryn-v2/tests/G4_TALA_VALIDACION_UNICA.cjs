const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const src=fs.readFileSync('src/ui/WorldView.tsx','utf8');
test('no se recupera fatiga en el mismo tick en que se cancela un transporte nocturno',()=>{
 assert.match(src,/if \(ch\.fatigue && !wasHauling && restingNow\) ch\.fatigue = recoverFatigue\(ch\.fatigue,dt\)/);
});
