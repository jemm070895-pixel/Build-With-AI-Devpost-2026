const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const view=fs.readFileSync('src/ui/WorldView.tsx','utf8');
test('mutual conversations have a spoken turn even without grievances',()=>{
  assert.match(view,/const pairLine=partner \? contextualPairDialogue/);
  assert.match(fs.readFileSync("src/world/socialLife.ts","utf8"),/¿Cómo va el trabajo\?/);
  assert.match(fs.readFileSync("src/world/socialLife.ts","utf8"),/How is the work going\?/);
});
