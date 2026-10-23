const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('src/ui/WorldView.tsx','utf8');
assert.match(source,/const localizedNotice =/);
assert.match(source,/workNotice \? localizedNotice\(workNotice\)/);
assert.match(source,/"Logging area exhausted"/);
assert.match(source,/"Time and weather"/);
assert.match(source,/"Log allocation:/);
console.log('OK: notice rendering and remaining blueprint labels are language-aware');
