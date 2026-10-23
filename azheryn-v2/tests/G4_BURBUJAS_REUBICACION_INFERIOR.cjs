const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
test('top-edge bubbles can move down without overlap',()=>{
 const code=`import {placeSocialBubble} from '../src/world/socialLife.ts';
 const first={x:20,y:0,width:90,height:22};
 const moved=placeSocialBubble(first,[first],160,110);
 if(!moved || moved.y<25 || moved.y+moved.height>110) throw Error('downward relocation');
 const top=placeSocialBubble(first,[],160,110);
 if(!top || top.y!==0) throw Error('unchanged preferred position');
 const occupied=[0,27,54,81].map(y=>({x:20,y,width:90,height:22}));
 if(placeSocialBubble(first,occupied,160,110)!==null) throw Error('fully occupied column');`;
 const temp=path.join(root,'tests','.__g4_downward_test.mts');
 try{fs.writeFileSync(temp,code);execFileSync(process.execPath,['--experimental-strip-types',temp],{cwd:root,stdio:'pipe'});}finally{fs.rmSync(temp,{force:true});}
});
