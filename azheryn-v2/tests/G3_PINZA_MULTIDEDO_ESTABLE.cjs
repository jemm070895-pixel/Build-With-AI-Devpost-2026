const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
assert.match(src,/slice\(0,2\)/,'Only two fingers should define the pinch');
assert.match(src,/clamp\(next.distance\/pinch.distance,0.75,1.33\)/,'Pinch zoom should limit spikes');
assert.match(src,/gestureWasMultitouch/,'Multitouch must suppress unintended taps');
console.log('G3 multitouch pinch stability: OK');
