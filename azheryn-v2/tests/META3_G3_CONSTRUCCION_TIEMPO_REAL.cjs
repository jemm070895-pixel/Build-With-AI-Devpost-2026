const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
(async()=>{
 const {createStorehouseSite,commitStorehouseLogs}=await import(pathToFileURL(path.resolve(__dirname,'../src/world/storehouse.ts')).href);
 let site=createStorehouseSite(0,0);
 site=commitStorehouseLogs(site,1,300);
 assert.equal(site.committed,1);
 assert.equal(site.progressSeconds,0,'cannot bank 297 seconds of labor for future logs');
 site=commitStorehouseLogs(site,1,1);
 assert.equal(site.committed,1,'newly delivered log requires new construction time');
 site=commitStorehouseLogs(site,1,2);
 assert.equal(site.committed,2);
 assert.equal(commitStorehouseLogs(site,0,500).committed,2);
 console.log('OK: construction labor cannot be banked beyond available material');
})().catch(e=>{console.error(e);process.exitCode=1});
