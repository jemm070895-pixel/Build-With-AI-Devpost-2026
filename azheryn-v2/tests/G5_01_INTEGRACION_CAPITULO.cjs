const {test}=require('node:test');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const moduleAt=(name)=>import(pathToFileURL(path.resolve(__dirname,'../src/world/'+name+'.ts')).href);
test('G5: tala/acopio/construcción/guardado — 91 troncos exactos sin duplicación',async()=>{
 const {createStorehouseSite,commitStorehouseLogs,STOREHOUSE_G1}=await moduleAt('storehouse');
 const {materialPlan,supplyMilestones}=await moduleAt('materialPlanner');
 let site=createStorehouseSite(7,12), stock=0, delivered=0;
 for(let tick=0;tick<400;tick++){
   if(delivered<91 && tick%2===0){stock++;delivered++;}
   const next=commitStorehouseLogs(site,stock,3);
   const used=next.committed-site.committed;
   assert.ok(used>=0 && used<=stock);
   stock-=used;site=next;
   if(tick%17===0)site=JSON.parse(JSON.stringify(site));
   const plan=materialPlan(site.committed,stock,0,false);
   assert.equal(plan.remaining,91-site.committed);
   assert.equal(plan.toGather,Math.max(0,91-site.committed-stock));
   const milestones=supplyMilestones(site.committed,stock,0,false);
   assert.ok(milestones.builtPct<=milestones.readyPct);
   if(site.complete)break;
 }
 assert.equal(site.committed,STOREHOUSE_G1.logsRequired);
 assert.equal(delivered,91);assert.equal(stock,0);assert.equal(site.complete,true);

});
test('G5: objetivos dañados no desincronizan planificación e indicadores',async()=>{
 const {materialPlan,supplyMilestones}=await moduleAt('materialPlanner');
 for(const target of [NaN,Infinity,-Infinity,0,-4,1,91,101.9]){
   const plan=materialPlan(0,0,0,false,target);
   const milestones=supplyMilestones(0,0,0,false,target);
   assert.equal(milestones.needsLogging,plan.toGather>0);
   assert.equal(milestones.builtPct,0);
   assert.equal(milestones.readyPct,0);
   assert.equal(milestones.securedPct,0);
   assert.ok(plan.remaining>=1);
 }
 assert.equal(materialPlan(0,0,0,false,NaN).remaining,91);
});
