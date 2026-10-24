/** G3 initial non-dangerous wildlife; visual only, no new gameplay systems. */
export type PeacefulAnimal = Readonly<{ id: string; kind: "deer" | "rabbit" | "bird"; x: number; y: number; phase: number }>;
export const PEACEFUL_ANIMALS: readonly PeacefulAnimal[] = Object.freeze([
  { id: "deer-1", kind: "deer", x: -110, y: 95, phase: 0 },
  { id: "deer-2", kind: "deer", x: -130, y: 110, phase: 1.2 },
  { id: "rabbit-1", kind: "rabbit", x: 105, y: 80, phase: 2.3 },
  { id: "rabbit-2", kind: "rabbit", x: 125, y: 91, phase: 3.4 },
  { id: "bird-1", kind: "bird", x: 60, y: -90, phase: 4.1 },
  { id: "bird-2", kind: "bird", x: 85, y: -105, phase: 5.2 },
]);
// Stable waypoints with species-specific pacing and pauses.
function stableUnit(seed: number): number {
  const v = Math.sin(seed * 127.1 + 78.233) * 43758.5453;
  return v - Math.floor(v);
}
function waypoint(animal: PeacefulAnimal, step: number) {
  const seed = animal.phase * 97 + (animal.kind === "bird" ? 41 : animal.kind === "rabbit" ? 23 : 7);
  const rangeX = animal.kind === "bird" ? 150 : animal.kind === "rabbit" ? 52 : 90;
  const rangeY = animal.kind === "bird" ? 125 : animal.kind === "rabbit" ? 46 : 75;
  return {x: animal.x * 3.2 + (stableUnit(seed + step * 2 + 1) * 2 - 1) * rangeX,
    y: animal.y * 3.2 + (stableUnit(seed + step * 2 + 2) * 2 - 1) * rangeY};
}
export function animalMovementPhase(animal: PeacefulAnimal, seconds: number) {
  const duration = animal.kind === "bird" ? 110 : animal.kind === "rabbit" ? 85 : 155;
  const elapsed = Math.max(0, Number.isFinite(seconds) ? seconds : 0) + animal.phase * duration;
  const segment = Math.floor(elapsed / duration);
  const phase = (elapsed % duration) / duration;
  const rest = animal.kind === "bird" ? 0 : animal.kind === "rabbit" ? .36 : .28;
  const moving = phase > rest;
  const u = Math.max(0, Math.min(1, (phase - rest) / (1 - rest)));
  const eased = u * u * (3 - 2 * u);
  return { segment, phase, moving, eased };
}
export function animalPosition(a: PeacefulAnimal, seconds: number): {x:number;y:number} {
  const {segment, eased} = animalMovementPhase(a, seconds);
  const from = waypoint(a, segment), to = waypoint(a, segment + 1);
  return {x:from.x+(to.x-from.x)*eased,y:from.y+(to.y-from.y)*eased};
}
export function keepOutsideClearing<T extends {x:number;y:number}>(position:T, animal:PeacefulAnimal):T {
  const minimumDistance = animal.kind === "bird" ? 215 : 195;
  const distance = Math.hypot(position.x,position.y);
  if(distance>=minimumDistance)return position;
  const angle=distance>.001?Math.atan2(position.y,position.x):Math.atan2(animal.y,animal.x);
  return {...position,x:Math.cos(angle)*minimumDistance,y:Math.sin(angle)*minimumDistance};
}

/** Presentation-only avoidance: animals keep a respectful distance from people. */
export function animalAvoidance(
  animal: PeacefulAnimal,
  seconds: number,
  people: readonly { x: number; y: number }[],
): { x: number; y: number; alert: boolean } {
  const base = animalPosition(animal, seconds);
  let dx = 0, dy = 0;
  const radius = animal.kind === "bird" ? 15 : animal.kind === "rabbit" ? 24 : 30;
  for (const person of people) {
    const vx = base.x - person.x, vy = base.y - person.y;
    const distance = Math.hypot(vx, vy);
    if (distance >= radius) continue;
    const safe = Math.max(distance, 0.001);
    const proximity = (radius - distance) / radius;
    // Smoothstep reduces visible snapping as a character crosses the alert radius.
    const strength = proximity * proximity * (3 - 2 * proximity);
    dx += (distance < 0.001 ? 1 : vx / safe) * strength;
    dy += (distance < 0.001 ? 0 : vy / safe) * strength;
  }
  const magnitude = Math.hypot(dx, dy);
  if (magnitude < 0.001) return keepOutsideClearing({ ...base, alert: false }, animal);
  const displacement = Math.min(animal.kind === "bird" ? 12 : 17, magnitude * 16);
  return keepOutsideClearing({ x: base.x + dx / magnitude * displacement, y: base.y + dy / magnitude * displacement, alert: true }, animal);
}
