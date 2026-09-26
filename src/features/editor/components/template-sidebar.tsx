"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { ActiveTool, Editor } from "@/features/editor/types";
import { NameplateSize, Template } from "@/types/nameplate";
import {
  getTemplateSizes,
  getTemplateVariants,
  normalizeTemplate,
  resolveSize,
} from "@/lib/template-utils";
import { applyDesignToCanvas } from "@/features/editor/apply-design";
import { OrderStoreService } from "@/lib/order-store";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { NameplatePreview } from "@/components/nameplate/NameplatePreview";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConfirm } from "@/hooks/use-confirm";

interface TemplateSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

interface DesignCardProps {
  design: Template;
  onApply: (options: {
    sizeId: string;
    variantId: string;
    customSize?: { width: number; height: number };
  }) => void;
}

const DesignCard = ({ design, onApply }: DesignCardProps) => {
  const sizes = getTemplateSizes(design);
  const variants = getTemplateVariants(design);

  const [sizeId, setSizeId] = useState(sizes[0]?.id || "2:1");
  const [variantId, setVariantId] = useState(variants[0]?.id || "default");
  const [customWidth, setCustomWidth] = useState(1200);
  const [customHeight, setCustomHeight] = useState(600);

  const isCustom = sizeId === "custom";
  const customSize = isCustom
    ? { width: customWidth, height: customHeight }
    : undefined;
  const preview = resolveSize(design, sizeId, customSize);

  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden bg-white">
      <div className="p-2">
        <NameplatePreview
          template={design}
          variantId={variantId}
          size={preview.id as NameplateSize}
          customValues={{ customSize }}
          compact
        />
      </div>

      <div className="px-2.5 pb-2.5 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <span className="font-bold text-xs text-neutral-900 leading-tight">
            {design.name}
          </span>
          <span className="text-[11px] font-bold text-[#0073ff] shrink-0">
            ৳{design.priceStartingAt.toLocaleString()}
          </span>
        </div>

        {/* Sizes */}
        <div className="flex flex-wrap items-center gap-1">
          {sizes.map((size) => (
            <button
              key={size.id}
              type="button"
              onClick={() => setSizeId(size.id)}
              className={cn(
                "px-2 py-0.5 rounded-md border text-[11px] font-semibold transition",
                sizeId === size.id
                  ? "border-[#0073ff] bg-[#f0f7ff] text-[#0073ff]"
                  : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
              )}
            >
              {size.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSizeId("custom")}
            className={cn(
              "px-2 py-0.5 rounded-md border text-[11px] font-semibold transition",
              isCustom
                ? "border-[#0073ff] bg-[#f0f7ff] text-[#0073ff]"
                : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
            )}
          >
            Custom
          </button>
        </div>

        {isCustom && (
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-600">
            <input
              type="number"
              min={200}
              max={4000}
              value={customWidth}
              onChange={(e) => setCustomWidth(Number(e.target.value))}
              className="w-16 h-7 px-1.5 rounded border border-neutral-200 text-center"
            />
            <span>×</span>
            <input
              type="number"
              min={200}
              max={4000}
              value={customHeight}
              onChange={(e) => setCustomHeight(Number(e.target.value))}
              className="w-16 h-7 px-1.5 rounded border border-neutral-200 text-center"
            />
            <span className="text-neutral-400">px</span>
          </div>
        )}

        {/* Colour variants */}
        {variants.length > 0 && (
          <div className="flex items-center gap-1.5">
            {variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                title={variant.name}
                onClick={() => setVariantId(variant.id)}
                className={cn(
                  "size-6 rounded-full border-2 flex items-center justify-center transition",
                  variantId === variant.id
                    ? "border-[#0073ff]"
                    : "border-neutral-200 hover:border-neutral-300"
                )}
                style={{ backgroundColor: variant.background }}
              >
                {variantId === variant.id && (
                  <Check
                    className="size-3"
                    style={{ color: variant.textColor }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => onApply({ sizeId, variantId, customSize })}
          className="w-full h-8 rounded-lg bg-[#0073ff] hover:bg-[#0059cc] text-white text-[11px] font-bold transition"
        >
          Apply to canvas
        </button>
      </div>
    </div>
  );
};

export const TemplateSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TemplateSidebarProps) => {
  // The editor is client-only, so reading the store during the first render is
  // safe and avoids a setState-in-effect round trip.
  const [designs] = useState<Template[]>(() =>
    OrderStoreService.getAdminTemplates()
      .filter((template) => template.enabled !== false)
      .map(normalizeTemplate)
  );

  const [ConfirmDialog, confirm] = useConfirm(
    "টেমপ্লেট পরিবর্তন নিশ্চিত করুন",
    "বর্তমান ক্যানভাসে এই ডিজাইনটি লোড করতে চান?"
  );

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onApply = async (
    design: Template,
    options: {
      sizeId: string;
      variantId: string;
      customSize?: { width: number; height: number };
    }
  ) => {
    if (!editor) return;

    const ok = await confirm();
    if (!ok) return;

    await applyDesignToCanvas(editor, design, options);
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[380px] h-full flex flex-col",
        activeTool === "templates" ? "visible" : "hidden"
      )}
    >
      <ConfirmDialog />
      <ToolSidebarHeader
        title="ডিজাইন লাইব্রেরি"
        description="সাইজ ও কালার ভার্সন বেছে নিয়ে ক্যানভাসে লোড করুন"
      />
      <ScrollArea>
        <div className="p-3 space-y-3">
          {designs.length === 0 && (
            <p className="text-xs text-neutral-500 p-2">
              কোনো ডিজাইন পাওয়া যায়নি। অ্যাডমিন প্যানেল থেকে ডিজাইন তৈরি করুন।
            </p>
          )}
          {designs.map((design) => (
            <DesignCard
              key={design.id}
              design={design}
              onApply={(options) => onApply(design, options)}
            />
          ))}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
