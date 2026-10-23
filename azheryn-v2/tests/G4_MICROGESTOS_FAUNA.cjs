const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const src = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('deer ears twitch independently with animal phase', () => {
  assert.match(src, /const leftEarTwitch=Math\.sin\(motionTime\*1\.9\+animal\.phase\*2\.7\)/);
  assert.match(src, /const rightEarTwitch=Math\.sin\(motionTime\*2\.3\+animal\.phase\*1\.4\+1\.7\)/);
  assert.match(src, /8\+leftEarTwitch,-29/);
  assert.match(src, /20\+rightEarTwitch,-29/);
});
test('rabbit whiskers move subtly with individual phase', () => {
  assert.match(src, /const whiskerTwitch=Math\.sin\(motionTime\*3\.1\+animal\.phase\)\*\.65/);
  assert.match(src, /14,-7\+side\*2\.4\+whiskerTwitch/);
  assert.match(src, /if \(detailed\) \{\s*ctx\.strokeStyle="\#e2d6c5"/);
});
