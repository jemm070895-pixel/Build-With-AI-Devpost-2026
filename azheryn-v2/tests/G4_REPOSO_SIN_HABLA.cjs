const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('resting NPC speech is suppressed before placing bubbles', () => {
  const start = source.indexOf('if(utterance){');
  const end = source.indexOf('occupiedSocialBubbles.push(placement)', start);
  assert.ok(start >= 0 && end > start);
  const block = source.slice(start,end);
  assert.match(block, /if \(ch\.resting && utterance\.kind === 'speech'\) continue;/);
  assert.ok(block.indexOf("ch.resting && utterance.kind === 'speech'") < block.indexOf('placeSocialBubble('));
});
