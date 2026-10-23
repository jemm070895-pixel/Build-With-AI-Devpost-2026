const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const source=fs.readFileSync('src/world/socialLife.ts','utf8');
test('group climate is deterministic and bounded',()=>{assert.match(source,/export function groupSocialClimate/);assert.match(source,/Number.isFinite\(s.resentment\)/);assert.match(source,/Math.min\(100,s.resentment\)/)});
test('group climate does not force refusal',()=>{const fn=source.slice(source.indexOf('export function groupSocialClimate'));assert.doesNotMatch(fn,/ch.order\s*=|refuseOrder\(/)});
