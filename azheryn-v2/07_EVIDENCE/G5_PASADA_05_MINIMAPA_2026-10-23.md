# G5 pasada 05: minimapa integrado en brújula

- El boceto aprobado sirve de dirección artística, no se considera captura del juego.
- La brújula existente N-S-E-O contiene ahora un canvas circular de terreno real.
- La geometría usa `project` del terreno actual, muestras de agua de `world.tiles`, posiciones actuales de Mui, guardias, almacén, acopio y fogata.
- El retículo marca el centro de la cámara. La imagen se actualiza como máximo cinco veces por segundo para ahorrar recursos.
- Puntos cardinales conservados, oeste localizado como O/W.
- No se agregan edificios, fauna ni mecánicas del boceto no presentes en el juego.
- Pendiente: inspección visual y compilación en laptop.
