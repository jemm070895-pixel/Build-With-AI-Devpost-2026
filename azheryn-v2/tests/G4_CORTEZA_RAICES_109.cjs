const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('bark and root relief is camera gated and tied to real trees',()=>{
 assert.match(source,/if \(z >= 1\.05\) \{[\s\S]*?groove<3[\s\S]*?quadraticCurveTo[\s\S]*?ctx\.stroke\(\);ctx\.restore\(\);/);
 assert.ok(source.indexOf('G4: bark relief')>source.indexOf('for (const tree of workTrees)'));
 assert.ok(source.indexOf('G4: bark relief')<source.indexOf('Five shared silhouettes'));
});
