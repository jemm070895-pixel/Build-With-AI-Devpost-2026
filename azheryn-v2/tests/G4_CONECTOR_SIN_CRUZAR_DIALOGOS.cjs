const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
test('connectors avoid other dialogue bubbles while retaining clear paths',()=>{
 const temp=path.join(root,'tests','.__g4_connector_obstacles.mts');
 const source=`import {socialConnectorUnobstructed as clear} from '../src/world/socialLife.ts';
 const c={x:0,y:10,toX:100,toY:10};
 if(clear(c,[{x:40,y:0,width:20,height:20}]))throw Error('crosses bubble');
 if(!clear(c,[{x:40,y:30,width:20,height:20}]))throw Error('clear connector hidden');
 if(!clear({x:0,y:0,toX:100,toY:100},[{x:40,y:60,width:10,height:10}]))throw Error('diagonal false positive');
 if(clear({x:NaN,y:0,toX:1,toY:1},[]))throw Error('nonfinite connector');`;
 try{fs.writeFileSync(temp,source);execFileSync(process.execPath,['--experimental-strip-types',temp],{cwd:root,stdio:'pipe'});}finally{fs.rmSync(temp,{force:true});}
});
