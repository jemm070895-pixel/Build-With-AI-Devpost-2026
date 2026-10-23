const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('campfire pulse and sparks use a shared motion-aware clock', () => {
  assert.match(source, /const fireTime = reducedMotionFrame \? 0 : wildlifeSimulationSeconds \* 1000/);
  assert.match(source, /Math\.sin\(fireTime\/270\)/);
  assert.match(source, /const flicker=fireTime\/330/);
});
test('campfire smoke and atmospheric effects freeze when reduced motion is enabled', () => {
  assert.match(source, /const smokeTime=\(reducedMotionFrame \? 0 : wildlifeSimulationSeconds\)\/1\.8/);
  assert.match(source, /const now=reducedMotionFrame \? 0 : wildlifeSimulationSeconds/);
});
