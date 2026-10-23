const {test}=require('node:test');
const assert=require('node:assert/strict');
const work=require('./work.cjs');
test('G5: índices de acopio corruptos no generan posiciones NaN',()=>{
 const s=work.createOutdoorStockpile(12,18);
 const first=work.stockpileSlot(s,0);
 for(const index of [NaN,Infinity,-Infinity,-4]) assert.deepEqual(work.stockpileSlot(s,index),first);
});
test('G5: radio de acopio corrupto no propaga coordenadas inválidas',()=>{
 for(const radius of [NaN,Infinity,-Infinity,-1]){
  const s=work.createOutdoorStockpile(12,18,radius);
  for(const index of [0,1,90,100]){
   const slot=work.stockpileSlot(s,index);
   assert.ok(Number.isFinite(slot.x)&&Number.isFinite(slot.y));
  }
 }
});
