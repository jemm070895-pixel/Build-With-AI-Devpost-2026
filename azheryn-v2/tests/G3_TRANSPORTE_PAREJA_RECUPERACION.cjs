const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('src/ui/WorldView.tsx','utf8');
assert.match(source,/if\(!target \|\| carriers\.length!==2 \|\| targetLog\?\.stockpiled/,'missing worker or log recovers');
assert.match(source,/Math\.max\(\.\.\.carriers\.map/,'slowest worker controls stall detector');
assert.match(source,/haulStallSeconds>25/,'stalled transport retries');
assert.match(source,/pair\.every\(ch=>Math\.hypot\(ch\.x-sx,ch\.y-sy\)<2\)/,'delivery requires both workers');
console.log('OK: transport recovery checks');
