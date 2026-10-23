const test=require('node:test');
const assert=require('node:assert/strict');
const {fruitPositionsForTreeId}=require('../src/world/treeFruits.ts');
test('golden-angle fruit layout stays within elliptical canopy',()=>{
 for(let n=0;n<120;n++){
  const points=fruitPositionsForTreeId(`fibonacci-tree-${n}`);
  assert.ok(points.length>=3 && points.length<=5);
  for(const [x,y] of points){assert.ok(Number.isFinite(x)&&Number.isFinite(y));assert.ok((x/.49)**2+(y/(.49*.75))**2<1);}
 }
});
test('golden-angle placement has nonoverlapping points and is deterministic',()=>{
 for(let n=0;n<120;n++){
  const id=`phi-tree-${n}`;const points=fruitPositionsForTreeId(id);
  assert.strictEqual(points,fruitPositionsForTreeId(id));
  for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){
   const dx=points[i][0]-points[j][0],dy=(points[i][1]-points[j][1])/.75;
   assert.ok(Math.hypot(dx,dy)>.14,`too close: ${id}`);
  }
 }
});
