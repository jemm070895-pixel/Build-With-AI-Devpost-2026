const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const view=fs.readFileSync('src/ui/WorldView.tsx','utf8');
test('emotion outline only applies to spoken dialogue',()=>{
  assert.match(view,/if\(utterance\.kind==='speech' && bubbleMood!=='calm'\)/);
  assert.match(view,/bubbleMood==='resentful'\?'#d8a18a':'#b6c5d0'/);
  assert.match(view,/ctx\.stroke\(\)/);
});
