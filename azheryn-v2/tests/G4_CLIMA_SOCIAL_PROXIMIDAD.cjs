const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('social climate for speech bubbles considers only nearby NPCs',()=>{
  assert.match(source,/const groupTone=groupDialogueTone\(\[ch,\.\.\.nearby\]\.filter\(member=>!member\.resting && member\.social\)\.map\(member=>member\.social!\)\)/);
  assert.doesNotMatch(source,/groupDialogueTone\(characters\.filter\(/);
});
