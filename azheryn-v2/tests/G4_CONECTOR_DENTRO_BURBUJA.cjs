const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
test('connector is omitted when the speaker is inside or on the bubble boundary',()=>{
 const temp=path.join(root,'tests','.__g4_connector_inside.mts');
 const source=`import {socialBubbleConnector as link} from '../src/world/socialLife.ts';
 const b={x:10,y:10,width:100,height:25};
 for(const s of [{x:20,y:20},{x:10,y:20},{x:110,y:35}])if(link(b,s)!==null)throw Error('connector inside bubble');
 const external=link(b,{x:60,y:80});
 if(!external || Math.abs(external.toY-35)>1e-6)throw Error('external connector broken');`;
 try{fs.writeFileSync(temp,source);execFileSync(process.execPath,['--experimental-strip-types',temp],{cwd:root,stdio:'pipe'});}finally{fs.rmSync(temp,{force:true});}
});
