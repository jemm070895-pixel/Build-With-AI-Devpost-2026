const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('animal shadows vanish without daylight',()=>assert.match(src,/wildlifeShadowLight = Math\.max\(0, Math\.min\(1, wildlifeLight\.light/));
test('animal shadows reuse same climate snapshot as scene',()=>assert.match(src,/drawPeacefulWildlife\(g3Weather\)/));
