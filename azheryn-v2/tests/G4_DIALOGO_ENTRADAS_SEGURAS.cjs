const assert = require('node:assert/strict');
const {test} = require('node:test');
const {pathToFileURL} = require('node:url');
const path = require('node:path');
const modulePath = pathToFileURL(path.resolve(__dirname,'../src/world/socialLife.ts')).href;
test('G4: reloj no finito o negativo no genera expresiones', async () => {
 const {socialUtterance}=await import(modulePath);
 for(const value of [NaN,Infinity,-Infinity,-1]) assert.equal(socialUtterance('guardia1',value,'es','calm',false),null);
 assert.equal(socialUtterance('',22,'es','calm',false),null);
});
test('G4: pareja con identificadores vacíos no conversa',async()=>{
 const {conversationTurn}=await import(modulePath);
 assert.equal(conversationTurn(' ','guardia1',13),false);
 assert.equal(conversationTurn('guardia1',' ',13),false);
});
