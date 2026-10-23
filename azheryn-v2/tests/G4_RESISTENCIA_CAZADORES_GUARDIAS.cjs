const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/world/work.ts'),'utf8');
test('los siete cazadores y guardias tienen resistencia elevada y diferenciada',()=>{
 const profiles=[...src.matchAll(/characterId: "guard-(\d)"[^\n]*?fatigueLimit: (\d+)/g)];
 assert.equal(profiles.length,7);
 for(const [,id,limit] of profiles){assert.ok(Number(limit)>=1900,`guardia ${id} se fatiga demasiado pronto`);}
 assert.ok(new Set(profiles.map(p=>p[2])).size>=5);
});
test('la fatiga sigue avanzando con el trabajo y conserva umbrales proporcionales',()=>{
 assert.match(src,/fatigue \+ Math\.max\(0, workingSeconds\)/);
 assert.match(src,/const ratio = profile\.fatigue \/ profile\.fatigueLimit/);
});
