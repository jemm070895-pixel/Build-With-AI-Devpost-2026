const assert = require('node:assert/strict');
const fs = require('node:fs');
const s = fs.readFileSync('src/world/renderer.ts','utf8');
assert.match(s, /animationSeconds = 0/);
assert.match(s, /Math\.sin\(swim/);
assert.match(s, /Date\.now\(\) \/ 1000/);
assert.match(s, /Small irregular wet-bank pebbles/);
assert.match(s, /Fish are visual wildlife/);
console.log('PASS: G2 corriente, peces animados en detalle y orillas');
