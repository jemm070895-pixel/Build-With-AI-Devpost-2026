const fs = require('node:fs');
const assert = require('node:assert/strict');
const source = fs.readFileSync(require('node:path').join(__dirname, '../src/world/renderer.ts'), 'utf8');
assert.match(source, /a >= 7 && depth > 0\.012/);
assert.match(source, /hash2\(i, j, seed \+ 2417\) < 0\.065/);
assert.match(source, /ctx\.lineWidth = lw;/);
console.log('G4 water reflection LOD safeguards OK');
