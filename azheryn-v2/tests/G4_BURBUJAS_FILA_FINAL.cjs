const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
test('recovers last visible row even when vertical scan stride skips it',()=>{
 const code=`import {placeSocialBubble} from '../src/world/socialLife.ts';
 const occupied=[{x:0,y:0,width:100,height:19}];
 const bubble=placeSocialBubble({x:0,y:0,width:100,height:20},occupied,100,42);
 if(!bubble || bubble.y!==22) throw Error('bottom edge missed: '+JSON.stringify(bubble));`;
 const temp=path.join(root,'tests','.__g4_last_row.mts');
 try{fs.writeFileSync(temp,code);execFileSync(process.execPath,['--experimental-strip-types',temp],{cwd:root,stdio:'pipe'});}finally{fs.rmSync(temp,{force:true});}
});
