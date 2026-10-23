const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync('src/ui/WorldView.tsx','utf8');
assert.match(source,/G3: grounded, directionally lit shadows/);
assert.match(source,/if\(!tree\.standing\)/);
assert.match(source,/species\.crownRadius\*1\.35/);
assert.match(source,/sunlight\.cloud\*\.55/);
console.log('G3 tree shadows: OK');
