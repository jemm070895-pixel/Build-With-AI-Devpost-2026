# G3 — Entrega compilada a tres dispositivos (2026-10-22)

El lanzador `JUGAR_EN_LAPTOP_TABLET_TELEFONO.bat` comprueba dependencias, ejecuta `npm run build` y SOLO si termina correctamente inicia `vite preview` sobre `dist/` en el puerto 5173.

Ventaja: laptop, teléfono y tableta reciben exactamente los archivos compilados para entrega, no el servidor de desarrollo con recarga en caliente. El acceso se limita a una red Wi-Fi privada de confianza. Los guardados no se sincronizan entre navegadores.

Pendiente: compilación real con dependencias completas y prueba manual en los tres dispositivos; completar partida real 91/91.
