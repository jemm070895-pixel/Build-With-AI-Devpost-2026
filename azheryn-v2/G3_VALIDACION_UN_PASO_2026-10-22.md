# G3: comprobación e inicio unificados

**Nuevo:** `VALIDAR_Y_ABRIR_TRES_PLATAFORMAS.bat` ejecuta el diagnóstico y, **solo si pasa**, abre el servidor de la versión compilada para laptop, teléfono y tableta. Si falla, deja `RESULTADO_COMPROBACION_G3.txt` para compartir el error.

**Comprobado en este entorno:** 110/110 pruebas de Node superadas; la simulación automatizada del almacén alcanza 91/91.

**Bloqueado en este entorno:** `npm ci --offline` devuelve `ENOTCACHED` porque falta el paquete Vite 8.3.2 en la caché. No se ha verificado `npm run build` ni jugabilidad en Windows/teléfono/tableta.

**Uso:** extraer ZIP, doble clic en `VALIDAR_Y_ABRIR_TRES_PLATAFORMAS.bat`, seguir la IP local indicada para otros dispositivos. Hace falta Node.js y conexión a Internet para la instalación inicial de dependencias. Mantener la ventana abierta. Utilizar Wi-Fi privado de confianza. Las partidas no se sincronizan automáticamente.

**Cierre G3:** pendiente compilación en Windows, prueba de interfaz real en tres formatos y partida completa 91/91.
