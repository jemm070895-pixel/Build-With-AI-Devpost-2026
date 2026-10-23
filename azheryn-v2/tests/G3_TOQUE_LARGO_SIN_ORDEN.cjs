const assert=require("node:assert/strict");
const fs=require("node:fs");
const src=fs.readFileSync("src/ui/WorldView.tsx","utf8");
assert.match(src,/TAP_MAX_DURATION_MS = 650/);
assert.match(src,/touchStartTimes\.set\(e\.pointerId,performance\.now\(\)\)/);
assert.match(src,/touchStartTimes\.delete\(e\.pointerId\)/);
assert.match(src,/elapsed<=TAP_MAX_DURATION_MS/);
assert.match(src,/e\.type!=="pointercancel"/);
console.log("G3 long touch: OK");
