const assert=require('node:assert/strict');
const fs=require('node:fs');
const view=fs.readFileSync('src/ui/WorldView.tsx','utf8');
const css=fs.readFileSync('src/index.css','utf8');
for(const phrase of ['g3-guide','Seleccionar 7 guardias','Marcar acopio','Colocar almacén','Ordenar tala','Cancelar orden','setShowGuide'])assert.ok(view.includes(phrase),phrase);
assert.ok(css.includes('.g3-guide-actions'));
console.log('G3 guide: OK');
