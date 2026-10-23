const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
assert.match(src,/squadShortcuts: Record<string,string>/);assert.match(src,/"1":"mui","2":"guards","3":"all","0":"clear"/);assert.match(src,/k === "m" \|\| k === "t"/);assert.match(src,/target\.isContentEditable/);assert.match(src,/animalAvoidance\(animal, time \+ \.2, characters\)/);assert.match(src,/const hopping = animal.kind === "rabbit"/);console.log('PASS G3 fauna y atajos');
