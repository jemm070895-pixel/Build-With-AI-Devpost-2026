const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('variantes sociales conectadas a burbujas sin reemplazar pensamientos ancestrales',()=>{
 assert.match(src,/socialDialogueVariant\(ch\.id,seconds,language,mood\)/);
 assert.match(src,/base\?\.kind==='speech'/);
 assert.match(src,/pairedSlot \? contextualExchange : ambientLine/);
});
