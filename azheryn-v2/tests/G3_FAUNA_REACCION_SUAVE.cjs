const assert = require('node:assert/strict');
const { animalAvoidance, animalPosition, PEACEFUL_ANIMALS } = require('../src/world/peacefulWildlife.ts');
for (const animal of PEACEFUL_ANIMALS) {
  const at = animalPosition(animal, 10);
  const far = animalAvoidance(animal, 10, [{x:at.x+100,y:at.y}]);
  assert.equal(far.alert,false);
  assert.equal(far.x,at.x);
  const edge = animalAvoidance(animal, 10, [{x:at.x+(animal.kind==='bird'?14.99:animal.kind==='rabbit'?23.99:29.99),y:at.y}]);
  assert.ok(Math.hypot(edge.x-at.x,edge.y-at.y)<0.01,'no visible jump at awareness boundary');
  const near = animalAvoidance(animal, 10, [{x:at.x+1,y:at.y}]);
  assert.equal(near.alert,true);
  assert.ok(Number.isFinite(near.x)&&Number.isFinite(near.y));
}
console.log('G3 fauna smooth reaction: OK');
