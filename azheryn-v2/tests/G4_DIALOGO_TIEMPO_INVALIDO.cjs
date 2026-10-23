const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('src/world/socialLife.ts','utf8');
test('conversation slots reject negative time and invalid interlocutors',()=>{
 assert.match(source,/!a\?\.trim\(\) \|\| !b\?\.trim\(\) \|\| !Number\.isFinite\(seconds\) \|\| seconds<0/);
});
