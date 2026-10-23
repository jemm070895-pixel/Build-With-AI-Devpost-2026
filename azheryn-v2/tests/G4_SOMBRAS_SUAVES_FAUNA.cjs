const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync('src/ui/WorldView.tsx', 'utf8');
test('fauna uses two grounded shadow layers with climate intensity', () => {
  assert.match(source, /shadowWidth \* 1\.42, shadowHeight \* 1\.7/);
  assert.match(source, /shadowAlpha \* wildlifeShadowLight \* \.34/);
  assert.match(source, /shadowAlpha \* wildlifeShadowLight \* \.74/);
  assert.match(source, /ctx\.ellipse\(0, 3\+bodyLift, shadowWidth, shadowHeight/);
});
