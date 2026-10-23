const assert = require("node:assert/strict");
const fs = require("node:fs");
const s = fs.readFileSync("src/ui/WorldView.tsx", "utf8");
assert.match(s, /fromTouchTap \? 32 : 18/);
assert.match(s, /fromTouchTap \? 28 : 12/);
assert.match(s, /as PointerEvent, true\)/);
console.log("OK: objetivos táctiles ampliados sin alterar clics de escritorio");
