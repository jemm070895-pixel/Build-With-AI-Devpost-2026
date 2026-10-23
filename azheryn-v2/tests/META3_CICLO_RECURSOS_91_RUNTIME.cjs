/** Executable resource-chain regression using actual game domain functions.
 * Does not claim to simulate browser NPC AI or rendering.
 */
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const source=name=>pathToFileURL(path.resolve(__dirname,`../src/world/${name}.ts`)).href;
(async()=>{
 const work=await import(source('work'));
 const house=await import(source('storehouse'));
 const trees=Array.from({length:1000},(_,i)=>({id:`tree-${i}`,x:i%40*5,y:Math.floor(i/40)*5,standing:true,reservedBy:null}));
 const logs=[];
 const pile=work.createOutdoorStockpile(20,20);
 let site=house.createStorehouseSite(30,30);
 let consumed=0;
 for(let i=0;i<91;i++){
  const tree=work.reserveNearestWorkTree(trees,'guard-1',i%40*5,Math.floor(i/40)*5);
  assert.ok(tree);
  assert.equal(work.fellReservedWorkTree(tree,'guard-1'),true);
  assert.equal(work.fellReservedWorkTree(tree,'guard-1'),false,'cannot fell twice');
  const log=work.createFelledLog(`log-${i}`,tree.x,tree.y);
  assert.equal(log.transportersRequired,2);
  logs.push(log);
  log.stockpiled=true;log.x=pile.x;log.y=pile.y;
  const next=house.commitStorehouseLogs(site,logs.filter(l=>l.stockpiled&&!l.usedForStorehouse).length,3);
  const delta=next.committed-site.committed;
  assert.ok(delta>=0&&delta<=1);
  for(const ready of logs.filter(l=>l.stockpiled&&!l.usedForStorehouse).slice(0,delta))ready.usedForStorehouse=true;
  consumed+=delta;site=next;
 }
 assert.equal(site.committed,91);
 assert.equal(site.complete,true);
 assert.equal(consumed,91);
 assert.equal(logs.filter(l=>l.usedForStorehouse).length,91);
 assert.equal(trees.filter(t=>!t.standing).length,91);
 assert.equal(trees.filter(t=>t.standing).length,909);
 const snapshot=JSON.parse(JSON.stringify({trees,logs,pile,site}));
 assert.equal(snapshot.site.committed,91);
 assert.equal(snapshot.logs.filter(l=>l.usedForStorehouse).length,91);
 console.log('OK: real domain resource chain 91 unique trees -> 91 logs -> stockpile -> 91/91 construction; serialized state intact');
})().catch(e=>{console.error(e);process.exitCode=1});
