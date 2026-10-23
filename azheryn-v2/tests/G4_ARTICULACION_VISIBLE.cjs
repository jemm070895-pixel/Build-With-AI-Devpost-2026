const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('articulacion visible solo para voz, no pensamientos o descanso',()=>{
 const segment=source.split('G4: visible speakers articulate subtly')[1].split('ctx.restore();')[0];
 assert.match(segment,/utterance\.kind === 'speech'/);
 assert.match(segment,/!ch\.resting/);
 assert.match(segment,/mouthOpen/);
 assert.match(segment,/ctx\.ellipse/);
 assert.doesNotMatch(segment,/ch\.[A-Za-z]+\s*=/);
});
