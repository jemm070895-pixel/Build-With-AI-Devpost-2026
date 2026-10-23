# Verificación de cierre Chrome / Safari — 2026-10-23

- `node scripts/run-all-tests.cjs`: 279/279 archivos de prueba correctos.
- `node --experimental-strip-types --test tests/*.cjs`: 383/383 subpruebas correctas.
- Ejecutar `node --test tests/*.cjs` sin strip-types provoca 35 fallos de carga `.ts` debidos al modo de ejecución, no a una regresión confirmada.
- `npm ci --offline`: ENOTCACHED para vite 8.3.2.
- `npm install` online: error interno de npm «Exit handler never called!».
- No hay compilación `dist` verificada, ni despliegue privado, ni prueba física en Chrome/Safari iPhone.
- Código y gráficos no modificados. No se ha publicado repositorio.
- Para continuar: instalación funcional de dependencias, `npm run build`, alojamiento HTTPS con acceso restringido y prueba táctil real.
