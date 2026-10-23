const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync('src/ui/WorldView.tsx','utf8');
assert.match(source,/const onBlur = \(\) => \{ saveGame\(\); keys\.clear\(\); resetInterruptedGestures\(\); \};/);
for(const name of ['blur','pagehide']) {
  const handler = name === 'blur' ? 'onBlur' : 'resetInterruptedGestures';
  assert.ok(source.includes(`window.addEventListener("${name}", ${handler});`));
  assert.ok(source.includes(`window.removeEventListener("${name}", ${handler});`));
}
assert.ok(!source.includes('window.addEventListener("blur", resetInterruptedGestures)'), 'Avoid duplicate blur listeners');
assert.ok(!source.includes('if(e.type==="pointercancel") {'), 'Avoid unreachable duplicate cancellation branch');
console.log('G4 interruption listener lifecycle OK');
