const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const social=fs.readFileSync('src/world/socialLife.ts','utf8');
const view=fs.readFileSync('src/ui/WorldView.tsx','utf8');
test('paired exchanges have distinct replies in both languages',()=>{assert.match(social,/pairedDialogue\(/);assert.match(social,/Avanzamos juntos/);assert.match(social,/making progress together/);assert.match(social,/necesitamos descansar/)});
test('world renders paired exchanges without overriding ancestral thought',()=>{assert.match(view,/contextualPairDialogue\(ch.id,partner.id,seconds,language/);assert.match(view,/const base=socialUtterance/)});
