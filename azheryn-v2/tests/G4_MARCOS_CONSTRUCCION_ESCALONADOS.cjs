const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('refuerzos diagonales dependen de troncos realmente instalados',()=>{
  assert.match(source,/installed >= 24 && scale >= \.55/);
  assert.match(source,/Math\.min\(4, Math\.floor\(\(installed - 16\) \/ 12\)\)/);
  assert.match(source,/ctx\.lineTo\(sideX \+ slant, lowerY\)/);
});
test('no modifica contabilidad de materiales ni etapas de techo',()=>{
  assert.match(source,/const roofUnits=Math\.max\(0,Math\.min\(25,installed-66\)\)/);
  assert.match(source,/const wallUnits=Math\.min\(installed,66\)/);
});
