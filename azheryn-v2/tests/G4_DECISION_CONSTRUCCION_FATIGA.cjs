const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const social=fs.readFileSync(path.join(__dirname,'../src/world/socialLife.ts'),'utf8');
const world=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('fatiga extrema excluye solamente de construcción autónoma',()=>{
 assert.match(social,/ratio >= 0\.85 \? 'recover' : 'build'/);
 assert.match(social,/if \(explicitlyOrdered\) return 'build'/);
 assert.ok(world.includes('autonomousConstructionDecision(ch.fatigue?.fatigue ?? 0,ch.fatigue?.fatigueLimit ?? 0,false)==="build"'));
});
