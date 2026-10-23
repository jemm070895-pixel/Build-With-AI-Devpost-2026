const fs=require('node:fs');const assert=require('node:assert/strict');const path=require('node:path');
const code=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
assert.match(code,/if\(ids\.length<log\.transportersRequired\)/);
assert.match(code,/candidates\.slice\(0,log\.transportersRequired\)/);
assert.match(code,/worker\.tx=log\.x;worker\.ty=log\.y/);
assert.match(code,/if\(ids\.length===log\.transportersRequired\)/);
console.log('OK: guardias libres acuden a troncos distantes antes de cargar');
