const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const world=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('uniones de madera visuales crecen con paredes instaladas',()=>{
 assert.ok(world.includes('const pegCount=Math.min(12,Math.floor(wallUnits/5))'));
 assert.ok(world.includes('if (installed > 0 && scale >= .65)'));
 assert.ok(world.includes('ctx.fillStyle="#c5a174"'));
});
