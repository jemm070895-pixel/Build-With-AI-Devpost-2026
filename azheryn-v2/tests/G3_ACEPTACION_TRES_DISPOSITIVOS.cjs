const fs=require('node:fs');
const assert=require('node:assert/strict');
const plan=fs.readFileSync('PRUEBA_FINAL_G3_TRES_DISPOSITIVOS.md','utf8');
const launcher=fs.readFileSync('REGISTRAR_PRUEBA_G3.bat','utf8');
for(const term of ['Laptop','Teléfono','Tableta','91/91','NO VALIDADO','Wi-Fi','pinza','guardar'])assert.ok(plan.toLowerCase().includes(term.toLowerCase()),`Falta ${term}`);
assert.match(launcher,/INFORME_PRUEBA_REAL_G3\.txt/);
assert.match(launcher,/PENDIENTE/);
console.log('G3: protocolo de aceptación presente; no se declara validación real');
