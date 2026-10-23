const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('el render principal comparte una instantánea climática para iluminación y atmósfera', () => {
  const start = source.indexOf('    const draw = () => {');
  const end = source.indexOf('    // Stop both carriers', start);
  const render = source.slice(start, end);
  assert.equal((render.match(/climateClock\.snapshot\(\)/g) || []).length, 1);
  assert.match(render, /const daylight = g3Weather/);
  assert.match(render, /const cs = g3Weather/);
});
