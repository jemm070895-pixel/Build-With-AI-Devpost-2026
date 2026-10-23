const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const social=fs.readFileSync('src/world/socialLife.ts','utf8');
const view=fs.readFileSync('src/ui/WorldView.tsx','utf8');
test('bubble bounds are clamped to canvas dimensions',()=>{
 assert.match(social,/export function bubbleLayout/);
 assert.match(social,/vw-margin-width/);
 assert.match(social,/vh-height/);
 assert.match(view,/bubbleLayout\(s\.x,s\.y-54\*z/);
});

test('bubble text follows clamped center and width',()=>{assert.match(view,/ctx\.fillText\(text,bx\+w\/2,by\+layout\.height\/2\+layout\.fontSize\*\.34,Math\.max\(8,w-12\)\)/);assert.doesNotMatch(view,/ctx\.fillText\(text,s\.x,by\+14\)/)});
