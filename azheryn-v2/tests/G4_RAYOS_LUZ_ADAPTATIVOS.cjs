const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
const fn=source.split('const drawG4CanopyLight =')[1].split('const drawG3Atmosphere =')[0];
test('Canopy light disabled on narrow screens and in overcast darkness',()=>{
 assert.match(fn,/width < 480/);
 assert.match(fn,/cloud > \.75/);
 assert.match(fn,/light < \.45/);
});
test('Canopy rays preserve reduced-motion setting and bound brightness',()=>{
 assert.match(fn,/reducedMotionFrame/);
 assert.match(fn,/Math\.min\(\.055/);
});
