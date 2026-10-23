const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('src/ui/WorldView.tsx','utf8');
assert.match(source,/pendingLoggingZone\?:/);
assert.match(source,/if\(ch\.needTrip \|\| ch\.resting\)/);
assert.match(source,/ch\.pendingLoggingZone=\{x:p\.x,y:p\.y\}/);
assert.match(source,/if\(ch\.pendingLoggingZone && !ch\.order\)/);
assert.match(source,/worker\.pendingLoggingZone=undefined/);
console.log('PASS: órdenes de zona diferidas y cancelables');
