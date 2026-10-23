const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('El descanso social convierte minutos acumulados a horas en las tres rutas',()=>{
  const calls=source.match(/restSocialState\(ch\.social \?\? initialSocialState\(\),minutes\/60\)/g)||[];
  assert.equal(calls.length,4);
  assert.doesNotMatch(source,/restSocialState\(ch\.social \?\? initialSocialState\(\),minutes\)/);
});
test('La recuperación nocturna el reposo ordinario y el reposo sin fatiga mantienen el acumulador de segundos',()=>{
  assert.equal((source.match(/ch\.socialRestSeconds-=minutes\*60/g)||[]).length,4);
});
