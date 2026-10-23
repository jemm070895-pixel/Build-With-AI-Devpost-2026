const {test}=require('node:test');
const assert=require('node:assert/strict');
const {contextualPairDialogue,conversationTurn}=require('../src/world/socialLife.ts');
test('pair dialogue respects reserved slots and valid speakers',()=>{
 for(let second=0;second<1300;second+=13){
  const line=contextualPairDialogue('guard1','guard2',second,'es','calm');
  assert.equal(Boolean(line),conversationTurn('guard1','guard2',second));
  if(line){assert.ok(['guard1','guard2'].includes(line.speaker));assert.ok(line.text.length>0);}
 }
});
test('contextual dialogues are localized and mood-sensitive',()=>{
 const second=Array.from({length:300},(_,i)=>i*13).find(s=>conversationTurn('guard1','guard2',s));
 const es=contextualPairDialogue('guard1','guard2',second,'es','resentful');
 const en=contextualPairDialogue('guard1','guard2',second,'en','resentful');
 assert.equal(es.speaker,en.speaker);assert.notEqual(es.text,en.text);
 assert.notEqual(contextualPairDialogue('guard1','guard2',second,'es','calm').text,es.text);
});
