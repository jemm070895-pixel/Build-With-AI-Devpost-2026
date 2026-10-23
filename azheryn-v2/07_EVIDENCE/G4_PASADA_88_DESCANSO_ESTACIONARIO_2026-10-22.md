# G4 pasada 88 — descanso estacionario

Se corrige la acumulación de recuperación social mientras un guardia aún se desplaza a un destino. La condición de descanso requiere ahora ausencia de orden, viaje de supervivencia, transporte y distancia restante <= 1 unidad. Tanto el descanso nocturno como el diurno aplican esa condición. Se actualizó la prueba del transporte para reflejarla y se agregó una prueba específica.

Validación: 219/219 pruebas automatizadas superadas con Node 22 (`node --experimental-strip-types --test tests/*.cjs`). Compilación y partida manual pendientes en laptop. G4 abierto; no pasar a G5.
