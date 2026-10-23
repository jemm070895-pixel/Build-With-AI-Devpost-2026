/** Runtime regression of the real TypeScript construction logic, not text matching.
 * Requires Node >=22 with --experimental-strip-types.
 */
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
(async()=>{
 const {STOREHOUSE_G1,createStorehouseSite,commitStorehouseLogs,storehouseProgress}=await import(pathToFileURL(path.resolve(__dirname,'../src/world/storehouse.ts')).href);
 assert.equal(STOREHOUSE_G1.logsRequired,91);
 let site=createStorehouseSite(15,30);
 let available=91;
 for(let i=0;i<400 && !site.complete;i++){
   const next=commitStorehouseLogs(site,available,1);
   const used=next.committed-site.committed;
   assert.ok(used>=0 && used<=available);
   available-=used;
   site=next;
 }
 assert.equal(site.committed,91,'91 real whole logs installed');
 assert.equal(available,0,'no phantom or duplicated logs');
 assert.equal(site.complete,true);
 assert.equal(storehouseProgress(available,site.committed).canComplete,true);
 assert.equal(commitStorehouseLogs(site,20,50).committed,91,'cannot exceed 91');
 let interrupted=createStorehouseSite(0,0);
 interrupted=commitStorehouseLogs(interrupted,2,5);
 assert.equal(interrupted.committed,1);
 interrupted=JSON.parse(JSON.stringify(interrupted));
 interrupted=commitStorehouseLogs(interrupted,1,1);
 assert.equal(interrupted.committed,2,'partial progress survives serialization');
 assert.equal(commitStorehouseLogs(createStorehouseSite(0,0),0,100).committed,0,'no material means no construction');
 assert.equal(commitStorehouseLogs(createStorehouseSite(0,0),1,0).committed,0,'paused simulation cannot build');
 console.log('OK: real storehouse simulation reaches 91/91, consumes exact logs, saves progress, honors pause');
})().catch(e=>{console.error(e);process.exitCode=1});
