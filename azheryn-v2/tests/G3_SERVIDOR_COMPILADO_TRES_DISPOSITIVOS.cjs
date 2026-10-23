const fs = require('node:fs');
const assert = require('node:assert/strict');
const launcher = fs.readFileSync('JUGAR_EN_LAPTOP_TABLET_TELEFONO.bat','utf8');
assert.match(launcher, /call npm run build/);
assert.match(launcher, /if errorlevel 1 \(/);
assert.match(launcher, /if not exist "dist\\index.html"/);
assert.match(launcher, /call npm run preview -- --host 0\.0\.0\.0 --port 5173 --strictPort/);
assert.doesNotMatch(launcher, /call npm run dev --/);
console.log('OK: servidor de produccion para tres dispositivos');
