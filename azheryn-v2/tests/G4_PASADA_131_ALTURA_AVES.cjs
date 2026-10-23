const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const src = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('birds hover above terrain without moving their ground shadow', () => {
  assert.match(src, /const flightHeight = animal\.kind === "bird" \? 9/);
  assert.match(src, /const bodyLift = hopping \+ flightHeight/);
  assert.match(src, /ctx\.ellipse\(0, 3\+bodyLift/);
});
test('reduced motion freezes the decorative flight bob', () => {
  assert.match(src, /reduceWildlifeMotion \? 0 : Math\.sin\(motionTime \* 1\.8 \+ animal\.phase\)/);
});
