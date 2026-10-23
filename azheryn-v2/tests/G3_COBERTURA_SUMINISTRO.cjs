const assert=require('node:assert/strict');
const fs=require('node:fs');
const src=fs.readFileSync('src/ui/WorldView.tsx','utf8');
for(const marker of ['Estado de suministros','Supply status','materials.available + materials.awaitingPickup + materials.inTransit','materials.toGather === 0','materials.toGather > 0','Enough timber is felled or stockpiled']) assert.ok(src.includes(marker),marker);
console.log('G3 supply coverage UI: 6 checks OK');
