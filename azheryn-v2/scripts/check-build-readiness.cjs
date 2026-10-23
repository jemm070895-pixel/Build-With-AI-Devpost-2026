/** Offline-friendly build preflight: does not claim compilation succeeded. */
const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');const pkg=require(path.join(root,'package.json'));
const required={...pkg.dependencies,...pkg.devDependencies};
const missing=[];
for(const name of Object.keys(required)){
 try{const file=require.resolve(name+'/package.json',{paths:[root]});if(!fs.statSync(file).isFile())missing.push(name)}
 catch{missing.push(name)}
}
console.log('Node:',process.version);
if(missing.length){console.error('DEPENDENCIAS AUSENTES:',missing.join(', '));console.error('En Windows, desde la carpeta azheryn-v2: npm ci && npm run build');process.exitCode=1}
else console.log('Dependencias encontradas. Ejecuta npm run build para comprobar la compilación; este control NO compila.');
