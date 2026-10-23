const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
const ground=src.split('const drawGroundDetail = () => {')[1].split('const drawG4WetGround')[0];
test('Hierba y piedras no se dibujan sobre el agua',()=>{
  assert.match(ground,/const detailTile=world\.tiles\[groundY\*world\.size\+groundX\]/);
  assert.match(ground,/if\(!detailTile\|\|detailTile\.water\)continue/);
});
test('Detalles de suelo no salen del mapa generado',()=>{
  assert.match(ground,/groundX<0\|\|groundY<0\|\|groundX>=world\.size\|\|groundY>=world\.size/);
  assert.match(ground,/const groundU=\(x-\(baked\?\.ox\?\?0\)\)\/14/);
});
