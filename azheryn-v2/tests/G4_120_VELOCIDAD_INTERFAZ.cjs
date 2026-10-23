const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ui=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../src/index.css'),'utf8');
test('time speed controls expose active selection and bilingual accessible names',()=>{
 assert.match(ui,/role="group" aria-label=\{t\("Velocidad del tiempo","Time speed"\)\}/);
 assert.match(ui,/aria-pressed=\{timeSpeed===s\}/);
 assert.match(ui,/Pausar simulación/);
 assert.match(ui,/Speed \${s}/);
});
test('time controls have strong selected contrast, focus and touch target',()=>{
 assert.match(css,/\.world-speed button\[aria-pressed="true"\]/);
 assert.match(css,/\.world-speed button:focus-visible/);
 assert.match(css,/@media\(pointer:coarse\)\{\.world-speed button\{min-width:44px;min-height:44px\}\}/);
});
