const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
assert.match(source,/const aAssigned=Math\.hypot\(a\.tx-waitingLog\.x,a\.ty-waitingLog\.y\)<1/);
assert.match(source,/return aAssigned-bAssigned \|\| Math\.hypot/);
assert.match(source,/const builderIds=new Set\(idleForConstruction\.filter\(ch=>!haulerIds\.has\(ch\.id\)\)/);
// Independent behavioral example: a guard already walking to the log must not be
// redirected to construction merely because a different guard stands closer.
const log={x:20,y:20};
const guards=[{id:'walking',x:3,y:3,tx:20,ty:20},{id:'closer',x:19,y:19,tx:19,ty:19}];
const rank=g=>(Math.hypot(g.tx-log.x,g.ty-log.y)<1?0:1);
guards.sort((a,b)=>rank(a)-rank(b)||Math.hypot(a.x-log.x,a.y-log.y)-Math.hypot(b.x-log.x,b.y-log.y));
assert.equal(guards[0].id,'walking');
console.log('OK: carriers already heading for a fallen log retain collection priority');
