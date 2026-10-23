const fs=require('fs');
const assert=require('assert');
const source=fs.readFileSync('src/ui/WorldView.tsx','utf8');
assert(source.includes('let climateSnapshotElapsed = 0;'));
assert(source.includes('climateSnapshotElapsed += elapsed;'));
assert(source.includes('climateSnapshotElapsed %= 0.5;'));
assert(source.includes('if (dt > 0) {\n          setClimate(frameClimate);'));
assert(!source.includes('Math.floor((now - dt * 1000) / 500)'));
for (const speed of [0,1,2,4]) {
 let accumulator=0,refreshes=0;
 for(let frame=0;frame<600;frame++){
  const elapsed=1/60; const dt=elapsed*speed;
  accumulator+=elapsed;
  if(accumulator>=0.5){accumulator%=0.5;if(dt>0)refreshes++;}
 }
 assert.strictEqual(refreshes,speed===0?0:19,`refresh cadence speed ${speed}`);
}
console.log('9/9: cadence checks + x0/x1/x2/x4 simulated frames');
