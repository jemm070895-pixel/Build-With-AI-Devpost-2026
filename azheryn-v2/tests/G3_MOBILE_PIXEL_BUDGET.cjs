const fs = require('node:fs');
const assert = require('node:assert/strict');
const src=fs.readFileSync('src/ui/WorldView.tsx','utf8');
assert.match(src,/const maxPixels = 2_000_000/);
assert.match(src,/Math\.sqrt\(maxPixels \/ Math\.max\(1, width \* height\)\)/);
assert.match(src,/Math\.min\(nativeDpr, 2, pixelBudgetDpr\)/);
assert.match(src,/ctx\.setTransform\(dpr, 0, 0, dpr, 0, 0\)/);
console.log('G3 mobile pixel budget OK');
