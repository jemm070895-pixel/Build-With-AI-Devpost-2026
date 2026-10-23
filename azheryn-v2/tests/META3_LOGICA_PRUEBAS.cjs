const assert=require('node:assert/strict'); const w=require(process.argv[2] || './work.cjs'); let n=0; const test=(name,fn)=>{fn();n++;console.log('OK',name)};
test('slots stay within default stockpile',()=>{const s=w.createOutdoorStockpile(0,0);for(let i=0;i<200;i++){const p=w.stockpileSlot(s,i);assert.ok(Math.hypot(p.x,p.y)<s.radius,`slot ${i}`)}});
test('slots stay within small stockpile',()=>{const s=w.createOutdoorStockpile(10,10,9);for(let i=0;i<200;i++){const p=w.stockpileSlot(s,i);assert.ok(Math.hypot(p.x-10,p.y-10)<s.radius)}});
test('distant logs do not deadlock',()=>{assert.equal(w.g1CanJoinHaul(0,0,181,0),true);assert.equal(w.g1CanJoinHaul(0,0,1800,0),true)});
test('fatigued worker refuses',()=>{const p={...w.G1_FOUNDING_WORK_PROFILES[0],fatigue:w.G1_FOUNDING_WORK_PROFILES[0].fatigueLimit-1};assert.equal(w.g1CanJoinHaul(0,0,0,0,p),false)});
test('hauler preference',()=>{const ids=w.chooseG1Haulers(['guard-1','guard-2','guard-3'],w.G1_FOUNDING_WORK_PROFILES);assert.equal(ids.length,2);assert.ok(ids.includes('guard-2'))});
test('no solo hauling',()=>assert.deepEqual(w.chooseG1Haulers(['guard-2'],w.G1_FOUNDING_WORK_PROFILES),[]));
test('stockpile has no repeated slots for 500 logs',()=>{const s=w.createOutdoorStockpile(0,0);const positions=new Set();for(let i=0;i<500;i++){const p=w.stockpileSlot(s,i);const key=`${p.x.toFixed(5)}:${p.y.toFixed(5)}`;assert.ok(!positions.has(key),`duplicate slot ${i}`);positions.add(key)}});
console.log(`${n}/${n} pruebas dinámicas`);
