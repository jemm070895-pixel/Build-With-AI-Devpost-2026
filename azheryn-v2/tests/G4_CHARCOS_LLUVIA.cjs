const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('reflejos de lluvia dependen del clima y la luz, no alteran simulacion',()=>{
 assert.match(src,/const drawG4WetGround = \(rain:number, light:number\)/);
 assert.match(src,/drawG4WetGround\(g3Weather\.rain,g3Weather\.light\)/);
 assert.match(src,/if \(rain < \.12 \|\| cam\.zoom < \.9\) return/);
 assert.match(src,/if\(light>\.25\)/);
});
test('charcos limitados y anclados al mundo',()=>{
 assert.match(src,/count<110/);
 assert.match(src,/const p=toScreen\(\{x,y\}\)/);
 assert.match(src,/ctx\.save\(\);[\s\S]*?ctx\.restore\(\);/);
});
