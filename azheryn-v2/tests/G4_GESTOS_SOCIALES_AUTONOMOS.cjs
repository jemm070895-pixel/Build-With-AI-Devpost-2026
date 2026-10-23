const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/ui/WorldView.tsx'), 'utf8');
test('guardias descontentos gesticulan sin alterar órdenes', () => {
 assert.match(source, /const expressiveIdle = !ch\.mui && idleBreathing && !ch\.resting/);
 assert.match(source, /const protestShake = socialDisposition !== 'cooperative' && protestWindow < 1\.1/);
 assert.match(source, /const expressiveGlance = glance \+ protestShake/);
 assert.match(source, /ctx\.ellipse\(s\.x\+expressiveGlance\*z/);
});
test('guardias fatigados cabecean en reposo despierto', () => {
 assert.match(source, /const tiredNod = expressiveIdle && socialDisposition === 'cooperative'/);
 assert.match(source, /const expressiveHeadY = headY \+ tiredNod/);
});
