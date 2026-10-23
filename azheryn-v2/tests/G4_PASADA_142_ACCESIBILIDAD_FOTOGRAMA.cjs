const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('all reduced-motion visual effects share one snapshot per paint', () => {
  assert.match(source, /let reducedMotionFrame = false/);
  assert.match(source, /const draw = \(\) => \{\s*reducedMotionFrame = window\.matchMedia\("\(prefers-reduced-motion: reduce\)"\)\.matches/);
  assert.equal((source.match(/window\.matchMedia\("\(prefers-reduced-motion: reduce\)"\)\.matches/g) || []).length, 1);
});
test('weather, wildlife, river and rain use shared motion preference', () => {
  for (const name of ['reduceWildlifeMotion', 'reduceWeatherMotion', 'reduceRainMotion'])
    assert.match(source, new RegExp(`const ${name} = reducedMotionFrame`));
  assert.match(source, /const reduced=reducedMotionFrame/);
});
