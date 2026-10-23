const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync('src/ui/WorldView.tsx','utf8');
test('la mirada al interlocutor solo se activa con dialogo emparejado visible',()=>{
  const placement=source.indexOf('if (!placement) { ctx.restore(); continue; }');
  const cue=source.indexOf('const partnerScreen = toScreen(partner);');
  assert.ok(placement>=0 && cue>placement);
  assert.match(source,/utterance\.kind === 'speech' && pairedSlot && partner && z >= 1\.1 && !ch\.resting/);
  assert.match(source,/Math\.sign\(partnerScreen\.x - s\.x\)/);
  assert.match(source,/Number\.isFinite\(partnerScreen\.x\)/);
});
