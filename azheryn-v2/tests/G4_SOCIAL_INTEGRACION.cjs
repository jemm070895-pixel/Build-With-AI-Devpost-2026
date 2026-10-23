const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const view=fs.readFileSync('src/ui/WorldView.tsx','utf8');
test('orders are attributed to Mui and persisted per guard',()=>{assert.match(view,/social\?: SocialState/);assert.match(view,/recordMuiCommand\(worker\)/);assert.match(view,/selected\.forEach\(ch=>\{recordMuiCommand\(ch\)/);assert.match(view,/for\(const ch of squad\)\{\s*recordMuiCommand\(ch\)/);});
test('rest lowers resentment and affects visible mood',()=>{assert.match(view,/restSocialState\(ch\.social/);assert.match(view,/socialReaction\(ch\.social\)/);});
