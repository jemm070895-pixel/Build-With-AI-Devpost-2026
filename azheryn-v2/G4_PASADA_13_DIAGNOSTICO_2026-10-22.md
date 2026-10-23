# G4 — Pasada 13: diagnóstico de compilación

- Base: ZIP G4 duodécima pasada. Se conservan los recursos y el código existentes.
- `node scripts/run-all-tests.cjs`: 121/121 pruebas superadas en el entorno de trabajo.
- `npm install --no-audit --no-fund --prefer-offline`: intento interrumpido por límite de tiempo sin instalar las dependencias; no hay evidencia de compilación exitosa.
- Añadido `scripts/preflight-offline.cjs`: revisa físicamente los `package.json` de las dependencias necesarias sin requerir red ni modificar el proyecto. Un estado FALTA devuelve código 2.
- Próximo paso en Windows: `npm install`, `npm run build`, ejecutar la partida completa y comprobar dispositivos.
- G4 abierto. Fehe, prólogo y 91/91 no alterados.
