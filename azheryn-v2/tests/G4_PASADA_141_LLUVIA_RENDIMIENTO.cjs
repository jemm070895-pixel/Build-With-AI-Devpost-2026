const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const src = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('lluvia usa una sola lectura temporal por fotograma', () => {
  const rain = src.split('if (cs.rain > 0) {')[1].split('dirty = true;')[0];
  assert.match(rain, /const rainFrameTime = reduceRainMotion \? 0 : wildlifeSimulationSeconds \* 1000/);
  assert.match(rain, /const rainOffsetX = Math\.floor\(rainFrameTime \/ 30\) \* 11/);
  assert.match(rain, /const rainOffsetY = Math\.floor\(rainFrameTime \/ 20\) \* 17/);
  assert.equal((rain.match(/wildlifeSimulationSeconds \* 1000/g) || []).length, 1);
});
test('lluvia conserva distribución, límites y reducción de movimiento', () => {
  assert.match(src, /const x = \(i \* 97 \+ rainOffsetX\) % rainWidth/);
  assert.match(src, /const y = \(i \* 53 \+ rainOffsetY\) % rainHeight/);
  assert.match(src, /const rainFrameTime = reduceRainMotion \? 0/);
});
