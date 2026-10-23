# AZHERYN V2 — tres vías (G3)

- **Laptop Windows:** ratón, teclado y paneles completos. Ejecutar `VALIDAR_Y_JUGAR_G3.bat`.
- **Tableta:** abrir el juego en navegador moderno; paneles adaptados y botones grandes al detectar pantalla táctil. Se admite orientación horizontal y vertical.
- **Teléfono:** navegador moderno; interfaz compacta con barra desplazable de acciones, zonas seguras de pantalla y gestos táctiles.

Las tres vías usan el mismo código y guardan partidas localmente **por dispositivo/navegador**. Para continuar en otro dispositivo, usar **Exportar partida** e **Importar partida**. No hay sincronización automática entre equipos. La versión web móvil requiere alojar la compilación en una URL accesible al teléfono/tableta; abrir el ZIP directamente en el móvil no inicia Vite. No se incluyen APK ni aplicación nativa iOS.

**Pendiente de validación:** compilación TypeScript/Vite con dependencias instaladas; ejecución real en Windows, Android, iPhone y tablet; partida real 91/91.

## Acceso práctico desde los tres dispositivos

Incluido `JUGAR_EN_LAPTOP_TABLET_TELEFONO.bat`: levanta Vite en la red local de confianza para que laptop, tableta y teléfono abran la misma aplicación desde el mismo Wi-Fi. Ver `GUIA_JUGAR_TRES_DISPOSITIVOS.txt`. No publica el juego en Internet ni sincroniza las partidas.
