const fs = require('node:fs');
const assert = require('node:assert/strict');
const launcher = fs.readFileSync('JUGAR_EN_LAPTOP_TABLET_TELEFONO.bat','utf8');
assert(launcher.includes('call npm run build'));
assert(launcher.includes('if not exist "dist\\index.html"'));
assert(launcher.indexOf('call npm run build') < launcher.indexOf('call npm run preview'));
assert(launcher.includes('if errorlevel 1'));
console.log('OK: lanzador compila antes de servir a los tres dispositivos');
