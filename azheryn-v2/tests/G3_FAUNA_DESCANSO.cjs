const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync('src/world/peacefulWildlife.ts','utf8');
assert.match(source,/const rest = Math.max\(0, Math.sin\(cycle \* \.55\)\)/);
assert.match(source,/const travel = 1 - rest \* rest/);
assert.match(source,/animalAvoidance/);
console.log('PASS G3 fauna: descanso y movimiento suave');
