const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('gesto de protesta limitado a guardias descontentos e inactivos', () => {
  assert.match(source, /const visiblyUpset = !ch\.mui && !ch\.resting && !visiblyTired/);
  assert.match(source, /const complaintGesture = visiblyUpset && gestureCycle < 1\.6/);
  assert.match(source, /line\(-4,-19,-6-complaintGesture,idleArmY-complaintGesture\*\.45/);
});
test('la mano con la Fehe conserva su geometría original', () => {
  assert.match(source, /const handX=working\?facing\*\(7\+4\*swing\):facing\*6/);
  assert.match(source, /const handY=working\?-20-5\*swing:building\?-14-5\*buildPulse:hauling\?-17:idleArmY/);
});
