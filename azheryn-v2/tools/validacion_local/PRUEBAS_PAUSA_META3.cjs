const fs = require('fs');
const path = require('path');
const ts = require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
const file = path.resolve(__dirname, '../../src/ui/WorldView.tsx');
const source = fs.readFileSync(file,'utf8');
const ast = ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const tests = [
 ['La pausa anula dt', /const dt\s*=\s*elapsed\s*\*\s*timeSpeedRef\.current/.test(source)],
 ['Tiempo transcurrido no negativo', /Math\.min\(0\.05,\s*Math\.max\(0,\s*\(now - last\)\s*\/\s*1000\)\)/.test(source)],
 ['Sin nuevo transporte en pausa', /if\(dt>0 && stockpile && !haul\)/.test(source)],
 ['Sin progreso de transporte en pausa', /if\(dt>0 && stockpile && haul\?\.active\)/.test(source)],
 ['Movimiento depende de dt', /CHARACTER_SPEED\*dt/.test(source)],
 ['Tala depende de dt', /advanceLogging\(ch\.work\?\?0,dt\*performance\)/.test(source)],
 ['Fatiga depende de dt', /advanceFatigue\(ch\.fatigue,dt\)/.test(source)],
 ['Recuperación depende de dt', /recoverFatigue\(ch\.fatigue,dt\)/.test(source)],
 ['El reloj del conocimiento se detiene', /if\(timeSpeedRef\.current!==0\) knowledgeClock \+= dt/.test(source)],
 ['Sintaxis TSX válida', ast.parseDiagnostics.length===0]
];
const failed=tests.filter(t=>!t[1]).map(t=>t[0]);
const report={total:tests.length,passed:tests.length-failed.length,failed};
fs.writeFileSync(path.join(__dirname,'RESULTADO_PAUSA_META3.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if(failed.length)process.exitCode=1;
