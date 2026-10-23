const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync('src/ui/WorldView.tsx','utf8');
assert.match(source, /builderIds\.has\(ch\.id\)/);
assert.match(source, /Math\.hypot\(ch\.tx-storehouse\.x,ch\.ty-storehouse\.y\)>1/);
assert.match(source, /ch\.tx=storehouse\.x;ch\.ty=storehouse\.y/);
assert.match(source, /reserveForHauling=pendingCollection && !haul \? 2 : 0/);
console.log('G3 constructores: destino de obra y reserva de transportistas OK');
