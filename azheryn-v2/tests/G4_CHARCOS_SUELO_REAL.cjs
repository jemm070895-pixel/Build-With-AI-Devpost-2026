const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('charcos G4 usan coordenadas del terreno generado y excluyen río',()=>{
  assert.match(src,/const projectedU=\(x-\(baked\?\.ox\?\?0\)\)\/14/);
  assert.match(src,/const tileX=Math\.round\(\(projectedU\+projectedV\)\/2\)/);
  assert.match(src,/groundTile\.water\|\|groundTile\.wet<\.18/);
});
test('charcos G4 siguen limitados por lluvia, zoom y presupuesto de dibujo',()=>{
  assert.match(src,/if \(rain < \.12 \|\| cam\.zoom < \.9\) return/);
  assert.match(src,/count<110/);
});
