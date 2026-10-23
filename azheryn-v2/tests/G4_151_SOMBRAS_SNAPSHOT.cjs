const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
const block=source.slice(source.indexOf('const drawWorkTrees = () => {'),source.indexOf('const drawStockpile = () =>'));
test('El estado climático se captura una sola vez antes de recorrer los árboles',()=>{
 assert.equal((block.match(/climateClock\.snapshot\(\)/g)||[]).length,1);
 assert.ok(block.indexOf('const sunlight=climateClock.snapshot()')<block.indexOf('for (const tree of workTrees)'));
});
test('La orientación solar se calcula una sola vez y conserva modulación por nubes',()=>{
 assert.ok(block.indexOf('const solarProgress=')<block.indexOf('for (const tree of workTrees)'));
 assert.match(block,/sunlight\.light\*\.24\*\(1-sunlight\.cloud\*\.55\)/);
});
