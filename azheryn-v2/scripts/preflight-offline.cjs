#!/usr/bin/env node
// Diagnóstico local sin descargas ni cambios de dependencias.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const names = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})];
let missing = 0;
for (const name of names) {
  const file = path.join(root, 'node_modules', ...name.split('/'), 'package.json');
  const ok = fs.existsSync(file);
  process.stdout.write(`${ok ? 'OK' : 'FALTA'} ${name}\n`);
  if (!ok) missing++;
}
console.log(`Node: ${process.version}; dependencias faltantes: ${missing}/${names.length}`);
if (missing) {
  console.log('Acción en Windows: abrir terminal en azheryn-v2, ejecutar npm install y luego npm run build.');
  process.exitCode = 2;
} else console.log('Dependencias presentes. Ejecutar npm run build para verificar compilación.');
