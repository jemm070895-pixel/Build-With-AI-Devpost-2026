import { clamp, fbm, hash2, lerp, smoothstep } from "./noise";
import { WATER_LEVEL, type World } from "./terrain";

type RGB = [number, number, number];

export const TILE_W = 40;
export const TILE_H = 20;
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
        for (let k = 0; k < 4; k++) {
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
          break;
        }
        case Kind.Broadleaf: {
          shadow(x, y, 9 * s, 3.5 * s);
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
    paint(ctx, S, bx0, bx0 + viewW / z, by0, by0 + viewH / z, Math.min(1, 1.2 / z));
    ctx.restore();
  };

  return { bake, drawDetail };
}
