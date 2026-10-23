const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
(async()=>{
 const {commitStorehouseLogs,createStorehouseSite}=await import(pathToFileURL(path.resolve(__dirname,'../src/world/storehouse.ts')).href);
 const base=createStorehouseSite(0,0);
 for(const corrupted of [NaN,-100,Infinity]) {
   const next=commitStorehouseLogs({...base,committed:corrupted},2,3);
   assert.equal(next.committed,1,'damaged saved progress cannot produce or remove logs');
 }
 const over=commitStorehouseLogs({...base,committed:999},10,3);
 assert.equal(over.committed,91); assert.equal(over.complete,true);
 assert.equal(commitStorehouseLogs(base,2,Infinity).committed,0);
 assert.equal(commitStorehouseLogs(base,2,-1).committed,0);
 console.log('OK: damaged construction saves normalized, no phantom logs');
})().catch(e=>{console.error(e);process.exitCode=1});
