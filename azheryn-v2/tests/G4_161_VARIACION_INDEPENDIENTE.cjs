const test=require('node:test');
const assert=require('node:assert/strict');
const {fruitForTreeId,fruitPositionsForTreeId}=require('../src/world/treeFruits.ts');
test('each fruit variety has independent fruit-count variation',()=>{
 const counts=new Map();
 for(let i=0;i<600;i++){const id=`orchard-${i}`;const kind=fruitForTreeId(id).id;
  if(!counts.has(kind))counts.set(kind,new Set());counts.get(kind).add(fruitPositionsForTreeId(id).length);}
 assert.deepEqual([...counts.keys()].sort(),['guava','jobo','mango']);
 for(const [kind,seen] of counts)assert.deepEqual([...seen].sort(),[3,4,5],kind);
});
test('independent fruit counts are stable across cache eviction',()=>{
 const id='orchard-persistent';const original=fruitPositionsForTreeId(id).map(p=>[...p]);
 for(let i=0;i<600;i++)fruitPositionsForTreeId(`other-${i}`);
 assert.deepEqual(fruitPositionsForTreeId(id),original);
});
