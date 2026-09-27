"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Loader, Save, TriangleAlert } from "lucide-react";

import { STANDARD_SIZES, type SizeOption, type Template } from "@/types/nameplate";
import type { Editor as EditorInstance } from "@/features/editor/types";
import { JSON_KEYS } from "@/features/editor/json-keys";
import { createBlankDesign, normalizeTemplate } from "@/lib/template-utils";
import {
  applyDesignToCanvas,
  readCanvasPalette,
  resizeLiveCanvas,
} from "@/features/editor/apply-design";
import { OrderStoreService } from "@/lib/order-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CanvasEditor = dynamic(
  () =>
    import("@/features/editor/components/editor").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white gap-3">
        <Loader className="size-8 animate-spin text-[#0073ff]" />
        <span className="text-sm font-semibold text-neutral-600">
          ক্যানভাস এডিটর লোড হচ্ছে…
        </span>
      </div>
    ),
  }
);

/** Small JPEG snapshot of the visible canvas, used as the design thumbnail. */
const captureThumbnail = () => {
  const source = document.querySelector(
    "canvas.lower-canvas"
  ) as HTMLCanvasElement | null;

  if (!source || !source.width) return "";

  const width = 480;
  const height = Math.max(1, Math.round((source.height / source.width) * width));
  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;

  const ctx = offscreen.getContext("2d");
  if (!ctx) return "";

  ctx.drawImage(source, 0, 0, width, height);
  return offscreen.toDataURL("image/jpeg", 0.75);
};

