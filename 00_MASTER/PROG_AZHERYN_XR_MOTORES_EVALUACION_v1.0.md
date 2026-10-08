# PROG — MOTORES PARA AZHERYN XR
Fecha: 2026-10-07
Estado: evaluacion preliminar. NO seleccion definitiva de motor.
## Vision
La vision del usuario es una experiencia inmersiva masiva dentro de la saga AZHERYN, con mundo abierto, IA, NPC, manos y VR, inspirada funcionalmente en la escala de Ready Player One pero con propiedad intelectual propia.
## Equipo
El usuario informa de laptop Windows gamer que corre GTA V y juegos Assassin's Creed modernos con soltura; estima 32 GB RAM y NVIDIA, no verificado. Pendiente dxdiag y modelo GPU.
## PROG-ENGINE-UE5
Unreal Engine 5: candidato principal para maximo potencial de realismo/mundo inmersivo a largo plazo. Soporta OpenXR y Quest, hand tracking via plugin Meta. Riesgo: peso del editor y optimizacion para visores autonomos.
Fuente https://dev.epicgames.com/documentation/en-us/unreal-engine/developing-for-head-mounted-experiences-with-openxr-in-unreal-engine
Fuente https://developers.meta.com/vr/documentation/unreal/unreal-hand-tracking-overview/
## PROG-ENGINE-UNITY6
Unity 6: candidato principal para prototipo Meta Quest 2026 de corto plazo y manos-first; Meta XR Interaction SDK tiene herramientas oficiales para agarre, toque y UI. No sacrificar calidad por velocidad.
Fuente https://developers.meta.com/vr/documentation/unity/unity-isdk-interaction-sdk-overview/
## PROG-ENGINE-GODOT4
Godot 4: alternativa liviana, open source, con OpenXR hand tracking. Validar ecosistema/rendimiento concreto.
Fuente https://docs.godotengine.org/en/latest/tutorials/xr/openxr_hand_tracking.html
## PROG-ENGINE-WEBXR
WebXR: alternativa de prototipo web XR ligero y distribuible, evaluar solo si mejora entrega/reglas/performance.
## GATE DECISION
No fijar motor hasta especificaciones GPU/CPU/RAM, pruebas de compilacion XR, FPS en dispositivo o simulador, pipeline de assets y coste-tiempo. El potencial de graficos Unreal no equivale a fidelidad GTA VI en Quest standalone.
## DERECHO DE AUTORIA
Cualquier XR New Experience sera implementacion nueva; prohibido copiar/portar codigo preexistente V2. Conceptos y mundo de saga si pueden informar especificacion sin contaminar implementacion.
## NO CANON
Las decisiones tecnologicas no modifican saga ni canon del juego, y la presentacion del usuario al concurso queda pendiente.
