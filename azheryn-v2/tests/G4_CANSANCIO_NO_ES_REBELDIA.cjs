const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {sharedPairMood,contextualPairDialogue}=require('../src/world/socialLife.ts');
test('fatigue has its own mood; it is not treated as resentment in WorldView',()=>{
 const source=fs.readFileSync(require('node:path').join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
 assert.match(source,/\(ch\.fatigue\?\.fatigue \?\? 0\)>50 \|\| ch\.resting\)\?'tired'/);
 assert.match(source,/\(partner\.fatigue\?\.fatigue \?\? 0\)>50 \|\| partner\.resting\) \? 'tired'/);
 assert.doesNotMatch(source,/fatigue\?\.fatigue \?\? 0\)>50\s*\?\s*'resentful'/);
});
test('tired pair dialogue stays on the rest topic without false accusations',()=>{
 assert.equal(sharedPairMood('tired','calm'),'tired');
 assert.equal(sharedPairMood('tired','resentful'),'resentful');
 const lines=[];
 for(let s=0;s<180;s++){const x=contextualPairDialogue('guard1','guard2',s*13,'es','tired');if(x)lines.push(x.text)}
 assert.ok(lines.some(x=>x.includes('cansado')));
 assert.ok(lines.every(x=>!x.includes('Mui')));
});
