const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const social=fs.readFileSync('src/world/socialLife.ts','utf8');const ui=fs.readFileSync('src/ui/WorldView.tsx','utf8');
test('night boundary and player attribution are defined',()=>{assert.match(social,/hour >= 20 \|\| hour < 6/);assert.match(social,/return 'Mui'/)});
test('ancestral thoughts, two interface languages, fire and night construction gate',()=>{assert.match(social,/Kilu/);assert.match(social,/language==='es'/);assert.match(ui,/drawCampfire\(\)/);assert.match(ui,/!isNight\(frameClimate.hour\) && storehouse/)});
