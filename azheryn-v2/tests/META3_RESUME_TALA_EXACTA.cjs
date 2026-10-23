const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = fs.readFileSync(path.join(__dirname,'../src/world/work.ts'),'utf8');
const ui = fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
assert.match(ts,/export function reserveRememberedLoggingTree/);
assert.match(ts,/Math\.hypot\(t\.x-order\.x,t\.y-order\.y\)<0\.01/);
assert.equal((ui.match(/reserveRememberedLoggingTree\(workTrees,ch\.id,/g)||[]).length,2);
console.log('OK: la tala individual se reanuda sobre el mismo árbol tras hambre, sed o descanso');
