# Red de especies compartidas — Capítulo 1

Se implementan **5 plantillas maestras** de árboles. Cada uno de los 1.000 árboles conserva identidad, ubicación, reserva y estado de tala propios; comparte con los demás de su especie los atributos gráficos y biológicos. No existe una red de comunicación física: es reutilización de datos y comportamiento (instancias / prototipos).

Especies provisionales: frondoso, frutal, alto, denso y claro. La etiqueta frutal es preparatoria: **no se ha implementado todavía la recolección de frutos**. Se puede ampliar el catálogo a 10–20 especies sin reescribir los árboles individuales. Millones de árboles requerirían sectores, carga diferida y almacenamiento de cambios, no crearlos todos en memoria.

Las partidas previas migran por ID y mantienen los árboles talados y reservados. Se debe verificar compilación y funcionamiento en Windows.
