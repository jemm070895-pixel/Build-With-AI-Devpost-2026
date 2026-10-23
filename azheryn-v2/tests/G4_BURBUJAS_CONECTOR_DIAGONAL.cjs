const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
test('diagonal tether touches first crossed bubble edge, not a corner',()=>{
 const source=`import {socialBubbleConnector} from '../src/world/socialLife.ts';
 const b={x:50,y:30,width:80,height:20};
 const c=socialBubbleConnector(b,{x:10,y:0});
 if(!c || Math.abs(c.toY-30)>1e-7 || !(c.toX>50 && c.toX<130)) throw Error('wrong diagonal attachment');
 if(socialBubbleConnector(b,{x:90,y:40})!==null) throw Error('inside bubble');
 if(socialBubbleConnector(b,{x:Infinity,y:0})!==null) throw Error('invalid coordinate');`;
 const temp=path.join(root,'tests','.__g4_connector_diagonal.mts');
 try{fs.writeFileSync(temp,source);execFileSync(process.execPath,['--experimental-strip-types',temp],{cwd:root,stdio:'pipe'});}finally{fs.rmSync(temp,{force:true});}
});
