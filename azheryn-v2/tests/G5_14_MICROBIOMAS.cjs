const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const src = fs.readFileSync(require('node:path').join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('ground details use actual tile rock, wet and meadow fields', () => {
  assert.match(src, /const rockyDetail = detailTile\.rock > 0\.60/);
  assert.match(src, /const wetDetail = detailTile\.wet > 0\.70/);
  assert.match(src, /detailTile\.meadow > \.62/);
});
test('water and off-world detail rejection remains before biome drawing', () => {
  const start = src.indexOf('const drawGroundDetail =');
  const end = src.indexOf('const drawG4WetGround =', start);
  const block = src.slice(start, end);
  assert.ok(block.indexOf('if(!detailTile||detailTile.water)continue;') < block.indexOf('const rockyDetail'));
  assert.match(block, /if \(!wetDetail && seed % 13 === 1\)/);
});
