const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('personajes proyectan sombras dependientes de sol y nubosidad', () => {
  assert.match(source, /const characterSun = climateClock\.snapshot\(\)/);
  assert.match(source, /characterSolarHour - 6/);
  assert.match(source, /characterSun\.cloud \* \.65/);
  assert.match(source, /if \(characterShadowAlpha > \.012\)/);
});
test('se conserva la sombra de contacto incluso sin sol', () => {
  assert.match(source, /Contact shadow anchors each character to the terrain/);
  assert.match(source, /rgba\(15,25,15,\.30\)/);
});
