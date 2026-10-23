const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=fs.readFileSync('src/world/peacefulWildlife.ts','utf8');
const view=fs.readFileSync('src/ui/WorldView.tsx','utf8');
assert.match(ts,/PEACEFUL_ANIMALS/);
assert.equal((ts.match(/id: "(?:deer|rabbit|bird)-\d+"/g)||[]).length,6);
assert.match(view,/drawPeacefulWildlife\(g3Weather\)/);
assert.match(view,/Objetivo: marca un acopio/);
console.log('G3 fauna e interfaz: OK');
