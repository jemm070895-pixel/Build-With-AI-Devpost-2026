# G3 - Diagnostico Windows independiente

Ejecutar `COMPROBAR_G3_SIN_ABRIR_JUEGO.bat` mediante doble clic en Windows.
El script corre todos los tests, instala dependencias solo si faltan y ejecuta
`npm run build` (TypeScript + Vite). Termina sin iniciar un servidor permanente.
El resultado queda en `RESULTADO_COMPROBACION_G3.txt` para poder compartir
un error concreto. No altera las partidas guardadas.

La ejecucion de tests en este entorno no sustituye la compilacion Windows
ni una partida manual 91/91. Si npm ci falla por falta de red, el registro
identifica el punto de bloqueo.
