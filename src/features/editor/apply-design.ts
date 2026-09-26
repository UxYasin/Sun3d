import { Editor } from '@/features/editor/types';
import { CustomSize, SizeOption, Template } from '@/types/nameplate';
import {
  getTemplateLayout,
  getVariant,
  layerFill,
  resolveSize,
} from '@/lib/template-utils';

/** Design layout coordinates are authored against this canvas. */
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

/**
 * Composes a design onto the canvas: sizes the workspace, fills the background,
 * drops the texture overlay and re-creates every layout text layer scaled to
 * the chosen size. Works for any design, including ones built in the admin
 * panel — there is no per-design special casing.
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

  editor.changeSize({ width: size.width, height: size.height });
  editor.changeBackground(variant.background);

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
      scaleX: layer.scaleX,
      scaleY: layer.scaleY,
    });
  });

  editor.canvas.discardActiveObject();
  editor.canvas.renderAll();
};
