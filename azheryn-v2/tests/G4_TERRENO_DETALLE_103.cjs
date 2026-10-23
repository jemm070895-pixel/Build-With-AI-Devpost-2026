const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('vegetation detail only at high zoom, deterministic seed',()=>{
  assert.match(source,/if \(z >= 1\.35\)/);
  assert.match(source,/if \(!wetDetail && z >= 1\.55 && seed % 11 === 2\)/);
  assert.match(source,/const seed=\(\(gx\*73856093\)\^\(gy\*19349663\)\)>>>0/);
});
test('rain drawing balances save and restore',()=>{
  const rain=source.split('if(rain>.12){')[1].split('// G3 wildlife')[0];
  assert.equal((rain.match(/ctx\.save\(\)/g)||[]).length,1);
  assert.equal((rain.match(/ctx\.restore\(\)/g)||[]).length,1);
});
