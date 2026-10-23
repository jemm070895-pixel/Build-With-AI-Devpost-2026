const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const ui=fs.readFileSync('src/ui/WorldView.tsx','utf8');
test('campfire can be placed and is not anchored to a moving guard',()=>{assert.match(ui,/campfire=insideWorld\(wx,wy\)/);assert.match(ui,/if \(!campfire\) return/);assert.match(ui,/toScreen\(campfire\)/);assert.doesNotMatch(ui,/anchor\.x\+6/);});
test('campfire is persisted and old saves remain compatible',()=>{assert.match(ui,/stockpile,storehouse,campfire,haul/);assert.match(ui,/campfire=saved\.campfire && Number\.isFinite/);});
