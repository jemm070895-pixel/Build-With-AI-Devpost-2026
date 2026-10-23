# G4 — Diagnóstico reproducible (22 octubre 2026)

- ZIP anterior contiene `node_modules` con directorios vacíos (incluidos React, tipos y Vite); no constituye una instalación utilizable.
- `npm run build`: TS2688 por falta de `@types/react` y `@types/react-dom`. No se ha validado compilación.
- `npm ci --offline`: ENOTCACHED para Vite; este entorno no dispone de los paquetes necesarios.
- `node --experimental-strip-types --test tests/*.cjs`: 118/118 pruebas aprobadas. Sin la opción, 9 fallan por la carga de TypeScript en Node 22.
- Se refuerza el lanzador Windows para comprobar archivos reales de dependencias antes de intentar compilar.
- En Windows con Internet: ejecutar `JUGAR_EN_LAPTOP_TABLET_TELEFONO.bat` para instalar y compilar. Si falla, remitir el registro.
- Estas pruebas no demuestran FPS, aspecto visual, funcionamiento del navegador ni partida manual 91/91.
