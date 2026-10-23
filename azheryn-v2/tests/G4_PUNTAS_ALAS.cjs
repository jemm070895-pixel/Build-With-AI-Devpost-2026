const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('puntas de alas con sombra solo a corta distancia',()=>{
  const start=source.indexOf('// Wing-tip shading follows the flap');
  const end=source.indexOf('const birdCoat=',start);
  assert.ok(start>0 && end>start);
  const block=source.slice(start,end);
  assert.match(block,/if \(detailed\)/);
  assert.match(block,/for \(const side of \[-1,1\]\)/);
  assert.match(block,/flap\*8/);
  assert.match(block,/ctx\.restore\(\)/);
});
