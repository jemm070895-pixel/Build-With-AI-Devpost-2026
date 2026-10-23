const fs=require('node:fs'); const assert=require('node:assert/strict');
const src=fs.readFileSync(require('node:path').join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
assert.match(src,/if \(waitingLogs\) \{/,'Stockpiled logs must trigger builder dispatch even during hauling');
assert.doesNotMatch(src,/if \(waitingLogs && !haul/,'Hauling must not block building');
assert.match(src,/stockpileSlot\(stockpile,felledLogs\.filter\(l=>l\.stockpiled && !l\.usedForStorehouse\)\.length\)/,'Consumed logs must not occupy future stockpile slots');
console.log('PASS parallel construction and hauling checks');
