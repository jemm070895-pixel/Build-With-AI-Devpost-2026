const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {stableTreeSeed,fruitForTreeId,fruitPositionsForTreeId}=require('../src/world/treeFruits.ts');
test('textual tree IDs have deterministic distinct visual seeds',()=>{
  const ids=['alpha','beta','gamma','tree-a1','tree-b1'];
  assert.equal(new Set(ids.map(stableTreeSeed)).size,ids.length);
  for(const id of ids){assert.equal(stableTreeSeed(id),stableTreeSeed(id));assert.equal(fruitForTreeId(id),fruitForTreeId(id));assert.deepEqual(fruitPositionsForTreeId(id),fruitPositionsForTreeId(id));}
});
test('tree canopy and fruits share the same stable ID hashing method',()=>{
  const view=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
  assert.match(view,/const seed = stableTreeSeed\(tree\.id\)/);
  assert.doesNotMatch(view,/String\(tree\.id\)\.replace\(\/\\D\/g/);
  assert.match(view,/fruitPositionsForTreeId\(tree\.id\)/);
});
