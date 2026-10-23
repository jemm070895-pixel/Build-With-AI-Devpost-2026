const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync('src/ui/WorldView.tsx', 'utf8');
assert.match(source, /const onBlur = \(\) => \{ saveGame\(\); keys\.clear\(\); resetInterruptedGestures\(\); \}/);
assert.match(source, /const onPageHide = \(\) => \{ saveGame\(\); keys\.clear\(\); \}/);
assert.match(source, /window\.addEventListener\("blur", onBlur\)/);
assert.match(source, /window\.removeEventListener\("blur", onBlur\)/);
console.log('OK: guardado al perder foco y al cerrar la página');
