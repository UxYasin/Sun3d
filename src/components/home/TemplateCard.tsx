'use client';

import React, { useState } from 'react';
import { Template, NameplateSize } from '@/types/nameplate';
import { NameplatePreview } from '@/components/nameplate/NameplatePreview';

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template, selectedSize: NameplateSize) => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const [activeSize, setActiveSize] = useState<NameplateSize>(template.supportedSizes[0] || '5:3');

  const handleSizeClick = (e: React.MouseEvent, size: NameplateSize) => {
    e.stopPropagation();
    setActiveSize(size);
  };

  const handleCardClick = () => {
    onSelect(template, activeSize);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between rounded-[20px] bg-white border border-neutral-200 hover:border-[#8b3dff] transition-all cursor-pointer overflow-hidden"
    >
      {/* Top Preview Canvas (Zero drop shadow, clean surface) */}
      <div className="relative p-5 bg-[#f8f9fa] border-b border-neutral-100 flex items-center justify-center min-h-[220px]">
        {/* Category Pill on Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <span className="text-[11px] font-semibold text-neutral-600 bg-white px-2.5 py-1 rounded-full border border-neutral-200">
            {template.category}
          </span>
        </div>

        {/* Badge on Top Left */}
        {template.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#8b3dff] text-white">
              {template.badge}
            </span>
          </div>
        )}

        {/* Nameplate Photo Thumbnail or Live Simulation */}
        <div className="w-full max-w-[320px] my-auto transition-transform group-hover:scale-[1.02] flex items-center justify-center">
          {template.thumbnail ? (
            <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden shadow-sm border border-neutral-200/80 bg-neutral-900">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <NameplatePreview
              template={template}
              size={activeSize}
              compact={true}
            />
          )}
        </div>
      </div>

      {/* Card Info */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-neutral-950 group-hover:text-[#8b3dff] transition-colors leading-snug">
            {template.name}
          </h3>

          <p className="mt-1 text-xs text-neutral-500 line-clamp-2 leading-relaxed">
            {template.description}
          </p>

          <p className="mt-2 text-xs text-neutral-600">
            <span className="font-semibold text-neutral-800">ম্যাটেরিয়াল: </span>
            {template.material}
          </p>
        </div>

        {/* Size Selection */}
        <div className="mt-4 pt-3 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              সাইজ:
            </span>
            <span className="text-xs font-bold text-neutral-900">
              ৳{template.priceStartingAt.toLocaleString()} BDT
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {template.supportedSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => handleSizeClick(e, size)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                  activeSize === size
                    ? 'bg-[#8b3dff] text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Action Button */}
          <div className="mt-4">
            <button
              type="button"
              className="w-full py-2.5 rounded-full text-xs sm:text-sm font-bold bg-neutral-100 text-neutral-900 group-hover:bg-[#8b3dff] group-hover:text-white transition-all cursor-pointer"
            >
              কাস্টমাইজ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
