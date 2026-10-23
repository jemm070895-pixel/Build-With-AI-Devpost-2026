const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('wildlife ground shadows respond to sunlight and cloud cover', () => {
  assert.match(source, /const drawPeacefulWildlife = \(wildlifeLight: ReturnType<typeof climateClock.snapshot>\) =>/);
  assert.match(source, /wildlifeLight\.light \* \(1 - wildlifeLight\.cloud \* \.6\)/);
  assert.match(source, /shadowAlpha \* wildlifeShadowLight/);
});
test('climate is sampled once before iterating animals', () => {
  assert.ok(source.indexOf('const drawPeacefulWildlife = (wildlifeLight: ReturnType<typeof climateClock.snapshot>) =>') < source.indexOf('for (const animal of PEACEFUL_ANIMALS)'));
});
