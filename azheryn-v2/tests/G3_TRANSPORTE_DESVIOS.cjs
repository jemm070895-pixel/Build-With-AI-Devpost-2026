const fs=require('node:fs');const assert=require('node:assert/strict');
const s=fs.readFileSync('src/ui/WorldView.tsx','utf8');
assert.match(s,/haulLastPositions: Record<string/);
assert.match(s,/Math\.hypot\(ch\.x-previous\.x,ch\.y-previous\.y\)>0\.015/);
assert.match(s,/if\(moving\) haulStallSeconds=0/);
assert.match(s,/if\(haulStallSeconds>25\)/);
assert.match(s,/haulLastPositions=\{\}/);
console.log('OK G3 transporte: desvíos y reinicio de vigilancia');
