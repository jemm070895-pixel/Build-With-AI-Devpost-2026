const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const src=fs.readFileSync('src/ui/WorldView.tsx','utf8');
test('construction decoration derives from committed logs without consuming resources',()=>{
  assert.match(src,/const braceCount=Math.min\(8,Math.floor\(installed\/8\)\)/);
  assert.match(src,/const scraps=Math.min\(6,Math.floor\(installed\/12\)\)/);
});
test('idle construction animation respects night pause',()=>{
  assert.match(src,/const building = !isNight\(characterSun.hour\)/);
});
