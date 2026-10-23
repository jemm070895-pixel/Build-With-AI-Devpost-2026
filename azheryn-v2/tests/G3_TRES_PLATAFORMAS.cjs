const fs=require('node:fs');const assert=require('node:assert/strict');
const css=fs.readFileSync('src/index.css','utf8');const html=fs.readFileSync('index.html','utf8');
for(const s of ['pointer:coarse','min-width:721px','max-width:1180px','max-width:720px','orientation:landscape','env(safe-area-inset-bottom','100dvh','overflow-x:auto'])assert.ok(css.includes(s),`missing ${s}`);
assert.ok(html.includes('viewport-fit=cover'));
console.log('G3 three platform layout: OK');
