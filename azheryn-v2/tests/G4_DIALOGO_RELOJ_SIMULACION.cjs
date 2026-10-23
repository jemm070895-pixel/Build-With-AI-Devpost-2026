const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const view=fs.readFileSync('src/ui/WorldView.tsx','utf8');
test('dialogue timing follows simulation clock instead of wall-clock performance',()=>{
  assert.doesNotMatch(view,/const seconds=performance\.now\(\)\/1000;/);
  assert.match(view,/const seconds=knowledgeClock;/);
});
