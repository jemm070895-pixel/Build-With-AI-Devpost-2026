const fs=require('node:fs'); const assert=require('node:assert/strict');
const s=fs.readFileSync(require('node:path').join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
assert.match(s,/idleForConstruction\]\.filter\(ch=>g1CanJoinHaul\(ch\.x,ch\.y,waitingLog\.x,waitingLog\.y,ch\.fatigue\)\)/);
assert.match(s,/!haul\?\.workerIds\.includes\(ch\.id\) && g1CanJoinHaul\(ch\.x,ch\.y,log\.x,log\.y,ch\.fatigue\)/);
assert.match(s,/const reserveForHauling=pendingCollection && !haul \? 2 : 0/);
console.log('G3 transporte: reservas y rendezvous respetan elegibilidad por fatiga');
