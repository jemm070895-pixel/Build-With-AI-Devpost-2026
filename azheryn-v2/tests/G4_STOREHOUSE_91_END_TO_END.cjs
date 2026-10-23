const assert=require('node:assert/strict');
const {STOREHOUSE_G1,createStorehouseSite,commitStorehouseLogs,storehouseProgress}=require('../src/world/storehouse.ts');
assert.equal(STOREHOUSE_G1.logsRequired,91);
let site=createStorehouseSite(10,20);
for(let i=0;i<91;i++){
  site=commitStorehouseLogs(site,1,2);
  assert.equal(site.committed,i,'No construction without sufficient elapsed work time');
  site=commitStorehouseLogs(site,1,1);
  assert.equal(site.committed,i+1);
  assert.equal(site.complete,i===90);
}
assert.deepEqual(storehouseProgress(0,site.committed).remaining,0);
assert.equal(commitStorehouseLogs(site,100,999).committed,91);
const corrupt=commitStorehouseLogs({...createStorehouseSite(0,0),committed:90,progressSeconds:Infinity},1,3);
assert.equal(corrupt.committed,91);
assert.equal(corrupt.complete,true);
console.log('91/91 incremental construction, cap, completion and damaged progress validated');
