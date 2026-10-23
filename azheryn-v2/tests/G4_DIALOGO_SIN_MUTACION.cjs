const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const view=fs.readFileSync('src/ui/WorldView.tsx','utf8');
test('collective dialogue is selected without mutating a shared utterance',()=>{
  assert.match(view,/const utterance=pairedSlot \? contextualExchange : ambientLine;/);
  assert.doesNotMatch(view,/utterance\.text\s*=/);
});
