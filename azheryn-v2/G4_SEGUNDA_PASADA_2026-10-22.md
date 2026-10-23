# G4 — segunda pasada comprobada

- Se conserva íntegra la estructura del ZIP G4 recibido.
- Vista del mundo: presupuesto de píxeles adaptativo. Dispositivos táctiles compactos mantienen límite de 2 millones de píxeles; pantallas no compactas permiten hasta 3,5 millones para mayor nitidez.
- Prólogo: contraste y saturación muy suaves, viñeteado de marco y sombra cinematográfica por CSS. No se reemplaza ni modifica ninguna ilustración original.
- Regresión inicial detectada en prueba G3_MOBILE_PIXEL_BUDGET; corregida conservando su contrato de límite móvil.
- Node v22.16.0: `node --experimental-strip-types --test tests/*.cjs`: 118/118, cero fallos.
- `npm run build` no puede completarse aquí: faltan definiciones React y React DOM en node_modules. No declarar compilación verificada.
- Pruebas de juego real y 91/91 pendientes.
