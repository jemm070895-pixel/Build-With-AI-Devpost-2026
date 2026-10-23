const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('Las sombras de árboles usan la hora simulada y no el reloj real',()=>{
 const block=source.slice(source.indexOf('const sunlight=climateClock.snapshot()'),source.indexOf('// G2 trunk:'));
 assert.match(block,/solarHour=sunlight\.hour\+sunlight\.minute\/60/);
 assert.match(block,/shadowX=\(1-2\*solarProgress\)/);
 assert.doesNotMatch(block,/performance\.now\(/);
});
test('Las sombras conservan la modulación por luz y nubosidad',()=>{
 const block=source.slice(source.indexOf('const sunlight=climateClock.snapshot()'),source.indexOf('// G2 trunk:'));
 assert.match(block,/sunlight\.light/);
 assert.match(block,/sunlight\.cloud/);
 assert.match(block,/if\(shadowStrength>\.015\)/);
});
