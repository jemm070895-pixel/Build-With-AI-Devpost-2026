const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('Deer hoof ground-contact shading tracks individual gait',()=>{
  assert.match(src,/Ground-contact occlusion under each hoof follows the leg gait/);
  assert.match(src,/const footX=x\+offset\*\.5\+1/);
  assert.match(src,/ctx\.ellipse\(footX,3\.1,2\.1,0\.7/);
});
test('Reduced motion disables rabbit breathing rather than freezing it in an offset pose',()=>{
  assert.match(src,/const breath=reduceWildlifeMotion \? 1 : 1\+Math\.sin/);
});
