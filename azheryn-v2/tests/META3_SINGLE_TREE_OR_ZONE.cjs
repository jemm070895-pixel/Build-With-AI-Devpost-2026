const fs=require('node:fs');const assert=require('node:assert/strict');
const s=fs.readFileSync(require('node:path').join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
assert.match(s,/orderModeRef\.current === "logging" && hitTree/,'Single tree click must be explicit logging mode');
assert.match(s,/worker\.loggingZone=undefined; \/\/ Exact tree order/,'Single tree must not auto-continue into a zone');
assert.match(s,/window\.dispatchEvent\(new CustomEvent\("azheryn-log-order"/,'Zone order must remain available');
console.log('OK: tala de árbol individual y tala por zona diferenciadas');
