const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('ciervo: orejas y garganta detalladas solo con camara cercana',()=>{
  assert.match(source,/Separate ear tips and a pale throat/);
  assert.match(source,/ctx\.quadraticCurveTo\(10,-15,8,-14\)/);
  assert.match(source,/if \(detailed\) \{\s*\/\/ Separate ear tips/);
});
test('ave: plumas de cola sujetas al cuerpo solo de cerca',()=>{
  assert.match(source,/Short fan-shaped tail feathers remain attached/);
  assert.match(source,/for \(const tail of \[-2,0,2\]\)/);
  assert.match(source,/if \(detailed\) \{\s*\/\/ Short fan-shaped/);
});
