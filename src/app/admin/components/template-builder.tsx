'use client';

import React, { useMemo, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

import {
  DesignTextLayer,
  NameplateSize,
  SizeOption,
  STANDARD_SIZES,
  Template,
  TemplateVariant,
} from '@/types/nameplate';
import { buildDefaultLayout, normalizeTemplate } from '@/lib/template-utils';
import { NameplatePreview } from '@/components/nameplate/NameplatePreview';
import { cn } from '@/lib/utils';

interface TemplateBuilderProps {
  /** Existing design to edit, or undefined to create a new one. */
  initial?: Template;
  onSave: (template: Template) => void;
  onClose: () => void;
}

const CATEGORIES = [
  'Modern Acrylic',
  'Classic Wood',
  'Royal Brass & Slate',
  'Minimalist Stone',
  'Traditional Heritage',
  'Contemporary Glass',
];

const BADGES: NonNullable<Template['badge']>[] = [
  'New',
  'Popular',
  'Featured',
  'Best Value',
];

const inputClass =
  'w-full h-9 px-2.5 rounded-lg border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#0073ff]';
const labelClass = 'text-[11px] font-semibold text-neutral-600';

const createBlankDesign = (): Template => {
  const base: Template = {
    id: `tpl-${Date.now()}`,
    name: 'নতুন ডিজাইন',
    category: 'Royal Brass & Slate',
    supportedSizes: STANDARD_SIZES.map((s) => s.id) as NameplateSize[],
    sizes: STANDARD_SIZES,
    thumbnail: '',
    description: '',
    material: 'প্রিমিয়াম এক্রিলিক + ৩ডি মেটালিক লেটারিং',
    priceStartingAt: 3250,
    badge: 'New',
    enabled: true,
    style: {
      background: '#006d03',
      borderColor: '#d4af37',
      borderWidth: '0px',
      borderRadius: '8px',
      standoffScrewType: 'gold-cap',
      accentLineColor: '#ffde59',
      materialFinish: 'gloss',
    },
    textConfig: {
      houseName: {
        fontFamily: 'SutonnyMJ',
        fontSizeClass: 'text-4xl',
        fontWeight: 'bold',
        color: '#ffd054',
      },
      proprietor: {
        fontFamily: 'SutonnyMJ',
        fontSizeClass: 'text-2xl',
        fontWeight: 'normal',
        color: '#ffdd78',
      },
      address: {
        fontFamily: 'SutonnyMJ',
        fontSizeClass: 'text-sm',
        color: '#ffea9f',
      },
      holdingNumber: {
        fontFamily: 'SutonnyMJ',
        fontSizeClass: 'text-base',
        color: '#ffd054',
      },
    },
    editableFields: ['houseName', 'proprietor', 'address', 'holdingNumber'],
    defaultValues: {
      houseName: 'mvwgDj nvmvb feb',
      proprietor: '†cªvt kvn Avjg',
      address: 'Mªvgt `wonvBigviv, ivqcyiv, biwms`x|',
      holdingNumber: 'wemwgj­vwni ivngvwbi ivwng',
    },
    variants: [
      {
        id: 'v1',
        name: 'ভার্সন ১ (Emerald)',
        background: '#006d03',
        textColor: '#ffd054',
        accentColor: '#ffde59',
      },
      {
        id: 'v2',
        name: 'ভার্সন ২ (Ruby)',
        background: '#4b0004',
        textColor: '#ffd054',
        accentColor: '#ffde59',
      },
      {
        id: 'v3',
        name: 'ভার্সন ৩ (Obsidian)',
        background: '#000000',
        textColor: '#ffd054',
        accentColor: '#ffde59',
      },
    ],
    createdAt: new Date().toISOString(),
  };

  return normalizeTemplate(base);
};

export const TemplateBuilder = ({
  initial,
  onSave,
  onClose,
}: TemplateBuilderProps) => {
  const [draft, setDraft] = useState<Template>(
    () => initial || createBlankDesign()
  );
  const [previewSizeId, setPreviewSizeId] = useState<string>(
    () => (draft.sizes || STANDARD_SIZES)[0].id
  );
  const [previewVariantId, setPreviewVariantId] = useState<string>(
    () => (draft.variants || [])[0]?.id || ''
  );

  const variants = draft.variants || [];
  const layout = draft.layout || [];

  const previewSize = useMemo(
    () =>
      (draft.sizes || STANDARD_SIZES).find((s) => s.id === previewSizeId) ||
      STANDARD_SIZES[0],
    [draft.sizes, previewSizeId]
  );

  const patch = (updates: Partial<Template>) =>
    setDraft((current) => normalizeTemplate({ ...current, ...updates }));

  const patchStyle = (updates: Partial<Template['style']>) =>
    patch({ style: { ...draft.style, ...updates } });

  const patchVariant = (id: string, updates: Partial<TemplateVariant>) =>
    patch({
      variants: variants.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    });

  const patchLayer = (index: number, updates: Partial<DesignTextLayer>) =>
    patch({
      layout: layout.map((l, i) => (i === index ? { ...l, ...updates } : l)),
    });

  const toggleStandardSize = (size: SizeOption) => {
    const sizes = draft.sizes || [];
    const has = sizes.some((s) => s.id === size.id);
    patch({
      sizes: has
        ? sizes.filter((s) => s.id !== size.id)
        : [...sizes, size],
    });
  };

  const addCustomSize = () => {
    const index = (draft.sizes || []).filter((s) => !STANDARD_SIZES.some((x) => x.id === s.id)).length + 1;
    patch({
      sizes: [
        ...(draft.sizes || []),
        { id: `custom-${Date.now()}`, label: `${index}:2`, width: 1200, height: 800 },
      ],
    });
  };

  const addVariant = () => {
    patch({
      variants: [
        ...variants,
        {
          id: `v${Date.now()}`,
          name: `ভার্সন ${variants.length + 1}`,
          background: '#1e293b',
          textColor: '#e2e8f0',
          accentColor: '#94a3b8',
        },
      ],
    });
  };

  const addLayer = () =>
    patch({
      layout: [
        ...layout,
        {
          key: `line${layout.length + 1}`,
          text: 'নতুন লাইন',
          left: 100,
          top: 120 + layout.length * 80,
          width: 1000,
          fontSize: 48,
          fontFamily: 'SutonnyMJ',
          fontWeight: 600,
          fill: variants[0]?.textColor || '#ffd054',
          colorKey: 'text',
        },
      ],
    });

  const resetLayout = () =>
    patch({ layout: buildDefaultLayout(draft, variants[0]) });

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-[1080px] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="font-black text-base text-neutral-900">
              {initial ? 'ডিজাইন এডিট করুন' : 'নতুন ডিজাইন তৈরি করুন'}
            </h3>
            <p className="text-[11px] text-neutral-500">
              সাইজ, কালার ভার্সন ও লেখার লাইন সেট করুন — ডান দিকে লাইভ প্রিভিউ
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_380px] overflow-hidden">
          {/* Form */}
          <div className="overflow-y-auto p-6 space-y-6 border-r">
            {/* Basics */}
            <section className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Basics
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className={labelClass}>নাম</label>
                  <input
                    className={inputClass}
                    value={draft.name}
                    onChange={(e) => patch({ name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>ক্যাটাগরি</label>
                  <select
                    className={inputClass}
                    value={draft.category}
                    onChange={(e) =>
                      patch({ category: e.target.value as Template['category'] })
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>ব্যাজ</label>
                  <select
                    className={inputClass}
                    value={draft.badge || ''}
                    onChange={(e) =>
                      patch({
                        badge: (e.target.value || undefined) as Template['badge'],
                      })
                    }
                  >
                    <option value="">None</option>
                    {BADGES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>দাম (৳)</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={draft.priceStartingAt}
                    onChange={(e) =>
                      patch({ priceStartingAt: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>থাম্বনেইল URL</label>
                  <input
                    className={inputClass}
                    placeholder="/templates/my-frame.png"
                    value={draft.thumbnail}
                    onChange={(e) => patch({ thumbnail: e.target.value })}
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className={labelClass}>বর্ণনা</label>
                  <input
                    className={inputClass}
                    value={draft.description}
                    onChange={(e) => patch({ description: e.target.value })}
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className={labelClass}>মেটেরিয়াল</label>
                  <input
                    className={inputClass}
                    value={draft.material}
                    onChange={(e) => patch({ material: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>ব্যাকগ্রাউন্ড</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draft.style.background}
                      onChange={(e) => patchStyle({ background: e.target.value })}
                      className="w-9 h-9 rounded border border-neutral-300 p-0.5"
                    />
                    <span className="font-mono text-[11px] text-neutral-500">
                      {draft.style.background}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>টেক্সচার ওভারলে</label>
                  <input
                    className={inputClass}
                    placeholder="/templates/frame.png"
                    value={draft.style.textureOverlay || ''}
                    onChange={(e) =>
                      patchStyle({ textureOverlay: e.target.value || undefined })
                    }
                  />
                </div>
              </div>
            </section>

            {/* Sizes */}
            <section className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Sizes
                </h4>
                <button
                  type="button"
                  onClick={addCustomSize}
                  className="text-[11px] font-bold text-[#0073ff] flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Custom size
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {STANDARD_SIZES.map((size) => {
                  const on = (draft.sizes || []).some((s) => s.id === size.id);
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => toggleStandardSize(size)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg border text-xs font-semibold transition',
                        on
                          ? 'border-[#0073ff] bg-[#f0f7ff] text-[#0073ff]'
                          : 'border-neutral-200 text-neutral-600'
                      )}
                    >
                      {size.label}
                      <span className="ml-1 text-[10px] text-neutral-400">
                        {size.width}×{size.height}
                      </span>
                    </button>
                  );
                })}
              </div>
              {(draft.sizes || []).some(
                (s) => !STANDARD_SIZES.some((x) => x.id === s.id)
              ) && (
                <div className="space-y-2">
                  {(draft.sizes || [])
                    .filter((s) => !STANDARD_SIZES.some((x) => x.id === s.id))
                    .map((size) => (
                      <div key={size.id} className="flex items-center gap-2">
                        <input
                          className={cn(inputClass, 'w-24')}
                          value={size.label}
                          onChange={(e) =>
                            patch({
                              sizes: draft.sizes!.map((s) =>
                                s.id === size.id
                                  ? { ...s, label: e.target.value }
                                  : s
                              ),
                            })
                          }
                        />
                        <input
                          type="number"
                          className={cn(inputClass, 'w-24')}
                          value={size.width}
                          onChange={(e) =>
                            patch({
                              sizes: draft.sizes!.map((s) =>
                                s.id === size.id
                                  ? { ...s, width: Number(e.target.value) }
                                  : s
                              ),
                            })
                          }
                        />
                        <span className="text-xs text-neutral-400">×</span>
                        <input
                          type="number"
                          className={cn(inputClass, 'w-24')}
                          value={size.height}
                          onChange={(e) =>
                            patch({
                              sizes: draft.sizes!.map((s) =>
                                s.id === size.id
                                  ? { ...s, height: Number(e.target.value) }
                                  : s
                              ),
                            })
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            patch({
                              sizes: draft.sizes!.filter((s) => s.id !== size.id),
                            })
                          }
                          className="p-2 rounded-lg border border-red-200 text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </section>

            {/* Colour variants */}
            <section className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Colour variants ({variants.length})
                </h4>
                <button
                  type="button"
                  onClick={addVariant}
                  className="text-[11px] font-bold text-[#0073ff] flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add variant
                </button>
              </div>
              <div className="space-y-2">
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center gap-2 p-2 rounded-xl border border-neutral-200"
                  >
                    <input
                      className={cn(inputClass, 'flex-1')}
                      value={variant.name}
                      onChange={(e) =>
                        patchVariant(variant.id, { name: e.target.value })
                      }
                    />
                    <input
                      type="color"
                      title="Background"
                      value={variant.background}
                      onChange={(e) =>
                        patchVariant(variant.id, { background: e.target.value })
                      }
                      className="w-9 h-9 rounded border border-neutral-300 p-0.5"
                    />
                    <input
                      type="color"
                      title="Text"
                      value={variant.textColor}
                      onChange={(e) =>
                        patchVariant(variant.id, { textColor: e.target.value })
                      }
                      className="w-9 h-9 rounded border border-neutral-300 p-0.5"
                    />
                    <input
                      type="color"
                      title="Accent"
                      value={variant.accentColor || variant.textColor}
                      onChange={(e) =>
                        patchVariant(variant.id, { accentColor: e.target.value })
                      }
                      className="w-9 h-9 rounded border border-neutral-300 p-0.5"
                    />
                    <button
                      type="button"
                      disabled={variants.length <= 1}
                      onClick={() =>
                        patch({
                          variants: variants.filter((v) => v.id !== variant.id),
                        })
                      }
                      className="p-2 rounded-lg border border-red-200 text-red-600 disabled:opacity-40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Text lines */}
            <section className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Text lines ({layout.length})
                </h4>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={resetLayout}
                    className="text-[11px] font-bold text-neutral-500"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={addLayer}
                    className="text-[11px] font-bold text-[#0073ff] flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add line
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {layout.map((layer, index) => (
                  <div
                    key={`${layer.key}-${index}`}
                    className="flex items-center gap-2 p-2 rounded-xl border border-neutral-200"
                  >
                    <input
                      className={cn(inputClass, 'flex-1')}
                      value={layer.text}
                      onChange={(e) => patchLayer(index, { text: e.target.value })}
                    />
                    <input
                      type="number"
                      title="Font size"
                      className={cn(inputClass, 'w-20')}
                      value={layer.fontSize}
                      onChange={(e) =>
                        patchLayer(index, { fontSize: Number(e.target.value) })
                      }
                    />
                    <input
                      type="number"
                      title="Top (y)"
                      className={cn(inputClass, 'w-20')}
                      value={layer.top}
                      onChange={(e) =>
                        patchLayer(index, { top: Number(e.target.value) })
                      }
                    />
                    <select
                      title="Colour source"
                      className={cn(inputClass, 'w-24')}
                      value={layer.colorKey || 'text'}
                      onChange={(e) =>
                        patchLayer(index, {
                          colorKey: e.target.value as 'text' | 'accent',
                        })
                      }
                    >
                      <option value="text">text</option>
                      <option value="accent">accent</option>
                    </select>
                    <button
                      type="button"
                      onClick={() =>
                        patch({ layout: layout.filter((_, i) => i !== index) })
                      }
                      className="p-2 rounded-lg border border-red-200 text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Live preview */}
          <div className="overflow-y-auto p-6 space-y-4 bg-neutral-50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Live preview
            </h4>

            <NameplatePreview
              template={draft}
              variantId={previewVariantId}
              size={previewSize.id as NameplateSize}
            />

            <div className="space-y-2">
              <label className={labelClass}>Preview size</label>
              <div className="flex flex-wrap gap-1.5">
                {(draft.sizes || STANDARD_SIZES).map((size) => (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => setPreviewSizeId(size.id)}
                    className={cn(
                      'px-2.5 py-1 rounded-md border text-[11px] font-semibold',
                      previewSizeId === size.id
                        ? 'border-[#0073ff] bg-[#f0f7ff] text-[#0073ff]'
                        : 'border-neutral-200 bg-white text-neutral-600'
                    )}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Preview colour</label>
              <div className="flex flex-wrap gap-1.5">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setPreviewVariantId(variant.id)}
                    className={cn(
                      'size-7 rounded-full border-2',
                      previewVariantId === variant.id
                        ? 'border-[#0073ff]'
                        : 'border-neutral-200'
                    )}
                    style={{ backgroundColor: variant.background }}
                    title={variant.name}
                  />
                ))}
              </div>
            </div>

            <p className="text-[10px] text-neutral-400 leading-relaxed">
              লেআউট স্থানাঙ্কগুলো 1200×600 ক্যানভাস ধরে লেখা — যেকোনো সাইজে
              অটোস্কেল হবে।
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600"
          >
            বাতিল
          </button>
          <button
            type="button"
            onClick={() => onSave(normalizeTemplate(draft))}
            className="px-5 py-2 rounded-xl bg-[#0073ff] hover:bg-[#0059cc] text-white text-xs font-bold"
          >
            {initial ? 'আপডেট করুন' : 'ডিজাইন সংরক্ষণ'}
          </button>
        </div>
      </div>
    </div>
  );
};
