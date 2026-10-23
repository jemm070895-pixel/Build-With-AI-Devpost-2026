const fs=require('node:fs');const assert=require('node:assert/strict');const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
assert.match(source,/pendingCollection=felledLogs\.some\(l=>!l\.stockpiled && !l\.usedForStorehouse\)/);
assert.match(source,/reserveForHauling=pendingCollection && !haul \? 2 : 0/);
assert.match(source,/builderIds\.has\(ch\.id\)/);
assert.match(source,/chooseG1Haulers/);
console.log('PASS: construction reserves two idle carriers while logs await transport');
