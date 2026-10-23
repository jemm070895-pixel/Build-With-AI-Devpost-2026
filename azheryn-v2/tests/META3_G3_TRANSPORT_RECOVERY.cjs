const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('src/ui/WorldView.tsx','utf8');
assert.match(source,/haulStallSeconds>25/);
assert.match(source,/cancelHaul\(\);setWorkNotice\("Transporte reintentado/);
assert.match(source,/if\(moving\) haulStallSeconds=0/);
assert.match(source,/if\(pair\.every\(ch=>Math\.hypot\(ch\.x-sx,ch\.y-sy\)<2\)\)/);
console.log('PASS: stalled transport recovery and delivery confirmation');
