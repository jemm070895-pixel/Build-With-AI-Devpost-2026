const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const src = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('ciervos parpadean solo de cerca sin cambiar IA', () => {
  assert.match(src, /const deerBlink = detailed/);
  assert.match(src, /if \(deerBlink\)/);
});
test('conejos tienen parpadeo independiente', () => {
  assert.match(src, /const rabbitBlink = detailed/);
  assert.match(src, /if \(rabbitBlink\)/);
});
