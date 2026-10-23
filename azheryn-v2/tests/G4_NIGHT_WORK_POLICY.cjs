const test=require('node:test'); const assert=require('node:assert/strict'); const fs=require('node:fs');
const source=fs.readFileSync(new URL('../src/world/socialLife.ts',`file://${__filename}`),'utf8');
test('night work policy exposes explicit-order exception',()=>{assert.match(source,/return !isNight\(hour\) \|\| explicitOrder/);assert.match(source,/isNight\(hour\) && !explicitOrder/);});
const world=fs.readFileSync(new URL('../src/ui/WorldView.tsx',`file://${__filename}`),'utf8');
test('night policy wired to agent loop and autonomous hauling',()=>{assert.match(world,/shouldPauseAutonomousWork\(frameClimate.hour, Boolean\(ch.order\)\)/);assert.match(world,/!isNight\(frameClimate.hour\) && stockpile && !haul/);});
