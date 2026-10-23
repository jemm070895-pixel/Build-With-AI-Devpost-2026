const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const s=fs.readFileSync(path.resolve(__dirname,'../src/ui/WorldView.tsx'),'utf8');
// Runtime notices are stored in Spanish and localized when rendered, so a
// language switch also updates notices already visible on screen.
for(const [es,en] of [
 ['Zona de tala agotada','Logging area exhausted'],
 ['Tala en espera: trasladar troncos al acopio','Logging paused: move logs to the stockpile'],
 ['¡Almacén construido! Capítulo 1 completado','Storehouse built! Chapter 1 completed']
]) {
 assert.ok(s.includes(`"${es}":"${en}"`),`Missing locale mapping: ${es}`);
}
assert.ok(s.includes('localizedNotice(workNotice)'), 'Notices must translate at render time');
assert.ok(!s.includes('"Zona de tala agotada / Logging area exhausted"'), 'Do not store bilingual text as a notice');
console.log('OK: live ES/EN notices for logging and construction');
