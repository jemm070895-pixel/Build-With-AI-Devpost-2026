const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const view=fs.readFileSync('src/ui/WorldView.tsx','utf8');
test('offscreen NPC dialogue is culled before neighborhood search',()=>{
  const guard=view.indexOf('if(!ch.mui && z>=.85 && s.x>=-190');
  const search=view.indexOf('const nearby=npcNeighborhoods.get(ch.id)',guard);
  assert.ok(guard>=0 && search>guard);
  assert.match(view.slice(guard,search),/s\.x<=canvas\.width\+190 && s\.y>=-30 && s\.y<=canvas\.height\+90/);
});
