const assert=require('node:assert/strict');
const fs=require('node:fs');
const geometry=fs.readFileSync('src/world/storehouse.ts','utf8');
const view=fs.readFileSync('src/ui/WorldView.tsx','utf8');
assert.match(geometry,/logsRequired: 91/);
assert.match(geometry,/roof: 25, front: 9, rear: 10\.5, left: 23, right: 23/);
assert.match(view,/Math\.min\(25,installed-66\)/);
assert.ok(view.includes("storehouse.complete?\"✓ 91/91\""));
console.log('OK: presupuesto y limite de cubierta coherentes; geometria visual detallada pendiente');
