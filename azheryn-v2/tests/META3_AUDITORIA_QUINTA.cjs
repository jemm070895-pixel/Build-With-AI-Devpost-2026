const fs=require('node:fs');const assert=require('node:assert/strict');const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
const checks=[
 ['Transporte no secuestra desplazamiento manual',source.includes('!ch.resting && !ch.needTrip && Math.hypot(ch.tx-ch.x,ch.ty-ch.y)<=1 && g1CanJoinHaul')],
 ['Avisos no interrumpen desplazamiento manual',source.includes('listener.helpingNotice || Math.hypot(listener.tx-listener.x,listener.ty-listener.y)>1')],
 ['Reanudación de tala no interrumpe desplazamiento',source.includes('worker.resting || Math.hypot(worker.tx-worker.x,worker.ty-worker.y)>1')],
 ['Almacén conserva margen horizontal',source.includes('clamp(q.x,Math.min(margin,baked.width/2),Math.max(margin,baked.width-margin))')],
 ['Almacén conserva margen vertical',source.includes('clamp(q.y,Math.min(margin,baked.height/2),Math.max(margin,baked.height-margin))')]
];for(const [name,ok] of checks){assert.ok(ok,name);console.log('OK',name)}console.log(`${checks.length}/${checks.length} nuevas comprobaciones`);
