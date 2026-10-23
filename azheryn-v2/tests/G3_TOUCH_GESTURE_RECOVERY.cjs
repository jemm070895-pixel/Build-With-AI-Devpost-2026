const fs=require('node:fs');const assert=require('node:assert/strict');
const s=fs.readFileSync('src/ui/WorldView.tsx','utf8');
assert.match(s,/const TAP_TOLERANCE_PX = 12/);
assert.match(s,/touchOrigins\.delete\(e\.pointerId\)/);
assert.match(s,/if\(touchPoints\.size===0\) \{ suppressTouchTap=false; gestureWasMultitouch=false; \}/);
assert.match(s,/!wasPinching && !moved && !suppressTouchTap/);
assert.match(s,/e\.type!=="pointercancel"/);
console.log('G3 touch gesture recovery OK');
