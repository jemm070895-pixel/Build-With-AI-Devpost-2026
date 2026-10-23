# G4 pasada 161 — variación independiente de frutos

Auditoría matemática: el tipo de fruta y el número de frutos dependían ambos de `hash % 3`. Eso forzaba a que cada variedad tuviera siempre el mismo número de frutos. Se desacopló el conteo mediante mezcla determinista de bits del identificador del árbol. Se mantiene la filotaxis áurea, persistencia por ID, caché limitada y 3–5 frutos. Pruebas automatizadas: 351/351. Validación visual y compilación pendientes en laptop.
