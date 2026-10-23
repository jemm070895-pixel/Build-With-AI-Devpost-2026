const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'src/ui/WorldView.tsx'),'utf8');
test('renderer uses collision-aware layout',()=>{
 assert.match(source,/placeSocialBubble\(layout,occupiedSocialBubbles/);
 assert.match(source,/occupiedSocialBubbles\.push\(placement\)/);
});
test('bubble placement avoids overlap and handles crowded viewports',()=>{
 const code=`import {placeSocialBubble} from '../src/world/socialLife.ts';
 const a={x:20,y:65,width:100,height:22};
 const first=placeSocialBubble(a,[],200,120);
 if(!first || first.y!==65) throw Error('initial placement');
 const second=placeSocialBubble(a,[first],200,120);
 if(!second || second.y>=first.y-22) throw Error('vertical avoidance');
 const full=Array.from({length:6},(_,i)=>({x:20,y:i*27,width:100,height:22}));
 if(placeSocialBubble(a,full,200,120)!==null) throw Error('crowding');
 if(placeSocialBubble(a,[],80,120)!==null) throw Error('small viewport');`;
 const temp=path.join(root,'tests','.__g4_bubble_test.mts');
 try {fs.writeFileSync(temp,code);execFileSync(process.execPath,['--experimental-strip-types',temp],{cwd:root,stdio:'pipe'});}finally{fs.rmSync(temp,{force:true});}
});
