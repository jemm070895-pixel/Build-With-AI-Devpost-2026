const test=require('node:test');
const assert=require('node:assert/strict');
const {socialReaction,socialEvent}=require('../src/world/socialLife.ts');
test('la reaccion ignora resentimiento no finito de partidas importadas',()=>{
 for(const resentment of [NaN,Infinity,-Infinity]){
  const state={resentment,trustMui:65,fatigueComplaints:0,lastOrderHour:-1};
  assert.equal(socialReaction(state),'cooperative');
  assert.equal(socialEvent(state),null);
 }
});
test('intensidad de quejas y avisos queda limitada a 0..100',()=>{
 for(const [resentment,kind,intensity] of [[36,'complaint',36],[85,'warning',85],[900,'warning',100]]){
  const state={resentment,trustMui:20,fatigueComplaints:0,lastOrderHour:-1};
  assert.equal(socialEvent(state).kind,kind);
  assert.equal(socialEvent(state).intensity,intensity);
 }
});
