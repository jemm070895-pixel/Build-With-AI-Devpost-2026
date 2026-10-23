const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const src = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('Rain brightness responds to sunlight rather than glowing at night', () => {
  assert.match(src, /const rainVisibility = Math\.max\(0\.22, Math\.min\(1, cs\.light \* 0\.82 \+ 0\.18\)\)/);
  assert.match(src, /\(0\.18 \+ cs\.rain \* 0\.35\) \* rainVisibility/);
});
test('Night rain is dimmer than daytime rain and remains visible', () => {
  const visibility = light => Math.max(0.22, Math.min(1, light * 0.82 + 0.18));
  assert.ok(visibility(0) < visibility(1));
  assert.ok(visibility(0) > 0);
  assert.equal(visibility(1), 1);
});
