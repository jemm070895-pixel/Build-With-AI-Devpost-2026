const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('la luz facial respeta la silueta y el nivel de zoom',()=>{
 assert.match(source,/if\(z>=1\.25\)\{[\s\S]*?ctx\.clip\(\)/);
 assert.match(source,/rgba\(255,218,166,\.16\)/);
 assert.match(source,/rgba\(65,37,28,\.16\)/);
});
test('la sombra de todos los personajes comparte una muestra climatica',()=>{
 const block=source.slice(source.indexOf('const drawCharacters = () =>'),source.indexOf('const drawCarriedLog = ()'));
 assert.equal((block.match(/climateClock\.snapshot\(\)/g)||[]).length,1);
 assert.match(block,/const characterShadowAlpha = characterDaylight/);
});
