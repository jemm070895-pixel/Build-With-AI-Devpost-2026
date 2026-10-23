const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
const handler=src.slice(src.indexOf('const onLogOrder='),src.indexOf('window.addEventListener("azheryn-log-order"'));
assert(handler.includes('if(ch.needTrip || ch.resting)'), 'Survival/resting agents must be deferred');
assert(handler.includes('ch.pendingLoggingZone={x:p.x,y:p.y}'), 'Deferred zone must be remembered');
assert(handler.includes('queued++'), 'Deferred agents must be counted');
assert(handler.includes('const tree=reserveNearestTreeInZone'), 'Ready agents must receive a real tree');
console.log('PASS: zone logging queues busy agents and assigns available agents');
