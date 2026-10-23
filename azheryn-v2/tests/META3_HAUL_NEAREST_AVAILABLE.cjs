const fs = require('node:fs');
const assert = require('node:assert/strict');
const src=fs.readFileSync(require('node:path').join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
assert.match(src,/const available=characters\.filter\([\s\S]*?g1CanJoinHaul\([\s\S]*?\.sort\(\(a,b\)=>Math\.hypot\(a\.x-log\.x,a\.y-log\.y\)-Math\.hypot\(b\.x-log\.x,b\.y-log\.y\)\);const ids=chooseG1Haulers/);
assert.match(src,/const haulerIds=new Set\(waitingLog/);
assert.match(src,/const builderIds=new Set\(idleForConstruction\.filter\(ch=>!haulerIds\.has\(ch\.id\)\)/);
console.log('OK: recogida prioriza guardias próximos y reserva constructores separados');
