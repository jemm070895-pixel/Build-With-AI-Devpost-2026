const fs=require('node:fs');const assert=require('node:assert/strict');
const src=fs.readFileSync('src/ui/WorldView.tsx','utf8');
assert.match(src,/characters\.forEach\(ch => ch\.selected = ch\.id === hit!\.id\)/);
assert.match(src,/else if \(e\.shiftKey\) \{\s*hit\.selected = !hit\.selected/);
assert.doesNotMatch(src,/hit\.selected = !wasSelected/);
console.log('OK: clic normal mantiene la unidad seleccionada; Shift alterna selección.');
