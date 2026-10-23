const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ui = fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
const css = fs.readFileSync(path.join(__dirname,'../src/index.css'),'utf8');
test('G5 minimapa utiliza agua y geometría del terreno generado, no iconos de un boceto',()=>{
  assert.match(ui,/const drawMinimap = \(now: number\)/);
  assert.match(ui,/world\.tiles\[gy \* world\.size \+ gx\]/);
  assert.match(ui,/tile\.water \? "#4d96a7"/);
  assert.match(ui,/drawMinimap\(performance\.now\(\)\)/);
});
test('G5 minimapa refleja Mui, guardias, almacén, acopio y puntos cardinales ES EN',()=>{
  assert.match(ui,/if \(stockpile\) landmark\(/);
  assert.match(ui,/if \(storehouse\) landmark\(/);
  assert.match(ui,/ch\.mui \? "#f9e6a7"/);
  assert.match(ui,/className="world-compass world-compass-map"/);
  assert.match(ui,/<span className="west">\{t\("O","W"\)\}<\/span>/);
  assert.match(css,/\.world-compass-map canvas/);
});
