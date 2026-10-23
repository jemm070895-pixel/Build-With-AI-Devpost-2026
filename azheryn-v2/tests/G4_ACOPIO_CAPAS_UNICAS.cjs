const test=require('node:test');
const assert=require('node:assert/strict');
const {createOutdoorStockpile,stockpileSlot}=require('./work.cjs');
test('rectangular stockpile has 2000 unique, bounded positions',()=>{
 const s=createOutdoorStockpile(13,-7);const seen=new Set();
 for(let i=0;i<2000;i++){
  const p=stockpileSlot(s,i);const key=`${p.x.toFixed(8)}:${p.y.toFixed(8)}`;
  assert.ok(!seen.has(key),`duplicate ${i}`);seen.add(key);
  assert.ok(Math.abs(p.x-s.x)<=s.radius*.64+1e-8);
  assert.ok(Math.abs(p.y-s.y)<=s.radius*.48+1e-8);
 }
});
