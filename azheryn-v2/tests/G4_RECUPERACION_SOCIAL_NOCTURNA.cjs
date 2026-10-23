const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('La pausa nocturna recupera presion social antes del continue',()=>{
  const branch=source.split('if (shouldPauseAutonomousWork(frameClimate.hour, Boolean(ch.order))) {')[1].split('          if(ch.fatigue){')[0];
  assert.match(branch,/socialRestSeconds/);
  assert.match(branch,/restSocialState\(/);
  assert.ok(branch.indexOf('restSocialState(')<branch.indexOf('continue;'));
});
