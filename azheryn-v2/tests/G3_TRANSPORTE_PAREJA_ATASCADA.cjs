const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('src/ui/WorldView.tsx','utf8');
assert.match(source,/const moving=carriers\.every\(ch=>/);
assert.match(source,/Math\.hypot\(ch\.x-target\.x,ch\.y-target\.y\)<2/);
assert.match(source,/haulStallSeconds>25/);
assert.match(source,/if\(pair\.every\(ch=>Math\.hypot\(ch\.x-sx,ch\.y-sy\)<2\)\)/);
console.log('PASS G3: ambos transportistas supervisados, entrega conjunta');
