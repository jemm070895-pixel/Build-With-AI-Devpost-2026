const fs=require('node:fs');
const assert=require('node:assert/strict');
const source=fs.readFileSync('src/ui/WorldView.tsx','utf8');
assert.match(source,/const drawG3Atmosphere = \(light:number, cloud:number\)/);
assert.match(source,/drawG3Atmosphere\(g3Weather.light,g3Weather.cloud\)/);
assert.match(source,/Math\.hypot\(wx,wy\)<85/);
assert.match(source,/if\(p\.x\+rx<0/);
console.log('G3 atmosphere: PASS');
