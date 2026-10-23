const fs=require('fs');
const path=require('path');
const base=path.resolve(__dirname,'../../src');
const view=fs.readFileSync(path.join(base,'ui/WorldView.tsx'),'utf8');
const work=fs.readFileSync(path.join(base,'world/work.ts'),'utf8');
const checks={
 'Prioridad de transporte':view.includes('if(awaitingTransport || listener.order'),
 'Deteccion de troncos pendientes':view.includes('Boolean(stockpile && nearestUnstockpiledLog'),
 'Orden directa preservada':view.includes('listener.order || listener.resting'),
 'Aviso no sustituye trabajo en curso':view.includes('listener.helpingNotice || Math.hypot(listener.tx-listener.x,listener.ty-listener.y)>1 || haul?.workerIds.includes(listener.id)'),
 'Avisos limitados por distancia':work.includes('g1CanCommunicate(speakerX,speakerY,listenerX,listenerY)'),
 'Avisos caducan':work.includes('now-knowledge.observedAt <= maxAgeSeconds'),
 'Trabajo requiere arbol disponible':view.includes('t.id===info.id && t.standing && !t.reservedBy'),
 'Avisos sin acciones durante pausa':view.includes('if(timeSpeedRef.current!==0)'),
};
const failed=Object.entries(checks).filter(([,v])=>!v);
console.log(JSON.stringify({total:Object.keys(checks).length,passed:Object.keys(checks).length-failed.length,failed:failed.map(([k])=>k)},null,2));
process.exitCode=failed.length?1:0;
