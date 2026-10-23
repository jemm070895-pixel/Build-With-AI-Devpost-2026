const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('G4 tunic shading uses zoom gate and restrained highlights', () => {
  assert.match(source, /if \(z >= \.85\) \{[\s\S]*?rgba\(178,161,201,\.20\)[\s\S]*?rgba\(15,13,18,\.20\)/);
});
test('G4 cloth shading retains Mui and guard palettes and original belt', () => {
  assert.match(source, /ch\.mui \? "rgba\(178,161,201,\.20\)" : "rgba\(226,201,160,\.13\)"/);
  assert.match(source, /line\(-4,-12,4,-12,ch\.mui\?"#d9b568":"#493b2c",1\.5\)/);
});
