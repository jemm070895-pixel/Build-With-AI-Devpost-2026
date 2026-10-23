const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {contextualPairDialogue,groupDialogueLine}=require('../src/world/socialLife.ts');
test('group statements cannot overwrite a paired question or answer',()=>{
 const view=fs.readFileSync(require('node:path').join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
 assert.match(view,/const contextualExchange=exchange;/);
 assert.match(view,/const utterance=pairedSlot \? contextualExchange : ambientLine;/);
 assert.match(view,/const ambientLine=variedBase\?\.kind==='speech' && collectiveLine && social/);
 assert.doesNotMatch(view,/contextualExchange=exchange && collectiveLine/);
});
test('paired context stays intact under collective social tension',()=>{
 const lines=[];
 for(let slot=0;slot<100;slot++){
  const line=contextualPairDialogue('guard1','guard2',slot*13,'es','resentful');
  if(line) lines.push(line.text);
 }
 assert.ok(lines.length>10);
 assert.equal(groupDialogueLine('solidarity','es'),'Debemos hablar juntos con Mui.');
 for(let i=0;i+1<lines.length;i+=2){
  assert.ok(lines[i].startsWith('¿'));
  assert.ok(!lines[i+1].startsWith('¿'));
 }
});
