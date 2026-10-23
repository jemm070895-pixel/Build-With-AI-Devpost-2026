const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const src = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
const wildlife = src.split('const drawPeacefulWildlife = (wildlifeLight: ReturnType<typeof climateClock.snapshot>) => {')[1].split('const drawG4NightVignette')[0];
test('G4 fauna: reduced motion freezes decorative cycles but keeps navigation live', () => {
  assert.match(wildlife, /const reduceWildlifeMotion = reducedMotionFrame/);
  assert.match(wildlife, /const motionTime = reduceWildlifeMotion \? 0 : time/);
  assert.match(wildlife, /animalAvoidance\(animal, time, characters\)/);
  assert.match(wildlife, /animalAvoidance\(animal, time \+ \.2, characters\)/);
  assert.doesNotMatch(wildlife, /Math\.sin\(time/);
});
test('G4 fauna: reduced motion disables hops and eyelid flashes', () => {
  assert.match(wildlife, /animal.kind === "rabbit" && !reduceWildlifeMotion/);
  assert.match(wildlife, /const deerBlink = detailed && !reduceWildlifeMotion/);
  assert.match(wildlife, /const rabbitBlink = detailed && !reduceWildlifeMotion/);
});
