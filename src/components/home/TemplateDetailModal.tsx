'use client';

import React, { useState } from 'react';
import { Template, NameplateSize } from '@/types/nameplate';
import { NameplatePreview } from '@/components/nameplate/NameplatePreview';
import { getTemplateVariants } from '@/lib/template-utils';

interface TemplateDetailModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  onCustomize: (
    template: Template,
    variantId: string | undefined,
    size: NameplateSize
  ) => void;
}

export function TemplateDetailModal({
  template,
  isOpen,
  onClose,
  onCustomize
}: TemplateDetailModalProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<NameplateSize>('2:1');

  if (!isOpen || !template) return null;

  const variants = getTemplateVariants(template);
  const activeVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];
  const previewThumbnail = activeVariant?.thumbnail || template.thumbnail;

  const activeSize = template.supportedSizes.includes(selectedSize)
    ? selectedSize
    : template.supportedSizes[0] || '2:1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-[24px] max-w-4xl w-full overflow-hidden border border-neutral-200 relative flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Left Side: Large Preview (Matching Canva Screenshot 4) */}
        <div className="md:w-7/12 bg-[#f8f9fa] p-6 sm:p-10 flex items-center justify-center border-b md:border-b-0 md:border-r border-neutral-100">
          <div className="w-full max-w-md">
            {previewThumbnail ? (
              <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden shadow-lg border border-neutral-200 bg-neutral-900">
                <img
                  src={previewThumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <NameplatePreview
                template={template}
                size={activeSize}
                customValues={{
                  templateId: template.id,
                  size: activeSize,
                  houseName: 'খান ভিলা (Khan Villa)',
                  proprietor: 'এম. এ. রফিক খান',
                  address: 'বাড়ি নং ১২, রোড ৪, ধানমন্ডি, ঢাকা',
                  holdingNumber: '৭২/বি',
                  typography: {
                    fontFamily: 'serif',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSizeScale: 'standard'
                  },
                  colors: {
                    textColor: template.textConfig.houseName.color,
                    accentColor: template.style.accentLineColor
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="md:w-5/12 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-[#0073ff] uppercase tracking-wider">
              {template.category} টেমপ্লেট
            </span>

            <h3 className="text-2xl font-bold text-neutral-950 mt-1 leading-snug">
              {template.name}
            </h3>

            <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500 font-medium">
              <span className="w-5 h-5 rounded-full bg-[#0073ff] text-white flex items-center justify-center text-[10px] font-bold">
                S
              </span>
              <span>ডিজাইনার: Sun3D স্টুডিও</span>
            </div>

            <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
              {template.description}
            </p>

            {/* Colour Mode — step 1 of the onboarding */}
            {variants.length > 1 && (
              <div className="mt-6">
                <label className="block text-xs font-semibold text-neutral-700 mb-2">
                  রঙ মোড নির্বাচন করুন:
                </label>
                <div className="flex gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      title={variant.name}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`size-8 rounded-full transition-all cursor-pointer ${
                        activeVariant?.id === variant.id
                          ? 'ring-2 ring-[#0073ff] ring-offset-2'
                          : 'ring-1 ring-neutral-300 hover:ring-neutral-400'
                      }`}
                      style={{ backgroundColor: variant.background }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector — step 2 */}
            <div className="mt-6">
              <label className="block text-xs font-semibold text-neutral-700 mb-2">
                সাইজ বা রেশিও নির্বাচন করুন:
              </label>
              <div className="flex gap-2">
                {template.supportedSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      activeSize === size
                        ? 'bg-[#0073ff] text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {size} অনুপাত
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-600">মূল্য (স্ক্রু সহ):</span>
              <span className="text-xl font-bold text-neutral-950">৳{template.priceStartingAt.toLocaleString()} BDT</span>
            </div>
          </div>

          {/* Action CTA Button (Canva Screenshot 4) */}
          <div className="mt-8">
            <button
              onClick={() => onCustomize(template, activeVariant?.id, activeSize)}
              className="w-full btn-canva-pill btn-canva-primary py-3 text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Customize free template • ডিজাইন শুরু করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
