const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ui = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '../src/index.css'), 'utf8');
test('HUD distingue almacén sin colocar, paredes, cubierta y terminado', () => {
  for (const text of ['Sin colocar','Paredes · 66 troncos','Cubierta · 25 troncos','✓ Terminado']) assert.ok(ui.includes(text));
  assert.match(ui, /buildingProgress\.committed >= 66/);
  assert.match(ui, /buildingProgress\.complete/);
});
test('Indicador de fase legible y compatible con pantallas pequeñas', () => {
  assert.match(ui, /strategy-progress-phase/);
  assert.match(css, /\.strategy-progress \.strategy-progress-phase/);
  assert.match(css, /@media\(max-width:720px\)/);
});
