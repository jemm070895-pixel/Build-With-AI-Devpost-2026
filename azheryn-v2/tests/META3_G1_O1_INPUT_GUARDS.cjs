const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const src = fs.readFileSync(path.join(__dirname, '../src/world/work.ts'), 'utf8');
for (const marker of ['Number.isFinite(value)', 'Number.isFinite(seconds)', 'boundedNeed(boundedNeed(state.hunger) + dt / 240)', 'boundedNeed(boundedNeed(state.thirst) + dt / 150)', 'boundedNeed(state.danger)', 'Number.isFinite(distance)', 'Number.isFinite(radius)', 'distance >= 0', 'Number.isInteger(required)']) {
  assert.ok(src.includes(marker), `Missing input guard: ${marker}`);
}
console.log('9/9 source guards checked (static only)');
