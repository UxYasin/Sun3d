'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';

import { Template } from '@/types/nameplate';
import { NameplatePreview } from '@/components/nameplate/NameplatePreview';
import {
  applyVariant,
  getTemplateSizes,
  getTemplateVariants,
} from '@/lib/template-utils';
import { cn } from '@/lib/utils';

interface DesignCardProps {
  template: Template;
  onDuplicate: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const actionClass =
  'p-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors';

export const DesignCard = ({
  template,
  onDuplicate,
  onToggle,
  onDelete,
}: DesignCardProps) => {
  const variants = getTemplateVariants(template);
  const sizes = getTemplateSizes(template);
  const [activeVariantId, setActiveVariantId] = useState<string>(variants[0]?.id);

  const activeVariant =
    variants.find((variant) => variant.id === activeVariantId) || variants[0];
  const thumbnail = activeVariant?.thumbnail || template.thumbnail;
  const isEnabled = template.enabled !== false;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      {/* Design only — the thumbnail carries the card */}
      <div className="relative aspect-[2/1] bg-[#f8f9fa] dark:bg-zinc-950 flex items-center justify-center p-4">
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={template.name}
            className="w-full h-full object-cover rounded-xl border border-neutral-200/80"
            loading="lazy"
          />
        ) : (
          <div className="w-full">
            <NameplatePreview
              template={applyVariant(template, activeVariantId)}
              size={sizes[0].id}
              compact={true}
            />
          </div>
        )}

        <span
          title={isEnabled ? 'Enabled' : 'Disabled'}
          className={cn(
            'absolute top-2.5 right-2.5 size-2 rounded-full',
            isEnabled ? 'bg-emerald-500' : 'bg-neutral-300'
          )}
        />
      </div>

      {/* Size + colour */}
      <div className="px-3 py-2.5 flex items-center justify-between gap-3 border-t border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-1.5">
          {variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              title={variant.name}
              aria-label={variant.name}
              onClick={() => setActiveVariantId(variant.id)}
              className={cn(
                'size-5 rounded-full cursor-pointer transition-all',
                activeVariantId === variant.id
                  ? 'ring-2 ring-[#0073ff] ring-offset-2'
                  : 'ring-1 ring-neutral-300 hover:ring-neutral-400'
              )}
              style={{ backgroundColor: variant.background }}
            />
          ))}
        </div>

        <div className="flex items-center gap-1">
          {sizes.map((size) => (
            <span
              key={size.id}
              className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-zinc-800 text-[10px] font-semibold text-neutral-600 dark:text-neutral-300"
            >
              {size.label}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-2 py-1.5 flex items-center gap-1.5 border-t border-neutral-100 dark:border-neutral-800">
        <Link
          href={`/admin/design?designId=${encodeURIComponent(template.id)}`}
          title="Edit in canvas"
          className={actionClass}
        >
          <Pencil className="w-3.5 h-3.5" />
        </Link>
        <button
          type="button"
          title="Duplicate"
          onClick={() => onDuplicate(template.id)}
          className={actionClass}
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          title={isEnabled ? 'Disable' : 'Enable'}
          onClick={() => onToggle(template.id)}
          className={cn(
            'ml-auto p-1.5 rounded-md border transition-colors',
            isEnabled
              ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/50 dark:hover:bg-emerald-950/30'
              : 'border-neutral-200 text-neutral-400 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-zinc-800'
          )}
        >
          {isEnabled ? (
            <Eye className="w-3.5 h-3.5" />
          ) : (
            <EyeOff className="w-3.5 h-3.5" />
          )}
        </button>
        <button
          type="button"
          title="Delete"
          onClick={() => onDelete(template.id)}
          className="p-1.5 rounded-md border border-red-200 dark:border-red-950/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
