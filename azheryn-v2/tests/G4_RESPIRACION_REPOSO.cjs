const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('respiración solo en inactividad, sin afectar trabajo o transporte',()=>{
  assert.match(source,/const idleBreathing = !moving && !working && !building && !hauling/);
  assert.match(source,/const breath = idleBreathing \? Math\.sin\(phase \* \.12 \+ guardIndex \* \.7\) \* \.24 : 0/);
});
test('guardia descansando inclina cabeza y detalles faciales acompañan movimiento',()=>{
  assert.match(source,/const headDip = !ch\.mui && ch\.resting \? 1\.25 : 0/);
  assert.match(source,/const headY = -27 \+ headDip \+ breath/);
  assert.match(source,/s\.y\+expressiveHeadY\*z/);
  assert.match(source,/expressiveHeadY\+2\.4/);
});
