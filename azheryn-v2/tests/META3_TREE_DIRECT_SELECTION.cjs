const fs=require('node:fs');const assert=require('node:assert/strict');
const s=fs.readFileSync(require('node:path').join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
for(const snippet of ['const hitTree=workTrees.filter(tree=>tree.standing)','hitTree.tree.reservedBy=worker.id','worker.treeId=hitTree.tree.id','worker.order=createLoggingOrder(hitTree.tree.x,hitTree.tree.y)','Este árbol ya está asignado','ctx.arc(s.x,s.y-20*z,13*z'])assert.ok(s.includes(snippet),`Missing ${snippet}`);
console.log('Direct tree selection static checks OK');
