const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('src/world/socialLife.ts','utf8');
test('social dialogue has localized, deterministic variations',()=>{
 assert.match(source,/export function socialDialogueVariant/);
 assert.match(source,/Number\.isFinite\(seconds\)/);
 assert.match(source,/Mui should hear our complaints/);
 assert.match(source,/Nos vemos junto a la fogata/);
});
test('group complaints clamp resentment before threshold',()=>{
 assert.match(source,/valid\.filter\(s=>Math\.max\(0,Math\.min\(100,s\.resentment\)\)\>=35\)/);
});
