/** Fictional, stable backstories for Chapter 1 dialogue. Not generated live by an AI. */
export type CharacterHistory = { id:string; name:string; originEs:string; originEn:string; memoryEs:string; memoryEn:string; hopeEs:string; hopeEn:string };
export const CHARACTER_HISTORIES:readonly CharacterHistory[] = [
 {id:'mui',name:'Mui',originEs:'Viajero que busca fundar un asentamiento',originEn:'Traveler seeking to found a settlement',memoryEs:'Recuerda los caminos y los encuentros del viaje',memoryEn:'Remembers the roads and encounters of the journey',hopeEs:'Un lugar donde guardar provisiones y recibir visitantes',hopeEn:'A place to store supplies and welcome visitors'},
 {id:'guard-1',name:'Guardia 1',originEs:'Pueblo de agricultores',originEn:'Farming village',memoryEs:'Su familia secaba frutas para el invierno',memoryEn:'His family dried fruit for winter',hopeEs:'Guardar cosechas en el almacén',hopeEn:'Store harvests in the storehouse'},
 {id:'guard-2',name:'Guardia 2',originEs:'Aldea junto a un río',originEn:'Riverside hamlet',memoryEs:'Había un mercado pequeño junto al puente',memoryEn:'There was a small market near the bridge',hopeEs:'Intercambiar alimentos y herramientas',hopeEn:'Trade food and tools'},
 {id:'guard-3',name:'Guardia 3',originEs:'Familia de carpinteros',originEn:'Carpenter family',memoryEs:'Aprendió a alisar tablas de madera',memoryEn:'Learned to smooth wooden boards',hopeEs:'Hacer estantes y mesas',hopeEn:'Make shelves and tables'},
 {id:'guard-4',name:'Guardia 4',originEs:'Pueblo de huertos',originEn:'Orchard village',memoryEs:'Recogía semillas con sus hermanos',memoryEn:'Collected seeds with his siblings',hopeEs:'Conservar semillas y frutos',hopeEn:'Preserve seeds and fruit'},
 {id:'guard-5',name:'Guardia 5',originEs:'Aldea de artesanos',originEn:'Craftsmen village',memoryEs:'Veía trabajar a los talladores de madera',memoryEn:'Watched woodcarvers at work',hopeEs:'Preparar objetos para el mercado',hopeEn:'Prepare goods for market'},
 {id:'guard-6',name:'Guardia 6',originEs:'Poblado entre bosques',originEn:'Woodland settlement',memoryEs:'Conocía senderos y árboles frutales',memoryEn:'Knew paths and fruit trees',hopeEs:'Encontrar nuevas rutas a otros pueblos',hopeEn:'Find new routes to other villages'},
 {id:'guard-7',name:'Guardia 7',originEs:'Pueblo de comerciantes',originEn:'Trading village',memoryEs:'Ayudaba a contar sacos y cestas',memoryEn:'Helped count sacks and baskets',hopeEs:'Organizar los productos del almacén',hopeEn:'Organize the storehouse goods'}
];
export function characterHistory(id:string):CharacterHistory|undefined {
 const normalized=id.toLowerCase().replace(/_/g,'-');
 return CHARACTER_HISTORIES.find(c=>c.id===normalized || (c.id==='mui' && normalized.includes('mui')) || (c.id.startsWith('guard-') && normalized.endsWith(c.id.split('-')[1]) && normalized.includes('guard')));
}
