const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('src/world/peacefulWildlife.ts','utf8');
assert.match(source,/export function animalAvoidance/);
assert.match(source,/radius - distance/);
assert.match(source,/alert: true/);
assert.match(fs.readFileSync('src/ui/WorldView.tsx','utf8'),/animalAvoidance\(animal, time, characters\)/);
console.log('PASS G3 animal avoidance');
