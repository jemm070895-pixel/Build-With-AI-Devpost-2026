const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const src = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
const canopy = src.split('const drawG4CanopyLight =')[1].split('const drawG3Atmosphere =')[0];
test('Reduced motion freezes canopy light rays without removing them', () => {
  assert.match(canopy, /const phase = reducedMotionFrame \? 0 : wildlifeSimulationSeconds\/12/);
  assert.doesNotMatch(canopy, /width < 480 \|\| reducedMotionFrame/);
});
test('Canopy rays remain bounded by brightness, cloud cover, and viewport', () => {
  assert.match(canopy, /light < \.45 \|\| cloud > \.75 \|\| width < 480/);
  assert.match(canopy, /Math\.min\(\.055/);
});
