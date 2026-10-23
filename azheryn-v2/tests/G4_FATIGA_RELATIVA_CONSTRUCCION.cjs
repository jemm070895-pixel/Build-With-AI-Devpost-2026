const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/world/socialLife.ts'),'utf8');
const match=src.match(/export function autonomousConstructionDecision\([^]*?\n\}/);
assert.ok(match,'decision function exists');
const fn=new Function(match[0].replace('export function autonomousConstructionDecision(fatigue:number, fatigueLimit:number, explicitlyOrdered:boolean):\'build\'|\'recover\'','function autonomousConstructionDecision(fatigue, fatigueLimit, explicitlyOrdered)')+'\nreturn autonomousConstructionDecision;')();
test('construction fatigue uses worker-specific limit, not raw seconds',()=>{
 assert.equal(fn(85,900,false),'build');
 assert.equal(fn(764,900,false),'build');
 assert.equal(fn(765,900,false),'recover');
 assert.equal(fn(850,1000,false),'recover');
});
test('direct orders remain authoritative and malformed limits do not block work',()=>{
 assert.equal(fn(900,900,true),'build');
 assert.equal(fn(900,0,false),'build');
 assert.equal(fn(NaN,900,false),'build');
});
