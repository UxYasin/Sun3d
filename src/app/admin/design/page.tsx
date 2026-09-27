"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Loader, Save } from "lucide-react";

import type { SizeOption, Template, TemplateVariant } from "@/types/nameplate";
import type { Editor as EditorInstance } from "@/features/editor/types";
import { JSON_KEYS } from "@/features/editor/json-keys";
import {
  artworkKey,
  createBlankDesign,
  getTemplateVariants,
  normalizeTemplate,
} from "@/lib/template-utils";
import {
  applyDesignToCanvas,
  readCanvasPalette,
  recolourLiveCanvas,
} from "@/features/editor/apply-design";
import { Button } from "@/components/ui/button";
import {
  VariationPanel,
  type NewColour,
} from "@/app/admin/components/variation-panel";

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
  const [activeColourId, setActiveColourId] = useState<string | null>(null);
  const [activeSizeId, setActiveSizeId] = useState<string | null>(null);

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
      await fetch(
        isUpdate
          ? `/api/templates/${encodeURIComponent(template.id)}`
          : "/api/templates",
        {
          method: isUpdate ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(template),
        }
      );
      setSaved(true);
      setDraft(template);
      return true;
    } catch (err) {
      console.warn("Failed to save design:", err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveDesign = async () => {
    if (!draft) return;

    const palette = readCanvasPalette({ ...draft, canvasJson: readCanvas() });
    const snapshot = captureThumbnail();

    // Save writes into the version currently loaded on the canvas.
    const variants = (draft.variants || []).map((variant) =>
      variant.id === activeColourId
        ? {
            ...variant,
            background: palette.background,
            textColor: palette.text,
            thumbnail: snapshot || variant.thumbnail,
          }
        : variant
    );

    const ok = await persist(
      withCanvas(draft, {
        variants,
        // The live canvas becomes the artwork of the active colour×size combo.
        artworks: {
          ...(draft.artworks || {}),
          [artworkKey(activeColourId, activeSizeId)]: readCanvas(),
        },
        thumbnail: snapshot || draft.thumbnail,
      })
    );

    // Stay in the editor — saving a template must not kick you back to Admin.
    if (ok) {
      setJustSaved(true);
      window.setTimeout(() => setJustSaved(false), 2000);
    }
  };

  // --- COLOUR VARIATIONS ---

  /** Snapshot the design recoloured to `variant`, then restore the canvas. */
  const captureVariantThumbnail = (variant: TemplateVariant) => {
    const editor = editorRef.current;
    if (!editor || !draft) return "";

    const palette = readCanvasPalette({ ...draft, canvasJson: readCanvas() });
    const from = { background: palette.background, text: palette.text };
    const to = { background: variant.background, text: variant.textColor };

    recolourLiveCanvas(editor, from, to);
    const thumbnail = captureThumbnail();
    recolourLiveCanvas(editor, to, from);

    return thumbnail;
  };

  /**
   * Load a colour×size combination. Each combination keeps its own artwork, so
   * switching loads the saved one; the first visit duplicates the current
   * artwork into it (recoloured for colours, re-laid out for sizes).
   */
  const applyColour = (variant: TemplateVariant) => {
    const editor = editorRef.current;
    if (!editor || !draft) return;

    const key = artworkKey(variant.id, activeSizeId);
    const saved = draft.artworks?.[key];

    if (saved) {
      editor.loadJson(saved);
      autosavedJson.current = saved;
      setActiveColourId(variant.id);
      return;
    }

    const palette = readCanvasPalette({ ...draft, canvasJson: readCanvas() });
    recolourLiveCanvas(
      editor,
      { background: palette.background, text: palette.text },
      { background: variant.background, text: variant.textColor }
    );

    const seeded = JSON.stringify(editor.canvas.toJSON(JSON_KEYS));
    setDraft({
      ...draft,
      artworks: { ...(draft.artworks || {}), [key]: seeded },
    });
    autosavedJson.current = seeded;
    setActiveColourId(variant.id);
  };

  const addColour = async (input: NewColour) => {
    if (!draft) return;

    const variant: TemplateVariant = {
      id: `v-${Date.now()}`,
      name: input.name,
      background: input.background,
      textColor: input.textColor,
    };

    const thumbnail = captureVariantThumbnail(variant);

    await persist(
      withCanvas(draft, {
        thumbnail: draft.thumbnail || captureThumbnail(),
        variants: [
          ...(draft.variants || []),
          thumbnail ? { ...variant, thumbnail } : variant,
        ],
      })
    );

    // Show the new colour on the canvas so it can be edited straight away.
    applyColour(thumbnail ? { ...variant, thumbnail } : variant);
  };

  const removeColour = async (variantId: string) => {
    if (!draft) return;
    await persist(
      withCanvas(draft, {
        variants: (draft.variants || []).filter((v) => v.id !== variantId),
      })
    );
  };

  const selectColour = (variantId: string) => {
    if (!draft) return;
    const variant = getTemplateVariants(draft).find((v) => v.id === variantId);
    if (variant) applyColour(variant);
  };

  // --- SIZE VARIATIONS ---

  /** Re-lay the live design out at `size` and mark it as the version being edited. */
  const applySize = async (size: SizeOption, sizes: SizeOption[]) => {
    const editor = editorRef.current;
    if (!editor || !draft) return;

    const key = artworkKey(activeColourId, size.id);
    const saved = draft.artworks?.[key];

    if (saved) {
      editor.loadJson(saved);
      autosavedJson.current = saved;
      setActiveSizeId(size.id);
      return;
    }

    await applyDesignToCanvas(
      editor,
      { ...draft, canvasJson: readCanvas(), sizes },
      { sizeId: size.id, variantId: activeColourId ?? undefined }
    );

    const seeded = JSON.stringify(editor.canvas.toJSON(JSON_KEYS));
    setDraft({
      ...draft,
      artworks: { ...(draft.artworks || {}), [key]: seeded },
    });
    autosavedJson.current = seeded;
    setActiveSizeId(size.id);
  };

  const addSize = async (size: SizeOption) => {
    if (!draft) return;

    const sizes = [...(draft.sizes || []), size].filter(
      (s, i, all) => all.findIndex((x) => x.id === s.id) === i
    );

    await applySize(size, sizes);
    await persist(withCanvas(draft, { sizes }));
  };

  const removeSize = async (sizeId: string) => {
    if (!draft) return;
    await persist(
      withCanvas(draft, {
        sizes: (draft.sizes || []).filter((s) => s.id !== sizeId),
      })
    );
  };

  const selectSize = (size: SizeOption) => {
    void applySize(size, draft?.sizes || [size]);
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

      <VariationPanel
        template={draft}
        busy={saving}
        activeColourId={activeColourId}
        activeSizeId={activeSizeId}
        onAddColour={addColour}
        onRemoveColour={removeColour}
        onSelectColour={selectColour}
        onAddSize={addSize}
        onRemoveSize={removeSize}
        onSelectSize={selectSize}
      />

      {/* Admin actions — floated so the editor's own layout is untouched. */}
      <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-lg border bg-white p-2 shadow-md">
        <span className="px-2 text-xs font-semibold text-muted-foreground max-w-[220px] truncate">
          {existing || saved ? draft.name : "New design"}
        </span>
        {justSaved && (
          <span className="flex items-center gap-1 px-1 text-[11px] font-semibold text-emerald-600">
            <Check className="size-3.5" />
            Saved
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
