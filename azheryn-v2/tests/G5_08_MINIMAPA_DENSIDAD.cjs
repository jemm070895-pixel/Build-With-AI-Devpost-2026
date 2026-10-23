const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
const map=src.slice(src.indexOf('const drawMinimap ='),src.indexOf('const draw = () =>'));
test('G5 minimapa muestrea biomas con densidad adaptativa y parches proporcionales',()=>{
 assert.match(map,/const terrainStep = Math\.max\(1, Math\.ceil\(world\.size \/ 85\)\)/);
 assert.match(map,/gy \+= terrainStep/);
 assert.match(map,/gx \+= terrainStep/);
 assert.match(map,/patchWidth/);assert.match(map,/patchHeight/);
 assert.doesNotMatch(map,/fillRect\(x - 1\.7, y - 1\.7, 3\.4, 3\.4\)/);
});
test('G5 Mui se distingue con un anillo sin alterar brújula ni otros marcadores',()=>{
 assert.match(map,/characters\.find\(ch => ch\.mui\)/);
 assert.match(map,/mapX\(mui\.x\),mapY\(mui\.y\),5\.7/);
 assert.match(map,/mapCtx\.restore\(\)/);
});
