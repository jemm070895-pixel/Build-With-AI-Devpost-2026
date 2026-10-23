const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const view=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
for(const feature of ['const drawCharacters','const facing =','const swing =','Fehe canonica: silueta de hoja triangular','Cross-body strap','G2 trunk: dark bark','Canopy volume: separate shadow','if(!tree.standing)']) assert.ok(view.includes(feature),`Missing G2 feature: ${feature}`);
for(const id of ['broadleaf','fruit','tall','dense','light']) assert.ok(view.includes(`case "${id}"`),`Missing species ${id}`);
console.log('OK: G2 character detailing, Fehe rendering, five tree silhouettes, and stumps retained');
