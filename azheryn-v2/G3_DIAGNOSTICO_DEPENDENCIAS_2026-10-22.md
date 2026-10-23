# G3 — Diagnóstico de dependencias

El comprobador de Windows detecta instalaciones incompletas de React, TypeScript o Vite antes de intentar compilar. Si falta alguna, ejecuta `npm ci` y explica en el informe si la instalación falla.

En este entorno, `npm ci` falló con un error interno de npm y la comprobación TypeScript sin dependencias reporta módulos React ausentes; esto NO demuestra un fallo del código del juego.

Pendiente: compilar con dependencias completas, validar gestos en dispositivo real y jugar hasta 91/91.
