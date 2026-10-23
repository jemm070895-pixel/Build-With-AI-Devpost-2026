import { clamp, fbm, hash2, lerp, smoothstep } from "./noise";
import { WATER_LEVEL, type World } from "./terrain";

type RGB = [number, number, number];

// G1 overview projection: keep the geographic map visually close to a rectangular sheet.
// The former 40:20 ratio exaggerated the isometric diamond and made N/S appear diagonal.
export const TILE_W = 28;
export const TILE_H = 26;
// Resolución del dibujo "horneado" para la vista general.
export const BAKE_SCALE = 1.25;
// A partir de este zoom se vuelve a dibujar la zona visible en vectores (siempre nítida).
export const DETAIL_ZOOM = 1.6;
const LIFT = 70;
const WATER_LIFT = WATER_LEVEL * LIFT;
const TOP_MARGIN = 150;
const PAD = 40;
// Anchura aproximada en pantalla de cada celda del terreno (px).
const CELL_PX = 12;

export const HAZE: RGB = [196, 210, 200];

export interface BakedWorld {
  canvas: HTMLCanvasElement;
  ox: number;
  oy: number;
  width: number;
  height: number;
  halfW: number;
  halfH: number;
  centerY: number;
  clearing: { x: number; y: number };
}

export interface Painter {
  bake: () => BakedWorld;
  drawDetail: (
    ctx: CanvasRenderingContext2D,
    cam: { x: number; y: number; zoom: number },
    viewW: number,
    viewH: number,
    dpr: number,
  ) => void;
}

const GRASS: RGB = [108, 148, 70];
const MEADOW: RGB = [146, 176, 82];
const FOREST_FLOOR: RGB = [70, 108, 58];
const MARSH: RGB = [98, 118, 76];
const ROCK: RGB = [132, 128, 118];
const EARTH: RGB = [104, 84, 58];
const MUD: RGB = [112, 100, 66];
const SAND: RGB = [176, 172, 124];
const FOAM: RGB = [206, 228, 216];
const SHALLOW: RGB = [104, 170, 170];
const DEEP: RGB = [44, 100, 138];

const mix = (a: RGB, b: RGB, t: number): RGB => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];
const scale = (c: RGB, k: number): RGB => [c[0] * k, c[1] * k, c[2] * k];
const css = (c: RGB, a = 1) =>
  `rgba(${Math.round(clamp(c[0], 0, 255))},${Math.round(clamp(c[1], 0, 255))},${Math.round(clamp(c[2], 0, 255))},${a})`;

interface Fields {
  h: number;
  forest: number;
  meadow: number;
  wet: number;
  rock: number;
}

// Interpola suavemente los datos por casilla y añade ruido fino: bordes orgánicos en vez de mosaico.
function makeSampler(world: World) {
  const N = world.size;
  const seed = world.seed;
  const tiles = world.tiles;

  const corner = (u: number, v: number) => {
    const uc = clamp(u, 0, N - 1);
    const vc = clamp(v, 0, N - 1);
    const x0 = Math.min(N - 2, Math.floor(uc));
    const y0 = Math.min(N - 2, Math.floor(vc));
    const fx = uc - x0;
    const fy = vc - y0;
    return { x0, y0, fx, fy };
  };

  const rawHeight = (u: number, v: number) => {
    const { x0, y0, fx, fy } = corner(u, v);
    const a = tiles[y0 * N + x0].h;
    const b = tiles[y0 * N + x0 + 1].h;
    const c = tiles[(y0 + 1) * N + x0].h;
    const d = tiles[(y0 + 1) * N + x0 + 1].h;
    return lerp(lerp(a, b, fx), lerp(c, d, fx), fy);
  };

  const height = (u: number, v: number) => {
    const h = rawHeight(u, v);
    // Orilla ondulada: solo se deforma cerca del nivel del agua.
    const near = smoothstep(0.1, 0.02, Math.abs(h - WATER_LEVEL));
    return near > 0 ? h + (fbm(u * 0.9, v * 0.9, seed + 51, 3) - 0.5) * 0.014 * near : h;
  };

  const fields = (u: number, v: number, o: Fields) => {
    const { x0, y0, fx, fy } = corner(u, v);
    const t00 = tiles[y0 * N + x0];
    const t10 = tiles[y0 * N + x0 + 1];
    const t01 = tiles[(y0 + 1) * N + x0];
    const t11 = tiles[(y0 + 1) * N + x0 + 1];
    const w00 = (1 - fx) * (1 - fy);
    const w10 = fx * (1 - fy);
    const w01 = (1 - fx) * fy;
    const w11 = fx * fy;
    const forest = t00.forest * w00 + t10.forest * w10 + t01.forest * w01 + t11.forest * w11;
    const meadow = t00.meadow * w00 + t10.meadow * w10 + t01.meadow * w01 + t11.meadow * w11;
    const wet = t00.wet * w00 + t10.wet * w10 + t01.wet * w01 + t11.wet * w11;
    const rock = t00.rock * w00 + t10.rock * w10 + t01.rock * w01 + t11.rock * w11;
    const n1 = fbm(u * 0.35 + 7, v * 0.35 + 3, seed + 50, 3) - 0.5;
    const n2 = fbm(u * 0.5 + 20, v * 0.5, seed + 53, 3) - 0.5;
    o.h = height(u, v);
    o.forest = clamp((forest - 0.5) * 1.5 + 0.5 + n1 * 0.5, 0, 1) * smoothstep(0, 0.04, forest);
    o.meadow = clamp((meadow - 0.5) * 1.4 + 0.5 + n2 * 0.4, 0, 1) * smoothstep(0, 0.04, meadow);
    o.wet = clamp((wet - 0.5) * 1.4 + 0.5 + n2 * 0.3, 0, 1) * smoothstep(0, 0.12, wet);
    o.rock = clamp((rock - 0.5) * 1.5 + 0.5 + n1 * 0.4, 0, 1) * smoothstep(0, 0.06, rock);
  };

  return { height, fields };
}

// Tipos de objeto del paisaje.
const Kind = {
  Pine: 0,
  Spruce: 1,
  Broadleaf: 2,
  Bush: 3,
  Boulder: 4,
  Tuft: 5,
  Flowers: 6,
  Reeds: 7,
} as const;
type Kind = (typeof Kind)[keyof typeof Kind];

