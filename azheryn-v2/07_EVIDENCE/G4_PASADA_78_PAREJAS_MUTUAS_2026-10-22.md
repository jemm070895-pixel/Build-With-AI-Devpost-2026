# G4 Pasada 78 — Parejas despiertas mutuamente próximas

Se corrigió la selección de interlocutores para exigir proximidad mutua entre guardias despiertos. Un NPC descansando ya no bloquea al interlocutor despierto más cercano, y un tercer NPC no puede crear una conversación asimétrica. Se conservaron los turnos y la lógica social anterior.

Validación: `node --experimental-strip-types --test tests/*.cjs`: 204/204. Compilación y juego real pendientes en laptop.
