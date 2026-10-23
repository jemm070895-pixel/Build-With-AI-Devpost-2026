const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
test('diagonal fallback finds a free slot in a crowded screen',()=>{
 const code=`import {placeSocialBubble} from '../src/world/socialLife.ts';
 const preferred={x:10,y:10,width:40,height:20};
 const occupied=[
   ...[10,37,64,91].map(y=>({x:10,y,width:40,height:20})),
   {x:55,y:10,width:40,height:20},
   {x:0,y:10,width:9,height:20}
 ];
 const result=placeSocialBubble(preferred,occupied,110,120);
 if(!result || result.x!==55 || result.y!==35) throw Error('expected diagonal fallback: '+JSON.stringify(result));
 if(result.x+result.width>110 || result.y+result.height>120) throw Error('outside viewport');`;
 const temp=path.join(root,'tests','.__g4_diagonal_test.mts');
 try{fs.writeFileSync(temp,code);execFileSync(process.execPath,['--experimental-strip-types',temp],{cwd:root,stdio:'pipe'});}finally{fs.rmSync(temp,{force:true});}
});
