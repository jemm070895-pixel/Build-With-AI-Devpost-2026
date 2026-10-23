const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('miradas sutiles escalonadas solo cuando despiertos e inactivos',()=>{
 assert.match(source,/const glanceCycle = \(now \/ 1000 \+ guardIndex \* 2\.13\)/);
 assert.match(source,/idleBreathing && !ch\.resting && socialDisposition === 'cooperative' && glanceCycle > 2\.2/);
 assert.match(source,/const glance =/);
});
test('mirada acompaña cabeza, pelo, ojos y boca sin cambiar la simulación',()=>{
 const part=source.split('const glanceCycle = ')[1].split('line(-1.7,-20')[0];
 assert.match(part,/ctx\.ellipse\(s\.x\+expressiveGlance\*z/);
 assert.match(part,/facing\*1\.4\+expressiveGlance/);
 assert.doesNotMatch(part,/ch\.(order|resting|fatigue|tx|ty|x|y)\s*=/);
});
