const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
const map=src.slice(src.indexOf('const drawMinimap ='),src.indexOf('const draw = () =>'));
test('G5 almacén, acopio y fogata tienen siluetas diferenciadas',()=>{
  assert.match(map,/kind: "stockpile" \| "storehouse" \| "campfire"/);
  assert.match(map,/kind === "stockpile"\) mapCtx\.rect/);
  assert.match(map,/kind === "storehouse"\) mapCtx\.rect/);
  assert.match(map,/mapCtx\.lineTo\(px \+ 3\.5, py \+ 3\)/);
});
test('G5 los hitos se dibujan solo cuando existen y respetan el recorte',()=>{
  for (const name of ['stockpile','storehouse','campfire']) assert.ok(map.includes(`if (${name}) landmark(${name}.x, ${name}.y, "${name}")`));
  assert.ok(map.indexOf('mapCtx.clip()')<map.indexOf('const landmark ='));
  assert.ok(map.indexOf('const landmark =')<map.lastIndexOf('mapCtx.restore()'));
});
