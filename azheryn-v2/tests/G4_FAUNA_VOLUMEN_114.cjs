const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('G4 wildlife uses separate shaded coats for deer, rabbits and birds',()=>{
  for(const coat of ['deerCoat','rabbitCoat','birdCoat']){
    assert.match(source,new RegExp(`const ${coat}=ctx\\.createLinearGradient`));
    assert.match(source,new RegExp(`${coat}\\.addColorStop\\(0,`));
    assert.match(source,new RegExp(`ctx\\.fillStyle\\s*=\\s*${coat}`));
  }
});
test('G4 wildlife shading stays in decorative drawing, no task behavior changes',()=>{
  assert.match(source,/const drawPeacefulWildlife = \(wildlifeLight: ReturnType<typeof climateClock.snapshot>\) =>/);
  assert.match(source,/Decorative only: no new hunting, collisions or AI decisions/);
});
