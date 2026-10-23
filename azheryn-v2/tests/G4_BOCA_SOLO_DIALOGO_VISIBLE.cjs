const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const src = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('mouth articulation only occurs after bubble placement succeeds', () => {
  const start = src.indexOf('if(utterance){');
  const end = src.indexOf('const {x:bx,y:by,width:w}=placement;', start);
  const segment = src.slice(start, end);
  const guard = segment.indexOf('if (!placement) { ctx.restore(); continue; }');
  const mouth = segment.indexOf('const mouthOpen =');
  assert.ok(start >= 0 && guard >= 0 && mouth > guard);
  assert.ok(segment.includes("utterance.kind === 'speech'"));
  assert.ok(segment.includes('!ch.resting'));
});
