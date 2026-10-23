const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('reeds are restricted to wet terrain, near camera and stable seeded cells', () => {
  assert.match(source, /wetDetail && z >= 1\.15 && seed % 7 === 2/);
  assert.match(source, /if\(!detailTile\|\|detailTile\.water\)continue;/);
});
test('dry leaf details do not appear in wet soil', () => {
  assert.match(source, /!wetDetail && z >= 1\.55 && seed % 11 === 2/);
});
