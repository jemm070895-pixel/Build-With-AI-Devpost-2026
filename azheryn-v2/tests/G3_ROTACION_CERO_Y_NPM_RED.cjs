const assert = require('node:assert/strict');
const fs = require('node:fs');
const world = fs.readFileSync('src/ui/WorldView.tsx', 'utf8');
const play = fs.readFileSync('JUGAR_EN_LAPTOP_TABLET_TELEFONO.bat', 'utf8');
const check = fs.readFileSync('COMPROBAR_G3_SIN_ABRIR_JUEGO.bat', 'utf8');
assert.match(world, /if \(rect\.width < 1 \|\| rect\.height < 1\) return;/);
for (const bat of [play,check]) {
 assert.match(bat, /--fetch-retries=1 --fetch-timeout=20000/);
 assert.match(bat, /npm ci/);
}
console.log('OK: rotacion sin canvas vacio y fallo de red npm acotado');
