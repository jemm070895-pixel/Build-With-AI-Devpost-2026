const fs=require('fs'),assert=require('assert'),ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
const source=fs.readFileSync(require('path').resolve(__dirname,'../../src/ui/WorldView.tsx'),'utf8');
const ast=ts.createSourceFile('WorldView.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
assert.equal(ast.parseDiagnostics.length,0,'No syntax errors');
const checks=[
 ['Cancellation helper',source.includes('const cancelHaul = () => {')],
 ['Reset both carriers',source.includes('if (haul.workerIds.includes(worker.id))')],
 ['Reset X destination',source.includes('worker.tx = worker.x;')],
 ['Reset Y destination',source.includes('worker.ty = worker.y;')],
 ['Fatigue cancels entire haul',source.includes('if(haul?.workerIds.includes(ch.id)) cancelHaul();')],
 ['Invalid pair cancels entire haul',source.includes('pair.some(ch=>ch.resting || Boolean(ch.order))){\n            cancelHaul();')],
 ['No dangling fatigue cancellation',!source.includes('if(haul?.workerIds.includes(ch.id)) haul=null;')]
];
for(const [name,ok] of checks)assert.ok(ok,name);
console.log(JSON.stringify({passed:checks.length+1,total:checks.length+1,checks:checks.map(x=>x[0])},null,2));
