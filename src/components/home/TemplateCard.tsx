'use client';

import React, { useState } from 'react';
import { Template, NameplateSize } from '@/types/nameplate';
import { NameplatePreview } from '@/components/nameplate/NameplatePreview';
import { applyVariant, getTemplateVariants } from '@/lib/template-utils';
import { cn } from '@/lib/utils';

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template, selectedSize: NameplateSize) => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const [activeSize, setActiveSize] = useState<NameplateSize>(
    template.supportedSizes[0] || '2:1'
  );
  const variants = getTemplateVariants(template);
  const [activeVariantId, setActiveVariantId] = useState<string>(variants[0]?.id);

  const activeVariant =
    variants.find((variant) => variant.id === activeVariantId) || variants[0];
  // A colour variant usually carries its own shot, so the swatch swaps the image.
  const thumbnail = activeVariant?.thumbnail || template.thumbnail;

  const handleSizeClick = (e: React.MouseEvent, size: NameplateSize) => {
    e.stopPropagation();
    setActiveSize(size);
  };

  const handleVariantClick = (e: React.MouseEvent, variantId: string) => {
    e.stopPropagation();
    setActiveVariantId(variantId);
  };

  return (
    <div
      onClick={() => onSelect(template, activeSize)}
      className="group relative flex flex-col rounded-[20px] bg-white border border-neutral-200 hover:border-[#0073ff] transition-all cursor-pointer overflow-hidden"
    >
      {/* Design only — the thumbnail carries the card */}
      <div className="relative aspect-[2/1] bg-[#f8f9fa] flex items-center justify-center p-4">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={template.name}
            className="w-full h-full object-cover rounded-xl border border-neutral-200/80 transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="w-full my-auto transition-transform duration-300 group-hover:scale-[1.02]">
            <NameplatePreview
              template={applyVariant(template, activeVariantId)}
              size={activeSize}
              compact={true}
            />
          </div>
        )}
      </div>

      {/* Size + colour */}
      <div className="px-4 py-3 flex items-center justify-between gap-3 border-t border-neutral-100">
        <div className="flex items-center gap-1.5">
          {variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              title={variant.name}
              aria-label={variant.name}
              onClick={(e) => handleVariantClick(e, variant.id)}
              className={cn(
                'size-5 rounded-full transition-all cursor-pointer',
                activeVariantId === variant.id
                  ? 'ring-2 ring-[#0073ff] ring-offset-2'
                  : 'ring-1 ring-neutral-300 hover:ring-neutral-400'
              )}
              style={{ backgroundColor: variant.background }}
            />
          ))}
        </div>

        <div className="flex items-center gap-1">
          {template.supportedSizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={(e) => handleSizeClick(e, size)}
              className={cn(
                'px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer',
                activeSize === size
                  ? 'bg-[#0073ff] text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
