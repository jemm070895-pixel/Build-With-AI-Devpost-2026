const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const src = fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('las plumas primarias siguen el batido de las alas solo de cerca',()=>{
  assert.match(src,/if \(detailed\) \{\s*ctx\.strokeStyle="rgba\(222,205,164,\.88\)"/);
  assert.match(src,/for \(let feather=0;feather<4;feather\+\+\)/);
  assert.match(src,/wingY=-12-flap\*\(4\+feather\*1\.15\)/);
});
