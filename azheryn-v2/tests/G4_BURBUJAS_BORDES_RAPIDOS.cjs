const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
test('recovers edge-aligned free space without overlapping nearby dialogue',()=>{
 const code=`import {placeSocialBubble} from '../src/world/socialLife.ts';
 const occupied=[{x:0,y:0,width:30,height:100},{x:78,y:0,width:42,height:100}];
 const result=placeSocialBubble({x:0,y:0,width:40,height:20},occupied,120,100);
 if(!result || result.x<33 || result.x+result.width>75) throw Error('edge gap lost: '+JSON.stringify(result));
 if(occupied.some(o=>result.x<o.x+o.width+3 && result.x+result.width+3>o.x && result.y<o.y+o.height+3 && result.y+result.height+3>o.y)) throw Error('overlap');`;
 const temp=path.join(root,'tests','.__g4_edges_test.mts');
 try{fs.writeFileSync(temp,code);execFileSync(process.execPath,['--experimental-strip-types',temp],{cwd:root,stdio:'pipe'});}finally{fs.rmSync(temp,{force:true});}
});
