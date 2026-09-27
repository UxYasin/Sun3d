import type { fabric } from 'fabric';

/**
 * Shrinks a single-line text box so its frame hugs the glyphs — a wide empty
 * frame makes the object awkward to grab and resize.
 *
 * Multi-line boxes are left alone: re-wrapping at a narrower width could change
 * how the text breaks. Right/centre aligned text is shifted so it keeps its
 * on-canvas position.
 */
export const fitTextboxToContent = (object: fabric.Object | undefined) => {
  const box = object as unknown as {
    type?: string;
    width?: number;
    left?: number;
    textAlign?: string;
    _textLines?: unknown[];
    calcTextWidth?: () => number;
    set: (props: Record<string, unknown>) => void;
    setCoords: () => void;
  };

  if (!box || box.type !== 'textbox') return;
  if (!box._textLines || box._textLines.length !== 1) return;

  const natural = box.calcTextWidth?.();
  if (!natural || !box.width || natural >= box.width) return;

  const delta = box.width - natural;
  const shift =
    box.textAlign === 'right'
      ? delta
      : box.textAlign === 'center'
        ? delta / 2
        : 0;

  box.set({ width: natural, left: (box.left || 0) + shift });
  box.setCoords();
};
