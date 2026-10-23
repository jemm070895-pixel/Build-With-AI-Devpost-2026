const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/world/renderer.ts'), 'utf8');
assert.match(source, /G4: sparse forest-floor leaf litter/);
assert.match(source, /!water && a >= 6 && F\.forest > 0\.48/);
assert.match(source, /hash2\(i, j, seed \+ 3301\)/);
assert.match(source, /ctx\.ellipse\(lx, ly, leafSize/);
console.log('G4 forest floor detail: OK');
