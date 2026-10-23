const assert = require("node:assert/strict");
const fs = require("node:fs");
const src = fs.readFileSync("src/world/renderer.ts", "utf8");
assert.match(src, /Stable shoals/);
assert.match(src, /fishCount = 2/);
assert.match(src, /direction = heading/);
assert.match(src, /ctx\.scale\(direction, 1\)/);
assert.match(src, /depth > 0\.018/);
console.log("G2 bancos de peces: OK");
