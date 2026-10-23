const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const {createStorehouseSite,commitStorehouseLogs,storehouseProgress}=await import(pathToFileURL(path.resolve(__dirname,'../src/world/storehouse.ts')).href);
 let site=createStorehouseSite(10,20),supplied=0,consumed=0;
 // 91 logs arrive in irregular batches. Building pauses when supply is exhausted.
 for(let tick=0;tick<700 && !site.complete;tick++){
   if(tick%17===0 && supplied<91)supplied+=Math.min(4,91-supplied);
   const available=supplied-consumed;
   const next=commitStorehouseLogs(site,available,1);
   const used=next.committed-site.committed;
   assert.ok(used>=0 && used<=available);
   consumed+=used;site=next;
   if(tick%29===0){site=JSON.parse(JSON.stringify(site));}
   assert.equal(site.committed,consumed);
   assert.equal(storehouseProgress(supplied-consumed,site.committed).committed,consumed);
 }
 assert.equal(site.committed,91);assert.equal(consumed,91);assert.equal(supplied,91);assert.equal(site.complete,true);
 const damaged={...createStorehouseSite(0,0),progressSeconds:NaN};
 assert.equal(commitStorehouseLogs(damaged,1,3).committed,1,'damaged save timer recovers');
 assert.equal(commitStorehouseLogs({...damaged,progressSeconds:-100},1,3).committed,1,'negative save timer recovers');
 console.log('OK: 91 logs, irregular deliveries, interrupted saves, and corrupted timers');
})().catch(e=>{console.error(e);process.exitCode=1});
