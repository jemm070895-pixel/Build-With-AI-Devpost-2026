const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
test('displaced bubble connector points to the nearest boundary',()=>{
 const code=`import {socialBubbleConnector} from '../src/world/socialLife.ts';
 const b={x:50,y:30,width:80,height:20};
 const c=socialBubbleConnector(b,{x:10,y:40});
 if(!c || c.toX!==50 || c.toY!==40) throw Error('wrong attachment');
 if(socialBubbleConnector(b,{x:49,y:40})!==null) throw Error('unnecessary connector');
 if(socialBubbleConnector(b,{x:NaN,y:40})!==null) throw Error('invalid coordinate');`;
 const temp=path.join(root,'tests','.__g4_connector_test.mts');
 try{fs.writeFileSync(temp,code);execFileSync(process.execPath,['--experimental-strip-types',temp],{cwd:root,stdio:'pipe'});}finally{fs.rmSync(temp,{force:true});}
});
test('renderer uses the connector without altering dialogue selection',()=>{
 const source=fs.readFileSync(path.join(root,'src/ui/WorldView.tsx'),'utf8');
 assert.match(source,/socialBubbleConnector\(placement,\{x:s\.x,y:s\.y-34\*z\}\)/);
 assert.match(source,/ctx\.lineTo\(connector\.toX,connector\.toY\)/);
});
