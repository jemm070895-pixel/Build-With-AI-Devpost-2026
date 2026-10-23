const fs=require('node:fs');const assert=require('node:assert/strict');
const s=fs.readFileSync('src/ui/WorldView.tsx','utf8');
const handler=s.slice(s.indexOf('const onPointerUp ='),s.indexOf('const onWheel ='));
assert.match(handler,/e\.type!=="pointercancel"/,'Cancelación táctil no debe dar órdenes');
assert.match(handler,/if\(e\.type === "pointercancel"\)\s*\{\s*resetInterruptedGestures\(\)/,'Cancelación de ratón/lápiz no debe completar selección');
console.log('G3: interrupciones de puntero seguras');
