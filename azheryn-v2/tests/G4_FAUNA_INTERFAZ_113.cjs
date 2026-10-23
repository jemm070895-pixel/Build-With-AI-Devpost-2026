const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ui=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../src/index.css'),'utf8');
test('G4 wildlife has independent deer, rabbit and bird silhouettes with camera detail gating',()=>{
  assert.match(ui,/animal.kind === "deer"/);
  assert.match(ui,/animal.kind === "bird"/);
  assert.match(ui,/const detailed = cam.zoom >= 1.05/);
  assert.match(ui,/const earBob/);
  assert.match(ui,/const antler of/);
});
test('G4 HUD has accessible keyboard focus and readable numeric resource counts',()=>{
  assert.match(css,/\.strategy-main:focus-visible/);
  assert.match(css,/font-variant-numeric:tabular-nums/);
  assert.match(css,/prefers-reduced-motion:reduce/);
});
