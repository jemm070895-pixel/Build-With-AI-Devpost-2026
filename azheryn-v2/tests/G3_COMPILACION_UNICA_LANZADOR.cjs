const fs=require('node:fs'); const assert=require('node:assert/strict');
const launcher=fs.readFileSync('JUGAR_EN_LAPTOP_TABLET_TELEFONO.bat','utf8');
const validated=fs.readFileSync('VALIDAR_Y_ABRIR_TRES_PLATAFORMAS.bat','utf8');
assert.match(validated,/set "AZHERYN_BUILD_VERIFIED=1"/);
assert.match(validated,/call "%~dp0COMPROBAR_G3_SIN_ABRIR_JUEGO.bat"/);
assert.match(launcher,/if \/i "%AZHERYN_BUILD_VERIFIED%"=="1" if exist "dist\\index.html" goto compiled_ok/);
assert.match(launcher,/call npm run build/);
console.log('OK: inicio validado sin compilacion duplicada');
