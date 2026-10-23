const fs = require('node:fs');
const assert = require('node:assert/strict');
const bat = fs.readFileSync('COMPROBAR_G3_SIN_ABRIR_JUEGO.bat','utf8');
for (const part of ['react\\jsx-runtime.js','typescript\\bin\\tsc',':install_deps',':compile_g3','npm ci fallo']) assert.ok(bat.includes(part), part);
console.log('OK diagnostico de dependencias');
