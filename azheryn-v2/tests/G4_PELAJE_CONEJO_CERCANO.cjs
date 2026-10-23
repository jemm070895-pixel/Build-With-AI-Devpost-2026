const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('El pelaje fino del conejo solo se dibuja de cerca y queda recortado al cuerpo',()=>{
  const start=source.indexOf('// Close-up fur strands follow the rabbit silhouette');
  const end=source.indexOf('ctx.fillStyle="#c9bcab"',start);
  assert.ok(start>0 && end>start);
  const section=source.slice(start,end);
  assert.match(section,/if \(detailed\)/);
  assert.match(section,/ctx\.clip\(\)/);
  assert.match(section,/ctx\.restore\(\)/);
});
