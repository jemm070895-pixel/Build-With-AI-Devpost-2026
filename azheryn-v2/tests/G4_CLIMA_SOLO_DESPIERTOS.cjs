const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const view=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('collective spoken mood excludes sleeping guards but retains local awake members',()=>{
  assert.match(view,/groupDialogueTone\(\[ch,\.\.\.nearby\]\.filter\(member=>!member\.resting && member\.social\)/);
  assert.match(view,/const nearby=npcNeighborhoods\.get\(ch\.id\) \?\? \[\]/);
});
