const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const view=fs.readFileSync('src/ui/WorldView.tsx','utf8');
test('active pair conversation suppresses unrelated ambient speech even without a complaint',()=>{
  assert.match(view,/const utterance=pairedSlot \? contextualExchange : ambientLine/);
  assert.doesNotMatch(view,/partner && social && conversationTurn\(ch\.id,partner\.id,seconds\) \? null : base/);
});
