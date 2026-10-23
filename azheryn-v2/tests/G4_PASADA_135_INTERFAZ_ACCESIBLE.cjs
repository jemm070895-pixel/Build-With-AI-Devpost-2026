const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const view = fs.readFileSync(path.join(root, 'src/ui/WorldView.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');
test('storehouse progress has bilingual accessible name and real log count', () => {
  assert.match(view, /aria-label=\{t\("Progreso de construcción del almacén", "Storehouse construction progress"\)\}/);
  assert.match(view, /aria-valuetext=\{`\$\{buildingProgress.committed\} \/ \$\{STOREHOUSE_G1.logsRequired\}/);
});
test('keyboard focus and reduced motion are styled for world controls', () => {
  assert.match(css, /\.world button:focus-visible/);
  assert.match(css, /outline: 3px solid #ffe4a3/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});
