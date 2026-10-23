const fs=require('fs');const assert=require('assert');
const src=fs.readFileSync('src/ui/WorldView.tsx','utf8');
assert(src.includes('touchLast.set(e.pointerId'));
assert(src.includes('touchPoints.size===1 && baked'));
assert(src.includes('cam.x-=(e.clientX-previous.x)/cam.zoom'));
assert(src.includes('cam.y-=(e.clientY-previous.y)/cam.zoom'));
assert(src.includes('touchAction:"none"'));
assert(src.includes('!moved && !suppressTouchTap'));
console.log('G3 one-finger pan checks OK');
