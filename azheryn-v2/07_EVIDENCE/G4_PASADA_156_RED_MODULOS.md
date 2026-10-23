# G4 156 — Auditoría de conexiones por ramas

Se construyó un grafo reproducible de dependencias reales de los módulos de `src`, siguiendo imports/exports relativos. El script `node tools/audit-module-network.cjs` detecta enlaces rotos y ciclos y emite el grafo en JSON.

- 21 módulos; 25 conexiones directas; 18 conexiones entre ramas.
- 0 imports internos sin resolver; 0 ciclos detectados.
- Ramas de juego conectadas desde `ui/WorldView.tsx`: clima, terreno, trabajo, NPC/social, animales, árboles/frutos, construcción y guardado.
- Dos módulos sin importadores dentro del juego (`foundation/meta0.ts`, `lab/experiment.ts`): son utilidades fundacionales/experimentales, no se deben conectar artificialmente al bucle de juego sin justificar su uso.
- Dos pruebas de regresión nuevas verifican integridad de red y conexiones críticas.
- La red describe dependencias de software, **no** una red neuronal ni una IA nueva. No cambia la jugabilidad ni añade autonomía.
- Pendiente: compilación y validación manual en laptop.
