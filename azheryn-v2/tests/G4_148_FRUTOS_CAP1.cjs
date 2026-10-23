const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..','src');
const fruits=fs.readFileSync(path.join(root,'world/treeFruits.ts'),'utf8');
const view=fs.readFileSync(path.join(root,'ui/WorldView.tsx'),'utf8');
test('Capítulo 1 incluye tres frutos tropicales estables por ID',()=>{
  for(const fruit of ['Guayaba','Mango','Jobo'])assert.ok(fruits.includes(fruit));
  assert.match(fruits,/treeId\.charCodeAt/);
  assert.match(fruits,/CHAPTER1_FRUITS\[/);
});
test('Frutos visibles solo en árboles frutales en pie y con zoom suficiente',()=>{
  assert.match(view,/if\(species\.fruit && z>=\.65\)/);
  assert.match(view,/fruitForTreeId\(tree\.id\)/);
  assert.match(view,/fruit\.shape==="oval"/);
  assert.match(view,/fruit\.shape==="small"/);
});
