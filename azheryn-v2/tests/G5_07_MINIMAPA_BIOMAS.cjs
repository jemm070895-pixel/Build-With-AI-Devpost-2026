const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
const map=src.slice(src.indexOf('const drawMinimap ='),src.indexOf('const draw = () =>'));
test('G5 minimapa utiliza datos de bosque, pradera, roca y claro del mundo',()=>{
 for(const field of ['forest','meadow','rock','clear','wet']) assert.match(map,new RegExp('tile\\.'+field));
 assert.doesNotMatch(map,/\(gx \* 7 \+ gy \* 11\)/);
});
test('G5 mantiene agua, recorte y coordenadas cardinales',()=>{
 assert.match(map,/tile\.water \? "#4d96a7"/);
 assert.match(map,/mapCtx\.clip\(\)/);
 assert.match(src,/className="world-compass world-compass-map"/);
});
