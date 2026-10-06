import { clamp, fbm, lerp, smoothstep } from "./noise";

export const GRID = 128;
export const WATER_LEVEL = 0.2;

// Public contest build: internal world-coordinate/canon contracts are maintained in the private repository.
// META 1 public minimum: only player-visible/implementation-safe behavior is exposed here.
export const CONTEST_WORLD_BASELINE = {
  stablePhase1Geography: true,
  topDownStrategyView: true,
  zoomUsesLevelOfDetail: true,
  fixedStructuresStayWhereBuilt: true,
} as const;

export interface Tile {
  h: number;
  water: boolean;
  depth: number;
  forest: number;
  meadow: number;
  wet: number;
  rock: number;
  clear: number;
}

export interface World {
  size: number;
  seed: number;
  tiles: Tile[];
  clearing: { x: number; y: number; radius: number };
}

export function tileAt(world: World, x: number, y: number): Tile | undefined {
  if (x < 0 || y < 0 || x >= world.size || y >= world.size) return undefined;
  return world.tiles[y * world.size + x];
}

const gauss = (dx: number, dy: number, sigma: number) =>
  Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));

export function createWorld(seed = 7): World {
  const N = GRID;

  // Orientación geográfica fija del mundo:
  // arriba = NORTE, abajo = SUR, izquierda = OESTE, derecha = ESTE.
  // La proyección isométrica inclina visualmente el cauce, pero no cambia esos puntos cardinales.
  //
  // El río entra por el NORTE y desciende hacia el SUR hasta salir del mapa.
  // Su recorrido puede verse inclinado en pantalla (aprox. \\), pero el flujo geográfico es N → S.
  const riverX = (gy: number) =>
    N * 0.5 +
    N * 0.17 * Math.sin((gy / N) * Math.PI * 1.9 - 1.41) +
    (fbm(gy * 0.035, 17.3, seed + 5) - 0.5) * N * 0.1 +
    (fbm(gy * 0.1, 41.7, seed + 8) - 0.5) * N * 0.05;

  // Vados: tramos más anchos y someros a lo largo del descenso norte-sur.
  const fordYs = [N * 0.2, N * 0.56, N * 0.86];
  const fordness = (gy: number) =>
    fordYs.reduce((m, f) => Math.max(m, Math.exp(-((gy - f) ** 2) / (2 * 3.5 * 3.5))), 0);
  // Anchura irregular a lo largo del recorrido.
  const riverHalfWidth = (gy: number) =>
    lerp(1.3, 2.0, clamp(gy / N, 0, 1)) *
    lerp(0.65, 1.45, smoothstep(0.3, 0.7, fbm(gy * 0.06, 8.2, seed + 11))) *
    (1 + 0.3 * fordness(gy));
  // Profundidad irregular: pozas profundas y fondos someros en los vados.
  const riverBed = (gy: number) =>
    lerp(
      lerp(0.055, 0.13, smoothstep(0.25, 0.75, fbm(gy * 0.05 + 30, 2.7, seed + 13))),
      0.172,
      fordness(gy),
    );

  const STEP = 0.5;
  const START = -8;
  const count = Math.ceil((N + 16) / STEP) + 1;
  const sampleX = new Float32Array(count);
  const sampleY = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    sampleY[i] = START + i * STEP;
    sampleX[i] = riverX(sampleY[i]);
  }
  const riverDistance = (x: number, y: number) => {
    const lo = Math.max(0, Math.floor((y - 14 - START) / STEP));
    const hi = Math.min(count - 1, Math.ceil((y + 14 - START) / STEP));
    let best = Infinity;
    for (let i = lo; i <= hi; i++) {
      const dx = x - sampleX[i];
      const dy = y - sampleY[i];
      const d = dx * dx + dy * dy;
      if (d < best) best = d;
    }
    return Math.sqrt(best);
  };

  // Claro inicial: en el centro del área jugable, pequeño e irregular.
  const cx = N / 2;
  const cy = N / 2 - 4;
  const clearingRadius = 8;
  // Distancia con signo al borde del claro (negativa = dentro).
  const clearingEdge = (x: number, y: number) => {
    const dx = x - cx;
    const dy = y - cy;
    const ang = Math.atan2(dy, dx);
    const r =
      8.5 +
      (fbm(Math.cos(ang) * 2.2 + 3, Math.sin(ang) * 2.2 + 3, seed + 30) - 0.5) * 9 +
      (fbm(x * 0.15, y * 0.15, seed + 31) - 0.5) * 3;
    return Math.hypot(dx, dy) - r;
  };
  // Pequeños claros sueltos entre el bosque.
  const glades = [
    { x: cx - 22, y: cy - 12, r: 4 },
    { x: cx + 26, y: cy - 10, r: 4 },
    { x: cx - 20, y: cy + 10, r: 3.2 },
  ];
  const gladeAt = (x: number, y: number) =>
    glades.reduce((m, g) => Math.max(m, smoothstep(g.r + 1.5, g.r - 1.5, Math.hypot(x - g.x, y - g.y))), 0);

  // Cuencas húmedas (zonas encharcadas).
  const basins = [
    { x: N * 0.72, y: N * 0.72, sigma: 7 },
    { x: N * 0.25, y: N * 0.25, sigma: 5 },
  ];
  const basinAt = (x: number, y: number) =>
    basins.reduce((m, b) => Math.max(m, gauss(x - b.x, y - b.y, b.sigma)), 0);

  const size = N * N;
  const heights = new Float32Array(size);
  const ridges = new Float32Array(size);
  const dists = new Float32Array(size);
  const clears = new Float32Array(size);

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const i = y * N + x;
      const edge = Math.min(x, y, N - 1 - x, N - 1 - y);
      const edgeD = edge + (fbm(x * 0.05 + 3, y * 0.05 + 9, seed + 9) - 0.5) * 16;
      const ridge = smoothstep(26, 3, edgeD);

      // Valle: el fondo es más bajo cerca del río y las laderas suben suavemente hacia los lados.
      const riverDist = riverDistance(x, y);
      let h = 0.31 + smoothstep(8, 40, riverDist) * 0.1;
      // Ondulaciones de varias escalas, con ejes deformados para evitar patrones regulares.
      const rx = x + (fbm(x * 0.03 + 20, y * 0.03, seed + 60) - 0.5) * 18;
      const ry = y + (fbm(x * 0.03, y * 0.03 + 20, seed + 61) - 0.5) * 18;
      h += (fbm(rx * 0.03, ry * 0.03, seed) - 0.5) * 0.2;
      h += (fbm(rx * 0.065, ry * 0.065, seed + 62) - 0.5) * 0.13;
      // Lomas suaves y hondonadas pequeñas.
      h += (smoothstep(0.5, 0.78, fbm(rx * 0.05 + 3, ry * 0.05 + 8, seed + 63)) - 0.2) * 0.09;
      h += (fbm(x * 0.1, y * 0.1, seed + 2) - 0.5) * 0.04;
      h += ridge * (0.42 + fbm(x * 0.08, y * 0.08, seed + 4) * 0.28) * smoothstep(0, 7, edge);
      h += smoothstep(0.55, 0.8, fbm(x * 0.025 + 7, y * 0.025 + 2, seed + 6)) * 0.12 * (1 - ridge);
      h -= basinAt(x, y) * 0.13;

      const dist = riverDist;
      h -= smoothstep(22, 0, dist) * 0.06 * (1 - ridge);

      const nd = dist / riverHalfWidth(y);
      const carve = smoothstep(2.2, 0.6, nd);
      const fz = fordness(y);
      const bed = riverBed(y) + (fbm(x * 0.2, y * 0.2, seed + 7) - 0.5) * (0.03 + fz * 0.04);
      h = lerp(h, bed, carve);

      const clear = smoothstep(2, -2, clearingEdge(x, y));
      // El claro es cómodo pero no una explanada: se suaviza el relieve sin aplanarlo del todo.
      h = lerp(h, 0.34 + (h - 0.34) * 0.3, clear);

      heights[i] = h;
      ridges[i] = ridge;
      dists[i] = dist;
      clears[i] = clear;
    }
  }

  const hAt = (x: number, y: number) =>
    heights[clamp(y, 0, N - 1) * N + clamp(x, 0, N - 1)];

  const tiles: Tile[] = new Array(size);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const i = y * N + x;
      const h = heights[i];
      const dist = dists[i];
      const ridge = ridges[i];
      const clear = clears[i];
      const water = h < WATER_LEVEL;

      const slope = Math.abs(hAt(x + 1, y) - hAt(x - 1, y)) + Math.abs(hAt(x, y + 1) - hAt(x, y - 1));
      const rock = clamp(
        smoothstep(0.62, 0.78, h) + smoothstep(0.14, 0.28, slope) * 0.8,
        0,
        1,
      );

      const lowness = smoothstep(WATER_LEVEL + 0.09, WATER_LEVEL + 0.015, h);
      const wetGate = smoothstep(
        0.3,
        0.5,
        fbm(x * 0.08, y * 0.08, seed + 10) + smoothstep(9, 2, dist) * 0.25,
      );
      const wet = water ? 0 : clamp(lowness * clamp(wetGate + basinAt(x, y), 0, 1), 0, 1);

      // Bosque irregular: ruido deformado, densidades distintas y pequeños huecos internos.
      const wx = x + (fbm(x * 0.04, y * 0.04, seed + 40) - 0.5) * 14;
      const wy = y + (fbm(x * 0.04 + 9, y * 0.04, seed + 44) - 0.5) * 14;
      let forest = smoothstep(0.34, 0.6, fbm(wx * 0.06 + 11, wy * 0.06 + 5, seed + 3));
      forest *= 1 - smoothstep(0.68, 0.82, fbm(wx * 0.16, wy * 0.16, seed + 41)) * 0.8;
      forest *= lerp(0.6, 1, smoothstep(0.3, 0.7, fbm(x * 0.09 + 4, y * 0.09, seed + 42)));
      // Anillo de bosque alrededor del claro, con entrantes y huecos irregulares.
      const sd = clearingEdge(x, y);
      const ring =
        smoothstep(0, 3, sd) *
        smoothstep(22, 11, sd) *
        (1 - 0.7 * smoothstep(0.62, 0.8, fbm(x * 0.13 + 90, y * 0.13, seed + 43)));
      forest = Math.max(forest, ring * 0.95);
      forest += ridge * 0.5 * (1 - rock);
      const glade = gladeAt(x, y);
      forest *= 1 - glade;
      forest *= lerp(0.55, 1, smoothstep(2.5, 8, dist));
      forest *= (1 - wet * 0.8) * (1 - rock * 0.9) * (1 - clear);
      if (water) forest = 0;
      forest = clamp(forest, 0, 1);

      let meadow =
        smoothstep(0.2, 0.04, forest) *
        smoothstep(0.4, 0.6, fbm(x * 0.1 + 51, y * 0.1 + 7, seed + 12)) *
        (1 - rock) *
        (1 - wet);
      meadow = clamp(Math.max(meadow, glade * 0.9) + clear * 0.6, 0, 1);
      if (water) meadow = 0;

      tiles[i] = {
        h,
        water,
        depth: water ? WATER_LEVEL - h : 0,
        forest,
        meadow,
        wet,
        rock: water ? 0 : rock,
        clear,
      };
    }
  }

  return { size: N, seed, tiles, clearing: { x: cx, y: cy, radius: clearingRadius } };
}
