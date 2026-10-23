const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('El transporte se cancela antes de contabilizar descanso nocturno',()=>{
  const start=source.indexOf('if (shouldPauseAutonomousWork(frameClimate.hour, Boolean(ch.order)))');
  const end=source.indexOf('if(ch.fatigue){',start);
  const branch=source.slice(start,end);
  assert.ok(start>=0 && end>start);
  assert.match(branch,/const wasHauling = Boolean\(haul\?\.workerIds\.includes\(ch\.id\)\)/);
  assert.match(branch,/if \(wasHauling\) cancelHaul\(\)/);
  assert.match(branch,/if \(!ch\.mui && !wasHauling && restingNow\) \{/);
  assert.ok(branch.indexOf('cancelHaul()')<branch.indexOf('ch.socialRestSeconds=(ch.socialRestSeconds'));
});
