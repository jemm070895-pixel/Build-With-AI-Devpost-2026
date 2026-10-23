const test=require('node:test');
const assert=require('node:assert/strict');
const {fruitPositionsForTreeId}=require('../src/world/treeFruits.ts');
test('fruit positions reuse the same immutable geometry on repeated renders',()=>{
 const a=fruitPositionsForTreeId('cache-tree-a');
 assert.strictEqual(a,fruitPositionsForTreeId('cache-tree-a'));
 assert.ok(Object.isFrozen(a));
 assert.ok(a.every(Object.isFrozen));
});
test('bounded cache eviction preserves deterministic fruit placement',()=>{
 const original=fruitPositionsForTreeId('cache-tree-evict');
 for(let i=0;i<600;i++)fruitPositionsForTreeId(`cache-bulk-${i}`);
 const again=fruitPositionsForTreeId('cache-tree-evict');
 assert.deepEqual(again,original);
 assert.notStrictEqual(again,original);
});
