const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const src = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
const rain = src.slice(src.indexOf('const rainFrameTime ='), src.indexOf('dirty = true;', src.indexOf('const rainFrameTime =')));
test('Rain draws all streaks in one batched canvas path', () => {
  assert.match(rain, /ctx\.beginPath\(\);\s*for \(let i = 0; i < count; i\+\+\)/);
  assert.match(rain, /ctx\.lineTo\(x - 5, y \+ 11\);\s*}\s*ctx\.stroke\(\)/);
});
test('Rain loop does not repeatedly stroke the canvas', () => {
  const loop = rain.slice(rain.indexOf('for (let i = 0; i < count; i++)'), rain.lastIndexOf('ctx.stroke();'));
  assert.doesNotMatch(loop, /ctx\.stroke\(\)/);
  assert.doesNotMatch(loop, /performance\.now\(\)/);
});
