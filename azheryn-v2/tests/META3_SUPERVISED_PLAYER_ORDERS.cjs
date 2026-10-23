const fs=require('node:fs');const assert=require('node:assert/strict');const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
assert.match(source,/Observations are informational only/);
assert.doesNotMatch(source,/listener\.order=createLoggingOrder/);
assert.match(source,/reserveNearestTreeInZone/);
assert.match(source,/azheryn-log-order/);
console.log('OK: tala iniciada por órdenes del jugador; conocimiento solo informativo');