interface Obj {
  kind: Kind;
  x: number;
  y: number;
  s: number;
  tone: number;
  r1: number;
  r2: number;
  r3: number;
}

export function createPainter(world: World): Painter {
  const N = world.size;
  const seed = world.seed;
  const hw = TILE_W / 2;
  const hh = TILE_H / 2;
  const width = N * TILE_W + PAD * 2;
  const height = TOP_MARGIN + N * TILE_H + PAD;
  const ox = width / 2;
  const oy = TOP_MARGIN;
  const { height: heightAt, fields } = makeSampler(world);
  const F: Fields = { h: 0, forest: 0, meadow: 0, wet: 0, rock: 0 };
  const G: Fields = { h: 0, forest: 0, meadow: 0, wet: 0, rock: 0 };

  const paint = (
    ctx: CanvasRenderingContext2D,
    S: number,
    bx0: number,
    bx1: number,
    by0: number,
    by1: number,
    lw: number,
    animationSeconds = 0,
  ) => {
    const M = N * S;
    const a = hw / S;
    const b = hh / S;

    // Rectángulo de pantalla -> rango de coordenadas de casilla (con margen para los árboles altos).
    let umin = Infinity;
    let umax = -Infinity;
    let vmin = Infinity;
    let vmax = -Infinity;
    for (const [X, Y] of [
      [bx0 - 30, by0 - 20],
      [bx1 + 30, by0 - 20],
      [bx0 - 30, by1 + 145],
      [bx1 + 30, by1 + 145],
    ]) {
      const du = (X - ox) / hw;
      const sv = (Y - oy) / hh;
      umin = Math.min(umin, (du + sv) / 2);
      umax = Math.max(umax, (du + sv) / 2);
      vmin = Math.min(vmin, (sv - du) / 2);
      vmax = Math.max(vmax, (sv - du) / 2);
    }
    const idx = (w: number) => Math.round((w + 0.5) * S - 0.5);
    const i0 = clamp(idx(umin) - 1, 0, M - 1);
    const i1 = clamp(idx(umax) + 1, 0, M - 1);
    const j0 = clamp(idx(vmin) - 1, 0, M - 1);
    const j1 = clamp(idx(vmax) + 1, 0, M - 1);
    if (i1 < i0 || j1 < j0) return;

    // Alturas de la ventana (con una celda de margen para vecinos).
    const hi0 = Math.max(0, i0 - 1);
    const hi1 = Math.min(M - 1, i1 + 1);
    const hj0 = Math.max(0, j0 - 1);
    const hj1 = Math.min(M - 1, j1 + 1);
    const HW = hi1 - hi0 + 1;
    const H = new Float32Array(HW * (hj1 - hj0 + 1));
    for (let j = hj0; j <= hj1; j++) {
      const v = (j + 0.5) / S - 0.5;
      for (let i = hi0; i <= hi1; i++) {
        H[(j - hj0) * HW + i - hi0] = heightAt((i + 0.5) / S - 0.5, v);
      }
    }
    const hOf = (i: number, j: number) =>
      H[(clamp(j, hj0, hj1) - hj0) * HW + clamp(i, hi0, hi1) - hi0];
    const liftOf = (i: number, j: number) => {
      const h = hOf(i, j);
      return h < WATER_LEVEL ? WATER_LIFT : h * LIFT;
    };

    // Objetos del paisaje: posiciones fijas por casilla (no dependen del nivel de detalle).
    const sBase = i0 + j0;
    const sCount = i1 + j1 - sBase + 1;
    const buckets: (Obj[] | undefined)[] = new Array(sCount);
    const addObj = (kind: Kind, u: number, v: number, s: number, tone: number, r1: number, r2: number, r3: number) => {
      const h = heightAt(u, v);
      const x = (u - v) * hw + ox;
      const y = (u + v) * hh + oy - h * LIFT;
      if (x < bx0 - 30 || x > bx1 + 30 || y < by0 - 2 || y > by1 + 85) return;
      const si = clamp(Math.floor((u + 0.5) * S) + Math.floor((v + 0.5) * S) - sBase, 0, sCount - 1);
      (buckets[si] ??= []).push({ kind, x, y, s, tone, r1, r2, r3 });
    };

    const tx0 = clamp(Math.floor(umin) - 1, 0, N - 1);
    const tx1 = clamp(Math.ceil(umax) + 1, 0, N - 1);
    const ty0 = clamp(Math.floor(vmin) - 1, 0, N - 1);
    const ty1 = clamp(Math.ceil(vmax) + 1, 0, N - 1);
    for (let ty = ty0; ty <= ty1; ty++) {
      for (let tx = tx0; tx <= tx1; tx++) {
        const rnd = (k: number) => hash2(tx, ty, seed + 100 + k);
        // Árboles: 4 posiciones candidatas repartidas con desorden por la casilla.
        for (let k = 0; k < 0; k++) { // Chapter 1: tree sprites now come exclusively from persistent workTrees
          const u = tx - 0.5 + (k & 1) * 0.5 + (rnd(k * 7 + 1) * 1.2 - 0.1) * 0.5;
          const v = ty - 0.5 + (k >> 1) * 0.5 + (rnd(k * 7 + 2) * 1.2 - 0.1) * 0.5;
          fields(u, v, G);
          if (G.h < WATER_LEVEL + 0.012) continue;
          const clump = lerp(0.6, 1.25, fbm(u * 0.5, v * 0.5, seed + 60, 2));
          const dens =
            Math.pow(G.forest, 1.1) * (1 - G.wet * 0.7) * (1 - G.rock * 0.8) * 0.62 * clump +
            (G.rock < 0.5 && G.wet < 0.3 ? 0.012 : 0);
          if (rnd(k * 7 + 3) >= dens) continue;
          const tone =
            0.8 + 0.4 * fbm(u * 0.25, v * 0.25, seed + 61, 3) + (rnd(k * 7 + 4) - 0.5) * 0.14;
          const s = 0.78 + rnd(k * 7 + 5) * 0.5;
          const pine = rnd(k * 7 + 6) < 0.25 + smoothstep(0.35, 0.6, G.h) * 0.6;
          const kind = pine ? (rnd(k * 7 + 8) < 0.3 ? Kind.Spruce : Kind.Pine) : Kind.Broadleaf;
          addObj(kind, u, v, s, tone, rnd(k * 7 + 9), rnd(k * 7 + 10), rnd(k * 7 + 11));
        }
        // Detalles del suelo: matas, flores, juncos, rocas y arbustos.
        for (let k = 0; k < 6; k++) {
          const u = tx - 0.5 + rnd(30 + k * 5);
          const v = ty - 0.5 + rnd(31 + k * 5);
          fields(u, v, G);
          if (G.h < WATER_LEVEL + 0.01) continue;
          const r = rnd(32 + k * 5);
          const r2 = rnd(33 + k * 5);
          const r3 = rnd(34 + k * 5);
          const tone = 0.85 + 0.3 * fbm(u * 0.25, v * 0.25, seed + 61, 3);
          if (G.rock > 0.3 ? r < G.rock * 0.1 : r < 0.003) {
            addObj(Kind.Boulder, u, v, 0.8 + r2 * 0.7, tone, r3, 0, 0);
          } else if (G.wet > 0.4 && r2 < 0.5) {
            addObj(Kind.Reeds, u, v, 1, tone, r3, r, 0);
          } else if (G.forest > 0.12 && G.forest < 0.75 && G.rock < 0.4 && r < 0.12) {
            addObj(Kind.Bush, u, v, 0.7 + r2 * 0.6, tone, r3, 0, 0);
          } else if (G.meadow > 0.35 && r < 0.3) {
            addObj(Kind.Flowers, u, v, 1, tone, r2, r3, 0);
          } else if (G.forest < 0.7 && G.rock < 0.5 && r < 0.55) {
            addObj(Kind.Tuft, u, v, 1, tone, r2, r3, 0);
          }
        }
      }
    }

    ctx.lineWidth = lw;
    ctx.lineJoin = "round";

    // Sin trazo: cada polígono se agranda un poco para que no queden rendijas entre celdas.
    const quad = (pts: number[], color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(pts[0], pts[1]);
      for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
      ctx.closePath();
      ctx.fill();
    };
    const e = lw * 0.5;

    const shadow = (x: number, y: number, rx: number, ry: number) => {
      ctx.fillStyle = "rgba(20,40,20,0.22)";
      ctx.beginPath();
      ctx.ellipse(x + rx * 0.2, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawObj = (o: Obj) => {
      const { x, y, s, tone } = o;
      switch (o.kind) {
        case Kind.Pine:
        case Kind.Spruce: {
          const spruce = o.kind === Kind.Spruce;
          const wf = (spruce ? 0.72 : 0.85) + o.r1 * 0.3;
          const hf = (spruce ? 1.25 : 1) + o.r2 * 0.2;
          shadow(x, y, 8 * s * wf, 3.5 * s);
          // G6.1: directional ground shadow, bounded to existing tree sprites.
          ctx.fillStyle = "rgba(24,43,25,0.13)";
          ctx.beginPath();
          ctx.ellipse(x + 6 * s, y + 2 * s, 11 * s * wf, 2.2 * s, -0.17, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = css([88, 62, 40]);
          ctx.fillRect(x - 1.5 * s, y - 6 * s, 3 * s, 6 * s);
          const layers: [number, number, number][] = spruce
            ? [
                [3, 8, 14],
                [9, 6.5, 20],
                [15, 5, 26],
                [21, 3.5, 32],
              ]
            : [
                [4, 9, 17],
                [11, 7, 24],
                [18, 5, 31],
              ];
          layers.forEach(([base, halfBase, apex], i) => {
            const lean = (o.r3 - 0.5) * 1.5 * s;
            const g = scale([44 + i * 9, 92 + i * 10, 56 + i * 4], tone);
            ctx.fillStyle = css(g);
            ctx.beginPath();
            ctx.moveTo(x - halfBase * s * wf, y - base * s * hf);
            ctx.lineTo(x + halfBase * s * wf, y - base * s * hf);
            ctx.lineTo(x + lean, y - (apex * s + 4 * s) * hf);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "rgba(0,20,0,0.18)";
            ctx.beginPath();
            ctx.moveTo(x - halfBase * s * wf, y - base * s * hf);
            ctx.lineTo(x, y - base * s * hf);
            ctx.lineTo(x + lean, y - (apex * s + 4 * s) * hf);
            ctx.closePath();
            ctx.fill();
          });
          // G6.3: restrained sunlit needles and canopy depth on close views.
          if (s >= 0.85) {
            ctx.lineWidth = Math.max(0.65, s * 0.7);
            ctx.strokeStyle = "rgba(192,212,123,0.30)";
            for (let n = 0; n < 5; n++) {
              const h = (10 + n * 4.2) * s;
              ctx.beginPath();
              ctx.moveTo(x - (2.5 + n % 2) * s, y - h);
              ctx.lineTo(x - (5.7 + n % 3) * s * wf, y - (h - 1.9 * s));
              ctx.stroke();
            }
            ctx.lineWidth = lw;
          }
          break;
        }
        case Kind.Broadleaf: {
          shadow(x, y, 9 * s, 3.5 * s);
          ctx.fillStyle = "rgba(24,43,25,0.14)";
          ctx.beginPath();
          ctx.ellipse(x + 7 * s, y + 2 * s, 12 * s, 2.6 * s, -0.12, 0, Math.PI * 2);
          ctx.fill();
          const th = 8 + o.r1 * 4;
          ctx.fillStyle = css([92, 66, 42]);
          ctx.fillRect(x - 1.5 * s, y - th * s, 3 * s, th * s);
          const base = scale(mix([78, 128, 56], [112, 146, 52], o.r2), tone);
          const blobs: [number, number, number][] = [
            [-4 - o.r3 * 2, th + 6, 5.5 + o.r1 * 1.5],
            [4 + o.r1 * 2, th + 7, 6 + o.r3 * 1.5],
            [(o.r2 - 0.5) * 3, th + 12, 6.5 + o.r2],
          ];
          blobs.forEach(([bx, by, r]) => {
            ctx.fillStyle = css(scale(base, 0.86));
            ctx.beginPath();
            ctx.arc(x + bx * s, y - by * s, r * s, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.fillStyle = css(scale(base, 1.12), 0.9);
          ctx.beginPath();
          ctx.arc(x - 2 * s, y - (th + 13) * s, 4.2 * s, 0, Math.PI * 2);
          ctx.fill();
          // G6.2: small deterministic leaf clusters soften the geometric silhouette.
          // No random state, additional assets, or gameplay changes.
          if (s >= 0.65) {
            for (let n = 0; n < 5; n++) {
              const aLeaf = n * 2.399 + o.r3 * 5.8;
              const rLeaf = (3.8 + (n % 3) * 1.15) * s;
              const lx = x + Math.cos(aLeaf) * rLeaf;
              const ly = y - (th + 8.8) * s + Math.sin(aLeaf) * rLeaf * 0.63;
              ctx.fillStyle = css(scale(base, n % 2 ? 1.07 : 0.93), 0.85);
              ctx.beginPath();
              ctx.ellipse(lx, ly, (2.0 + o.r1) * s, (1.35 + o.r2) * s, aLeaf * 0.25, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          // G6.3: individual shaded leaf clusters, seeded by the tree, not the frame.
          if (s >= 0.85) {
            for (let n = 0; n < 9; n++) {
              const ang = n * 2.39996 + o.r1 * 5.1;
              const rr = (2.1 + (n % 4) * 1.22) * s;
              const dx = Math.cos(ang) * rr;
              const dy = Math.sin(ang) * rr * 0.66;
              ctx.fillStyle = n % 3 === 0 ? "rgba(29,68,32,0.19)" : "rgba(211,232,144,0.20)";
              ctx.beginPath();
              ctx.ellipse(x + dx - s, y - (th + 10) * s + dy, (1.15 + o.r2 * 0.65) * s, (0.62 + o.r3 * 0.4) * s, ang * 0.12, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          // Broken canopy highlights avoid perfectly flat circular crowns.
          ctx.fillStyle = "rgba(213,230,148,0.19)";
          for (let n = 0; n < 3; n++) {
            const a = (o.r1 * 6.28) + n * 2.13;
            ctx.beginPath();
            ctx.ellipse(x + (Math.cos(a) * 4 - 1) * s, y - (th + 9 + Math.sin(a) * 3) * s, (1.2 + o.r2) * s, 0.8 * s, a, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }
        case Kind.Bush: {
          shadow(x, y, 6 * s, 2.4 * s);
          const base = scale(mix([70, 116, 52], [104, 138, 58], o.r1), tone);
          ctx.fillStyle = css(scale(base, 0.85));
          ctx.beginPath();
          ctx.arc(x - 2.5 * s, y - 3 * s, 3.6 * s, 0, Math.PI * 2);
          ctx.arc(x + 2.5 * s, y - 3.5 * s, 3.9 * s, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = css(scale(base, 1.1));
          ctx.beginPath();
          ctx.arc(x, y - 5.5 * s, 3.4 * s, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case Kind.Boulder: {
          ctx.fillStyle = "rgba(20,30,20,0.22)";
          ctx.beginPath();
          ctx.ellipse(x + 1, y + 1, 6 * s, 2.6 * s, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = css(scale(ROCK, 0.85 + o.r1 * 0.2));
          ctx.beginPath();
          ctx.moveTo(x - 6 * s, y);
          ctx.lineTo(x - 4 * s, y - 6 * s);
          ctx.lineTo(x + 2 * s, y - 7 * s);
          ctx.lineTo(x + 6 * s, y - 2 * s);
          ctx.lineTo(x + 5 * s, y);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.18)";
          ctx.beginPath();
          ctx.moveTo(x - 4 * s, y - 6 * s);
          ctx.lineTo(x + 2 * s, y - 7 * s);
          ctx.lineTo(x, y - 3 * s);
          ctx.closePath();
          ctx.fill();
          // G6.3: subtle cracks and mineral grain on close-up boulders.
          if (s > 0.85) {
            ctx.strokeStyle = "rgba(61,67,61,0.28)";
            ctx.lineWidth = Math.max(0.6, s * 0.55);
            ctx.beginPath();
            ctx.moveTo(x - 2.5 * s, y - 3.8 * s);
            ctx.lineTo(x - 0.5 * s, y - 2.8 * s);
            ctx.lineTo(x + 1.1 * s, y - 4.0 * s);
            ctx.stroke();
            ctx.lineWidth = lw;
          }
          break;
        }
        case Kind.Tuft: {
          ctx.strokeStyle = css(scale([88, 124, 56], tone * 0.85));
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - 1.2 - o.r1, y - 3.5);
          ctx.moveTo(x + 1.5, y);
          ctx.lineTo(x + 2 + o.r2 * 1.5, y - 3);
          ctx.moveTo(x + 0.7, y);
          ctx.lineTo(x + 0.4, y - 4.2);
          ctx.stroke();
          ctx.lineWidth = lw;
          break;
        }
        case Kind.Flowers: {
          const palette: RGB[] = [
            [244, 240, 224],
            [240, 208, 84],
            [226, 130, 160],
            [150, 130, 220],
          ];
          const n = 1 + Math.floor(o.r1 * 3);
          for (let k = 0; k < n; k++) {
            ctx.fillStyle = css(palette[Math.floor(hash2(k, Math.floor(o.r2 * 1e4), seed) * 4)]);
            ctx.fillRect(x + (k - 1) * 2.6, y - (k % 2) * 1.5, 2, 2);
          }
          break;
        }
        case Kind.Reeds: {
          ctx.strokeStyle = css([158, 156, 92]);
          ctx.lineWidth = 1.2;
          const n = 2 + Math.floor(o.r2 * 2);
          for (let k = 0; k < n; k++) {
            const rh = 6 + hash2(k, Math.floor(o.r1 * 1e4), seed) * 5;
            ctx.beginPath();
            ctx.moveTo(x + k * 1.6 - 2, y);
            ctx.lineTo(x + k * 1.6 - 2 + (o.r1 - 0.5) * 3, y - rh);
            ctx.stroke();
          }
          ctx.lineWidth = lw;
          break;
        }
      }
    };

    for (let s = i0 + j0; s <= i1 + j1; s++) {
      const iFrom = Math.max(i0, s - j1);
      const iTo = Math.min(i1, s - j0);
      for (let i = iFrom; i <= iTo; i++) {
        const j = s - i;
        const u = (i + 0.5) / S - 0.5;
        const v = (j + 0.5) / S - 0.5;
        const px = (u - v) * hw + ox;
        if (px < bx0 - a - 2 || px > bx1 + a + 2) continue;
        const h = hOf(i, j);
        const water = h < WATER_LEVEL;
        const lift = water ? WATER_LIFT : h * LIFT;
        const cy = (u + v) * hh + oy - lift;
        if (cy < by0 - b - 2 || cy > by1 + 40) continue;

        let top: RGB;
        if (water) {
          const d = WATER_LEVEL - h;
          let c = mix(SHALLOW, DEEP, smoothstep(0, 0.09, d));
          c = mix(c, SAND, smoothstep(0.04, 0, d) * 0.45);
          const land =
            hOf(i + 1, j) >= WATER_LEVEL ||
            hOf(i - 1, j) >= WATER_LEVEL ||
            hOf(i, j + 1) >= WATER_LEVEL ||
            hOf(i, j - 1) >= WATER_LEVEL;
          if (land) c = mix(c, FOAM, 0.2);
          // G6.2: quiet depth variation, without affecting river collision or fords.
          const depthGrain = fbm(u * 2.6, v * 2.6, seed + 772, 2) - 0.5;
          c = scale(c, 1 + depthGrain * (land ? 0.09 : 0.055));
          top = scale(c, 0.97 + (fbm(u * 0.8, v * 0.8, seed + 55, 2) - 0.5) * 0.12);
        } else {
          fields(u, v, F);
          let c = GRASS;
          c = mix(c, FOREST_FLOOR, F.forest * 0.85);
          c = mix(c, MEADOW, F.meadow);
          c = mix(c, MARSH, F.wet * 0.9);
          c = mix(c, ROCK, F.rock);
          if (
            hOf(i + 1, j) < WATER_LEVEL ||
            hOf(i - 1, j) < WATER_LEVEL ||
            hOf(i, j + 1) < WATER_LEVEL ||
            hOf(i, j - 1) < WATER_LEVEL
          ) {
            c = mix(c, MUD, 0.4);
          }
          const tone =
            0.95 +
            (fbm(u * 0.05, v * 0.05, seed + 20) - 0.5) * 0.18 +
            (fbm(u * 1.4 + 2, v * 1.4, seed + 52, 2) - 0.5) * 0.09;
          const shade =
            1 + 4 * S * (hOf(i + 1, j) + hOf(i, j + 1) - hOf(i - 1, j) - hOf(i, j - 1));
          top = scale(c, tone * clamp(shade, 0.72, 1.25));

          const dropL = lift - liftOf(i, j + 1);
          const dropR = lift - liftOf(i + 1, j);
          const side = mix(mix(top, EARTH, 0.45), ROCK, F.rock * 0.6);
          if (dropL > 0.2) {
            quad([px - a - e, cy, px, cy + b, px, cy + b + dropL + e, px - a - e, cy + dropL + e], css(scale(side, 0.78)));
          }
          if (dropR > 0.2) {
            quad([px, cy + b, px + a + e, cy, px + a + e, cy + dropR + e, px, cy + b + dropR + e], css(scale(side, 0.6)));
          }
        }

        quad([px, cy - b - e, px + a + e, cy, px, cy + b + e, px - a - e, cy], css(top));

        // G6: subtle high-zoom terrain microtexture, bounded to avoid mobile overdraw.
        // Stable hashes prevent visual flicker when the camera moves.
        if (!water && a >= 5.5) {
          const speck = hash2(i, j, seed + 6401);
          if (speck < 0.34) {
            const dx = (hash2(i, j, seed + 6402) - 0.5) * a * 1.1;
            const dy = (hash2(i, j, seed + 6403) - 0.5) * b * 0.9;
            ctx.fillStyle = speck < 0.12 ? "rgba(35,63,30,0.19)" : "rgba(245,229,159,0.16)";
            ctx.beginPath();
            ctx.ellipse(px + dx, cy + dy, Math.max(0.7, a * 0.13), Math.max(0.4, b * 0.09), 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        // Broken bank highlights: only land cells adjacent to water, at close zoom.
        if (!water && a >= 5 && hash2(i, j, seed + 6420) < 0.31 && (
          hOf(i + 1, j) < WATER_LEVEL || hOf(i - 1, j) < WATER_LEVEL ||
          hOf(i, j + 1) < WATER_LEVEL || hOf(i, j - 1) < WATER_LEVEL
        )) {
          ctx.strokeStyle = "rgba(214,198,146,0.33)";
          ctx.lineWidth = Math.max(0.65, Math.min(1.4, a * 0.055));
          ctx.beginPath();
          ctx.moveTo(px - a * 0.26, cy + b * 0.18);
          ctx.quadraticCurveTo(px, cy + b * 0.04, px + a * 0.27, cy + b * 0.16);
          ctx.stroke();
          ctx.lineWidth = lw;
        }

        // G4: deterministic, sparse meadow highlights at close zoom only.
        // No additional sprites or assets; skips water and low-detail views.
        if (!water && a >= 4 && F.meadow > 0.24 && F.forest < 0.55) {
          const tuft = hash2(i, j, seed + 947);
          if (tuft < 0.16) {
            const tx = px + (hash2(i, j, seed + 948) - 0.5) * a * 0.8;
            const ty = cy + (hash2(i, j, seed + 949) - 0.5) * b * 0.6;
            const blade = Math.min(3.2, Math.max(1, a * 0.18));
            ctx.strokeStyle = `rgba(190,207,115,${Math.min(0.42, F.meadow * 0.45)})`;
            ctx.lineWidth = Math.max(0.55, Math.min(1, a * 0.035));
            ctx.beginPath();
            ctx.moveTo(tx - blade * 0.5, ty);
            ctx.lineTo(tx - blade * 0.8, ty - blade);
            ctx.moveTo(tx, ty);
            ctx.lineTo(tx + blade * 0.25, ty - blade * 1.35);
            ctx.moveTo(tx + blade * 0.5, ty);
            ctx.lineTo(tx + blade, ty - blade * 0.8);
            ctx.stroke();
            ctx.lineWidth = lw;
          }
        }

        // G4: sparse forest-floor leaf litter. Draw only at close zoom;
        // positions depend on the world seed, not on animation frames.
        if (!water && a >= 6 && F.forest > 0.48 && hash2(i, j, seed + 3301) < 0.12) {
          const lx = px + (hash2(i, j, seed + 3302) - 0.5) * a * 0.9;
          const ly = cy + (hash2(i, j, seed + 3303) - 0.5) * b * 0.7;
          const leafSize = Math.min(2.5, a * 0.13);
          ctx.fillStyle = "rgba(155,120,69,0.34)";
          ctx.beginPath();
          ctx.ellipse(lx, ly, leafSize, leafSize * 0.36, -0.35, 0, Math.PI * 2);
          ctx.fill();
        }

        // G4: subtle riverbank sediment texture. Cosmetic only, deterministic,
        // and restricted to detailed views to preserve mobile performance.
        if (!water && a >= 4 && F.meadow < 0.65 && hash2(i, j, seed + 1201) < 0.10) {
          const nearWater =
            liftOf(i - 1, j) <= WATER_LIFT || liftOf(i + 1, j) <= WATER_LIFT ||
            liftOf(i, j - 1) <= WATER_LIFT || liftOf(i, j + 1) <= WATER_LIFT;
          if (nearWater) {
            const sx = px + (hash2(i, j, seed + 1202) - 0.5) * a * 0.65;
            const sy = cy + (hash2(i, j, seed + 1203) - 0.5) * b * 0.55;
            ctx.fillStyle = "rgba(208,190,142,0.22)";
            ctx.beginPath();
            ctx.ellipse(sx, sy, Math.min(2.1, a * 0.12), Math.min(0.8, b * 0.08), 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // G5: broken soft bank transition and damp sediment at water boundaries.
        // Purely cosmetic; uses existing terrain cells and no new simulation state.
        if (!water && a >= 3.2) {
          const adjacentWater = liftOf(i - 1, j) <= WATER_LIFT || liftOf(i + 1, j) <= WATER_LIFT ||
            liftOf(i, j - 1) <= WATER_LIFT || liftOf(i, j + 1) <= WATER_LIFT;
          if (adjacentWater) {
            const bankNoise = hash2(i, j, seed + 4182);
            ctx.fillStyle = `rgba(144,126,84,${0.12 + bankNoise * 0.12})`;
            ctx.beginPath();
            ctx.ellipse(px + (bankNoise - .5) * a * .25, cy, a * (.25 + bankNoise * .18), b * .28, bankNoise - .5, 0, Math.PI * 2);
            ctx.fill();
            // G6.3: short reeds along the shore; no collision or world state.
            if (a > 8 && bankNoise > 0.72) {
              const bx = px + (bankNoise - 0.5) * a * 0.45;
              const by = cy + b * 0.18;
              ctx.strokeStyle = "rgba(64,103,66,0.48)";
              ctx.lineWidth = Math.max(0.7, Math.min(1.3, a * 0.055));
              ctx.beginPath();
              ctx.moveTo(bx, by);
              ctx.lineTo(bx - a * 0.07, by - b * 0.38);
              ctx.moveTo(bx, by);
              ctx.lineTo(bx + a * 0.06, by - b * 0.32);
              ctx.stroke();
              ctx.lineWidth = lw;
            }
            if (a > 7 && bankNoise > .53) {
              ctx.strokeStyle = 'rgba(224,236,205,.27)';
              ctx.lineWidth = Math.min(1.1, a * .05);
              ctx.beginPath();
              ctx.moveTo(px - a * .21, cy + b * .08);
              ctx.quadraticCurveTo(px, cy - b * .13, px + a * .22, cy);
              ctx.stroke();
              ctx.lineWidth = lw;
            }
          }
        }

        // G2 water depth: a translucent surface glint travels with the current.
        // The underlying shallow/deep palette remains visible, preserving fords.
        if (water && a > 2.5) {
          const depth = WATER_LEVEL - h;
          const glint = hash2(i, j, seed + 211);
          if (glint < 0.11) {
            const phase = animationSeconds * (0.55 + glint) + i * 0.73 + j * 0.49;
            const shimmer = 0.09 + 0.13 * (0.5 + 0.5 * Math.sin(phase));
            const gx = px + Math.sin(phase * 0.65) * a * 0.15;
            const gy = cy - b * 0.16;
            ctx.strokeStyle = `rgba(230,250,243,${depth < 0.035 ? shimmer * 1.6 : shimmer})`;
            ctx.lineWidth = Math.max(0.65, Math.min(1.6, a * 0.055));
            ctx.beginPath();
            ctx.moveTo(gx - a * 0.2, gy + b * 0.08);
            ctx.quadraticCurveTo(gx, gy - b * 0.11, gx + a * 0.2, gy + b * 0.02);
            ctx.stroke();
            ctx.lineWidth = lw;
          }
          // G4: subtle secondary water reflections only at close zoom. Purely
          // cosmetic; deterministic positions and capped drawing cost on mobile.
          if (a >= 7 && depth > 0.012 && hash2(i, j, seed + 2417) < 0.065) {
            const drift = animationSeconds * 0.36 + i * 0.31 + j * 0.67;
            const reflectionX = px + (hash2(i, j, seed + 2418) - 0.5) * a * 0.32;
            const reflectionY = cy + (hash2(i, j, seed + 2419) - 0.5) * b * 0.22;
            ctx.strokeStyle = `rgba(218,244,232,${(0.07 + 0.045 * Math.sin(drift)).toFixed(3)})`;
            ctx.lineWidth = Math.min(1.15, Math.max(0.65, a * 0.035));
            ctx.beginPath();
            ctx.moveTo(reflectionX - a * 0.14, reflectionY);
            ctx.lineTo(reflectionX + a * 0.14, reflectionY - b * 0.035);
            ctx.stroke();
            ctx.lineWidth = lw;
          }
          // G4: shallow ford ripples reveal moving water over the riverbed.
          // Sparse, deterministic cells and a close-zoom gate bound draw cost.
          if (a >= 7 && depth > 0.003 && depth < 0.05 &&
              hash2(i, j, seed + 2801) < 0.085) {
            const ripplePhase = (animationSeconds * 0.42 +
              hash2(i, j, seed + 2802) * 3.5) % 3.5;
            const spread = 0.08 + ripplePhase / 3.5 * 0.28;
            const opacity = Math.max(0, (1 - ripplePhase / 3.5) * 0.25);
            const rx = px + (hash2(i, j, seed + 2803) - 0.5) * a * 0.25;
            const ry = cy + (hash2(i, j, seed + 2804) - 0.5) * b * 0.18;
            ctx.strokeStyle = `rgba(230,248,234,${opacity.toFixed(3)})`;
            ctx.lineWidth = Math.max(0.6, Math.min(1.2, a * 0.04));
            ctx.beginPath();
            ctx.ellipse(rx, ry, a * spread, b * spread * 0.55,
              0, Math.PI * 0.13, Math.PI * 0.88);
            ctx.stroke();
            ctx.lineWidth = lw;
          }
          // A narrow broken foam edge follows tiles touching the riverbank.
          const northLand = hOf(i, j - 1) >= WATER_LEVEL;
          const southLand = hOf(i, j + 1) >= WATER_LEVEL;
          const westLand = hOf(i - 1, j) >= WATER_LEVEL;
          const eastLand = hOf(i + 1, j) >= WATER_LEVEL;
          if (northLand || southLand || westLand || eastLand) {
            const pulse = 0.22 + 0.09 * Math.sin(animationSeconds * 1.3 + i * 0.9 + j);
            ctx.strokeStyle = `rgba(220,241,225,${pulse})`;
            ctx.lineWidth = Math.max(0.65, Math.min(1.45, a * 0.05));
            ctx.beginPath();
            if (northLand) { ctx.moveTo(px - a, cy); ctx.lineTo(px, cy - b); }
            if (eastLand) { ctx.moveTo(px, cy - b); ctx.lineTo(px + a, cy); }
            if (southLand) { ctx.moveTo(px + a, cy); ctx.lineTo(px, cy + b); }
            if (westLand) { ctx.moveTo(px, cy + b); ctx.lineTo(px - a, cy); }
            ctx.stroke();
            ctx.lineWidth = lw;
          }
        }

        // G2 river surface: thin current streaks and occasional submerged fish.
        // Fish are visual wildlife for Chapter 1, not harvestable resources yet.
        if (water) {
          const depth = WATER_LEVEL - h;
          const current = hash2(i, j, seed + 171);
          if (current < 0.18) {
            const ox = (hash2(i, j, seed + 172) - 0.5) * a * 0.55 + Math.sin(animationSeconds * 0.65 + i + j * 0.7) * a * 0.09;
            const oy = (hash2(i, j, seed + 173) - 0.5) * b * 0.45;
            ctx.strokeStyle = depth < 0.045 ? "rgba(222,245,236,0.42)" : "rgba(176,224,225,0.25)";
            ctx.lineWidth = Math.max(0.6, Math.min(1.3, a * 0.045));
            ctx.beginPath();
            ctx.moveTo(px + ox - a * 0.28, cy + oy + b * 0.1);
            ctx.quadraticCurveTo(px + ox, cy + oy - b * 0.14, px + ox + a * 0.25, cy + oy);
            ctx.stroke();
            ctx.lineWidth = lw;
          }
          // Stable shoals: neighbouring fish share a heading and turn together.
          // Deterministic seeds keep the shoal in place across camera movements.
          const shoalSeed = hash2(Math.floor(i / 7), Math.floor(j / 7), seed + 181);
          if (depth > 0.018 && shoalSeed < 0.15 && hash2(i, j, seed + 186) < 0.055) {
            const shoalX = Math.floor(i / 7);
            const shoalY = Math.floor(j / 7);
            const heading = Math.sin(animationSeconds * 0.23 + shoalX * 1.3 + shoalY * 0.9);
            const direction = heading >= 0 ? 1 : -1;
            const swim = animationSeconds * (0.28 + shoalSeed * 0.18);
            const fishCount = 2 + Math.floor(hash2(i, j, seed + 187) * 3);
            const fishSize = Math.max(1.3, Math.min(3.8, a * 0.12));
            // Keep the shoal inside its own water cell. Never swim onto dry banks.
            const wander = Math.sin(swim + shoalX) * a * 0.07;
            for (let fish = 0; fish < fishCount; fish++) {
              const offset = fish - (fishCount - 1) / 2;
              const fx = px + (hash2(i, j, seed + 182) - 0.5) * a * 0.24 +
                direction * offset * a * 0.12 + wander;
              const fy = cy + (hash2(i, j, seed + 183) - 0.5) * b * 0.2 +
                offset * b * 0.085 + Math.cos(swim * 0.7 + shoalY + fish * 0.3) * b * 0.045;
              ctx.save();
              ctx.translate(fx, fy);
              ctx.scale(direction, 1);
              ctx.rotate(Math.sin(swim + fish * 0.4) * 0.12);
              ctx.fillStyle = "rgba(22,69,75,0.47)";
              ctx.beginPath();
              ctx.ellipse(0, 0, fishSize, fishSize * 0.38, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(-fishSize * 0.75, 0);
              ctx.lineTo(-fishSize * (1.45 + Math.sin(swim * 7 + fish) * 0.16), -fishSize * 0.62);
              ctx.lineTo(-fishSize * (1.45 + Math.sin(swim * 7 + fish) * 0.16), fishSize * 0.62);
              ctx.closePath();
              ctx.fill();
              // Small dorsal fin and eye: readable at close zoom, no extra entities.
              if (fishSize > 1.8) {
                ctx.beginPath();
                ctx.moveTo(-fishSize * 0.18, -fishSize * 0.26);
                ctx.lineTo(fishSize * 0.1, -fishSize * 0.73);
                ctx.lineTo(fishSize * 0.48, -fishSize * 0.27);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = "rgba(228,238,218,0.72)";
                ctx.beginPath();
                ctx.arc(fishSize * 0.62, -fishSize * 0.09, Math.max(0.28, fishSize * 0.1), 0, Math.PI * 2);
                ctx.fill();
              }
              ctx.restore();
            }
          }
          // Slow eddies in deep water; cosmetic and deterministic per river cell.
          if (depth > 0.055 && a > 4 && hash2(i, j, seed + 245) < 0.022) {
            const turn = animationSeconds * 0.34 + hash2(i, j, seed + 246) * Math.PI * 2;
            ctx.strokeStyle = "rgba(201,232,229,0.18)";
            ctx.lineWidth = Math.max(0.65, Math.min(1.4, a * 0.045));
            ctx.beginPath();
            ctx.ellipse(px, cy, a * 0.23, b * 0.15, 0, turn, turn + Math.PI * 1.18);
            ctx.stroke();
            ctx.lineWidth = lw;
          }
        }

        // Small irregular wet-bank pebbles, visible only on shoreline land.
        if (!water && hash2(i, j, seed + 191) < 0.25 && (
          hOf(i + 1, j) < WATER_LEVEL || hOf(i - 1, j) < WATER_LEVEL ||
          hOf(i, j + 1) < WATER_LEVEL || hOf(i, j - 1) < WATER_LEVEL
        )) {
          const stoneX = px + (hash2(i, j, seed + 192) - 0.5) * a * 0.9;
          const stoneY = cy + (hash2(i, j, seed + 193) - 0.5) * b * 0.7;
          ctx.fillStyle = "rgba(116,116,100,0.52)";
          ctx.beginPath();
          ctx.ellipse(stoneX, stoneY, Math.max(0.7, a * 0.1), Math.max(0.5, b * 0.07), 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // G2 shoreline ecology: stable clusters of reeds rooted only in wet
        // land immediately beside water. Sway is cosmetic, not a simulation tick.
        if (!water && a > 3 && hash2(i, j, seed + 231) < 0.19 && (
          hOf(i + 1, j) < WATER_LEVEL || hOf(i - 1, j) < WATER_LEVEL ||
          hOf(i, j + 1) < WATER_LEVEL || hOf(i, j - 1) < WATER_LEVEL
        )) {
          const rx = px + (hash2(i, j, seed + 232) - 0.5) * a * 0.7;
          const ry = cy + (hash2(i, j, seed + 233) - 0.5) * b * 0.48;
          const sway = Math.sin(animationSeconds * 0.85 + i * 0.71 + j * 0.49) * a * 0.045;
          const stem = Math.max(2, Math.min(12, a * 0.46));
          ctx.lineWidth = Math.max(0.7, Math.min(1.6, a * 0.045));
          for (let blade = 0; blade < 3; blade++) {
            const spread = (blade - 1) * a * 0.09;
            ctx.strokeStyle = blade === 1 ? "rgba(72,111,57,0.78)" : "rgba(92,126,65,0.67)";
            ctx.beginPath();
            ctx.moveTo(rx + spread * 0.4, ry);
            ctx.quadraticCurveTo(rx + spread, ry - stem * 0.58, rx + spread + sway, ry - stem * (0.78 + blade * 0.1));
            ctx.stroke();
          }
          ctx.lineWidth = lw;
        }

        if (water && hash2(i, j, seed + 2) < 0.06) {
          const lx = px + (hash2(i, j, seed + 3) - 0.5) * a;
          ctx.strokeStyle = "rgba(255,255,255,0.35)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(lx - 4, cy);
          ctx.lineTo(lx + 4, cy);
          ctx.stroke();
          ctx.lineWidth = lw;
        }
      }
      const list = buckets[s - sBase];
      if (list) {
        list.sort((p, q) => p.y - q.y);
        list.forEach(drawObj);
        buckets[s - sBase] = undefined;
      }
    }

    // Bruma en los bordes, dibujada sobre el plano de la cuadrícula.
    ctx.save();
    ctx.transform(hw, hh, -hw, hh, ox, oy);
    const Fd = 16;
    const lo = -0.5;
    const hi = N - 0.5;
    const fade = (x0: number, y0: number, x1: number, y1: number) => {
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, css(HAZE, 0.92));
      g.addColorStop(0.5, css(HAZE, 0.42));
      g.addColorStop(1, css(HAZE, 0));
      ctx.fillStyle = g;
      ctx.fillRect(lo - 2, lo - 2, N + 4, N + 4);
    };
    fade(lo, 0, lo + Fd, 0);
    fade(hi, 0, hi - Fd, 0);
    fade(0, lo, 0, lo + Fd);
    fade(0, hi, 0, hi - Fd);
    ctx.restore();
  };

  const bake = (): BakedWorld => {
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(width * BAKE_SCALE);
    canvas.height = Math.ceil(height * BAKE_SCALE);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No se pudo crear el lienzo del mundo");
    ctx.scale(BAKE_SCALE, BAKE_SCALE);
    paint(ctx, 3, 0, width, 0, height, 1);

    const c = world.clearing;
    const t = world.tiles[c.y * N + c.x];
    return {
      canvas,
      ox,
      oy,
      width,
      height,
      halfW: (N * TILE_W) / 2,
      halfH: (N * TILE_H) / 2,
      centerY: oy + (N * TILE_H) / 2,
      clearing: {
        x: (c.x - c.y) * hw + ox,
        y: (c.x + c.y) * hh + oy - t.h * LIFT,
      },
    };
  };

  const drawDetail: Painter["drawDetail"] = (ctx, cam, viewW, viewH, dpr) => {
    const z = cam.zoom;
    const bx0 = cam.x - viewW / (2 * z);
    const by0 = cam.y - viewH / (2 * z);
    const S = Math.max(3, Math.round((TILE_W * z) / CELL_PX));
    ctx.save();
    ctx.setTransform(dpr * z, 0, 0, dpr * z, -bx0 * dpr * z, -by0 * dpr * z);
    paint(ctx, S, bx0, bx0 + viewW / z, by0, by0 + viewH / z, Math.min(1, 1.2 / z), Date.now() / 1000);
    ctx.restore();
  };

  return { bake, drawDetail };
}
