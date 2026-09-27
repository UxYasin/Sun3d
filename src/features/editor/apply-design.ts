import type { Editor } from '@/features/editor/types';
import type {
  CustomSize,
  SizeOption,
  Template,
  TemplateVariant,
} from '@/types/nameplate';
import {
  getTemplateArtwork,
  getTemplateLayout,
  getVariant,
  layerFill,
  resolveSize,
} from '@/lib/template-utils';

/**
 * Deliberately no `fabric` import here: this module is reached from
 * server-rendered components, and pulling Fabric in would break the server
 * bundle. The bits of canvas shape we touch are typed structurally.
 */
const isTextType = (type?: string) =>
  type === 'text' || type === 'i-text' || type === 'textbox';

interface Point {
  x: number;
  y: number;
}

interface WorkspaceLike {
  width?: number;
  height?: number;
  getCenterPoint: () => Point;
  set: (properties: Record<string, unknown>) => void;
  setPositionByOrigin: (point: Point, originX: string, originY: string) => void;
  setCoords: () => void;
}

interface CanvasObjectLike {
  name?: string;
  type?: string;
  scaleX?: number;
  scaleY?: number;
  getCenterPoint: () => Point;
  set: (properties: Record<string, unknown>) => void;
  setPositionByOrigin: (point: Point, originX: string, originY: string) => void;
  setCoords: () => void;
}

/** Layout coordinates for form-built designs are authored against this canvas. */
export const LAYOUT_REFERENCE = { width: 1200, height: 600 };

export interface ApplyDesignOptions {
  sizeId?: string;
  variantId?: string;
  customSize?: CustomSize;
}

export const designSize = (
  template: Template,
  options: ApplyDesignOptions = {}
): SizeOption => resolveSize(template, options.sizeId, options.customSize);

const findWorkspace = (editor: Editor) =>
  editor.canvas.getObjects().find((object) => object.name === 'clip');

/**
 * Scales whatever is on the canvas to a new plate ratio, keeping the artwork
 * centred. Used by the designer's size control and when applying a design.
 */
export const resizeLiveCanvas = (editor: Editor, size: SizeOption) => {
  const canvas = editor.canvas;
  const workspace = findWorkspace(editor) as unknown as WorkspaceLike | undefined;

  if (!workspace) {
    editor.changeSize({ width: size.width, height: size.height });
    return;
  }

  const authoredWidth = workspace.width || size.width;
  const authoredHeight = workspace.height || size.height;
  const scaleX = size.width / authoredWidth;
  const scaleY = size.height / authoredHeight;
  const workspaceCenter = workspace.getCenterPoint();

  canvas.getObjects().slice().forEach((raw) => {
    const object = raw as unknown as CanvasObjectLike;
    if (object.name === 'clip') return;

    const center = object.getCenterPoint();
    object.set({
      scaleX: (object.scaleX ?? 1) * scaleX,
      scaleY: (object.scaleY ?? 1) * scaleY,
    });
    object.setPositionByOrigin(
      {
        x: workspaceCenter.x + (center.x - workspaceCenter.x) * scaleX,
        y: workspaceCenter.y + (center.y - workspaceCenter.y) * scaleY,
      },
      'center',
      'center'
    );
    object.setCoords();
  });

  // Resize the plate to the chosen ratio, then put it back where it was.
  editor.changeSize({ width: size.width, height: size.height });
  workspace.setPositionByOrigin(workspaceCenter, 'center', 'center');
  workspace.setCoords();
  canvas.renderAll();
};

const loadCanvasJson = (editor: Editor, json: string) =>
  new Promise<void>((resolve, reject) => {
    try {
      editor.canvas.loadFromJSON(JSON.parse(json), () => resolve());
    } catch (error) {
      reject(error);
    }
  });

/**
 * Loads a design that was drawn in the canvas editor, then scales it to the
 * chosen size (about the workspace centre) and recolours it for the variant.
 */
