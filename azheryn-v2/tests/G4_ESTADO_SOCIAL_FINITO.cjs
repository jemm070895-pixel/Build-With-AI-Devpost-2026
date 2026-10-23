const test=require('node:test');
const assert=require('node:assert/strict');
const {registerMuiOrder,restSocialState,initialSocialState}=require('../src/world/socialLife.ts');
test('órdenes conservan contadores sociales finitos con datos dañados',()=>{
 const damaged={trustMui:NaN,resentment:Infinity,fatigueComplaints:-Infinity,lastOrderHour:NaN};
 const result=registerMuiOrder(damaged,NaN,NaN,true);
 assert.deepEqual(result,{trustMui:61,resentment:16,fatigueComplaints:1,lastOrderHour:-1});
});
test('reposo inválido no recupera horas imaginarias y mantiene límites',()=>{
 const bad={...initialSocialState(),resentment:NaN,trustMui:Infinity};
 const result=restSocialState(bad,Infinity);
 assert.equal(result.resentment,0);assert.equal(result.trustMui,65);
 assert.deepEqual(restSocialState({...initialSocialState(),resentment:80},3).resentment,74);
});