const AdminDesigner = () => {
  const searchParams = useSearchParams();
  const designId = searchParams.get("designId");

  // Resolve the design from the server, not localStorage — the store may not
  // have synced yet (or may still hold the seeded mocks), which would make an
  // edit look like a brand-new design. The editor waits until this settles.
  const [existing, setExisting] = useState<Template | undefined>(undefined);
  const [draft, setDraft] = useState<Template | null>(() =>
    designId ? null : normalizeTemplate(createBlankDesign())
  );
  const [booted, setBooted] = useState(!designId);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [activeSizeId, setActiveSizeId] = useState<string>(STANDARD_SIZES[0].id);
  const [customWidth, setCustomWidth] = useState(1200);
  const [customHeight, setCustomHeight] = useState(600);

  useEffect(() => {
    if (!designId) return; // new design, draft is already seeded

    let cancelled = false;

    fetch("/api/templates", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const found = data?.success
          ? (data.templates as Template[]).find((t) => t.id === designId)
          : undefined;
        const base = found ? normalizeTemplate(found) : undefined;
        setExisting(base);
        setDraft(base ?? normalizeTemplate(createBlankDesign()));
      })
      .catch((err) => {
        console.warn("Failed to load design:", err);
        if (!cancelled) setDraft(normalizeTemplate(createBlankDesign()));
      })
      .finally(() => {
        if (!cancelled) setBooted(true);
      });

    return () => {
      cancelled = true;
    };
  }, [designId]);

  const editorRef = useRef<EditorInstance | null>(null);
  const autosavedJson = useRef<string>("");

  const initialData = useMemo(() => {
    if (!existing?.canvasJson) {
      return { id: "admin-design", width: 1200, height: 600 };
    }
    const palette = readCanvasPalette(existing);
    return {
      id: existing.id,
      json: existing.canvasJson,
      width: palette.width,
      height: palette.height,
    };
  }, [existing]);

  const onReady = useCallback(
    (editor: EditorInstance) => {
      editorRef.current = editor;

      // Designs saved before the canvas editor existed carry no canvas JSON —
      // compose their source onto the canvas so the admin can edit and update it.
      if (existing && !existing.canvasJson) {
        applyDesignToCanvas(editor, existing).then(() => {
          autosavedJson.current = JSON.stringify(
            editor.canvas.toJSON(JSON_KEYS)
          );
        });
      }
    },
    [existing]
  );

  // Keep a fallback copy in case the canvas is read before the ref is set.
  const onSave = useCallback((values: { json: string }) => {
    autosavedJson.current = values.json;
  }, []);

  const readCanvas = (): string => {
    const canvas = editorRef.current?.canvas;
    if (canvas) {
      return JSON.stringify(canvas.toJSON(JSON_KEYS));
    }
    return autosavedJson.current;
  };

  /** The template with the live canvas + its palette folded in. */
  const withCanvas = (base: Template, extra: Partial<Template> = {}) => {
    const canvasJson = readCanvas();
    const palette = readCanvasPalette({ ...base, canvasJson });

    return normalizeTemplate({
      ...base,
      canvasJson,
      palette: { background: palette.background, text: palette.text },
      ...extra,
    });
  };

  const persist = async (template: Template) => {
    setSaving(true);
    const isUpdate = Boolean(existing) || saved;

    try {
      // Await the write so a later list refresh can't read pre-save data.
      const res = await fetch(
        isUpdate
          ? `/api/templates/${encodeURIComponent(template.id)}`
          : "/api/templates",
        {
          method: isUpdate ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(template),
        }
      );

      // fetch only rejects on a network failure, so a rejected write has to be
      // caught here — otherwise the editor claims "Saved" on a 4xx/5xx.
      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new Error(`${res.status} ${detail.slice(0, 200)}`);
      }

      setSaved(true);
      setDraft(template);
      setSaveFailed(false);

      // Refresh the local mirror the rest of the app reads from, so the saved
      // design shows up in the editor without a reload.
      await OrderStoreService.syncWithServer().catch(() => undefined);

      return true;
    } catch (err) {
      console.warn("Failed to save design:", err);
      setSaveFailed(true);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveDesign = async () => {
    if (!draft) return;

    const snapshot = captureThumbnail();

    const ok = await persist(
      withCanvas(draft, {
        // Whatever the admin drew *is* the design. It keeps the standard
        // ratios so it can be placed at any of them later.
        sizes: draft.sizes?.length ? draft.sizes : STANDARD_SIZES,
        thumbnail: snapshot || draft.thumbnail,
      })
    );

    // Stay in the editor — saving a template must not kick you back to Admin.
    if (ok) {
      setJustSaved(true);
      window.setTimeout(() => setJustSaved(false), 2000);
    }
  };

  // --- SIZE / RATIO ---

  /** Re-lay the whole design at `size`, keeping every element centred. */
  const applySize = (size: SizeOption) => {
    const editor = editorRef.current;
    if (!editor) return;

    resizeLiveCanvas(editor, size);
    setActiveSizeId(size.id);
  };

  const chooseSize = (sizeId: string) => {
    if (sizeId === "custom") {
      applySize({
        id: "custom",
        label: `${customWidth}×${customHeight}`,
        width: customWidth,
        height: customHeight,
      });
      return;
    }

    const size = STANDARD_SIZES.find((item) => item.id === sizeId);
    if (size) applySize(size);
  };

  if (!booted || !draft) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white gap-3">
        <Loader className="size-8 animate-spin text-[#0073ff]" />
        <span className="text-sm font-semibold text-neutral-600">
          ডিজাইন লোড হচ্ছে…
        </span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <CanvasEditor
        initialData={initialData}
        onSave={onSave}
        onReady={onReady}
        adminMode
      />

      {/* Admin actions — floated so the editor's own layout is untouched. */}
      <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 rounded-lg border bg-white px-3 py-2 shadow-md">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-muted-foreground">
            Size
          </span>
          {STANDARD_SIZES.map((size) => (
            <button
              key={size.id}
              type="button"
              onClick={() => chooseSize(size.id)}
              className={cn(
                "px-2.5 py-1 rounded-md border text-[11px] font-semibold transition-colors",
                activeSizeId === size.id
                  ? "border-[#0073ff] bg-[#f0f7ff] text-[#0073ff]"
                  : "border-neutral-200 text-neutral-600 hover:bg-neutral-100"
              )}
            >
              {size.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => chooseSize("custom")}
            className={cn(
              "px-2.5 py-1 rounded-md border text-[11px] font-semibold transition-colors",
              activeSizeId === "custom"
                ? "border-[#0073ff] bg-[#f0f7ff] text-[#0073ff]"
                : "border-neutral-200 text-neutral-600 hover:bg-neutral-100"
            )}
          >
            Custom
          </button>
          {activeSizeId === "custom" && (
            <span className="flex items-center gap-1 text-[11px] text-neutral-500">
              <input
                type="number"
                min={200}
                max={4000}
                value={customWidth}
                onChange={(event) => setCustomWidth(Number(event.target.value))}
                className="w-16 h-7 px-1.5 rounded border border-neutral-200 text-center"
              />
              ×
              <input
                type="number"
                min={200}
                max={4000}
                value={customHeight}
                onChange={(event) => setCustomHeight(Number(event.target.value))}
                className="w-16 h-7 px-1.5 rounded border border-neutral-200 text-center"
              />
              <button
                type="button"
                onClick={() => chooseSize("custom")}
                className="px-2 h-7 rounded border border-neutral-200 font-semibold hover:bg-neutral-100"
              >
                Apply
              </button>
            </span>
          )}
        </div>

        <span className="h-6 w-px bg-neutral-200" />

        <span className="px-1 text-xs font-semibold text-muted-foreground max-w-[200px] truncate">
          {existing || saved ? draft.name : "New design"}
        </span>
        {justSaved && (
          <span className="flex items-center gap-1 px-1 text-[11px] font-semibold text-emerald-600">
            <Check className="size-3.5" />
            Saved
          </span>
        )}
        {saveFailed && !justSaved && (
          <span className="flex items-center gap-1 px-1 text-[11px] font-semibold text-red-600">
            <TriangleAlert className="size-3.5" />
            Save failed
          </span>
        )}
        <Button variant="ghost" size="sm" asChild className="gap-x-2">
          <Link href="/admin">
            <ArrowLeft className="size-4" />
            Admin
          </Link>
        </Button>
        <Button
          size="sm"
          onClick={saveDesign}
          disabled={saving}
          className="gap-x-2"
        >
          <Save className="size-4" />
          {saving ? "Saving…" : "Save design"}
        </Button>
      </div>
    </div>
  );
};

export default function AdminDesignPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center text-xs text-muted-foreground">
          Loading designer…
        </div>
      }
    >
      <AdminDesigner />
    </Suspense>
  );
}
