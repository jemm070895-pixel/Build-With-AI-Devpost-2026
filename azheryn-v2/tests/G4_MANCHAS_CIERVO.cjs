const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('deer coat markings are camera-gated and clipped to torso',()=>{
  const start=source.indexOf('Close-range dappled coat markings');
  const end=source.indexOf('A short tail flicks',start);
  assert.ok(start>0&&end>start);
  const segment=source.slice(start,end);
  assert.match(segment,/if \(detailed\)/);
  assert.match(segment,/ctx\.clip\(\)/);
  assert.match(segment,/ctx\.restore\(\)/);
  assert.match(segment,/spotX,spotY,spotR/);
});
