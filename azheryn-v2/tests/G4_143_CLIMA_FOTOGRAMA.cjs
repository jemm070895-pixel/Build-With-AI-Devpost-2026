const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
const tick = source.split('    const tick = (now: number) => {')[1].split('    // G3 mobile: two-finger')[0];
test('el simulador consulta clima una sola vez por fotograma', () => {
  assert.equal((tick.match(/climateClock\.snapshot\(\)/g) || []).length, 1);
  assert.match(tick, /climateClock\.tick\(elapsed\);[\s\S]*?const frameClimate = climateClock\.snapshot\(\)/);
});
test('construcción y descanso usan el mismo estado horario', () => {
  assert.match(tick, /isNight\(frameClimate\.hour\)/);
  assert.match(tick, /shouldPauseAutonomousWork\(frameClimate\.hour/);
  assert.match(tick, /setClimate\(frameClimate\)/);
});
