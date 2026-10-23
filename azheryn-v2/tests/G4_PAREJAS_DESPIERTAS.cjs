const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('sleeping guards cannot be selected as paired speakers', () => {
  assert.match(source, /const partner=!ch\.resting \? awakeNearby\.find\(other=>\{/);
  assert.match(source, /const awakeNearby=nearby\.filter\(other=>!other\.resting\)/);
  assert.match(source, /return theirNearest\?\.id===ch\.id && awakeNearby\[0\]\?\.id===other\.id;/);
});
