const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('personajes y árboles usan el mismo sentido solar de mañana a tarde', () => {
  assert.match(source, /const shadowX=\(1-2\*solarProgress\)\*13\*z/);
  assert.match(source, /const shadowDx = \(1 - 2 \* characterSolarProgress\) \* 11 \* z/);
  assert.match(source, /const characterSolarProgress = Math\.max\(0, Math\.min\(1, \(characterSolarHour - 6\) \/ 12\)\)/);
});
test('construcción nocturna usa el mismo reloj que la sombra del personaje', () => {
  assert.match(source, /!isNight\(characterSun\.hour\) && !ch\.mui/);
  assert.doesNotMatch(source, /!isNight\(climateClock\.snapshot\(\)\.hour\) && !ch\.mui/);
});
