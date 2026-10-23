const assert=require('node:assert/strict');
const fs=require('node:fs');
const s=fs.readFileSync('src/ui/WorldView.tsx','utf8');
const cleanup=s.slice(s.indexOf('    return () => {\n      window.clearTimeout(timer);'));
assert.ok(cleanup.includes('window.clearTimeout(timer)'));
assert.ok(!cleanup.includes('saveGame()'), 'El desmontaje no debe sobrescribir una partida restaurada');
assert.match(s,/saveElapsed >= 15/);
console.log('OK: desmontaje seguro y guardado periódico presente');
