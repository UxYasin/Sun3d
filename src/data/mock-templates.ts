import { NameplateSize, STANDARD_SIZES, Template } from '@/types/nameplate';

/**
 * One design with three colour variants. Layout coordinates are authored
 * against a 1200×600 canvas and scaled to whichever size is chosen.
 */
export const MOCK_TEMPLATES: Template[] = [
  {
    id: 'tpl-royal-frame',
    name: 'রয়্যাল গোল্ডেন ফ্রেম (Royal Golden Frame)',
    category: 'Royal Brass & Slate',
    supportedSizes: STANDARD_SIZES.map((size) => size.id) as NameplateSize[],
    sizes: STANDARD_SIZES,
    thumbnail: '/templates/emerald-gold-frame.png',
    description:
      'ঐতিহ্যবাহী লাক্সারি গোল্ডেন ব্রাস কর্নার ফ্রেম এবং সুতোন্বী এমজে হরফে সোনালী ৩ডি লেটারিং সম্বলিত প্রিমিয়াম নামপ্লেট।',
    material: 'প্রিমিয়াম এক্রিলিক + ৩ডি গোল্ডেন মিরর হরফ + ব্রাস ফ্রেম',
    priceStartingAt: 3250,
    badge: 'Featured',
    enabled: true,
    style: {
      background: '#006d03',
      textureOverlay: '/templates/golden-frame-border.png',
      borderColor: '#d4af37',
      borderWidth: '0px',
      borderRadius: '8px',
      boxShadow:
        '0 25px 45px -12px rgba(0, 109, 3, 0.7), inset 0 2px 4px rgba(255, 215, 0, 0.2)',
      standoffScrewType: 'gold-cap',
      accentLineColor: '#ffde59',
      materialFinish: 'হাই-গ্লস ফিনিশ ও কার্ভড ব্রাস ফ্রেম',
    },
    textConfig: {
      houseName: {
        fontFamily: 'SutonnyMJ',
        fontSizeClass: 'text-3xl sm:text-4xl md:text-5xl tracking-wide',
        fontWeight: 'font-bold',
        color: '#ffd054',
      },
      proprietor: {
        fontFamily: 'SutonnyMJ',
        fontSizeClass: 'text-xl sm:text-2xl',
        fontWeight: 'font-bold',
        color: '#ffdd78',
      },
      address: {
        fontFamily: 'SutonnyMJ',
        fontSizeClass: 'text-xs sm:text-sm',
        color: '#ffea9f',
      },
      holdingNumber: {
        fontFamily: 'SutonnyMJ',
        fontSizeClass: 'text-sm sm:text-base font-semibold',
        badgeStyle: false,
        prefix: '',
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
        id: 'emerald',
        name: 'পান্না সবুজ (Emerald)',
        background: '#006d03',
        textColor: '#ffd054',
        accentColor: '#ffde59',
        thumbnail: '/templates/emerald-gold-frame.png',
      },
      {
        id: 'ruby',
        name: 'রুবি মেরুন (Ruby Maroon)',
        background: '#4b0004',
        textColor: '#ffd054',
        accentColor: '#ffde59',
        thumbnail: '/templates/ruby-gold-frame.png',
      },
      {
        id: 'obsidian',
        name: 'অবসিডিয়ান ব্ল্যাক (Obsidian)',
        background: '#000000',
        textColor: '#ffd054',
        accentColor: '#ffde59',
        thumbnail: '/templates/black-gold-frame.png',
      },
    ],
    layout: [
      {
        key: 'holdingNumber',
        text: 'wemwgj­vwni ivngvwbi ivwng',
        left: 100,
        top: 55,
        width: 1000,
        fontSize: 30,
        fontFamily: 'SutonnyMJ',
        fontWeight: 600,
        fill: '#f5d061',
        colorKey: 'text',
      },
      {
        key: 'houseName',
        text: 'mvwgDj nvmvb feb',
        left: 100,
        top: 105,
        width: 1000,
        fontSize: 132,
        fontFamily: 'SutonnyMJ',
        fontWeight: 700,
        fill: '#f5d061',
        colorKey: 'text',
        scaleY: 1.25,
      },
      {
        key: 'proprietor',
        text: '†cªvt kvn Avjg',
        left: 100,
        top: 285,
        width: 1000,
        fontSize: 104,
        fontFamily: 'SutonnyMJ',
        fontWeight: 700,
        fill: '#f5d061',
        colorKey: 'text',
        scaleX: 1.15,
      },
      {
        key: 'father',
        text: 'wcZvt g…Z nvi“b Ai iwk`',
        left: 100,
        top: 425,
        width: 1000,
        fontSize: 54,
        fontFamily: 'SutonnyMJ',
        fontWeight: 700,
        fill: '#f5d061',
        colorKey: 'text',
      },
      {
        key: 'address',
        text: 'Mªvgt `wonvBigviv, ivqcyiv, biwms`x|',
        left: 100,
        top: 500,
        width: 1000,
        fontSize: 42,
        fontFamily: 'SutonnyMJ',
        fontWeight: 600,
        fill: '#ffea9f',
        colorKey: 'accent',
      },
    ],
    createdAt: '2026-09-26',
  },
];

export const TEMPLATE_CATEGORIES = [
  'All',
  'Modern Acrylic',
  'Classic Wood',
  'Royal Brass & Slate',
  'Minimalist Stone',
  'Traditional Heritage',
  'Contemporary Glass',
] as const;

export const SIZE_LABELS: Record<
  string,
  { label: string; ratio: string; dimensions: string; bestFor: string }
> = {
  '2:1': {
    label: 'Wide Architectural (2:1)',
    ratio: '2:1',
    dimensions: '16" × 8" (40cm × 20cm)',
    bestFor: 'Lintel header over main doorway, modern bungalows, villas',
  },
  '1:1': {
    label: 'Square Classic (1:1)',
    ratio: '1:1',
    dimensions: '12" × 12" (30cm × 30cm)',
    bestFor: 'Apartment front door, lift lobby, compact entrances',
  },
  '4:1': {
    label: 'Banner Long (4:1)',
    ratio: '4:1',
    dimensions: '20" × 5" (50cm × 12.5cm)',
    bestFor: 'Compound boundary wall, gate arch, long fascia boards',
  },
  custom: {
    label: 'Custom Size',
    ratio: 'custom',
    dimensions: 'Your own width × height',
    bestFor: 'Unusual openings the standard ratios do not fit',
  },
};
