# AZHERYN V2 — Guía de tres dispositivos y cierre G3

## Laptop Windows
1. Extrae el ZIP completo. No ejecutes archivos dentro del ZIP.
2. Instala Node.js LTS si no lo tienes.
3. Haz doble clic en `COMPROBAR_G3_SIN_ABRIR_JUEGO.bat` para ejecutar pruebas y compilación. Requiere Internet la primera vez.
4. Si el informe termina en `RESULTADO: PRUEBAS Y COMPILACION CORRECTAS`, haz doble clic en `JUGAR_EN_LAPTOP_TABLET_TELEFONO.bat`. Se abrirá el navegador automáticamente.

## Teléfono y tableta
1. Conecta ambos a la misma red Wi-Fi privada que la laptop.
2. Mantén abierta la ventana del lanzador en la laptop.
3. Abre en Safari/Chrome una dirección `http://IP-DE-LA-LAPTOP:5173` de las que muestra la ventana.
4. En Windows, autoriza el acceso solo para redes privadas.
5. Usa los controles táctiles. Prueba retrato, horizontal, desplazamiento y zoom.

## Guardados
Cada navegador conserva su propia partida. Para trasladarla, usa Exportar e Importar. No hay sincronización automática.

## Lista de aceptación G3 (todavía pendiente de prueba real)
- [ ] `npm run build` completo en Windows.
- [ ] Laptop: selección, tala, acopio, dos guardias transportan un tronco y construcción.
- [ ] Teléfono: toque breve, arrastre con un dedo, pinza y rotación.
- [ ] Tableta: interfaz vertical/horizontal y controles sin superposición.
- [ ] Guardado, salida y restauración de partida.
- [ ] Partida completa: almacén construido hasta 91/91.

Si hay errores, comparte `RESULTADO_COMPROBACION_G3.txt` y una captura de la pantalla.
