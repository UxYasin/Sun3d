import { Template } from '@/types/nameplate';

export const MOCK_TEMPLATES: Template[] = [
  {
    id: 'tpl-royal-frame-emerald',
    name: 'রয়্যাল গোল্ডেন ফ্রেম — পান্না সবুজ (Emerald Green)',
    category: 'Royal Brass & Slate',
    supportedSizes: ['4:2'],
    thumbnail: '/templates/emerald-gold-frame.png',
    description: 'ঐতিহ্যবাহী লাক্সারি ২:১ গোল্ডেন ব্রাস কর্নার ফ্রেম এবং সুতোন্বী এমজে হরফে সোনালী ৩ডি লেটারিং সম্বলিত প্রিমিয়াম নামপ্লেট।',
    material: 'ডিপ এমেরাল্ড এক্রিলিক + ৩ডি গোল্ডেন মিরর হরফ + ব্রাস ফ্রেম',
    priceStartingAt: 3250,
    badge: 'Featured',
    style: {
      background: '#006d03',
      textureOverlay: '/templates/golden-frame-border.png',
      borderColor: '#d4af37',
      borderWidth: '0px',
      borderRadius: '8px',
      boxShadow: '0 25px 45px -12px rgba(0, 109, 3, 0.7), inset 0 2px 4px rgba(255, 215, 0, 0.2)',
      standoffScrewType: 'gold-cap',
      accentLineColor: '#ffde59',
      materialFinish: 'হাই-গ্লস এমেরাল্ড সবুজ ও কার্ভড ব্রাস ফ্রেম'
    },
    textConfig: {
      houseName: {
        fontFamily: 'SutonnyMJ',
        fontSizeClass: 'text-3xl sm:text-4xl md:text-5xl tracking-wide',
        fontWeight: 'font-bold',
        color: '#ffd054'
      },
      proprietor: {
        fontFamily: 'SutonnyMJ',
        fontSizeClass: 'text-xl sm:text-2xl',
        fontWeight: 'font-bold',
        color: '#ffdd78'
      },
      address: {
        fontFamily: 'SutonnyMJ',
        fontSizeClass: 'text-xs sm:text-sm',
        color: '#ffea9f'
      },
      holdingNumber: {
        fontFamily: 'SutonnyMJ',
        fontSizeClass: 'text-sm sm:text-base font-semibold',
        badgeStyle: false,
        prefix: '',
        color: '#ffd054'
      }
    },
    editableFields: ['houseName', 'proprietor', 'address', 'holdingNumber'],
    defaultValues: {
      houseName: 'mvwgDj nvmvb feb',
      proprietor: '†cªvt kvn Avjg',
      address: 'wcZvt g…Z nvi“b Ai iwk` • Mªvgt `wonvBigviv, ivqcyiv, biwms`x|',
      holdingNumber: 'wemwgj­vwni ivngvwbi ivwng'
    },
    createdAt: '2026-09-26'
  },
  {
    id: 'tpl-royal-frame-ruby',
    name: 'রয়্যাল গোল্ডেন ফ্রেম — রুবি মেরুন (Ruby Maroon)',
    category: 'Royal Brass & Slate',
    supportedSizes: ['4:2'],
    thumbnail: '/templates/ruby-gold-frame.png',
    description: 'রাজকীয় গাঢ় রুবি মেরুন ব্যাকগ্রাউন্ডের সাথে ঝলমলে সোনালী বর্ডার ও কোণা খচিত ৩ডি লেটারিং যুক্ত প্রিমিয়াম নামপ্লেট।',
    material: 'ডিপ রুবি মেরুন এক্রিলিক + ৩ডি গোল্ডেন মিরর হরফ + ব্রাস ফ্রেম',
    priceStartingAt: 3250,
    badge: 'Popular',
    style: {
      background: '#4b0004',
      textureOverlay: '/templates/golden-frame-border.png',
      borderColor: '#d4af37',
      borderWidth: '0px',
      borderRadius: '8px',
      boxShadow: '0 25px 45px -12px rgba(75, 0, 4, 0.7), inset 0 2px 4px rgba(255, 215, 0, 0.2)',
      standoffScrewType: 'gold-cap',
      accentLineColor: '#ffde59',
      materialFinish: 'লাক্সারি রুবি মেরুন ও কার্ভড ব্রাস ফ্রেম'
    },
    textConfig: {
      houseName: {
        fontFamily: 'SutonnyMJ',
        fontSizeClass: 'text-3xl sm:text-4xl md:text-5xl tracking-wide',
        fontWeight: 'font-bold',
        color: '#ffd054'
      },
      proprietor: {
        fontFamily: 'SutonnyMJ',
        fontSizeClass: 'text-xl sm:text-2xl',
        fontWeight: 'font-bold',
        color: '#ffdd78'
      },
      address: {
        fontFamily: 'SutonnyMJ',
        fontSizeClass: 'text-xs sm:text-sm',
        color: '#ffea9f'
      },
      holdingNumber: {
        fontFamily: 'SutonnyMJ',
        fontSizeClass: 'text-sm sm:text-base font-semibold',
        badgeStyle: false,
        prefix: '',
        color: '#ffd054'
      }
    },
    editableFields: ['houseName', 'proprietor', 'address', 'holdingNumber'],
    defaultValues: {
      houseName: 'mvwgDj nvmvb feb',
      proprietor: '†cªvt kvn Avjg',
      address: 'wcZvt g…Z nvi“b Ai iwk` • Mªvgt `wonvBigviv, ivqcyiv, biwms`x|',
      holdingNumber: 'wemwgj­vwni ivngvwbi ivwng'
    },
    createdAt: '2026-09-26'
  },
  {
    id: 'tpl-royal-frame-black',
    name: 'রয়্যাল গোল্ডেন ফ্রেম — অবসিডিয়ান ব্ল্যাক (Obsidian Black)',
    category: 'Royal Brass & Slate',
    supportedSizes: ['4:2'],
    thumbnail: '/templates/black-gold-frame.png',
    description: 'জেট-ব্ল্যাক পিচ ব্লাক ব্যাকগ্রাউন্ডের সাথে সর্বোচ্চ কনট্রাস্ট ও সোনালী রাজকীয় ফ্রেমের ক্লাসিক ৩ডি নামপ্লেট।',
    material: 'জেট-ব্ল্যাক এক্রিলিক + ৩ডি গোল্ডেন মিরর হরফ + ব্রাস ফ্রেম',
    priceStartingAt: 3250,
    badge: 'New',
    style: {
      background: '#000000',
      textureOverlay: '/templates/golden-frame-border.png',
      borderColor: '#d4af37',
      borderWidth: '0px',
      borderRadius: '8px',
      boxShadow: '0 25px 45px -12px rgba(0, 0, 0, 0.8), inset 0 2px 4px rgba(255, 215, 0, 0.2)',
      standoffScrewType: 'gold-cap',
      accentLineColor: '#ffde59',
      materialFinish: 'হাই-গ্লস পিচ ব্ল্যাক ও কার্ভড ব্রাস ফ্রেম'
    },
    textConfig: {
      houseName: {
        fontFamily: 'SutonnyMJ',
        fontSizeClass: 'text-3xl sm:text-4xl md:text-5xl tracking-wide',
        fontWeight: 'font-bold',
        color: '#ffd054'
      },
      proprietor: {
        fontFamily: 'SutonnyMJ',
        fontSizeClass: 'text-xl sm:text-2xl',
        fontWeight: 'font-bold',
        color: '#ffdd78'
      },
      address: {
        fontFamily: 'SutonnyMJ',
        fontSizeClass: 'text-xs sm:text-sm',
        color: '#ffea9f'
      },
      holdingNumber: {
        fontFamily: 'SutonnyMJ',
        fontSizeClass: 'text-sm sm:text-base font-semibold',
        badgeStyle: false,
        prefix: '',
        color: '#ffd054'
      }
    },
    editableFields: ['houseName', 'proprietor', 'address', 'holdingNumber'],
    defaultValues: {
      houseName: 'mvwgDj nvmvb feb',
      proprietor: '†cªvt kvn Avjg',
      address: 'wcZvt g…Z nvi“b Ai iwk` • Mªvgt `wonvBigviv, ivqcyiv, biwms`x|',
      holdingNumber: 'wemwgj­vwni ivngvwbi ivwng'
    },
    createdAt: '2026-09-26'
  }
];

export const TEMPLATE_CATEGORIES = [
  'All',
  'Modern Acrylic',
  'Classic Wood',
  'Royal Brass & Slate',
  'Minimalist Stone',
  'Traditional Heritage',
  'Contemporary Glass'
] as const;

export const SIZE_LABELS: Record<string, { label: string; ratio: string; dimensions: string; bestFor: string }> = {
  '5:3': {
    label: 'Standard Classic (5:3)',
    ratio: '5:3',
    dimensions: '15" × 9" (38cm × 23cm)',
    bestFor: 'Main entrance gate, compound boundary wall, villas'
  },
  '4:2': {
    label: 'Wide Architectural (4:2 / 2:1)',
    ratio: '4:2',
    dimensions: '16" × 8" (40cm × 20cm)',
    bestFor: 'Lintel header over main doorway, modern bungalows'
  },
  '4:3': {
    label: 'Compact Apartment (4:3)',
    ratio: '4:3',
    dimensions: '12" × 9" (30cm × 23cm)',
    bestFor: 'Apartment/Flat front door, lift lobby, compact entrances'
  }
};
