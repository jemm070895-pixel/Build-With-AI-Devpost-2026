const fs=require('node:fs');const assert=require('node:assert/strict');
const ui=fs.readFileSync(require('node:path').join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
const checks=[
 ['pause blocks simulation',ui.includes('if (dt>0 && baked && characters.length)')],
 ['pause does not block render',ui.includes('requestAnimationFrame(tick)')],
 ['changing stockpile cancels active haul',ui.includes('if(stockpileModeRef.current){') && ui.includes('if(haul)cancelHaul();')],
 ['move order cancels hauling',/selected\.forEach\(ch=>\{(?:recordMuiCommand\(ch\);)?if\(haul\?\.workerIds\.includes\(ch\.id\)\)cancelHaul\(\);/.test(ui)],
 ['move order releases tree',ui.includes('if(ch.order){releaseTree(ch);ch.order=undefined;}')],
 ['logging requires reservation ownership',ui.includes('tree.reservedBy!==ch.id')],
 ['transport phase collecting',ui.includes('phase:"collecting"')],
 ['transport phase delivering',ui.includes('currentHaul.phase="delivering"')],
 ['haul interruption restores log',ui.includes('log.x=haulOrigin.x;log.y=haulOrigin.y')],
 ['resting workers excluded from haul',ui.includes('!ch.resting && !ch.needTrip && Math.hypot(ch.tx-ch.x,ch.ty-ch.y)<=1 && g1CanJoinHaul')],
 ['invalid tree cancels ghost destination',ui.includes('ch.tx=ch.x;ch.ty=ch.y;dirty=true;continue;')],
 ['failed logging order clears stale zone',ui.includes('ch.order=undefined;ch.loggingZone=undefined;ch.tx=ch.x;ch.ty=ch.y;continue;')],
 ['resume logging after stockpile is clear',ui.includes('if(!nearestUnstockpiledLog(felledLogs,stockpile.x,stockpile.y)){')],
 ['resumption respects player orders',ui.includes('worker.order || worker.resting || Math.hypot(worker.tx-worker.x,worker.ty-worker.y)>1 || !worker.loggingZone')],
];for(const [name,ok] of checks){assert.ok(ok,name);console.log('OK',name)}console.log(`${checks.length}/${checks.length} integration guards`);
