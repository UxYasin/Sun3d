import { fabric } from "fabric";

import { BevelEmbossConfig } from "@/features/editor/types";

export type BevelMode = BevelEmbossConfig["mode"];

/** Photoshop "Bevel & Emboss" -> Inner Bevel defaults. */
export const DEFAULT_BEVEL_EMBOSS: BevelEmbossConfig = {
  enabled: true,
  mode: "emboss",
  size: 24,
  soften: 2,
  depth: 140,
  altitude: 35,
  angle: 135,
  highlightColor: "#ffffff",
  highlightOpacity: 0.95,
  shadowColor: "#000000",
  shadowOpacity: 0.7,
};

export const EMBOSS_PRESET: BevelEmbossConfig = {
  ...DEFAULT_BEVEL_EMBOSS,
  mode: "emboss",
};

export const ENGRAVE_PRESET: BevelEmbossConfig = {
  ...DEFAULT_BEVEL_EMBOSS,
  mode: "engrave",
};

const MAX_BUFFER_AREA = 24 * 1024 * 1024;
// The lighting pass runs at 1 device pixel per object unit; the smooth result
// is then scaled up, which keeps the per-pixel loop cheap at any zoom level.
const WORK_SCALE = 1;

export type BevelObject = fabric.Object & {
  bevelEmbossConfig?: BevelEmbossConfig;
  dirty?: boolean;
};

const clamp = (value: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;

export const normalizeBevelConfig = (
  config: Partial<BevelEmbossConfig> | undefined
): BevelEmbossConfig => {
  const merged = { ...DEFAULT_BEVEL_EMBOSS, ...(config || {}) };

  return {
    enabled: merged.enabled,
    mode: merged.mode === "engrave" ? "engrave" : "emboss",
    size: clamp(merged.size, 1, 80),
    soften: clamp(merged.soften, 0, 10),
    depth: clamp(merged.depth, 1, 500),
    altitude: clamp(merged.altitude, 1, 89),
    angle: ((merged.angle % 360) + 360) % 360,
    highlightColor: merged.highlightColor || "#ffffff",
    highlightOpacity: clamp(merged.highlightOpacity, 0, 1),
    shadowColor: merged.shadowColor || "#000000",
    shadowOpacity: clamp(merged.shadowOpacity, 0, 1),
  };
};

const parseHex = (hex: string): [number, number, number] => {
  const clean = (hex || "#000000").replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;

  return [
    parseInt(full.slice(0, 2), 16) || 0,
    parseInt(full.slice(2, 4), 16) || 0,
    parseInt(full.slice(4, 6), 16) || 0,
  ];
};

const computePad = (cfg: BevelEmbossConfig) =>
  Math.ceil(cfg.size + cfg.soften * 4 + 4);

interface Buffer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

const createBuffer = (width: number, height: number): Buffer => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.ceil(width));
  canvas.height = Math.max(1, Math.ceil(height));

  return { canvas, ctx: canvas.getContext("2d")! };
};

/**
 * A real Photoshop-style inner bevel, computed from the object's alpha channel:
 *
 *  1. render the shape mask, blur it by `size` -> a height map
 *  2. take the height map gradient -> surface normals
 *  3. light those normals (`angle` / `altitude`, scaled by `depth`) and split
 *     the result into a highlight and a shadow pass
 *  4. screen the highlight over the object and multiply the shadow, clipped
 *     back to the shape
 *
 * Flat areas stay neutral, so only the 2D edges pick up shading - no 3D mesh.
 */
