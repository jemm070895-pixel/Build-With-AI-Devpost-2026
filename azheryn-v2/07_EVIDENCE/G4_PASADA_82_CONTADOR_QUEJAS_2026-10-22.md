# G4 pasada 82 — contador seguro de quejas

AQD: anomalía: tras muchas órdenes o datos importados, el contador podía exceder el límite de enteros seguros. Corrección: saturación a Number.MAX_SAFE_INTEGER sin modificar órdenes ni jugabilidad. Pruebas: G4_QUEJAS_CONTADOR_SEGURO.cjs.
