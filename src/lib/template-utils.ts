import {
  CustomSize,
  DesignTextLayer,
  NameplateSize,
  SizeOption,
  STANDARD_SIZES,
  Template,
  TemplateVariant,
} from '@/types/nameplate';

/** Sizes used before the 2:1 / 1:1 / 4:1 set replaced them. */
export const LEGACY_SIZE_MAP: Record<string, NameplateSize> = {
  '4:2': '2:1',
  '5:3': '2:1',
  '4:3': '1:1',
};

export const SIZE_IDS: NameplateSize[] = ['2:1', '1:1', '4:1', 'custom'];

export const MIN_CUSTOM_SIDE = 200;
export const MAX_CUSTOM_SIDE = 4000;

const clamp = (value: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : min;

/** Maps any stored size key (including legacy ones) onto the current set. */
export const normalizeSizeId = (size?: string): NameplateSize => {
  const mapped = (size && LEGACY_SIZE_MAP[size]) || size;
  return (SIZE_IDS as string[]).includes(mapped ?? '')
    ? (mapped as NameplateSize)
    : '2:1';
};

/** The sizes a design offers — its own list, or the three standards. */
export const getTemplateSizes = (template: Template): SizeOption[] => {
  const sizes = (template.sizes || []).filter(
    (s) => s && typeof s.width === 'number' && typeof s.height === 'number'
  );
  return sizes.length ? sizes : STANDARD_SIZES;
};

/** Resolves the chosen size (or a custom width/height) to pixel dimensions. */
export const resolveSize = (
  template: Template,
  sizeId?: string,
  customSize?: CustomSize
): SizeOption => {
  if (sizeId === 'custom' && customSize) {
    const width = clamp(customSize.width, MIN_CUSTOM_SIDE, MAX_CUSTOM_SIDE);
    const height = clamp(customSize.height, MIN_CUSTOM_SIDE, MAX_CUSTOM_SIDE);
    return { id: 'custom', label: `${width}×${height}`, width, height };
  }

  const sizes = getTemplateSizes(template);

  // A design may define its own sizes (e.g. 3:2) — those win over the aliases.
  const own = sizes.find((s) => s.id === sizeId);
  if (own) return own;

  const wanted = normalizeSizeId(sizeId);
  return sizes.find((s) => s.id === wanted) || sizes[0] || STANDARD_SIZES[0];
};

/** Stable key for a colour×size artwork inside `Template.artworks`. */
export const artworkKey = (variantId?: string | null, sizeId?: string | null) =>
  `${variantId || 'default'}::${sizeId || 'default'}`;

/** The artwork saved for a colour×size combination, falling back to the base. */
export const getTemplateArtwork = (
  template: Template,
  variantId?: string | null,
  sizeId?: string | null
): string | undefined =>
  template.artworks?.[artworkKey(variantId, sizeId)] || template.canvasJson;

export const getTemplateVariants = (template: Template): TemplateVariant[] => {
  const variants = (template.variants || []).filter((v) => v && v.id);
  if (variants.length) return variants;

  return [
    {
      id: 'default',
      name: 'Default',
      background: template.style?.background || '#006d03',
      textColor: template.textConfig?.houseName?.color || '#f6d365',
      accentColor: template.style?.accentLineColor,
    },
  ];
};

export const getVariant = (
  template: Template,
  variantId?: string
): TemplateVariant =>
  getTemplateVariants(template).find((v) => v.id === variantId) ||
  getTemplateVariants(template)[0];

/** The three-line composition used when a design defines no layout of its own. */
export const buildDefaultLayout = (
  template: Template,
  variant: TemplateVariant
): DesignTextLayer[] => {
  const { defaultValues, textConfig } = template;
  const accent = variant.accentColor || variant.textColor;

  return [
    {
      key: 'houseName',
      text: defaultValues?.houseName || '',
      left: 100,
      top: 200,
      width: 1000,
      fontSize: 56,
      fontFamily: textConfig?.houseName?.fontFamily || 'Arial',
      fontWeight: 700,
      fill: variant.textColor,
      colorKey: 'text',
    },
    {
      key: 'proprietor',
      text: defaultValues?.proprietor || '',
      left: 100,
      top: 305,
      width: 1000,
      fontSize: 32,
      fontFamily: textConfig?.proprietor?.fontFamily || 'Arial',
      fontWeight: 600,
      fill: variant.textColor,
      colorKey: 'text',
    },
    {
      key: 'address',
      text: [defaultValues?.holdingNumber, defaultValues?.address]
        .filter(Boolean)
        .join(' • '),
      left: 100,
      top: 380,
      width: 1000,
      fontSize: 22,
      fontFamily: textConfig?.address?.fontFamily || 'Arial',
      fontWeight: 400,
      fill: accent,
      colorKey: 'accent',
    },
  ];
};

export const getTemplateLayout = (template: Template): DesignTextLayer[] => {
  const layout = (template.layout || []).filter((l) => l && l.text !== undefined);
  return layout.length ? layout : buildDefaultLayout(template, getTemplateVariants(template)[0]);
};

/**
 * Returns the design with a variant's colours folded in, so any renderer that
 * only understands `style` / `textConfig` can display the chosen colourway.
 */
export const applyVariant = (template: Template, variantId?: string): Template => {
  const variant = getVariant(template, variantId);
  if (!variant) return template;

  const accent = variant.accentColor || template.style?.accentLineColor;

  return {
    ...template,
    style: {
      ...template.style,
      background: variant.background,
      accentLineColor: accent,
    },
    textConfig: {
      ...template.textConfig,
      houseName: { ...template.textConfig.houseName, color: variant.textColor },
      proprietor: { ...template.textConfig.proprietor, color: variant.textColor },
      address: {
        ...template.textConfig.address,
        color: variant.accentColor || variant.textColor,
      },
      holdingNumber: {
        ...template.textConfig.holdingNumber,
        color: variant.textColor,
      },
    },
    layout: getTemplateLayout(template).map((layer) => ({
      ...layer,
      fill:
        layer.colorKey === 'accent'
          ? variant.accentColor || variant.textColor
          : variant.textColor,
    })),
  };
};

/** The colour a layout layer should use for the given variant. */
export const layerFill = (
  layer: DesignTextLayer,
  variant: TemplateVariant
): string =>
  layer.colorKey === 'accent'
    ? variant.accentColor || variant.textColor
    : variant.textColor;

/**
 * Upgrades a stored template in place: legacy sizes are mapped onto the new set
 * and missing sizes / variants / layout get sensible defaults. Safe to run on
 * every read.
 */
export const normalizeTemplate = (template: Template): Template => {
  if (!template) return template;

  const sizes = getTemplateSizes(template);
  const variants = getTemplateVariants(template);

  return {
    ...template,
    sizes,
    supportedSizes: sizes.map((s) => s.id) as NameplateSize[],
    variants,
    layout: getTemplateLayout({ ...template, variants }),
  };
};

/** A ready-to-edit design the canvas editor can start from. */
export const createBlankDesign = (): Template => {
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
