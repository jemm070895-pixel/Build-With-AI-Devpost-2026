const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ui = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('la interfaz informa progreso de paredes y cubierta sin confundir total y etapa', () => {
  assert.match(ui, /strategy-progress-detail/);
  assert.match(ui, /buildingProgress\.committed - 66/);
  assert.match(ui, /buildingProgress\.committed\)\)\}\/66/);
  assert.match(ui, /Math\.max\(0, 91 - buildingProgress\.committed\)/);
  assert.match(ui, /Math\.max\(0, 66 - buildingProgress\.committed\)/);
});
