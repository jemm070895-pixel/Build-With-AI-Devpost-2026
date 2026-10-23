const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('Fogata y humo usan tiempo de simulación y se congelan con la pausa', () => {
  assert.match(source, /const fireTime = reducedMotionFrame \? 0 : wildlifeSimulationSeconds \* 1000/);
  assert.match(source, /const smokeTime=\(reducedMotionFrame \? 0 : wildlifeSimulationSeconds\)\/1\.8/);
});
test('La lluvia usa el mismo reloj simulado que la fauna y la vegetación', () => {
  assert.match(source, /const rainFrameTime = reduceRainMotion \? 0 : wildlifeSimulationSeconds \* 1000/);
  assert.match(source, /wildlifeSimulationSeconds \+= dt/);
});
