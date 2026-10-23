# G4 — décima pasada (22 octubre 2026)
- Se incorporó una segunda capa de reflejos tenues en el río, exclusivamente visual.
- Protección de rendimiento: solo con tamaño de celda >=7 px, agua con profundidad >0.012 y muestra determinista <6.5%; sin nuevas imágenes ni recursos de red.
- Se añadió la prueba G4_WATER_REFLECTION_LOD.cjs; suite completa: 119/119 aprobadas en Node 22.16.0.
- `npm run build` se ejecutó y FALLÓ con TS2688 porque las dependencias del ZIP están incompletas (`@types/react`, `@types/react-dom`). No se afirma compilación exitosa.
- No se modificaron Fehe, prólogo, personajes, reglas de juego ni objetivo 91/91.
- Pendiente crítico: `npm ci` con acceso a paquetes, `npm run build`, prueba jugable 91/91 y dispositivos reales.
