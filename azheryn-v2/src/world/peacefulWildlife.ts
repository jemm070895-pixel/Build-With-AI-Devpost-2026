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
export function animalPosition(a: PeacefulAnimal, seconds: number): {x:number;y:number} {
  // Each animal traverses a broad, continuous path across the map. The route
  // passes near the clearing periodically, without teleportation or spawning.
  const speed = a.kind === "bird" ? .009 : a.kind === "rabbit" ? .0045 : .0028;
  const t=seconds*speed+a.phase;
  const rangeX=a.kind === "bird" ? 180 : 145;
  const rangeY=a.kind === "bird" ? 175 : 140;
  return {
    x:Math.sin(t)*rangeX + Math.sin(t*2.3+a.phase)*16,
    y:Math.sin(t*.73+a.phase*.35)*rangeY + Math.cos(t*1.7)*12,
  };
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
  if (magnitude < 0.001) return { ...base, alert: false };
  const displacement = Math.min(animal.kind === "bird" ? 12 : 17, magnitude * 16);
  return { x: base.x + dx / magnitude * displacement, y: base.y + dy / magnitude * displacement, alert: true };
}
