const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('fruit contact shadows precede the fruit silhouette',()=>{
 const shadow=src.indexOf('ctx.ellipse(px+1.05*z,py+1.55*z,2.15*z,1.25*z');
 const fruit=src.indexOf('ctx.fillStyle=fruit.shade;ctx.beginPath();');
 assert.ok(shadow>0 && fruit>shadow);
});
test('fruit depth uses zoom scale and deterministic coordinates',()=>{
 assert.match(src,/ctx\.fillStyle="rgba\(17,43,19,\.30\)"/);
 assert.match(src,/ctx\.ellipse\(px\+1\.05\*z,py\+1\.55\*z,2\.15\*z,1\.25\*z/);
});
