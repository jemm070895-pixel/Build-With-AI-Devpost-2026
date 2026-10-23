const {test}=require('node:test');
const assert=require('node:assert/strict');
const {CHAPTER1_FRUITS,fruitForTreeId}=require('../src/world/treeFruits.ts');
test('Identificadores de árbol no numéricos conservan su fruto al recargar',()=>{
  for(const id of ['arbol-abc','UUID-xyz-89','tree-999999999999999999999999','']){
    const first=fruitForTreeId(id);
    assert.ok(CHAPTER1_FRUITS.includes(first));
    assert.equal(fruitForTreeId(id),first);
  }
});
test('IDs de árbol diversos producen las tres variedades',()=>{
  const varieties=new Set(Array.from({length:100},(_,i)=>fruitForTreeId(`tree-${i}`).id));
  assert.deepEqual([...varieties].sort(),['guava','jobo','mango']);
});
