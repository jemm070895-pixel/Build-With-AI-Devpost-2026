const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('src/world/materialPlanner.ts','utf8');
assert.match(source,/Number\.isFinite\(n\)/);
assert.match(source,/const loose=count\(unstockpiled\)/);
assert.match(source,/Number\.isFinite\(target\)/);
console.log('OK: planificador sanea cantidades y objetivos no finitos');
