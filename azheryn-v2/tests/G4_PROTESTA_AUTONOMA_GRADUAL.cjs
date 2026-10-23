const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const cp=require('node:child_process');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
test('G4 visual protest uses autonomous graded social intensity without cancelling orders',()=>{
 assert.match(source,/autonomousProtestIntensity\(ch\.social/);
 assert.match(source,/3\.5 \* protestIntensity/);
});
test('G4 protest intensity responds to resentment, rest and busy state',()=>{
 const modulePath=path.join(__dirname,'../src/world/socialLife.ts');
 const script=`import {autonomousProtestIntensity as f} from ${JSON.stringify(modulePath)}; const s=n=>({trustMui:65,resentment:n,fatigueComplaints:0,lastOrderHour:0}); if(f(s(10),0,false,false)!==0||f(s(90),0,true,false)!==0||f(s(90),0,false,true)!==0||!(f(s(90),0,false,false)>f(s(40),0,false,false))||!(f(s(90),0,false,false)>f(s(90),80,false,false))) process.exit(1);`;
 cp.execFileSync(process.execPath,['--experimental-strip-types','--input-type=module','-e',script],{stdio:'pipe'});
});
