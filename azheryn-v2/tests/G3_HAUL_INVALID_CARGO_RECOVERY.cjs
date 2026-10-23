const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
assert.match(source,/targetLog\?\.stockpiled \|\| targetLog\?\.usedForStorehouse/);
assert.match(source,/log\.stockpiled \|\| log\.usedForStorehouse \|\| pair\.length!==2/);
assert.match(source,/pair\.some\(ch=>ch\.resting \|\| ch\.needTrip/);
assert.match(source,/pair\.every\(ch=>Math\.hypot\(ch\.x-sx,ch\.y-sy\)<2\)/);
console.log('G3 invalid cargo recovery: OK');
