import { fabric } from "fabric";
import { useEffect } from "react";
import { hasBanglaUnicode, isSutonnyFont, unicodeToBijoy } from "../bangla-converter";
import { fitTextboxToContent } from "../text-frame";

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

          if (hasBanglaUnicode(currentText)) {
            // Save cursor position if currently editing
            const cursorStart = (target as any).selectionStart;
            const cursorEnd = (target as any).selectionEnd;

            // Bengali only shapes correctly in SutonnyMJ (ANSI/Bijoy), so switch
            // the box over before converting the Unicode the user typed.
            if (!isSutonnyFont(currentFont)) {
              target.set({ fontFamily: "SutonnyMJ" });
            }

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

          // Follow the text as it is typed so the frame stays snug.
          fitTextboxToContent(target);
          canvas.renderAll();
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
        canvas.off("text:changed");
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
