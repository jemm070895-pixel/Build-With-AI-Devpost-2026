const fs=require('fs'),path=require('path');
const s=fs.readFileSync(path.join(__dirname,'../../src/ui/WorldView.tsx'),'utf8');
const tests=[
 ['Log is registered before transport backlog check',s.indexOf('felledLogs.push(createFelledLog(')<s.indexOf('const transportWaiting=')],
 ['Backlog depends on existing stockpile and unstockpiled logs',s.includes('const transportWaiting=Boolean(stockpile && nearestUnstockpiledLog(felledLogs,stockpile.x,stockpile.y))')],
 ['No next tree reserved while transport waits',s.includes('const next=z&&!transportWaiting?reserveNearestTreeInZone(')],
 ['Idle workers are not resting',s.includes('characters.filter(ch=>!ch.mui && !ch.order && !ch.resting')],
 ['Transport starts only with required workers',s.includes('if(ids.length===log.transportersRequired)')],
 ['Explicit notice for pending transport',s.includes('Tala en espera: trasladar troncos al acopio')]
];
console.log(JSON.stringify({total:tests.length,passed:tests.filter(x=>x[1]).length,failed:tests.filter(x=>!x[1]).map(x=>x[0]),limitation:'Static integration checks, not a running-game simulation.'},null,2));
if(tests.some(x=>!x[1]))process.exitCode=1;
