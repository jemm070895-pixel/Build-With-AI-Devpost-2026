const {test}=require('node:test');
const assert=require('node:assert/strict');
const {contextualPairDialogue}=require('../src/world/socialLife.ts');
test('each question is followed by its matching answer across topic boundaries',()=>{
 const pairs=[['guard1','guard2'],['guard3','guard7'],['npc11','npc15']];
 const expected=[['¿Cómo marcha el almacén?','La madera está lista.'],['¿Has visto los troncos?','Están en el acopio.'],['¿Descansamos junto al fuego?','Cuando termine mi tarea.']];
 for(const [a,b] of pairs){
  const utterances=[];
  for(let slot=0;slot<180;slot++){
   const u=contextualPairDialogue(a,b,slot*13,'es','calm');
   if(u) utterances.push(u);
  }
  assert.ok(utterances.length>15);
  for(let i=0;i+1<utterances.length;i+=2){
   const topic=expected.findIndex(([question])=>question===utterances[i].text);
   assert.notEqual(topic,-1,`expected question, got ${utterances[i].text}`);
   assert.equal(utterances[i+1].text,expected[topic][1]);
   assert.notEqual(utterances[i].speaker,utterances[i+1].speaker);
  }
 }
});
