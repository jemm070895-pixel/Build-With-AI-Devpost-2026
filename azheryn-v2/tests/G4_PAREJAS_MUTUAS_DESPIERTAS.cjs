const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const src=fs.readFileSync('src/ui/WorldView.tsx','utf8');
test('partners require mutual nearest awake neighbors',()=>{
  assert.match(src,/const awakeNearby=nearby\.filter\(other=>!other\.resting\)/);
  assert.match(src,/const theirNearest=npcNeighborhoods\.get\(other\.id\)\?\.find\(candidate=>!candidate\.resting\)/);
  assert.match(src,/theirNearest\?\.id===ch\.id && awakeNearby\[0\]\?\.id===other\.id/);
});
