const fs=require('fs'),path=require('path'),ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
const root=path.resolve(__dirname,'../..');let files=[],errors=[],tests=0;
function check(v,m){tests++;if(!v)errors.push('TEST: '+m)}
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.(ts|tsx)$/.test(p)&&!p.endsWith('.d.ts'))files.push(p)}}
walk(path.join(root,'src'));
for(const f of files){const s=fs.readFileSync(f,'utf8');const ast=ts.createSourceFile(f,s,ts.ScriptTarget.Latest,true,f.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);for(const d of ast.parseDiagnostics)errors.push(`${f}: ${ts.flattenDiagnosticMessageText(d.messageText,' ')}`);for(const m of s.matchAll(/from\s+["'](\.[^"']+)["']/g)){const p=path.resolve(path.dirname(f),m[1]);check(['.ts','.tsx','.js','.jsx','.css',''].some(e=>fs.existsSync(p+e)),`import ${m[1]} in ${path.basename(f)}`)}}
const f=path.join(root,'src/world/work.ts');const code=ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const mod={exports:{}};new Function('module','exports',code)(mod,mod.exports);const w=mod.exports;
const k={id:'tree-1',kind:'logging',x:5,y:5,observedAt:100,sourceCharacterId:'guard-1'};
for(const [x,y,expected] of [[0,0,true],[24,0,true],[24.01,0,false],[0,24,true],[0,25,false],[-24,0,true]])check(w.g1CanCommunicate(0,0,x,y)===expected,`communication ${x},${y}`);
check(w.g1ShareWorkKnowledge(k,'guard-2',0,0,5,5)?.sourceCharacterId==='guard-2','relay speaker');check(w.g1ShareWorkKnowledge(k,'guard-2',0,0,25,0)===null,'out of range');check(k.sourceCharacterId==='guard-1','original report immutable');
for(const [now,expected] of [[99,false],[100,true],[145,true],[146,false]])check(w.g1KnowledgeIsCurrent(k,now)===expected,`freshness ${now}`);
check(w.createLoggingOrder(1,2).kind==='logging','logging order');check(w.createFelledLog('x',1,2).transportersRequired===2,'haul needs two');
const ui=fs.readFileSync(path.join(root,'src/ui/WorldView.tsx'),'utf8');check(ui.includes('g1ShareWorkKnowledge('),'runtime share');check(ui.includes('g1KnowledgeIsCurrent('),'runtime freshness');check(ui.includes('helpingNotice'),'runtime notice');check(ui.includes('listener.order || listener.resting'),'direct order precedence');
const report={date:new Date().toISOString(),mode:'OFFLINE_SYNTAX_IMPORTS_LOGIC',files:files.length,tests,errors,ok:errors.length===0,limitation:'Does not replace npm run build with installed React/Vite dependencies.'};fs.writeFileSync(path.join(__dirname,'RESULTADO_VALIDACION_LOCAL.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));process.exitCode=errors.length?1:0;
