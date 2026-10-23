const {test}=require('node:test');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const load=()=>import(pathToFileURL(path.resolve(__dirname,'../src/world/storehouse.ts')).href);
test('G5: obra incompleta con bandera complete dañada se puede reanudar',async()=>{
 const {commitStorehouseLogs,createStorehouseSite}=await load();
 const damaged={...createStorehouseSite(1,2),committed:90,complete:true};
 const recovered=commitStorehouseLogs(damaged,1,3);
 assert.equal(recovered.committed,91);
 assert.equal(recovered.complete,true);
 assert.equal(damaged.committed,90);
});
test('G5: contador de troncos prevalece ante bandera falsa y se sanea aun pausado',async()=>{
 const {commitStorehouseLogs,createStorehouseSite}=await load();
 const done={...createStorehouseSite(0,0),committed:91,complete:false};
 assert.deepEqual([commitStorehouseLogs(done,0,0).committed,commitStorehouseLogs(done,0,0).complete],[91,true]);
 const incomplete={...createStorehouseSite(0,0),committed:NaN,complete:true};
 const fixed=commitStorehouseLogs(incomplete,0,0);
 assert.equal(fixed.committed,0);assert.equal(fixed.complete,false);
});
