const fs=require('node:fs');const assert=require('node:assert/strict');const path=require('node:path');
const s=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
assert.match(s,/if\(hit && orderModeRef\.current !== "logging"\)/,'Logging clicks must not be intercepted by nearby NPC selection');
assert.match(s,/orderModeRef\.current === "logging" && hitTree/,'Individual logging target must remain active');
assert.match(s,/worker\.loggingZone=undefined/,'Individual tree order must not become a zone order');
assert.match(s,/new CustomEvent\("azheryn-log-order"/,'Area logging must remain available');
assert.match(s,/t\("Este árbol ya está asignado a otro personaje","This tree is already assigned to another character"\)/,'Reservation notice must be bilingual');
console.log('OK: priority of explicit logging orders and bilingual feedback');
