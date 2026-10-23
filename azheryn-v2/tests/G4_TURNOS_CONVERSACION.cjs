const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const social=fs.readFileSync('src/world/socialLife.ts','utf8');
const view=fs.readFileSync('src/ui/WorldView.tsx','utf8');
test('alternating conversation speaker is deterministic and stable',()=>{
 assert.match(social,/export function conversationSpeaker/);
 assert.match(social,/pair\[Math\.floor\(Math\.max\(0,seconds\)\/13\)%2\]/);
});
test('only selected NPC emits paired social dialogue',()=>{
 assert.match(view,/contextualPairDialogue\(ch\.id,partner\.id,seconds,language/);
});
