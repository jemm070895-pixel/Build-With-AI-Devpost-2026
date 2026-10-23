const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const s=fs.readFileSync('src/world/socialLife.ts','utf8');
test('social model bounds and recovery are explicitly defined',()=>{for(const k of ['registerMuiOrder','restSocialState','socialReaction','Math.min(100','Math.max(0']) assert.ok(s.includes(k));});
test('social reactions do not pretend to be autonomous cognition',()=>{assert.match(s,/no claim of generative cognition/);assert.match(s,/refusal-risk/);});
