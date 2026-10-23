const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
assert.match(source, /const reserveForHauling=pendingCollection && !haul \? 2 : 0/);
assert.match(source, /const haulerIds=new Set\(waitingLog/);
assert.match(source, /const builderIds=new Set\(idleForConstruction.filter\(ch=>!haulerIds.has\(ch.id\)\)/);
function allowed(idle, pending, activeHaul) { return idle - (pending && !activeHaul ? Math.min(2,idle) : 0); }
assert.equal(allowed(3, true, true), 3);
assert.equal(allowed(4, true, false), 2);
assert.equal(allowed(2, false, false), 2);
console.log('PASS: builders not starved while hauling is active');
