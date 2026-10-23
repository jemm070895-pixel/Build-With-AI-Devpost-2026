const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('night vignette uses a bounded, dark radial gradient with a clear centre',()=>{
 assert.match(src,/const drawG4NightVignette = \(light:number, cloud:number\)/);
 assert.match(src,/Math\.min\(\.25,dusk\*\(\.17\+cloud\*\.08\)\)/);
 assert.match(src,/shade\.addColorStop\(0,"rgba\(12,19,33,0\)"\)/);
 assert.match(src,/ctx\.createRadialGradient\(/);
});
test('night shading follows the global darkness layer and precedes weather',()=>{
 assert.match(src,/drawG4NightVignette\(cs\.light,cs\.cloud\);\s*drawG3WeatherDetails\(cs\.rain,cs\.cloud,cs\.light\)/);
});
