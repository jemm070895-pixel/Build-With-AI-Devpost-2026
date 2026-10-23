const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('src/ui/WorldView.tsx','utf8');
test('fog and rain rings retain appearance without moving under reduced motion',()=>{
 assert.match(source,/const reduceWeatherMotion = reducedMotionFrame/);
 assert.match(source,/const time=reduceWeatherMotion \? 0 : wildlifeSimulationSeconds/);
});
test('rain streak positions stop moving for reduced motion, while rain remains visible',()=>{
 assert.match(source,/const reduceRainMotion = reducedMotionFrame/);
 assert.match(source,/const rainFrameTime = reduceRainMotion \? 0 : wildlifeSimulationSeconds \* 1000/);
 assert.match(source,/const rainOffsetY = Math\.floor\(rainFrameTime \/ 20\) \* 17/);
});
