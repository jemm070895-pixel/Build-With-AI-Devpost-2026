const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/world/renderer.ts'), 'utf8');
test('ford ripples are gated by shallow depth and camera detail', () => {
  assert.match(source, /a >= 7 && depth > 0\.003 && depth < 0\.05/);
  assert.match(source, /hash2\(i, j, seed \+ 2801\) < 0\.085/);
});
test('ford ripples fade, animate and restore canvas line width', () => {
  assert.match(source, /ripplePhase = \(animationSeconds \* 0\.42/);
  assert.match(source, /const opacity = Math\.max\(0, \(1 - ripplePhase \/ 3\.5\) \* 0\.25\)/);
  assert.match(source, /ctx\.ellipse\(rx, ry, a \* spread/);
  assert.match(source, /ctx\.lineWidth = lw;/);
});
