import { useEffect, useRef, useState } from "react";
import { clampCamera, MAX_ZOOM, MIN_ZOOM, type CameraState } from "../world/camera";
import { clamp } from "../world/noise";
import {
  BAKE_SCALE,
  createPainter,
  DETAIL_ZOOM,
  HAZE,
  type BakedWorld,
} from "../world/renderer";
import { createWorld } from "../world/terrain";

const PAN_SPEED = 700;
const MOVE_KEYS: Record<string, [number, number]> = {
  w: [0, -1],
  arrowup: [0, -1],
  s: [0, 1],
  arrowdown: [0, 1],
  a: [-1, 0],
  arrowleft: [-1, 0],
  d: [1, 0],
  arrowright: [1, 0],
};

export function WorldView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const world = createWorld();
    const painter = createPainter(world);

    let baked: BakedWorld | null = null;
    let frame = 0;
    let dirty = true;
    let last = performance.now();
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    const keys = new Set<string>();
    const cam: CameraState = { x: 0, y: 0, zoom: 1 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dirty = true;
    };

    // Vista general: imagen ya dibujada. Vista cercana: se dibuja solo la zona visible, siempre nítida.
    const drawBaked = (b: BakedWorld) => {
      const z = cam.zoom;
      const sx = cam.x - width / (2 * z);
      const sy = cam.y - height / (2 * z);
      const x0 = Math.max(0, sx);
      const y0 = Math.max(0, sy);
      const x1 = Math.min(b.width, sx + width / z);
      const y1 = Math.min(b.height, sy + height / z);
      if (x1 <= x0 || y1 <= y0) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        b.canvas,
        x0 * BAKE_SCALE,
        y0 * BAKE_SCALE,
        (x1 - x0) * BAKE_SCALE,
        (y1 - y0) * BAKE_SCALE,
        (x0 - sx) * z,
        (y0 - sy) * z,
        (x1 - x0) * z,
        (y1 - y0) * z,
      );
    };

    const draw = () => {
      ctx.fillStyle = `rgb(${HAZE[0]},${HAZE[1]},${HAZE[2]})`;
      ctx.fillRect(0, 0, width, height);
      if (!baked) return;
      if (cam.zoom >= DETAIL_ZOOM) painter.drawDetail(ctx, cam, width, height, dpr);
      else drawBaked(baked);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (baked && keys.size > 0) {
        let mx = 0;
        let my = 0;
        keys.forEach((k) => {
          const v = MOVE_KEYS[k];
          if (v) {
            mx += v[0];
            my += v[1];
          }
        });
        if (mx || my) {
          const len = Math.hypot(mx, my);
          cam.x += ((mx / len) * PAN_SPEED * dt) / cam.zoom;
          cam.y += ((my / len) * PAN_SPEED * dt) / cam.zoom;
          clampCamera(cam, baked);
          dirty = true;
        }
      }
      if (dirty) {
        dirty = false;
        draw();
      }
      frame = requestAnimationFrame(tick);
    };

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging || !baked) return;
      cam.x -= (e.clientX - lastX) / cam.zoom;
      cam.y -= (e.clientY - lastY) / cam.zoom;
      lastX = e.clientX;
      lastY = e.clientY;
      clampCamera(cam, baked);
      dirty = true;
    };
    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      canvas.style.cursor = "grab";
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!baked) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - width / 2;
      const my = e.clientY - rect.top - height / 2;
      const before = cam.zoom;
      const after = clamp(before * Math.exp(-e.deltaY * 0.0015), MIN_ZOOM, MAX_ZOOM);
      cam.x += mx / before - mx / after;
      cam.y += my / before - my / after;
      cam.zoom = after;
      clampCamera(cam, baked);
      dirty = true;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (MOVE_KEYS[k]) {
        keys.add(k);
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());
    const onBlur = () => keys.clear();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    frame = requestAnimationFrame(tick);

    // El mundo se genera tras el primer pintado para poder mostrar el mensaje de carga.
    const timer = window.setTimeout(() => {
      baked = painter.bake();
      cam.x = baked.clearing.x;
      cam.y = baked.clearing.y;
      cam.zoom = 1;
      clampCamera(cam, baked);
      dirty = true;
      setReady(true);
    }, 30);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return (
    <div className="world">
      <canvas ref={canvasRef} className="world-canvas" />
      <div className="world-compass" aria-label="Puntos cardinales">
        <span className="north">N</span>
        <span className="west">O</span>
        <span className="east">E</span>
        <span className="south">S</span>
      </div>
      <div className="world-hint">
        {ready ? "Arrastra: mover · Rueda: zoom · WASD / flechas" : "Generando el valle…"}
      </div>
    </div>
  );
}
