const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('river highlights and canopy shafts use simulation time, not wall time', () => {
  assert.match(source, /const phase=reduced\?0:wildlifeSimulationSeconds\/1\.85/);
  assert.match(source, /const phase = reducedMotionFrame \? 0 : wildlifeSimulationSeconds\/12/);
});
test('cloud shadows, fireflies, and weather details freeze on pause and respect reduced motion', () => {
  assert.match(source, /const now=reducedMotionFrame \? 0 : wildlifeSimulationSeconds/);
  assert.match(source, /const time=reduceWeatherMotion \? 0 : wildlifeSimulationSeconds/);
  assert.match(source, /wildlifeSimulationSeconds \+= dt/);
  assert.match(source, /const dt = elapsed \* timeSpeedRef\.current/);
});
