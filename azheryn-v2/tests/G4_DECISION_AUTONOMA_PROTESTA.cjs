const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const social=fs.readFileSync(path.join(__dirname,'../src/world/socialLife.ts'),'utf8');
const world=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('la protesta autónoma exige resentimiento extremo y confianza baja',()=>{
 assert.ok(social.includes('resentment,0)>=95'));
 assert.ok(social.includes('trustMui,65)<=15'));
 assert.ok(social.includes("if (explicitlyOrdered || !state) return 'work'"));
});
test('la protesta excluye del trabajo colectivo sin cancelar tareas existentes',()=>{
 assert.ok(world.includes('const idleForConstruction=characters.filter('));
 assert.ok(world.includes('autonomousWorkDecision(ch.social,false)==="work"'));
 assert.ok(world.includes('autonomousWorkDecision(ch.social,false)==="protest"'));
});
