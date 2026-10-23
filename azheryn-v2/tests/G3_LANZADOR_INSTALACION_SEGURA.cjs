const fs = require('node:fs');
const assert = require('node:assert/strict');
const s = fs.readFileSync('JUGAR_EN_LAPTOP_TABLET_TELEFONO.bat','utf8');
assert.match(s, /call npm ci[^\r\n]*\r?\nif errorlevel 1 goto installation_failed/i);
assert.match(s, /:installation_failed\r?\n[\s\S]*?exit \/b 1\r?\n:ready_to_play/i);
assert.ok(!s.includes('call npm ci --no-audit --no-fund --fetch-retries=1 --fetch-timeout=20000 ||'));
console.log('OK: fallo de instalacion interrumpe el inicio antes del servidor');
