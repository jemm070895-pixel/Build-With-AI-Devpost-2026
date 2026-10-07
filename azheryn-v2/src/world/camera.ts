import { clamp } from "./noise";
import type { BakedWorld } from "./renderer";

export interface CameraState {
  x: number;
  y: number;
  zoom: number;
}

// G1 overview gate: allow the whole local map to be inspected before detailed play.
export const MIN_ZOOM = 0.18;
export const MAX_ZOOM = 8;

// Mantiene el centro de la cámara dentro del rombo del mundo (un poco de margen).
export function clampCamera(cam: CameraState, world: BakedWorld) {
  cam.zoom = clamp(cam.zoom, MIN_ZOOM, MAX_ZOOM);
  const dx = (cam.x - world.ox) / world.halfW;
  const dy = (cam.y - world.centerY) / world.halfH;
  const m = Math.abs(dx) + Math.abs(dy);
  const limit = 0.82;
  if (m > limit) {
    cam.x = world.ox + (dx * limit * world.halfW) / m;
    cam.y = world.centerY + (dy * limit * world.halfH) / m;
  }
}
