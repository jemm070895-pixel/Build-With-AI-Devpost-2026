const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('Costuras se dibujan solo con zoom cercano y restauran linea continua',()=>{
  assert.match(source,/if \(z >= 1\.05\) \{[\s\S]*?ctx\.setLineDash\(\[1\.15\*z,1\.55\*z\]\)[\s\S]*?ctx\.setLineDash\(\[\]\)/);
});
test('Hebilla diferenciada entre Mui y guardias sin cambiar la Fehe',()=>{
  assert.match(source,/if \(z >= \.95\) \{\s*ctx\.fillStyle = ch\.mui \? "#e3c57b" : "#b5a184"/);
  assert.match(source,/const handleH = bladeH \* \(13 \/ 17\)/);
});
