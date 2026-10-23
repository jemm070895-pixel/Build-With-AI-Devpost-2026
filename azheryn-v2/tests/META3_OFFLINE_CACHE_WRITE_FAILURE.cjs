const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sw = fs.readFileSync(path.join(__dirname, '../public/sw.js'), 'utf8');
assert.match(sw, /try \{ const cache = await caches\.open\(CACHE\)/);
assert.match(sw, /catch \(_\) \{/);
console.log('OK: cache write failures do not reject valid online responses');
