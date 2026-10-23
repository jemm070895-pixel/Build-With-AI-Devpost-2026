const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.join(__dirname,'..');
const canonical=fs.readFileSync(path.join(root,'public/intro/Fehe_original.jpeg'));
const character=fs.readFileSync(path.join(root,'public/characters/FEHE_CANONICA_13_PUNTAS.jpeg'));
assert(canonical.equals(character),'The approved Fehe must be the exact same image');
const world=fs.readFileSync(path.join(root,'src/ui/WorldView.tsx'),'utf8');
assert(world.includes('for (let j = 1; j <= 6; j++)'));
assert(world.includes('for (let j = 6; j >= 1; j--)'));
console.log('Fehe: referencia exacta y silueta de 13 puntas verificadas');
