"use client";

import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader, Save } from "lucide-react";

import type { Template } from "@/types/nameplate";
import type { Editor as EditorInstance } from "@/features/editor/types";
import { JSON_KEYS } from "@/features/editor/json-keys";
import { OrderStoreService } from "@/lib/order-store";
import { getTemplateSizes, normalizeTemplate } from "@/lib/template-utils";
import { readCanvasPalette } from "@/features/editor/apply-design";
import {
  TemplateBuilder,
  createBlankDesign,
} from "@/app/admin/components/template-builder";
import { Button } from "@/components/ui/button";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const designId = searchParams.get("designId");

  const existing = useMemo(() => {
    if (!designId || typeof window === "undefined") return undefined;
    const found = OrderStoreService.getAdminTemplates().find(
      (template) => template.id === designId
    );
    return found ? normalizeTemplate(found) : undefined;
  }, [designId]);

  const editorRef = useRef<EditorInstance | null>(null);
  const autosavedJson = useRef<string>(existing?.canvasJson || "");
  const [draft, setDraft] = useState<Template | null>(null);

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

  const onReady = useCallback((editor: EditorInstance) => {
    editorRef.current = editor;
  }, []);

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

  const openSaveDialog = () => {
    const json = readCanvas();
    const base = existing ?? createBlankDesign();
    const palette = readCanvasPalette({ ...base, canvasJson: json });

    setDraft(
      normalizeTemplate({
        ...base,
        canvasJson: json,
        palette: {
          background: palette.background,
          text: palette.text,
        },
        thumbnail: captureThumbnail() || base.thumbnail,
      })
    );
  };

  const persist = (template: Template) => {
    const exists = OrderStoreService.getAdminTemplates().some(
      (item) => item.id === template.id
    );

    if (exists) {
      OrderStoreService.updateTemplate(template.id, template);
    } else {
      OrderStoreService.createTemplate(template);
    }

    router.push("/admin");
  };

  const sizeCount = draft ? getTemplateSizes(draft).length : 0;
  const colourCount = draft?.variants?.length ?? 0;

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <CanvasEditor
        initialData={initialData}
        onSave={onSave}
        onReady={onReady}
      />

      {/* Admin actions — floated so the editor's own layout is untouched. */}
      <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-lg border bg-white p-2 shadow-md">
        <span className="px-2 text-xs font-semibold text-muted-foreground max-w-[220px] truncate">
          {existing ? existing.name : "New design"}
        </span>
        <Button variant="ghost" size="sm" asChild className="gap-x-2">
          <Link href="/admin">
            <ArrowLeft className="size-4" />
            Admin
          </Link>
        </Button>
        <Button size="sm" onClick={openSaveDialog} className="gap-x-2">
          <Save className="size-4" />
          Save as design
        </Button>
      </div>

      {draft && (
        <TemplateBuilder
          initial={draft}
          onSave={persist}
          onClose={() => setDraft(null)}
          footerNote={`${sizeCount} sizes × ${colourCount} colours`}
        />
      )}
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
