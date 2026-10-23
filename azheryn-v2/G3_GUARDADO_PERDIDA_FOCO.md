# G3 — Guardado al perder foco

- Guardado inmediato cuando el navegador pierde el foco (blur), además del guardado al ocultar/cerrar la pestaña.
- Limpieza de teclas activas al cerrar la página para evitar movimiento retenido.
- Prueba automatizada nueva: `tests/G3_GUARDADO_PERDIDA_FOCO.cjs`.
- 97/97 comprobaciones `.cjs` correctas.

## Pendiente de validación
No hay `node_modules` en este entorno. El comando TypeScript no puede resolver React y Vite; por tanto, la compilación completa y la prueba real de la partida 91/91 siguen pendientes. No se considera G3 terminado.
