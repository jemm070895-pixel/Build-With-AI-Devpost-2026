const assert=require('node:assert/strict');
const fs=require('node:fs');
const sw=fs.readFileSync(require('node:path').join(__dirname,'../public/sw.js'),'utf8');
assert.match(sw,/await cache\.put\(req, response\.clone\(\)\)/);
assert.match(sw,/await cache\.put\(ROOT\.href, response\.clone\(\)\)/);
assert.match(sw,/caches\.match\(ROOT\.href\)/);
assert.match(sw,/url\.origin !== ROOT\.origin/);
console.log('OFFLINE CACHE REGRESSION: 4 comprobaciones correctas');
