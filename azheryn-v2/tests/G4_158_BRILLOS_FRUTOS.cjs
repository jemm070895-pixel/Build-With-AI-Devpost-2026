const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const view=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('fruit highlights follow mango elongated silhouette',()=>{
 assert.match(view,/if\(fruit\.shape==="oval"\)ctx\.ellipse\(px-\.35\*z,py-\.6\*z,\.65\*z,1\.05\*z/);
});
test('small jobo highlights are smaller than round guava highlights',()=>{
 assert.match(view,/else if\(fruit\.shape==="small"\)ctx\.ellipse\(px-\.35\*z,py-\.45\*z,\.42\*z,\.55\*z/);
 assert.match(view,/else ctx\.arc\(px-\.5\*z,py-\.5\*z,\.85\*z/);
});
