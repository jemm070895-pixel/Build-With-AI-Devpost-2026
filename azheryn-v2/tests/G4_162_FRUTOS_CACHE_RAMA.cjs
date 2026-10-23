const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {fruitPositionsForTreeId}=require('../src/world/treeFruits.ts');
test('LRU retains frequently visible trees after more than 512 other insertions',()=>{
 const id='visible-fruit-tree-162';
 const first=fruitPositionsForTreeId(id);
 for(let i=0;i<650;i++){
  fruitPositionsForTreeId(`scenery-${i}`);
  if(i%64===0)assert.strictEqual(fruitPositionsForTreeId(id),first);
 }
 assert.strictEqual(fruitPositionsForTreeId(id),first);
});
test('fruit stalks attach toward canopy center and render leaves only at near zoom',()=>{
 const source=fs.readFileSync(require('node:path').join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
 assert.match(source,/const stemX=px\+\(cx-px\)\*\.20/);
 assert.match(source,/quadraticCurveTo\(px,py-3\.1\*z,px,py-z\)/);
 assert.match(source,/if\(z>=1\.05\)/);
});
