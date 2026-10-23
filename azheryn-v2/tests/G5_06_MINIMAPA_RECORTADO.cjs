const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
const map=src.slice(src.indexOf('const drawMinimap ='),src.indexOf('const draw = () =>'));
test('G5 minimapa recorta todos los elementos dentro del marco circular',()=>{
  assert.match(map,/mapCtx\.save\(\)/);
  assert.match(map,/mapCtx\.arc\(center, center, center - 3, 0, Math\.PI \* 2\)/);
  assert.match(map,/mapCtx\.clip\(\)/);
  assert.match(map,/mapCtx\.restore\(\)/);
  assert.ok(map.indexOf('mapCtx.clip()') < map.indexOf('for (let gy'));
});
test('G5 minimapa preserva indicadores de cámara y posiciones reales',()=>{
  assert.match(map,/mapX\(cam\.x\), cy=mapY\(cam\.y\)/);
  assert.match(map,/for \(const ch of characters\) marker/);
});
