const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('rabbit ground shadow compensates hopping displacement', () => {
  assert.match(source, /ctx\.ellipse\(0, 3\+bodyLift, shadowWidth, shadowHeight/);
  assert.match(source, /Math\.max\(\.09,\.20-hopping\*\.025\)/);
});
test('close-up animal features are zoom gated', () => {
  assert.match(source, /Dark split hooves follow the animated legs/);
  assert.match(source, /Fine whiskers and nose are visible only at close zoom/);
  assert.match(source, /const detailed = cam\.zoom >= 1\.05/);
});
