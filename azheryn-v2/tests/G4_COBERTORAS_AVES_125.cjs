const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('close-up wing coverts follow the wing flap and remain decorative', () => {
  assert.match(source, /Near-camera wing coverts/);
  assert.match(source, /if \(detailed\) \{[\s\S]*?for \(let covert=0;covert<3;covert\+\+\)/);
  assert.match(source, /const lift=flap\*\(2\.5\+covert\*1\.15\)/);
  assert.match(source, /const birdCoat=ctx\.createLinearGradient/);
});
