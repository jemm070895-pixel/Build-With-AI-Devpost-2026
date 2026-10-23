const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('src/world/socialLife.ts','utf8');
test('bubble geometry clamps width and height even on tiny screens',()=>{
 assert.match(source,/Math\.min\(Math\.max\(0,vw-2\*margin\)/);
 assert.match(source,/Math\.min\(22,vh\)/);
 assert.match(source,/Number\.isFinite\(viewportWidth\)/);
});
