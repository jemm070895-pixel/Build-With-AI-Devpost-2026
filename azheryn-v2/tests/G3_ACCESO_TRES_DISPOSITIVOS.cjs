const fs=require('node:fs');const assert=require('node:assert/strict');
const launcher=fs.readFileSync('JUGAR_EN_LAPTOP_TABLET_TELEFONO.bat','utf8');
const guide=fs.readFileSync('GUIA_JUGAR_TRES_DISPOSITIVOS.txt','utf8');
assert.match(launcher,/--host 0\.0\.0\.0 --port 5173 --strictPort/);
assert.match(launcher,/npm ci/);
assert.match(guide,/mismo Wi-Fi/);
assert.match(guide,/Exportar\/Importar/);
assert.match(guide,/redes privadas/);
console.log('G3 acceso por LAN: OK');
