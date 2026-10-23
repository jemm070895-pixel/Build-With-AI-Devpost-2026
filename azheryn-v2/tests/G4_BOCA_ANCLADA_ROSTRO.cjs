const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('la boca acompaña los gestos de cabeza y la mirada del rostro', () => {
  assert.match(source, /const expressiveGlance = glance \+ protestShake/);
  assert.match(source, /const expressiveHeadY = headY \+ tiredNod/);
  assert.match(source, /ctx\.ellipse\(s\.x\+\(facing\*2\+expressiveGlance\)\*z,s\.y\+\(expressiveHeadY\+2\.35\)\*z/);
  assert.doesNotMatch(source, /ctx\.ellipse\(s\.x\+\(facing\*2\+glance\)\*z,s\.y\+\(headY\+2\.35\)\*z/);
});
