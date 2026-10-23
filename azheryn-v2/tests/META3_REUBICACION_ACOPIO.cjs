const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
const work=require(process.argv[2] || './work.cjs');
assert.match(source,/felledLogs\.filter\(log=>log\.stockpiled\)\.forEach/);
assert.match(source,/const slot=stockpileSlot\(stockpile!,index\);log\.x=slot\.x;log\.y=slot\.y/);
for(const count of [1,2,20,500]){
  const destination=work.createOutdoorStockpile(120,70);
  const logs=Array.from({length:count},(_,i)=>({x:i,y:i,stockpiled:true}));
  logs.filter(log=>log.stockpiled).forEach((log,index)=>{const slot=work.stockpileSlot(destination,index);log.x=slot.x;log.y=slot.y;});
  assert.ok(logs.every(log=>Math.hypot(log.x-120,log.y-70)<destination.radius));
}
console.log('6/6 comprobaciones de reubicación del almacén');
