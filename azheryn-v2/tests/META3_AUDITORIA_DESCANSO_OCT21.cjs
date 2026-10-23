const assert=require('node:assert/strict');
const fs=require('node:fs');
const src=fs.readFileSync(new URL('../src/ui/WorldView.tsx',`file://${__filename}`),'utf8');
assert.match(src,/ch\.resting=true;ch\.tx=ch\.x;ch\.ty=ch\.y;dirty=true;continue;/);
assert.match(src,/if\(ch\.order\)ch\.previousOrder=ch\.order/);
assert.match(src,/if\(haul\?\.workerIds\.includes\(ch\.id\)\) cancelHaul\(\)/);
assert.match(src,/if\(ch\.order\)releaseTree\(ch\)/);
console.log('4/4 comprobaciones de descanso y cancelación correctas');
