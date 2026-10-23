# G3 — Validación obligatoria antes de jugar (2026-10-22)

El lanzador de Windows ahora ejecuta `npm run build` antes de iniciar el servidor Wi-Fi. Si TypeScript o Vite fallan, NO abre una sesión aparentemente funcional con errores ocultos. Verifica también que exista `dist/index.html`.

Este control es para laptop, teléfono y tableta porque los tres utilizan el mismo servidor. El modo de desarrollo de Vite sigue siendo una solución de prueba en red Wi-Fi privada, no un servicio público.

**Pendientes:** compilación real en Windows con dependencias instaladas; comprobar interfaz y gestos en dispositivos reales; completar la partida interactiva hasta 91/91 troncos.
