/**
 * Canvas JSON that has been through a save/load cycle can carry `null` scale
 * values. Fabric treats that as a scale of 0, which collapses the object's
 * cache canvas to 0x0 — and drawing that cache throws
 * "The image argument is a canvas element with a width or height of 0",
 * taking the whole canvas down. Repair the values on the way in.
 */
interface CanvasJsonObject {
  scaleX?: unknown;
  scaleY?: unknown;
  objects?: CanvasJsonObject[];
}

const repairObject = (object: CanvasJsonObject) => {
  if (object.scaleX === null || object.scaleX === undefined) {
    object.scaleX = 1;
  }

  if (object.scaleY === null || object.scaleY === undefined) {
    object.scaleY = 1;
  }

  if (Array.isArray(object.objects)) {
    object.objects.forEach(repairObject);
  }
};

/** Parses canvas JSON, repairing degenerate values Fabric cannot render. */
export const parseCanvasJson = (json: string): Record<string, unknown> => {
  const data = JSON.parse(json) as CanvasJsonObject &
    Record<string, unknown>;

  if (Array.isArray(data.objects)) {
    data.objects.forEach(repairObject);
  }

  return data;
};
