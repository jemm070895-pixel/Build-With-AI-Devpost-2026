const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const view=fs.readFileSync('src/ui/WorldView.tsx','utf8');
test('closest partner chosen without asymmetric id override',()=>{
 assert.match(view,/const partner=!ch\.resting \? awakeNearby\.find/);
 assert.match(view,/theirNearest\?\.id===ch\.id/);
 assert.doesNotMatch(view,/nearby\.find\(other=>other\.id\.localeCompare/);
});
test('non-speaker does not interrupt active paired social turn',()=>{
 assert.match(view,/const utterance=pairedSlot \? contextualExchange : ambientLine/);
});
