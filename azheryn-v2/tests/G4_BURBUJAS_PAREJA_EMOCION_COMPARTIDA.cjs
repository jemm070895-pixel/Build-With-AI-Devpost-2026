const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('paired conversations use shared emotional cue rather than individual mood',()=>{
  assert.match(source,/const bubbleMood=pairedSlot && contextualExchange \? pairMood : mood/);
  assert.match(source,/utterance\.kind==='speech' && bubbleMood!=='calm'/);
  assert.match(source,/bubbleMood==='resentful'\?'#d8a18a':'#b6c5d0'/);
});
