const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('wildlife animation time is simulated, not wall clock',()=>{
  const section=source.split('const drawPeacefulWildlife =')[1].split('const draw =')[0];
  assert.match(section,/const time = wildlifeSimulationSeconds/);
  assert.doesNotMatch(section,/const time = performance\.now\(\)/);
});
test('pause freezes wildlife animation clock and speed scales it',()=>{
  assert.match(source,/wildlifeSimulationSeconds \+= dt/);
  assert.match(source,/const dt = elapsed \* timeSpeedRef\.current/);
  assert.match(source,/const motionTime = reduceWildlifeMotion \? 0 : time/);
});
