const fs=require('node:fs');const assert=require('node:assert/strict');const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
assert(src.includes('founding-portraits'));assert(src.includes('guardTunics'));assert(src.includes('guardHair'));
for(let i=1;i<=7;i++)assert(fs.statSync(path.join(__dirname,`../public/characters/guard-${i}.webp`)).size>2000);
assert(fs.statSync(path.join(__dirname,'../public/characters/mui.webp')).size>2000);
assert(fs.statSync(path.join(__dirname,'../public/characters/REFERENCIA_PERSONAJES.webp')).size>10000);
assert(fs.statSync(path.join(__dirname,'../../assets/fotos_y_bocetos/Fehe.jpeg')).size>1000);
console.log('Retratos 8/8 y referencia Fehe original OK');
