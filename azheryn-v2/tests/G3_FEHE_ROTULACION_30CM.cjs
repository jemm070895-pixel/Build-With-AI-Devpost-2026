const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const root=path.join(__dirname,'..');const story=fs.readFileSync(path.join(root,'src/ui/IntroStory.tsx'),'utf8');const meta=fs.readFileSync(path.join(root,'src/foundation/meta0.ts'),'utf8');
assert.ok(fs.statSync(path.join(root,'public/intro/Fehe_canonica_30cm.jpeg')).size>100000);
assert.match(story,/Fehe_canonica_30cm\.jpeg/g);assert.match(story,/17 cm y su mango 13 cm: 30 cm/);
assert.match(meta,/totalLengthCm: 30/);assert.match(meta,/bladeLengthCm: 17/);assert.match(meta,/handleLengthCm: 13/);
console.log('OK: Fehe canonica rotulada 30 cm, hoja 17 cm, mango 13 cm');
