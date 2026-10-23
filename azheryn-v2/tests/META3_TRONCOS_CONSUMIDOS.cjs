const assert=require('node:assert/strict');
const fs=require('node:fs');
const src=fs.readFileSync('src/ui/WorldView.tsx','utf8');
assert.match(src,/const drawLogs = \(\) => \{\s*for \(const log of felledLogs\) \{\s*if \(log\.usedForStorehouse\) continue;/);
console.log('OK: los troncos instalados no se dibujan como disponibles');
