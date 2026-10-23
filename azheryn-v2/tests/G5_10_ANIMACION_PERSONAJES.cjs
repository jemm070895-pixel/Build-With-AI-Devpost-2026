const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('character animation follows simulation seconds and reduced-motion preference', () => {
  assert.match(source, /const phase = reducedMotionFrame \? 0 : wildlifeSimulationSeconds \* \(1000 \/ 220\)/);
  assert.match(source, /wildlifeSimulationSeconds \+= dt/);
  assert.match(source, /const dt = elapsed \* timeSpeedRef\.current/);
});
test('character stride, construction gesture and logging swing share frozen animation phase', () => {
  assert.match(source, /const stride = moving \? Math\.sin\(phase/);
  assert.match(source, /const buildPulse = building \? Math\.sin\(phase/);
  assert.match(source, /const swing = working \? Math\.sin\(phase/);
});
