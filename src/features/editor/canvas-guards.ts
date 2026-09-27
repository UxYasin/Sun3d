import { fabric } from "fabric";

let installed = false;

/**
 * Fabric paints a cached object with `drawImage(object._cacheCanvas)`, which
 * throws when that cache canvas has a zero dimension — an object with a null or
 * zero scale, for instance. One such object would take the whole canvas (and
 * the page) down, so skip the draw instead of throwing.
 */
export function installCanvasGuards() {
  if (installed) return;
  installed = true;

  const proto = fabric.Object.prototype as unknown as {
    drawCacheOnCanvas: (
      this: fabric.Object,
      ctx: CanvasRenderingContext2D
    ) => void;
  };
  const original = proto.drawCacheOnCanvas;

  proto.drawCacheOnCanvas = function (ctx) {
    const cache = (
      this as unknown as { _cacheCanvas?: HTMLCanvasElement }
    )._cacheCanvas;

    if (!cache || !cache.width || !cache.height) return;

    return original.call(this, ctx);
  };
}