function renderBevelEffect(
  object: BevelObject,
  ctx: CanvasRenderingContext2D,
  baseRender: (ctx: CanvasRenderingContext2D) => void,
  cfg: BevelEmbossConfig
) {
  const width = object.width || 0;
  const height = object.height || 0;

  if (typeof document === "undefined" || width <= 0 || height <= 0) {
    baseRender.call(object, ctx);
    return;
  }

  const pad = computePad(cfg);

  const transform = ctx.getTransform();
  const scale = Math.min(
    4,
    Math.max(1, Math.hypot(transform.a, transform.b) || 1)
  );

  const bufferWidth = (width + pad * 2) * scale;
  const bufferHeight = (height + pad * 2) * scale;

  if (bufferWidth * bufferHeight > MAX_BUFFER_AREA) {
    baseRender.call(object, ctx);
    return;
  }

  const savedShadow = object.shadow;
  const savedFill = object.fill;
  const savedStroke = object.stroke;

  const place = (buffer: Buffer, factor: number) => {
    buffer.ctx.setTransform(factor, 0, 0, factor, 0, 0);
    buffer.ctx.translate(pad + width / 2, pad + height / 2);
  };

  const paint = (
    buffer: Buffer,
    factor: number,
    fill: typeof object.fill,
    stroke: typeof object.stroke
  ) => {
    place(buffer, factor);
    object.shadow = undefined;
    object.fill = fill;
    object.stroke = stroke;
    baseRender.call(object, buffer.ctx);
  };

  // 1. the object as authored, at full resolution
  const base = createBuffer(bufferWidth, bufferHeight);
  paint(base, scale, savedFill, savedStroke);

  // 2. the shape's alpha, at full resolution, used to clip the shading
  const mask = createBuffer(bufferWidth, bufferHeight);
  paint(mask, scale, "#ffffff", undefined);

  // 3. the shape's alpha at work resolution, blurred into a height map
  const workWidth = Math.max(1, Math.ceil((width + pad * 2) * WORK_SCALE));
  const workHeight = Math.max(1, Math.ceil((height + pad * 2) * WORK_SCALE));

  const silhouette = createBuffer(workWidth, workHeight);
  paint(silhouette, WORK_SCALE, "#ffffff", undefined);

  const heightMap = createBuffer(workWidth, workHeight);
  heightMap.ctx.filter = `blur(${cfg.size * WORK_SCALE}px)`;
  heightMap.ctx.drawImage(silhouette.canvas, 0, 0);
  heightMap.ctx.filter = "none";

  object.shadow = savedShadow;
  object.fill = savedFill;
  object.stroke = savedStroke;

  // 4. light the normals of the height map
  const data = heightMap.ctx.getImageData(0, 0, workWidth, workHeight).data;

  const azimuth = ((cfg.angle + (cfg.mode === "engrave" ? 180 : 0)) * Math.PI) / 180;
  const elevation = (cfg.altitude * Math.PI) / 180;
  const lightX = Math.cos(elevation) * Math.cos(azimuth);
  const lightY = -Math.cos(elevation) * Math.sin(azimuth);
  const lightZ = Math.sin(elevation);

  // Per-pixel slope of the height field, folded together with the 0..255 alpha
  // range and the depth multiplier.
  const slope = (cfg.size * WORK_SCALE * (cfg.depth / 100)) / 2 / 255;

  const [hr, hg, hb] = parseHex(cfg.highlightColor);
  const [sr, sg, sb] = parseHex(cfg.shadowColor);

  const highlight = new ImageData(workWidth, workHeight);
  const shadow = new ImageData(workWidth, workHeight);

  for (let y = 0; y < workHeight; y++) {
    const row = y * workWidth;
    const rowUp = (y > 0 ? y - 1 : 0) * workWidth;
    const rowDown = (y < workHeight - 1 ? y + 1 : workHeight - 1) * workWidth;

    for (let x = 0; x < workWidth; x++) {
      const left = x > 0 ? x - 1 : 0;
      const right = x < workWidth - 1 ? x + 1 : workWidth - 1;

      const gx = (data[(row + right) * 4 + 3] - data[(row + left) * 4 + 3]) * slope;
      const gy = (data[(rowDown + x) * 4 + 3] - data[(rowUp + x) * 4 + 3]) * slope;

      const length = Math.sqrt(gx * gx + gy * gy + 1);
      const nx = -gx / length;
      const ny = -gy / length;
      const nz = 1 / length;

      const lambert = nx * lightX + ny * lightY + nz * lightZ;
      // Subtract the flat-surface term so unshaded areas stay neutral.
      const lit = lambert - lightZ;

      const hi =
        lit > 0
          ? Math.min(1, lit / Math.max(0.0001, 1 - lightZ)) * cfg.highlightOpacity
          : 0;
      const sh =
        lit < 0
          ? Math.min(1, -lit / Math.max(0.0001, 1 + lightZ)) * cfg.shadowOpacity
          : 0;

      const i = (row + x) * 4;
      highlight.data[i] = hr;
      highlight.data[i + 1] = hg;
      highlight.data[i + 2] = hb;
      highlight.data[i + 3] = hi * 255;

      shadow.data[i] = sr;
      shadow.data[i + 1] = sg;
      shadow.data[i + 2] = sb;
      shadow.data[i + 3] = sh * 255;
    }
  }

  const highlightLayer = createBuffer(workWidth, workHeight);
  highlightLayer.ctx.putImageData(highlight, 0, 0);
  const shadowLayer = createBuffer(workWidth, workHeight);
  shadowLayer.ctx.putImageData(shadow, 0, 0);

  const soften = (source: Buffer) => {
    const out = createBuffer(workWidth, workHeight);
    if (cfg.soften > 0) {
      out.ctx.filter = `blur(${cfg.soften * WORK_SCALE}px)`;
    }
    out.ctx.drawImage(source.canvas, 0, 0);
    out.ctx.filter = "none";
    return out;
  };

  // 5. scale the shading up and clip it back to the shape
  const clipToShape = (source: Buffer) => {
    const out = createBuffer(bufferWidth, bufferHeight);
    out.ctx.drawImage(source.canvas, 0, 0, bufferWidth, bufferHeight);
    out.ctx.globalCompositeOperation = "destination-in";
    out.ctx.drawImage(mask.canvas, 0, 0);
    out.ctx.globalCompositeOperation = "source-over";
    return out;
  };

  const highlightFull = clipToShape(soften(highlightLayer));
  const shadowFull = clipToShape(soften(shadowLayer));

  // 6. screen the highlight over the artwork, multiply the shadow under it
  const composed = createBuffer(bufferWidth, bufferHeight);
  composed.ctx.drawImage(base.canvas, 0, 0);
  composed.ctx.globalCompositeOperation = "multiply";
  composed.ctx.drawImage(shadowFull.canvas, 0, 0);
  composed.ctx.globalCompositeOperation = "screen";
  composed.ctx.drawImage(highlightFull.canvas, 0, 0);
  composed.ctx.globalCompositeOperation = "source-over";

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0)";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.drawImage(
    composed.canvas,
    -width / 2 - pad,
    -height / 2 - pad,
    width + pad * 2,
    height + pad * 2
  );
  ctx.restore();
}

let installed = false;

/**
 * Hooks the bevel into `drawObject`, the single rendering entry point shared by
 * text and every shape class, so the effect works on any layer type.
 */
export function installBevelEmbossRenderer() {
  if (installed) return;
  installed = true;

  const proto = fabric.Object.prototype as unknown as {
    drawObject: (
      this: BevelObject,
      ctx: CanvasRenderingContext2D,
      forClipping?: boolean
    ) => void;
  };
  const original = proto.drawObject;

  proto.drawObject = function (ctx, forClipping) {
    const cfg = this.bevelEmbossConfig;

    if (!cfg || !cfg.enabled || forClipping) {
      return original.call(this, ctx, forClipping);
    }

    return renderBevelEffect(
      this,
      ctx,
      (target) => original.call(this, target, false),
      normalizeBevelConfig(cfg)
    );
  };
}

export function applyBevelEmboss(
  object: fabric.Object,
  config: Partial<BevelEmbossConfig>
) {
  const target = object as BevelObject;
  target.bevelEmbossConfig = normalizeBevelConfig(config);
  target.set({ shadow: undefined });
  target.dirty = true;
  target.setCoords();
}
