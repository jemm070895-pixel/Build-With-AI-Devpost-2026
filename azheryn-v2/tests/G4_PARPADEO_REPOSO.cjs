const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('parpadeo breve individual y cierre de ojos en descanso',()=>{
  assert.match(source,/const blinkCycle = \(now \/ 1000 \+ guardIndex \* 1\.37\) % \(3\.8 \+ \(guardIndex % 3\) \* \.65\)/);
  assert.match(source,/const eyesClosed = \(!ch\.mui && ch\.resting\) \|\| \(idleBreathing && blinkCycle < \.13\)/);
  assert.match(source,/if \(eyesClosed\)/);
});
test('parpadeo modifica solamente el dibujo de los ojos',()=>{
  const section=source.split('const blinkCycle = ')[1].split('line(-1.7,-20')[0];
  assert.doesNotMatch(section,/ch\.(fatigue|order|resting)\s*=/);
  assert.match(section,/ctx\.fillRect/);
});
