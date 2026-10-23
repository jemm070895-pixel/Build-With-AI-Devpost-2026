const test=require('node:test');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const modulePath=pathToFileURL(path.resolve(__dirname,'../src/world/socialLife.ts')).href;
test('non-numeric guard identifiers stagger their speech slots deterministically',async()=>{
 const {socialUtterance}=await import(modulePath);
 const ids=['alpha','bravo','charlie','delta','echo','foxtrot','golf','hotel'];
 const schedules=ids.map(id=>Array.from({length:20},(_,i)=>Boolean(socialUtterance(id,i*11,'es','calm',false))).join(''));
 assert.ok(new Set(schedules).size>=3,'distinct NPCs must not all share the same dialogue schedule');
 for(const id of ids) assert.deepEqual(socialUtterance(id,33,'es','calm',false),socialUtterance(id,33,'es','calm',false));
});
test('numeric IDs preserve established schedules and malformed IDs are safe',async()=>{
 const {socialUtterance}=await import(modulePath);
 assert.equal(socialUtterance('guardia1',33,'es','calm',false)?.kind,'speech');
 assert.equal(socialUtterance('  ',33,'es','calm',false),null);
 assert.doesNotThrow(()=>socialUtterance('guardia999999999999999999999999',33,'en','calm',false));
});
