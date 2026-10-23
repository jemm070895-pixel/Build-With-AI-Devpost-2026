const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
(async()=>{
 const {createStorehouseSite,commitStorehouseLogs,STOREHOUSE_G1}=await import(pathToFileURL(path.resolve(__dirname,'../src/world/storehouse.ts')).href);
 let site=createStorehouseSite(0,0);
 assert.equal(commitStorehouseLogs(site,10,0).committed,0,'paused game cannot build');
 assert.equal(commitStorehouseLogs(site,0,100).committed,0,'no timber cannot build');
 assert.equal(commitStorehouseLogs(site,10,2.9).committed,0,'needs three seconds per log');
 site=commitStorehouseLogs(site,1,2.9);
 assert.equal(site.committed,0);
 site=commitStorehouseLogs(site,1,0.1);
 assert.equal(site.committed,1,'fractional time accumulates');
 let consumed=1;
 for(let n=0;n<200;n++){
   const supply=91-consumed;
   const next=commitStorehouseLogs(site,supply,3);
   const delta=next.committed-site.committed;
   assert.ok(delta>=0 && delta<=supply,'never overdraw supply');
   consumed+=delta;site=next;
 }
 assert.equal(site.committed,STOREHOUSE_G1.logsRequired);
 assert.equal(consumed,91);
 assert.equal(site.complete,true);
 assert.equal(commitStorehouseLogs(site,100,100).committed,91,'finished construction stays finished');
 console.log('OK: construction invariants, pause, supply, fractional time, 91/91');
})().catch(e=>{console.error(e);process.exitCode=1});
