const test=require('node:test');
const assert=require('node:assert/strict');
const {initialSocialState,registerMuiOrder}=require('../src/world/socialLife.ts');
test('contador de quejas no supera el entero seguro',()=>{
 const state={...initialSocialState(),fatigueComplaints:Number.MAX_SAFE_INTEGER};
 const result=registerMuiOrder(state,22,90,true);
 assert.equal(result.fatigueComplaints,Number.MAX_SAFE_INTEGER);
 assert.ok(Number.isSafeInteger(result.fatigueComplaints));
});
test('contador de quejas importado excesivo se normaliza',()=>{
 const state={...initialSocialState(),fatigueComplaints:1e100};
 const result=registerMuiOrder(state,22,90,true);
 assert.equal(result.fatigueComplaints,Number.MAX_SAFE_INTEGER);
});
