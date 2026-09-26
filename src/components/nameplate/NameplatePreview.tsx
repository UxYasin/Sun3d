'use client';

import React from 'react';
import { Template, NameplateSize, NameplateDesignState } from '@/types/nameplate';
import { applyVariant, resolveSize } from '@/lib/template-utils';
import { cn } from '@/lib/utils';

interface NameplatePreviewProps {
  template: Template;
  size?: NameplateSize;
  /** Colour version to display. Defaults to the design's first variant. */
  variantId?: string;
  customValues?: Partial<NameplateDesignState>;
  className?: string;
  compact?: boolean;
  interactive?: boolean;
}

export function NameplatePreview({
  template,
  size,
  variantId,
  customValues,
  className,
  compact = false,
  interactive = false
}: NameplatePreviewProps) {
  const active = variantId ? applyVariant(template, variantId) : template;
  const currentSize = size || customValues?.size || active.supportedSizes[0] || '2:1';
  const { style, textConfig, defaultValues } = active;
  const sizeOption = resolveSize(active, currentSize, customValues?.customSize);

  const houseName = customValues?.houseName ?? defaultValues.houseName;
  const proprietor = customValues?.proprietor ?? defaultValues.proprietor;
  const address = customValues?.address ?? defaultValues.address;
  const holdingNumber = customValues?.holdingNumber ?? defaultValues.holdingNumber;

  // Typography customizations
  const customTypography = customValues?.typography;
  const fontFamily = customTypography?.fontFamily || textConfig.houseName.fontFamily;
  const fontWeight = customTypography?.fontWeight ? `font-${customTypography.fontWeight}` : textConfig.houseName.fontWeight;
  const textAlign = customTypography?.textAlign || 'center';
  const fontSizeScale = customTypography?.fontSizeScale || 'standard';

  // Color customizations
  const customColors = customValues?.colors;
  const textColor = customColors?.textColor || textConfig.houseName.color;
  const accentColor = customColors?.accentColor || style.accentLineColor;

  // Scale classes for typography
  let scaleClass = compact
    ? 'text-sm sm:text-base'
    : 'text-lg sm:text-2xl md:text-3xl';
  if (fontSizeScale === 'compact') {
    scaleClass = compact ? 'text-xs sm:text-sm' : 'text-base sm:text-xl md:text-2xl';
  } else if (fontSizeScale === 'prominent') {
    scaleClass = compact ? 'text-base sm:text-lg' : 'text-xl sm:text-3xl md:text-4xl';
  }

  // Alignment classes
  const alignClass =
    textAlign === 'left'
      ? 'items-start text-left'
      : textAlign === 'right'
      ? 'items-end text-right'
      : 'items-center text-center';

  // Render standoff screws
  const renderStandoffScrew = (position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
    if (style.standoffScrewType === 'none') return null;

    const posClass = {
      'top-left': 'top-2.5 left-2.5 sm:top-3.5 sm:left-3.5',
      'top-right': 'top-2.5 right-2.5 sm:top-3.5 sm:right-3.5',
      'bottom-left': 'bottom-2.5 left-2.5 sm:bottom-3.5 sm:left-3.5',
      'bottom-right': 'bottom-2.5 right-2.5 sm:bottom-3.5 sm:right-3.5'
    }[position];

    let screwStyle = 'bg-gradient-to-tr from-slate-400 to-slate-100 border-slate-500 shadow-sm';
    let innerDot = 'bg-slate-700';

    if (style.standoffScrewType === 'brass-round') {
      screwStyle = 'bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 border-amber-700 shadow-md';
      innerDot = 'bg-amber-900';
    } else if (style.standoffScrewType === 'gold-cap') {
      screwStyle = 'bg-gradient-to-tr from-yellow-500 via-amber-300 to-yellow-100 border-yellow-600 shadow-md ring-1 ring-yellow-400/40';
      innerDot = 'bg-yellow-800';
    } else if (style.standoffScrewType === 'black-hex') {
      screwStyle = 'bg-gradient-to-tr from-neutral-800 via-neutral-700 to-neutral-600 border-neutral-900 shadow-md';
      innerDot = 'bg-neutral-950';
    }

    return (
      <div
        className={cn(
          'absolute z-20 flex items-center justify-center rounded-full border',
          compact ? 'w-2 h-2 sm:w-2.5 sm:h-2.5' : 'w-3.5 h-3.5 sm:w-4 sm:h-4',
          posClass,
          screwStyle
        )}
      >
        <div className={cn('rounded-full', compact ? 'w-0.5 h-0.5' : 'w-1 h-1 sm:w-1.5 sm:h-1.5', innerDot)} />
      </div>
    );
  };

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden transition-all duration-300 select-none flex flex-col justify-between',
        interactive && 'hover:scale-[1.01]',
        className
      )}
      style={{
        aspectRatio: `${sizeOption.width} / ${sizeOption.height}`,
        background: style.background,
        borderColor: style.borderColor || 'transparent',
        borderWidth: style.borderWidth || '0px',
        borderRadius: style.borderRadius || '12px',
        boxShadow: style.boxShadow || '0 10px 25px -5px rgba(0,0,0,0.4)',
        borderStyle: 'solid'
      }}
    >
      {/* 4 Corner Standoff Screws */}
      {renderStandoffScrew('top-left')}
      {renderStandoffScrew('top-right')}
      {renderStandoffScrew('bottom-left')}
      {renderStandoffScrew('bottom-right')}

      {/* Optional Frame / Texture Background Overlay */}
      {style.textureOverlay && (
        <div
          className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat pointer-events-none"
          style={{ backgroundImage: `url(${style.textureOverlay})` }}
        />
      )}

      {/* Surface Sheen / Gloss Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12] z-10" />

      {/* Subtle border bevel highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/10 z-10" />

      {/* Main Content Area */}
      <div
        className={cn(
          'relative z-10 h-full w-full flex flex-col justify-between',
          compact ? 'p-3 sm:p-3.5' : 'p-4 sm:p-6'
        )}
      >
        {/* Top Header Row (Holding Number Badge / Tag) */}
        <div className="flex items-center justify-between w-full">
          <div className="w-6" /> {/* Balance spacer */}
          {holdingNumber && (
            <div
              className={cn(
                'inline-flex items-center gap-1 font-mono uppercase tracking-wider',
                textConfig.holdingNumber.badgeStyle
                  ? 'px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-current/30 backdrop-blur-md bg-black/25'
                  : 'font-bold',
                compact ? 'text-[9px] sm:text-[10px]' : 'text-[11px] sm:text-xs'
              )}
              style={{ color: accentColor || textConfig.holdingNumber.color }}
            >
              {textConfig.holdingNumber.prefix && (
                <span className="opacity-75 font-normal">{textConfig.holdingNumber.prefix}</span>
              )}
              <span className="font-extrabold">{holdingNumber}</span>
            </div>
          )}
          <div className="w-6" /> {/* Balance spacer */}
        </div>

        {/* Center: House / Family Name */}
        <div className={cn('my-auto px-2 flex flex-col justify-center', alignClass)}>
          <h2
            className={cn(
              'leading-tight drop-shadow-md transition-all',
              fontFamily === 'serif' && 'font-serif',
              fontFamily === 'mono' && 'font-mono',
              fontFamily === 'sans' && 'font-sans',
              fontWeight,
              scaleClass
            )}
            style={{
              fontFamily: (fontFamily && !['serif', 'sans', 'mono'].includes(fontFamily)) ? fontFamily : undefined,
              color: textColor,
              textTransform: textConfig.houseName.textTransform || 'none'
            }}
          >
            {houseName}
          </h2>

          {/* Decorative Accent Divider */}
          {accentColor && (
            <div className={cn(
              'flex items-center gap-2 mt-1 sm:mt-2 w-full max-w-[140px] sm:max-w-[200px]',
              textAlign === 'left' ? 'mr-auto justify-start' : textAlign === 'right' ? 'ml-auto justify-end' : 'mx-auto justify-center'
            )}>
              <div
                className="h-[1px] flex-1 opacity-70"
                style={{ backgroundColor: accentColor }}
              />
              <div
                className="w-1.5 h-1.5 rotate-45 opacity-90"
                style={{ backgroundColor: accentColor }}
              />
              <div
                className="h-[1px] flex-1 opacity-70"
                style={{ backgroundColor: accentColor }}
              />
            </div>
          )}

          {/* Proprietor / Resident Name */}
          {proprietor && (
            <p
              className={cn(
                'mt-1 sm:mt-1.5 transition-all',
                fontFamily === 'serif' && 'font-serif',
                textConfig.proprietor.fontWeight,
                compact ? 'text-[10px] sm:text-[11px]' : 'text-xs sm:text-sm'
              )}
              style={{
                fontFamily: (textConfig.proprietor.fontFamily && !['serif', 'sans', 'mono'].includes(textConfig.proprietor.fontFamily)) ? textConfig.proprietor.fontFamily : undefined,
                color: textColor || textConfig.proprietor.color
              }}
            >
              {textConfig.proprietor.prefix && (
                <span className="opacity-80 mr-1 font-normal">{textConfig.proprietor.prefix}</span>
              )}
              <span className="opacity-95">{proprietor}</span>
            </p>
          )}
        </div>

        {/* Bottom Row: Address Details */}
        <div className={cn('pt-1', textAlign === 'left' ? 'text-left' : textAlign === 'right' ? 'text-right' : 'text-center')}>
          {address && (
            <p
              className={cn(
                'truncate opacity-90 tracking-wide',
                compact ? 'text-[8px] sm:text-[9px]' : 'text-[10px] sm:text-xs'
              )}
              style={{
                fontFamily: (textConfig.address.fontFamily && !['serif', 'sans', 'mono'].includes(textConfig.address.fontFamily)) ? textConfig.address.fontFamily : undefined,
                color: textConfig.address.color
              }}
            >
              {address}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
