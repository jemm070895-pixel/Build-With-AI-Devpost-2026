const test=require('node:test');
const assert=require('node:assert/strict');
const {initialSocialState,restSocialState}=require('../src/world/socialLife.ts');
test('La confianza se recupera con descansos breves acumulados',()=>{
  let state={...initialSocialState(),trustMui:50,resentment:60};
  for(let i=0;i<180;i++) state=restSocialState(state,1/60);
  assert.ok(Math.abs(state.trustMui-51)<1e-8);
  assert.ok(Math.abs(state.resentment-54)<1e-8);
});
test('La confianza permanece limitada al máximo durante descanso prolongado',()=>{
  let state={...initialSocialState(),trustMui:99.9};
  for(let i=0;i<300;i++) state=restSocialState(state,1/60);
  assert.equal(state.trustMui,100);
});
