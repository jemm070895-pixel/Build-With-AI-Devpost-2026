import assert from 'node:assert/strict';
import { clamp, lerp, hash2, fbm } from '../src/noise.ts';
assert.equal(clamp(5,0,3),3);
assert.equal(lerp(0,10,.5),5);
assert.equal(hash2(1,2,3),hash2(1,2,3));
assert.ok(fbm(.2,.4,5)>=0 && fbm(.2,.4,5)<=1);
console.log('PASS: 4 smoke checks');
