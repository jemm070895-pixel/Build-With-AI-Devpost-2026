const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('river glints sample actual water tiles and stay capped',()=>{
 assert.match(source,/const drawG4RiverGlints/);
 assert.match(source,/world\.tiles\[gy\*world\.size\+gx\]\?\.water/);
 assert.match(source,/drawn<limit/);
 assert.match(source,/toScreen\(project\(gx,gy\)\)/);
});
test('river glints honor zoom, light, motion preference and render order',()=>{
 assert.match(source,/cam\.zoom < 1\.05 \|\| light < \.12/);
 assert.match(source,/prefers-reduced-motion: reduce/);
 assert.ok(source.indexOf('drawG4RiverGlints(g3Weather.light,g3Weather.cloud)')>source.indexOf('drawG4WetGround(g3Weather.rain,g3Weather.light)'));
});
