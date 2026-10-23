#!/usr/bin/env node
/** Read-only module network audit: derive edges from actual imports, never assume connections. */
const fs=require('node:fs'); const path=require('node:path');
const root=path.resolve(__dirname,'../src');
const files=[];
function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,item.name);if(item.isDirectory())walk(p);else if(/\.(tsx?|jsx?)$/.test(item.name)&&!item.name.endsWith('.d.ts'))files.push(p);}}
walk(root);
const names=new Set(files.map(p=>path.relative(root,p).replaceAll('\\','/')));
const branches={foundation:[],world:[],ui:[],lab:[],app:[]};
const edges=[];const unresolved=[];
for(const p of files){const name=path.relative(root,p).replaceAll('\\','/');const branch=name.split('/')[0];(branches[branches[branch]?branch:'app']).push(name);
 const source=fs.readFileSync(p,'utf8');
 const regex=/(?:\bimport\s*(?:[\s\S]*?\s+from\s*)?|\bexport\s+(?:\*|\{[^}]*\})\s+from\s*)["'](\.[^"']+)["']/g;
 let m;while((m=regex.exec(source))){const base=path.resolve(path.dirname(p),m[1]);const resolved=[base,base+'.ts',base+'.tsx',base+'.js',base+'.jsx',path.join(base,'index.ts'),path.join(base,'index.tsx')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());if(!resolved){unresolved.push({from:name,import:m[1]});continue;}const target=path.relative(root,resolved).replaceAll('\\','/');if(names.has(target))edges.push({from:name,to:target});}
}
const adjacent=new Map([...names].map(n=>[n,[]]));for(const e of edges)adjacent.get(e.from).push(e.to);
const visited=new Set(),active=new Set(),cycles=[];
function dfs(n,stack){if(active.has(n)){cycles.push([...stack.slice(stack.indexOf(n)),n]);return;}if(visited.has(n))return;visited.add(n);active.add(n);for(const to of adjacent.get(n))dfs(to,[...stack,n]);active.delete(n);}
for(const n of names)dfs(n,[]);
const cross=edges.filter(e=>e.from.split('/')[0]!==e.to.split('/')[0]);
const result={schema:'azheryn-module-network-v1',branches:Object.fromEntries(Object.entries(branches).map(([k,v])=>[k,v.sort()])),modules:files.length,connections:edges.length,crossBranchConnections:cross,unresolved,cycles,orphanModules:[...names].filter(n=>!edges.some(e=>e.to===n)&&!['main.tsx','App.tsx'].includes(n)).sort()};
if(require.main===module){process.stdout.write(JSON.stringify(result,null,2)+'\n');if(unresolved.length||cycles.length)process.exitCode=1;}
module.exports={audit:()=>result};
