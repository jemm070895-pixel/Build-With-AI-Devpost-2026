const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('expresion facial usa estado social sin alterar simulacion',()=>{
 const segment=src.split('const facialReaction = ')[1].split('ctx.strokeStyle="#76533f"')[0];
 assert.match(segment,/socialReaction\(ch\.social\)/);
 assert.match(segment,/!ch\.resting/);
 assert.match(segment,/facialReaction === 'refusal-risk'/);
 assert.doesNotMatch(segment,/ch\.[a-zA-Z]+\s*=/);
});
