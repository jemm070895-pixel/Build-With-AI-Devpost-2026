const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('Descanso social funciona sin registro de fatiga',()=>{
  assert.match(source,/if \(!ch\.fatigue && ch\.resting && restingNow\)/);
  const begin=source.indexOf('if (!ch.fatigue && ch.resting && restingNow)');
  const end=source.indexOf('if(ch.fatigue){',begin);
  assert.ok(end>begin);
  const body=source.slice(begin,end);
  assert.match(body,/socialRestSeconds=\(ch\.socialRestSeconds \?\? 0\)\+dt/);
  assert.match(body,/restSocialState\(ch\.social \?\? initialSocialState\(\),minutes\/60\)/);
});
