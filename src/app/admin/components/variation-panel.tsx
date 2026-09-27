'use client';

import React, { useState } from 'react';
import { ChevronRight, Plus, Trash2 } from 'lucide-react';

import {
  SizeOption,
  STANDARD_SIZES,
  Template,
} from '@/types/nameplate';
import { getTemplateSizes, getTemplateVariants } from '@/lib/template-utils';
import { cn } from '@/lib/utils';

export interface NewColour {
  name: string;
  background: string;
  textColor: string;
}

interface VariationPanelProps {
  template: Template;
  busy?: boolean;
  activeColourId?: string | null;
  activeSizeId?: string | null;
  onAddColour: (input: NewColour) => void;
  onRemoveColour: (variantId: string) => void;
  onSelectColour: (variantId: string) => void;
  onAddSize: (size: SizeOption) => void;
  onRemoveSize: (sizeId: string) => void;
  onSelectSize: (size: SizeOption) => void;
}

const inputClass =
  'w-full h-8 px-2 rounded-lg border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#0073ff]';
const labelClass = 'text-[11px] font-semibold text-neutral-500';
const actionClass =
  'h-8 px-3 rounded-lg bg-[#0073ff] hover:bg-[#0059cc] text-white text-[11px] font-bold flex items-center gap-1 disabled:opacity-50';

export const VariationPanel = ({
  template,
  busy,
  activeColourId,
  activeSizeId,
  onAddColour,
  onRemoveColour,
  onSelectColour,
  onAddSize,
  onRemoveSize,
  onSelectSize,
}: VariationPanelProps) => {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState('');
  const [background, setBackground] = useState('#111113');
  const [textColor, setTextColor] = useState('#f5d061');
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(600);

  const variants = getTemplateVariants(template);
  const sizes = getTemplateSizes(template);

  const addColour = () => {
    onAddColour({
      name: name.trim() || `ভার্সন ${variants.length + 1}`,
      background,
      textColor,
    });
    setName('');
  };

  const addSize = () => {
    const preset = STANDARD_SIZES.find(
      (s) => s.width === width && s.height === height
    );
    onAddSize(
      preset || {
        id: `custom-${Date.now()}`,
        label: `${width}×${height}`,
        width,
        height,
      }
    );
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed top-[84px] right-0 z-[55] h-10 px-2 rounded-l-lg border border-r-0 bg-white text-neutral-600 hover:bg-neutral-100"
        title="Show variations"
      >
        <ChevronRight className="size-4 rotate-180" />
      </button>
    );
  }

  return (
    <aside className="fixed top-[68px] right-0 bottom-20 z-[55] w-[290px] bg-white border-l flex flex-col">
      <div className="h-11 shrink-0 flex items-center justify-between px-3 border-b">
        <span className="text-xs font-bold text-neutral-900">
          ভ্যারিয়েশন (Variations)
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="p-1 rounded text-neutral-400 hover:bg-neutral-100"
          title="Hide panel"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        <p className="text-[10px] leading-relaxed text-neutral-400">
          একটি ভ্যারিয়েশন বেছে নিলে ক্যানভাস সেটিতে বদলে যাবে — Save করলে সেই
          ভার্সনেই আপডেট হবে।
        </p>

        {/* Colour variations */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={labelClass}>কালার ভ্যারিয়েশন</span>
            <span className="text-[10px] text-neutral-400">
              {variants.length}
            </span>
          </div>

          <div className="space-y-1">
            {variants.map((variant) => (
              <div
                key={variant.id}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-2 py-1.5',
                  activeColourId === variant.id
                    ? 'border-[#0073ff] bg-[#f0f7ff]'
                    : 'border-neutral-200'
                )}
              >
                <button
                  type="button"
                  title={`Load "${variant.name}" on the canvas`}
                  onClick={() => onSelectColour(variant.id)}
                  className="flex flex-1 items-center gap-2 min-w-0 text-left"
                >
                  <span
                    className={cn(
                      'size-5 rounded-full border shrink-0',
                      activeColourId === variant.id
                        ? 'border-transparent ring-2 ring-[#0073ff] ring-offset-1'
                        : 'border-neutral-300'
                    )}
                    style={{ backgroundColor: variant.background }}
                  />
                  <span className="flex-1 text-[11px] text-neutral-700 truncate">
                    {variant.name}
                  </span>
                </button>
                <button
                  type="button"
                  disabled={busy || variants.length <= 1}
                  onClick={() => onRemoveColour(variant.id)}
                  className="p-1 rounded text-red-500 hover:bg-red-50 disabled:opacity-30"
                  title="Remove colour"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-neutral-200 p-2 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                title="Background colour"
                className="w-8 h-8 rounded border border-neutral-300 p-0.5"
              />
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                title="Text colour"
                className="w-8 h-8 rounded border border-neutral-300 p-0.5"
              />
              <input
                className={inputClass}
                placeholder={`ভার্সন ${variants.length + 1}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={addColour}
              disabled={busy}
              className={cn(actionClass, 'w-full justify-center')}
            >
              <Plus className="size-3.5" /> Add colour variation
            </button>
          </div>
        </section>

        {/* Size variations */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={labelClass}>সাইজ ভ্যারিয়েশন</span>
            <span className="text-[10px] text-neutral-400">{sizes.length}</span>
          </div>

          <div className="space-y-1">
            {sizes.map((size) => (
              <div
                key={size.id}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-2 py-1.5',
                  activeSizeId === size.id
                    ? 'border-[#0073ff] bg-[#f0f7ff]'
                    : 'border-neutral-200'
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelectSize(size)}
                  className={cn(
                    'flex-1 text-left text-[11px] font-semibold',
                    activeSizeId === size.id ? 'text-[#0073ff]' : 'text-neutral-700'
                  )}
                  title="Resize canvas to this ratio"
                >
                  {size.label}
                  <span className="ml-1 text-[10px] font-normal text-neutral-400">
                    {size.width}×{size.height}
                  </span>
                </button>
                <button
                  type="button"
                  disabled={busy || sizes.length <= 1}
                  onClick={() => onRemoveSize(size.id)}
                  className="p-1 rounded text-red-500 hover:bg-red-50 disabled:opacity-30"
                  title="Remove size"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-neutral-200 p-2 space-y-2">
            <div className="flex items-center gap-1">
              {STANDARD_SIZES.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => {
                    setWidth(size.width);
                    setHeight(size.height);
                  }}
                  className={cn(
                    'px-2 py-1 rounded-md border text-[11px] font-semibold',
                    width === size.width && height === size.height
                      ? 'border-[#0073ff] bg-[#f0f7ff] text-[#0073ff]'
                      : 'border-neutral-200 text-neutral-600'
                  )}
                >
                  {size.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={200}
                max={4000}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className={cn(inputClass, 'text-center')}
              />
              <span className="text-xs text-neutral-400">×</span>
              <input
                type="number"
                min={200}
                max={4000}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className={cn(inputClass, 'text-center')}
              />
            </div>
            <button
              type="button"
              onClick={addSize}
              disabled={busy}
              className={cn(actionClass, 'w-full justify-center')}
            >
              <Plus className="size-3.5" /> Add size variation
            </button>
          </div>
        </section>
      </div>
    </aside>
  );
};
