const fs=require('node:fs');const assert=require('node:assert/strict');
const s=fs.readFileSync('src/ui/WorldView.tsx','utf8');
assert.match(s,/const drawCarriedLog = \(\) =>/);
assert.match(s,/haul\?\.active \|\| haul.phase !== "delivering"/);
assert.match(s,/drawCarriedLog\(\)/);
assert.match(s,/if \(!hauling\) \{/);
console.log('G2 carried log rendering: OK');
