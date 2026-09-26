import { fabric } from "fabric";
import { useEffect } from "react";
import { hasBanglaUnicode, isSutonnyFont, unicodeToBijoy } from "../bangla-converter";

interface UseCanvasEventsProps {
  save: () => void;
  canvas: fabric.Canvas | null;
  setSelectedObjects: (objects: fabric.Object[]) => void;
  clearSelectionCallback?: () => void;
};

export const useCanvasEvents = ({
  save,
  canvas,
  setSelectedObjects,
  clearSelectionCallback,
}: UseCanvasEventsProps) => {
  useEffect(() => {
    if (canvas) {
      canvas.on("object:added", () => save());
      canvas.on("object:removed", () => save());
      canvas.on("object:modified", () => save());
      canvas.on("text:changed", (e: any) => {
        const target = e.target;
        if (target && target.type === "textbox") {
          const currentFont = target.get("fontFamily");
          const currentText = target.get("text") || "";
          
          if (isSutonnyFont(currentFont) && hasBanglaUnicode(currentText)) {
            // Save cursor position if currently editing
            const cursorStart = (target as any).selectionStart;
            const cursorEnd = (target as any).selectionEnd;

            const converted = unicodeToBijoy(currentText);
            (target as any).originalUnicodeText = currentText;
            target.set({ text: converted });
            
            // Restore cursor
            if (typeof cursorStart === "number") {
              (target as any).selectionStart = Math.min(cursorStart, converted.length);
              (target as any).selectionEnd = Math.min(cursorEnd, converted.length);
            }
            
            canvas.renderAll();
          }
        }
        save();
      });
      canvas.on("selection:created", (e) => {
        setSelectedObjects(e.selected || []);
      });
      canvas.on("selection:updated", (e) => {
        setSelectedObjects(e.selected || []);
      });
      canvas.on("selection:cleared", () => {
        setSelectedObjects([]);
        clearSelectionCallback?.();
      });
    }

    return () => {
      if (canvas) {
        canvas.off("object:added");
        canvas.off("object:removed");
        canvas.off("object:modified");
        canvas.off("selection:created");
        canvas.off("selection:updated");
        canvas.off("selection:cleared");
      }
    };
  },
  [
    save,
    canvas,
    clearSelectionCallback,
    setSelectedObjects // No need for this, this is from setState
  ]);
};
