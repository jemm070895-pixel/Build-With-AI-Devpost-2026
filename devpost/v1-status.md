# AZHERYN — Versión 1: Prototipo antiguo

## Estado

La versión actual de AZHERYN queda **FINALIZADA, CONGELADA Y PRESERVADA como VERSIÓN 1 — PROTOTIPO ANTIGUO**. Se conserva únicamente como referencia histórica, técnica y reutilizable. No se continuará ampliando esta versión.

La congelación describe el estado real del prototipo; no afirma que se haya completado todo el alcance originalmente planeado en el PRD o en el checklist. En el corte actual, Slices 1–3 y 10 figuran completadas; Slice 4 tiene implementación y pruebas registradas, learner check confirmado, pero sigue sin marcarse completada en `checklist.md`; Slices 5–9 y las revisiones finales del checklist permanecen pendientes. Esta discrepancia forma parte del historial y no se resuelve como parte del cierre de V1.

## Preservación

- Conservar el código, las pruebas, los documentos, los datos de Skill Pack y el resto del trabajo existente en su estado actual.
- No borrar, restaurar, reorganizar ni reescribir materiales como parte del cierre.
- No iniciar V2 ni preparar su arquitectura o estructura dentro de este proyecto.
- Cualquier desarrollo futuro de V2 partirá desde cero y de una especificación nueva que proporcionará el usuario cuando esté completa.
- La autorización para crear el commit que registre este corte debe solicitarse por separado; hasta entonces, los cambios permanecen en el árbol de trabajo sin commit.

## Verificación del corte

Verificación realizada desde `azheryn-app`:

- `node --experimental-strip-types --test`: 55 pruebas aprobadas, 0 fallidas.
- `npm run lint`: correcto.
- `npm run build`: correcto.

Estas verificaciones registran el estado técnico de V1 en este corte; no convierten las slices pendientes del checklist en trabajo completado.
