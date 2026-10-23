const fs=require('node:fs');const assert=require('node:assert/strict');
const ui=fs.readFileSync('src/ui/WorldView.tsx','utf8');
assert.match(ui,/stockpilePlaced:Boolean\(stockpile\)/);
assert.match(ui,/waiting:felledLogs\.filter/);
assert.match(ui,/busyGuards:characters\.filter/);
assert.match(ui,/aria-valuenow=\{Math\.min\(91,buildingProgress\.committed\)\}/);
assert.match(ui,/logsCount\.stockpilePlaced\?"done"/);
console.log('G3 operational dashboard checks passed');
