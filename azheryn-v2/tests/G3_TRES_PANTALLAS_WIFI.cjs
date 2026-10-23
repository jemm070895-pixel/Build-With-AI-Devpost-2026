const fs=require('node:fs');const assert=require('node:assert/strict');
const css=fs.readFileSync('src/index.css','utf8');const bat=fs.readFileSync('JUGAR_EN_LAPTOP_TABLET_TELEFONO.bat','utf8');
assert.match(css,/max-width: 1180px\) and \(orientation: landscape/);
assert.match(css,/max-width: 720px\) and \(orientation: portrait/);
assert.match(css,/env\(safe-area-inset-bottom\)/);
assert.match(bat,/Get-NetIPAddress/);
assert.match(bat,/http:\/\//);
assert.match(bat,/npm run preview -- --host 0\.0\.0\.0/);
console.log('G3: laptop, tablet, telefono y direcciones Wi-Fi: OK');
