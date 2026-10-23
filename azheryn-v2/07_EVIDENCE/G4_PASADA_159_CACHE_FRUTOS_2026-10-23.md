# G4 pasada 159 — revisión de rendimiento de árboles frutales

Se detectó que `fruitPositionsForTreeId` recreaba un arreglo con 3–5 pares de coordenadas en cada fotograma para cada árbol frutal visible. Se añadió caché de 512 árboles como máximo, con geometría inmutable y eliminación de la entrada más antigua. La semilla determinista preserva exactamente las posiciones al reconstruir una entrada expulsada. No cambia la distribución, variedad, guardado ni tala. Dos pruebas nuevas verifican reutilización, inmutabilidad y expulsión determinista.

Validación automatizada: 347/347 pruebas aprobadas. Pendiente: compilación y revisión visual en laptop.
