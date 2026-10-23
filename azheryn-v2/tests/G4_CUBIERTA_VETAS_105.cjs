const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('roof grain follows committed timbers and camera LOD', () => {
  assert.match(source, /const roofUnits=Math\.max\(0,Math\.min\(25,installed-66\)\)/);
  assert.match(source, /for\(let i=0;i<roofUnits;i\+\+\)\{/);
  assert.match(source, /if\(scale>=\.7\)\{/);
});
test('roof fastening pins appear only on installed timbers at close zoom', () => {
  assert.match(source, /if\(roofUnits>0 && scale>=1\)/);
  assert.match(source, /for\(const py of \[top\+5\*scale,top\+wallH-5\*scale\]\)/);
});
