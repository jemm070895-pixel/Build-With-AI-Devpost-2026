const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const launch = fs.readFileSync(path.join(root, 'JUGAR_EN_LAPTOP_TABLET_TELEFONO.bat'), 'utf8');
const diagnostic = fs.readFileSync(path.join(root, 'COMPROBAR_G3_SIN_ABRIR_JUEGO.bat'), 'utf8');
for (const required of ['node_modules\\.bin\\vite.cmd','node_modules\\react\\jsx-runtime.js','node_modules\\typescript\\bin\\tsc']) {
 assert.ok(launch.includes(required), `Falta verificar dependencia: ${required}`);
 assert.ok(diagnostic.includes(required), `El diagnostico no comprueba: ${required}`);
}
assert.ok(launch.includes('npm ci --no-audit --no-fund'));
assert.ok(launch.includes('goto ready_to_play'));
assert.ok(launch.includes('--host 0.0.0.0 --port 5173 --strictPort'));
assert.ok(launch.includes('NO se sincronizan'));
console.log('OK: inicio LAN detecta instalaciones incompletas y aclara limites');
