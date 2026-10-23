const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
test('crowded dialogue uses adjacent columns while preserving viewport bounds',()=>{
 const code=`import {placeSocialBubble} from '../src/world/socialLife.ts';
 const first={x:20,y:0,width:90,height:22};
 const occupied=[0,27,54,81].map(y=>({x:20,y,width:90,height:22}));
 const moved=placeSocialBubble(first,occupied,240,110);
 if(!moved || moved.x<115 || moved.y!==0 || moved.x+moved.width>240) throw Error('adjacent column placement');
 if(placeSocialBubble(first,occupied,160,110)!==null) throw Error('must hide when no column fits');
 const clear=placeSocialBubble(first,[],240,110);
 if(!clear || clear.x!==20 || clear.y!==0) throw Error('preferred placement should be preserved');`;
 const temp=path.join(root,'tests','.__g4_columns_test.mts');
 try{fs.writeFileSync(temp,code);execFileSync(process.execPath,['--experimental-strip-types',temp],{cwd:root,stdio:'pipe'});}finally{fs.rmSync(temp,{force:true});}
});
