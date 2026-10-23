const fs=require('node:fs');const assert=require('node:assert/strict');
const src=fs.readFileSync('src/ui/WorldView.tsx','utf8');
assert.match(src,/gestureWasMultitouch=true/);
assert.match(src,/touchOrigins\.set\(id,\{\.\.\.point\}\)/);
assert.match(src,/!gestureWasMultitouch && touchPoints\.size===0/);
assert.match(src,/gestureWasMultitouch=false/);
console.log('OK G3 transición pinza-arrastre y protección de órdenes');
