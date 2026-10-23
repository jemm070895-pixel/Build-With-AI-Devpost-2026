const {test}=require('node:test');
const assert=require('node:assert/strict');
const {sharedPairMood,contextualPairDialogue}=require('../src/world/socialLife.ts');
test('pair mood is symmetric and prioritizes resentment then fatigue',()=>{
 for(const a of ['calm','tired','resentful']) for(const b of ['calm','tired','resentful']) assert.equal(sharedPairMood(a,b),sharedPairMood(b,a));
 assert.equal(sharedPairMood('calm','resentful'),'resentful');
 assert.equal(sharedPairMood('tired','calm'),'tired');
 assert.equal(sharedPairMood('calm','calm'),'calm');
});
test('pair members use identical dialogue when their personal moods differ',()=>{
 for(let slot=0;slot<90;slot++){
  const moodA=sharedPairMood('calm','tired');
  const moodB=sharedPairMood('tired','calm');
  assert.deepEqual(contextualPairDialogue('guard1','guard2',slot*13,'es',moodA),contextualPairDialogue('guard2','guard1',slot*13,'es',moodB));
 }
});
