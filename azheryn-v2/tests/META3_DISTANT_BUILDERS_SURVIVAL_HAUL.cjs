const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const src = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
assert.ok(!src.includes('Math.hypot(ch.x-storehouse.x,ch.y-storehouse.y)>55'), 'Idle builders must not be blocked by an arbitrary 55m cutoff');
assert.match(src, /!ch\.order && !ch\.resting && !ch\.needTrip && Math\.hypot\(ch\.tx-ch\.x,ch\.ty-ch\.y\)<=1 && g1CanJoinHaul/, 'Survival trip must take priority over new hauling assignments');
console.log('PASS: distant idle builders and survival-safe hauling');
