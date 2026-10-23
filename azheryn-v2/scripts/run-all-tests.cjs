/** Runs every Chapter 1 regression, including TypeScript runtime checks. */
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const files=fs.readdirSync(path.join(root,'tests')).filter(f=>f.endsWith('.cjs')).sort();
let passed=0;const failed=[];
for(const file of files){
  const result=spawnSync(process.execPath,['--experimental-strip-types',path.join(root,'tests',file)],{cwd:root,encoding:'utf8',timeout:45000});
  if(result.status===0){passed++;console.log('OK  '+file);}
  else {failed.push(file);console.error('FAIL '+file+'\n'+(result.stderr||result.stdout||result.error||''));}
}
console.log(`RESULTADO: ${passed}/${files.length} pruebas superadas`);
if(failed.length)process.exitCode=1;
