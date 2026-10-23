const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const view=fs.readFileSync('src/ui/WorldView.tsx','utf8');
test('each NPC neighborhood computed once per draw, reused for dialogue and mutual partner',()=>{
 assert.match(view,/const npcNeighborhoods = new Map/);
 assert.match(view,/npcNeighborhoods\.set\(member\.id,neighbors\)/);
 assert.match(view,/const nearby=npcNeighborhoods\.get\(ch\.id\) \?\? \[\]/);
 assert.match(view,/const theirNearest=npcNeighborhoods\.get\(other\.id\)\?\.find\(candidate=>!candidate\.resting\)/);
 assert.doesNotMatch(view,/const theirNearest=characters\.filter/);
});
