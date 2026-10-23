const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('fogata dibuja humo acotado y adaptado a la camara', () => {
  const campfire = source.slice(source.indexOf('const drawCampfire ='), source.indexOf('const drawCharacters ='));
  assert.match(campfire, /if \(z >= \.85\)/);
  assert.match(campfire, /for\(let i=0;i<6;i\+\+\)/);
  assert.match(campfire, /\(1-age\)/);
  assert.match(campfire, /ctx\.restore\(\);/);
});
test('humo no modifica estado ni ordenes', () => {
  const smoke = source.slice(source.indexOf('// G4: a restrained, wind-drifting smoke'), source.indexOf('const drawCharacters ='));
  assert.doesNotMatch(smoke, /setState|dispatch|\.order\s*=|\.resting\s*=/);
});
