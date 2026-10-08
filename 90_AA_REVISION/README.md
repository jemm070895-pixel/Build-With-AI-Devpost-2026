# Bandeja AA / LF

Espacio para informes y propuestas de GitHub y revisión por ChatGPT.

## Categorías
- `AUDITORIAS`: comprobaciones y evidencia.
- `MEJORAS`: sugerencias sin aplicar.
- `RECOMENDACIONES`: prioridades y justificación.
- `INCIDENCIAS`: errores, riesgos y resultados negativos (no modificar automáticamente).
- `DECISIONES`: aprobaciones explícitas, motivos y trazabilidad.

## Llave LF — Filtro
`Detectar → Evaluar → Clasificar → Decidir`.

- **Verde**: positivo, reversible, bajo riesgo y dentro del alcance; aprobación automática solo para mantenimiento documental o informes, sin tocar código, datos, canon, protocolos, permisos, gates ni automatizaciones protegidas.
- **Amarillo**: importante, incierto o de impacto amplio; propuesta pendiente de autorización del propietario.
- **Rojo**: negativo, fallo o riesgo; no ejecutar cambios; documentar y elevar al propietario.

GitHub Actions no puede consultar ChatGPT directamente ni asumir su aprobación. Los informes se revisan mediante conexión GitHub y las alertas configuradas. Nunca tratar recomendaciones como resultados verificados.
