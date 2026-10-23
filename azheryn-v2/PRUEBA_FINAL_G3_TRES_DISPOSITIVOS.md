# G3 — Prueba final de aceptación (Windows / teléfono / tableta)

Estado inicial: NO VALIDADO EN DISPOSITIVOS REALES. Las pruebas automáticas de código no sustituyen estas pruebas.

## Preparación
1. Extrae todo el ZIP a una carpeta local de Windows (no ejecutes desde el ZIP).
2. Conecta los tres dispositivos a la misma red Wi-Fi privada.
3. En Windows abre `COMPROBAR_G3_SIN_ABRIR_JUEGO.bat` y conserva `RESULTADO_COMPROBACION_G3.txt`.
4. Si la compilación pasa, abre `JUGAR_EN_LAPTOP_TABLET_TELEFONO.bat`.
5. Abre en teléfono y tableta la dirección IP local mostrada por la laptop (no `localhost`).

## Laptop — ratón y teclado
- [ ] Abre sin errores; mapa, río, árboles, 8 humanos y animales visibles.
- [ ] Selección individual, selección de grupo con Shift y arrastre.
- [ ] Movimiento de cámara, zoom y atajos 1/2/3/0, M/T, Esc y espacio.
- [ ] Ordenar tala de un árbol: se detiene tras talarlo.
- [ ] Ordenar tala por zona, acopio y transporte de troncos.
- [ ] Construir almacén hasta 91/91 sin bloquear la partida.
- [ ] Guardar, cerrar, reabrir y recuperar el progreso.

## Teléfono — vertical y horizontal
- [ ] Interfaz visible sin botones inaccesibles o solapados.
- [ ] Toque breve selecciona y ordena; arrastre de un dedo mueve cámara.
- [ ] Pinza de dos dedos hace zoom sin órdenes involuntarias.
- [ ] Cambiar orientación y volver desde segundo plano no rompe el mapa.
- [ ] Exportar partida y volver a importarla.

## Tableta — vertical y horizontal
- [ ] Paneles, HUD y botones utilizables en ambas orientaciones.
- [ ] Toque, arrastre y pinza funcionan igual que en teléfono.
- [ ] Menús y panel de construcción permiten llegar a todos los controles.
- [ ] Exportación e importación de partida.

## Resultado
Marca los puntos realizados y anota errores, plataforma, navegador y pasos para reproducirlos.
La versión es una web adaptable compartida por Wi-Fi; NO es una aplicación nativa instalada ni sincroniza partidas entre dispositivos.
G3 se cerrará solamente después de compilar y verificar la partida completa y las tres interfaces.
