const fs = require('node:fs');
const assert = require('node:assert/strict');
const source = fs.readFileSync('src/ui/WorldView.tsx', 'utf8');
assert.match(source, /e\.code === "Space" && !e\.repeat/);
assert.match(source, /lastRunningSpeedRef\.current/);
assert.match(source, /if \(k === "escape"\)/);
for (const fragment of ['orderModeRef.current = "none"','buildingModeRef.current = false','stockpileModeRef.current = false']) assert.ok(source.includes(fragment),fragment);
assert.match(source,/Space pause/);
console.log('G3 pause and cancel: OK');
