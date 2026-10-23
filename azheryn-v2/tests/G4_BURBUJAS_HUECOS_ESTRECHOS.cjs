const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
test('finds narrow free gaps missed by fixed-column offsets',()=>{
 const code=`import {placeSocialBubble} from '../src/world/socialLife.ts';
 const occupied=[{x:0,y:0,width:10,height:60},{x:57,y:0,width:43,height:60}];
 const result=placeSocialBubble({x:0,y:0,width:40,height:20},occupied,100,60);
 if(!result || result.x<13 || result.x+result.width>54) throw Error('gap not recovered: '+JSON.stringify(result));
 if(occupied.some(o=>result.x<o.x+o.width+3 && result.x+result.width+3>o.x && result.y<o.y+o.height+3 && result.y+result.height+3>o.y)) throw Error('overlap');`;
 const temp=path.join(root,'tests','.__g4_gap_test.mts');
 try{fs.writeFileSync(temp,code);execFileSync(process.execPath,['--experimental-strip-types',temp],{cwd:root,stdio:'pipe'});}finally{fs.rmSync(temp,{force:true});}
});
