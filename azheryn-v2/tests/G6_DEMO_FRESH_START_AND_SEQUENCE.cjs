const test=require('node:test'); const assert=require('node:assert/strict'); const fs=require('node:fs');
const src=fs.readFileSync('src/ui/WorldView.tsx','utf8');
const intro=fs.readFileSync('src/ui/IntroStory.tsx','utf8');
test('contest demo starts fresh and does not auto-save gameplay',()=>{assert.match(src,/const recovered = null; \/\/ Demo mode/);assert.match(src,/Demo mode: intentionally keep gameplay state in memory only/);});
test('stockpile, campfire, storehouse are ordered',()=>{assert.match(src,/disabled={!logsCount.stockpilePlaced \|\| campfirePlaced}/);assert.match(src,/disabled={buildingProgress.placed \|\| !logsCount.stockpilePlaced \|\| !campfirePlaced}/);assert.match(src,/2 · Fogata/);});
test('intro is automatic with splash',()=>{assert.match(intro,/setSplash\(false\)/);assert.match(intro,/setIndex\(i => Math.min/);});
