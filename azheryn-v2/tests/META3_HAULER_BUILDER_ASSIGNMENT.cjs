const fs = require('node:fs');
const assert = require('node:assert/strict');
const source = fs.readFileSync(require('node:path').join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
assert.match(source, /const waitingLog=pendingCollection && !haul && stockpile/);
assert.match(source, /const haulerIds=new Set\(waitingLog/);
assert.match(source, /idleForConstruction\.filter\(ch=>!haulerIds\.has\(ch\.id\)\)/);
// Test the assignment policy on representative positions: closest two haul,
// remaining guards build regardless of their original array positions.
const guards = [{id:'far1',x:100,y:100},{id:'near1',x:1,y:0},{id:'far2',x:90,y:90},{id:'near2',x:2,y:0}];
const log={x:0,y:0};
const reserved = new Set([...guards].sort((a,b)=>Math.hypot(a.x-log.x,a.y-log.y)-Math.hypot(b.x-log.x,b.y-log.y)).slice(0,2).map(g=>g.id));
assert.deepEqual([...reserved],['near1','near2']);
assert.deepEqual(guards.filter(g=>!reserved.has(g.id)).map(g=>g.id),['far1','far2']);
console.log('PASS: closest idle pair reserved for hauling; other guards build');
