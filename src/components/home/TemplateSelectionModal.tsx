'use client';

import React, { useState, useEffect } from 'react';
import { Template, NameplateSize } from '@/types/nameplate';
import { NameplatePreview } from '@/components/nameplate/NameplatePreview';
import { SIZE_LABELS } from '@/data/mock-templates';
import { X, ArrowRight, Check, ShieldCheck, Ruler, Sparkles, SlidersHorizontal, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateSelectionModalProps {
  template: Template | null;
  initialSize?: NameplateSize;
  isOpen: boolean;
  onClose: () => void;
  onContinue: (template: Template, size: NameplateSize) => void;
}

export function TemplateSelectionModal({
  template,
  initialSize,
  isOpen,
  onClose,
  onContinue
}: TemplateSelectionModalProps) {
  const [selectedSize, setSelectedSize] = useState<NameplateSize>('2:1');

  useEffect(() => {
    if (template) {
      if (initialSize && template.supportedSizes.includes(initialSize)) {
        setSelectedSize(initialSize);
      } else {
        setSelectedSize(template.supportedSizes[0] || '2:1');
      }
    }
  }, [template, initialSize]);

  if (!isOpen || !template) return null;

  const currentSizeInfo = SIZE_LABELS[selectedSize];

  const handleContinueClick = () => {
    // Persist choice to localStorage for cross-page/flow continuity
    if (typeof window !== 'undefined') {
      localStorage.setItem('sun3d_selected_template_id', template.id);
      localStorage.setItem('sun3d_selected_size', selectedSize);
    }
    onContinue(template, selectedSize);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                {template.category}
              </span>
              <span className="text-xs text-neutral-500">ID: {template.id}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-1">
              {template.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-8 flex-1 space-y-6">
          {/* Main Large Visual Preview at Selected Aspect Ratio */}
          <div className="bg-neutral-100 dark:bg-zinc-950/90 rounded-2xl p-4 sm:p-8 border border-neutral-200/80 dark:border-neutral-800 flex flex-col items-center justify-center">
            <div className="w-full max-w-xl">
              <NameplatePreview
                template={template}
                size={selectedSize}
                className="shadow-2xl mx-auto"
              />
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-3 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-500" />
              <span>Preview rendered in real-world aspect ratio: <strong>{selectedSize}</strong></span>
            </p>
          </div>

          {/* Size Selector Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-amber-500" />
                <span>Select Dimensions & Ratio</span>
              </label>
              <span className="text-xs text-neutral-500">
                {template.supportedSizes.length} size{template.supportedSizes.length > 1 ? 's' : ''} supported
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {template.supportedSizes.map((sz) => {
                const info = SIZE_LABELS[sz];
                const isSelected = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={cn(
                      'p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between relative',
                      isSelected
                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 ring-2 ring-amber-500/30'
                        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-sm text-neutral-900 dark:text-white">
                        {sz} Ratio
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                      {info.dimensions}
                    </p>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
                      {info.bestFor}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Template Details & Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-zinc-800/60 border border-neutral-200 dark:border-neutral-700/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Material & Hardware
              </h4>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                {template.material}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Includes 4× SS Standoff Mounts + Wall Plugs</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-zinc-800/60 border border-neutral-200 dark:border-neutral-700/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Customizable Fields in Editor
              </h4>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className="px-2 py-0.5 text-xs bg-white dark:bg-zinc-900 rounded-md border border-neutral-200 dark:border-neutral-700 font-medium">
                  House / Family Name
                </span>
                <span className="px-2 py-0.5 text-xs bg-white dark:bg-zinc-900 rounded-md border border-neutral-200 dark:border-neutral-700 font-medium">
                  Proprietor
                </span>
                <span className="px-2 py-0.5 text-xs bg-white dark:bg-zinc-900 rounded-md border border-neutral-200 dark:border-neutral-700 font-medium">
                  Address
                </span>
                <span className="px-2 py-0.5 text-xs bg-white dark:bg-zinc-900 rounded-md border border-neutral-200 dark:border-neutral-700 font-medium">
                  Holding Number
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">Selected Size:</span>
            <p className="text-sm font-bold text-neutral-900 dark:text-white">
              {currentSizeInfo.label} — {currentSizeInfo.dimensions}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleContinueClick}
              className="flex-1 sm:flex-none px-7 py-3 rounded-xl text-sm font-bold bg-neutral-900 hover:bg-black text-white dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-neutral-950 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>Continue to Customize</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
