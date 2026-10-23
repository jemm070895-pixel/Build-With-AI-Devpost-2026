const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'..');
const ui=fs.readFileSync(path.join(base,'src/ui/WorldView.tsx'),'utf8');
const foundation=fs.readFileSync(path.join(base,'src/foundation/meta0.ts'),'utf8');
const terrain=fs.readFileSync(path.join(base,'src/world/terrain.ts'),'utf8');
const climate=fs.readFileSync(path.join(base,'src/world/climate.ts'),'utf8');
const camera=fs.readFileSync(path.join(base,'src/world/camera.ts'),'utf8');
const tests=[
['META0: referencia temporal y economía histórica',foundation.includes('META0_REFERENCE_YEAR = 700')&&foundation.includes('currency: "OKEYE"')],
['META1: referencia geográfica preservada',terrain.includes('referenceGeometry: "africa"')&&terrain.includes('preservesAfricanReference: true')],
['META1: cámara acotada y zoom limitado',camera.includes('clamp(cam.zoom, MIN_ZOOM, MAX_ZOOM)')&&camera.includes('if (m > limit)')],
['META2: reloj climático multiplica velocidad una sola vez',ui.includes('climateClock.tick(elapsed)')&&!ui.includes('climateClock.tick(dt)')&&climate.includes('realSeconds * GAME_SECONDS_PER_REAL_SECOND * speed')],
['META2: pausa mantiene reloj inmóvil',climate.includes('let speed = 1')&&ui.includes('climateClock.setSpeed(timeSpeedRef.current)')],
['META3: selección invalida objetivo de tala anterior',/if\(hit && orderModeRef\.current !== "logging"\)\{[\s\S]*?loggingTargetRef\.current=null;\s*setLoggingTarget\(null\)/.test(ui)],
['META3: nuevo acopio invalida objetivo de tala anterior',ui.includes('if(stockpileModeRef.current){loggingTargetRef.current=null;setLoggingTarget(null);')],
['META3: orden de tala requiere grupo seleccionado',ui.includes('if(!squad.length)return;')],
['META3: informa si no hay árboles libres',ui.includes('No hay árboles libres en esta zona')],
['META3: la pausa bloquea la simulación pero no la cámara',ui.includes('if (dt>0 && baked && characters.length)')&&ui.includes('PAN_SPEED * elapsed')],
];for(const [name,ok] of tests){assert.ok(ok,name);console.log('OK',name)}console.log(`${tests.length}/${tests.length} audit guards`);