const applyCanvasDesign = async (
  editor: Editor,
  template: Template,
  size: SizeOption,
  variant: TemplateVariant,
  artwork: string,
  recolour: boolean
) => {
  await loadCanvasJson(editor, artwork);

  const canvas = editor.canvas;
  const workspace = findWorkspace(editor) as unknown as WorkspaceLike | undefined;

  if (!workspace) return;

  resizeLiveCanvas(editor, size);

  // Artwork the author drew for this exact colour is used as-is; only the
  // shared base artwork gets recoloured for the variant. Text the author gave
  // a different colour on purpose is left alone either way, so multi-colour
  // designs keep their variety.
  if (recolour) {
    const authoredText = template.palette?.text?.toLowerCase();
    workspace.set({ fill: variant.background });

    canvas.getObjects().forEach((raw) => {
      const object = raw as unknown as CanvasObjectLike & { fill?: unknown };
      if (object.name === 'clip') return;
      if (!isTextType(object.type)) return;

      const fill =
        typeof object.fill === 'string' ? object.fill.toLowerCase() : undefined;
      if (authoredText && fill && fill !== authoredText) return;

      object.set({ fill: variant.textColor });
    });

    canvas.backgroundColor = variant.background;
  }
  canvas.discardActiveObject();
  canvas.renderAll();
};

/**
 * Composes a design onto the canvas.
 *
 * Designs drawn in the editor are replayed from their canvas JSON; form-built
 * designs are composed from their layout. Either way the workspace is resized
 * to the chosen ratio and the colours follow the chosen variant.
 */
export const applyDesignToCanvas = async (
  editor: Editor,
  template: Template,
  options: ApplyDesignOptions = {}
) => {
  const size = designSize(template, options);
  const variant = getVariant(template, options.variantId);

  // Make sure the Bijoy font is ready before the canvas measures text.
  try {
    if (document.fonts) {
      await document.fonts.load('48px SutonnyMJ');
      await document.fonts.load('bold 48px SutonnyMJ');
    }
  } catch (error) {
    console.warn('Font loading error:', error);
  }

  // Clear everything except the workspace clip.
  editor.canvas.getObjects().slice().forEach((object) => {
    if (object.name !== 'clip') {
      editor.canvas.remove(object);
    }
  });

  editor.changeBackground(variant.background);

  // A design drawn in the canvas editor may hold a separate artwork for this
  // exact colour x size; otherwise the shared base artwork is reused.
  const artwork = getTemplateArtwork(template, variant?.id, size.id);

  if (artwork) {
    await applyCanvasDesign(
      editor,
      template,
      size,
      variant,
      artwork,
      artwork === template.canvasJson
    );
    return;
  }

  editor.changeSize({ width: size.width, height: size.height });

  if (template.style.textureOverlay) {
    editor.addImage(template.style.textureOverlay, { sendToBack: true });
  }

  const scaleX = size.width / LAYOUT_REFERENCE.width;
  const scaleY = size.height / LAYOUT_REFERENCE.height;
  const fontScale = Math.min(scaleX, scaleY);

  getTemplateLayout(template).forEach((layer) => {
    if (!layer.text) return;

    editor.addText(layer.text, {
      left: layer.left * scaleX,
      top: layer.top * scaleY,
      width: layer.width * scaleX,
      fontSize: Math.max(8, Math.round(layer.fontSize * fontScale)),
      fontFamily: layer.fontFamily,
      fontWeight: layer.fontWeight,
      fill: layerFill(layer, variant),
      // Never write a null/undefined scale — Fabric turns it into 0, which
      // collapses the object's cache canvas and breaks rendering on reload.
      scaleX: layer.scaleX ?? 1,
      scaleY: layer.scaleY ?? 1,
    });
  });

  editor.canvas.discardActiveObject();
  editor.canvas.renderAll();
};

/** Reads the workspace size + colours out of a captured canvas JSON. */
export const readCanvasPalette = (
  template: Template
): { width: number; height: number; background: string; text: string } => {
  const fallback = {
    width: LAYOUT_REFERENCE.width,
    height: LAYOUT_REFERENCE.height,
    background: template.style?.background || '#ffffff',
    text: template.textConfig?.houseName?.color || '#000000',
  };

  if (!template.canvasJson) return fallback;

  try {
    const parsed = JSON.parse(template.canvasJson) as {
      background?: string;
      objects?: { name?: string; type?: string; width?: number; height?: number; fill?: string }[];
    };

    const workspace = parsed.objects?.find((o) => o.name === 'clip');
    const text = parsed.objects?.find((o) => isTextType(o.type) && o.fill);

    return {
      width: workspace?.width || fallback.width,
      height: workspace?.height || fallback.height,
      background: parsed.background || workspace?.fill || fallback.background,
      text: text?.fill || fallback.text,
    };
  } catch {
    return fallback;
  }
};
