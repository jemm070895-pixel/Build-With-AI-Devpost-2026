const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {fruitPositionsForTreeId}=require('../src/world/treeFruits.ts');
test('fruits remain within canopy and are deterministic',()=>{
 for(let i=0;i<200;i++){
  const id=`tree-${i}`;const p=fruitPositionsForTreeId(id);
  assert.deepEqual(p,fruitPositionsForTreeId(id));assert.ok(p.length>=3&&p.length<=5);
  for(const [x,y] of p){assert.ok(Number.isFinite(x)&&Number.isFinite(y));assert.ok(Math.abs(x)<=.52&&Math.abs(y)<=.39)}
 }
});
test('renderer uses tree-specific fruit placement',()=>{
 const source=fs.readFileSync(require('node:path').join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
 assert.match(source,/fruitPositionsForTreeId\(tree\.id\)/);
 assert.doesNotMatch(source,/for\(const \[dx,dy\] of \[\[-\.65/);
});
