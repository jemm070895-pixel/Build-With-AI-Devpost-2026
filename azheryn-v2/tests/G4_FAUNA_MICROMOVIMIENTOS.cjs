const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('deer tail has independent phase-based movement gated by detail level',()=>{
  assert.match(src,/if \(detailed\) \{\s*\/\/ A short tail flicks independently[\s\S]*?const tailFlick=Math\.sin\(motionTime\*2\.1\+animal\.phase\)\*1\.7/);
});
test('rabbit breath is subtle and preserves body placement',()=>{
  assert.match(src,/const breath=reduceWildlifeMotion \? 1 : 1\+Math\.sin\(motionTime\*1\.7\+animal\.phase\)\*\.025/);
  assert.match(src,/ctx\.ellipse\(-2,-6,8,5\*breath,0,0,Math\.PI\*2\)/);
});
