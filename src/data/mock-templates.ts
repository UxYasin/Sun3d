import { Template } from '@/types/nameplate';

export const MOCK_TEMPLATES: Template[] = [
  {
    id: 'tpl-obsidian-gold',
    name: 'Dhaka Obsidian & Mirror Gold',
    category: 'Modern Acrylic',
    supportedSizes: ['5:3', '4:2', '4:3'],
    thumbnail: '/templates/obsidian-gold.png',
    description: 'High-gloss jet-black 8mm acrylic sheet with 3D raised mirror-gold acrylic lettering and 4 stainless steel standoff fixings.',
    material: '8mm Cast Acrylic + Mirror Gold Acrylic',
    priceStartingAt: 2450,
    badge: 'Popular',
    style: {
      background: 'linear-gradient(135deg, #111113 0%, #1f1f24 100%)',
      borderColor: 'rgba(212, 175, 55, 0.4)',
      borderWidth: '1px',
      borderRadius: '12px',
      boxShadow: '0 20px 35px -10px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.1)',
      standoffScrewType: 'gold-cap',
      accentLineColor: '#d4af37',
      badgeAccent: '#d4af37',
      materialFinish: 'High-Gloss Acrylic'
    },
    textConfig: {
      houseName: {
        fontFamily: 'serif',
        fontSizeClass: 'text-2xl sm:text-3xl tracking-wider',
        fontWeight: 'font-bold',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: '#f6d365',
        subColor: '#fda085'
      },
      proprietor: {
        fontFamily: 'sans',
        fontSizeClass: 'text-xs sm:text-sm tracking-wide',
        fontWeight: 'font-semibold',
        prefix: 'Proprietor:',
        color: '#e2e8f0'
      },
      address: {
        fontFamily: 'sans',
        fontSizeClass: 'text-[11px] sm:text-xs',
        color: '#94a3b8'
      },
      holdingNumber: {
        fontFamily: 'mono',
        fontSizeClass: 'text-xs sm:text-sm font-bold',
        badgeStyle: true,
        prefix: 'Holding:',
        color: '#fef08a'
      }
    },
    editableFields: ['houseName', 'proprietor', 'address', 'holdingNumber'],
    defaultValues: {
      houseName: 'The Rahman Family',
      proprietor: 'Md. Anisur Rahman',
      address: 'House 24, Road 7, Dhanmondi, Dhaka',
      holdingNumber: '12/A'
    },
    createdAt: '2026-01-15'
  },
  {
    id: 'tpl-teak-brass',
    name: 'Chittagong Teak & Inlaid Brass',
    category: 'Classic Wood',
    supportedSizes: ['5:3', '4:2'],
    thumbnail: '/templates/teak-brass.png',
    description: 'Aged Chittagong Teak seasoned hardwood with precision CNC CNC engraved brass lettering and lacquer coating.',
    material: 'Natural Solid Teak Hardwood + Solid Brass',
    priceStartingAt: 3200,
    badge: 'Featured',
    style: {
      background: 'linear-gradient(135deg, #3d1f0d 0%, #582f14 50%, #2f1709 100%)',
      borderColor: '#9a6b38',
      borderWidth: '2px',
      borderRadius: '8px',
      boxShadow: '0 20px 30px -10px rgba(45, 23, 10, 0.7), inset 0 2px 4px rgba(255,255,255,0.08)',
      standoffScrewType: 'brass-round',
      accentLineColor: '#d4af37',
      materialFinish: 'Polished Hardwood & Brushed Brass'
    },
    textConfig: {
      houseName: {
        fontFamily: 'serif',
        fontSizeClass: 'text-2xl sm:text-3xl font-extrabold',
        fontWeight: 'font-bold',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: '#fef3c7'
      },
      proprietor: {
        fontFamily: 'serif',
        fontSizeClass: 'text-xs sm:text-sm italic',
        fontWeight: 'font-medium',
        prefix: 'Resident:',
        color: '#fde68a'
      },
      address: {
        fontFamily: 'sans',
        fontSizeClass: 'text-[11px] sm:text-xs',
        color: '#fbcfe8'
      },
      holdingNumber: {
        fontFamily: 'mono',
        fontSizeClass: 'text-xs sm:text-sm font-bold',
        badgeStyle: false,
        prefix: 'Holding:',
        color: '#fef9c3'
      }
    },
    editableFields: ['houseName', 'proprietor', 'address', 'holdingNumber'],
    defaultValues: {
      houseName: 'Chowdhury Bari',
      proprietor: 'M. A. Chowdhury & Family',
      address: 'Chawkbazar Road, Chittagong',
      holdingNumber: '84/B'
    },
    createdAt: '2026-01-18'
  },
  {
    id: 'tpl-carrara-stone',
    name: 'Dhanmondi Minimalist Carrara',
    category: 'Minimalist Stone',
    supportedSizes: ['5:3', '4:3'],
    thumbnail: '/templates/carrara.png',
    description: 'Polished white Carrara stone grain texture with deep charcoal recessed architectural engraving.',
    material: 'Composite Stone & Weather-Shield Sealant',
    priceStartingAt: 2800,
    badge: 'Best Value',
    style: {
      background: 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 70%, #cbd5e1 100%)',
      borderColor: '#94a3b8',
      borderWidth: '1px',
      borderRadius: '10px',
      boxShadow: '0 18px 28px -8px rgba(100,116,139,0.35), inset 0 1px 0 rgba(255,255,255,0.8)',
      standoffScrewType: 'silver-round',
      accentLineColor: '#475569',
      materialFinish: 'Smooth Polished Marble Composite'
    },
    textConfig: {
      houseName: {
        fontFamily: 'sans',
        fontSizeClass: 'text-2xl sm:text-3xl font-extrabold',
        fontWeight: 'font-bold',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        color: '#0f172a'
      },
      proprietor: {
        fontFamily: 'sans',
        fontSizeClass: 'text-xs sm:text-sm',
        fontWeight: 'font-semibold',
        prefix: 'Proprietor:',
        color: '#334155'
      },
      address: {
        fontFamily: 'sans',
        fontSizeClass: 'text-[11px] sm:text-xs font-medium',
        color: '#64748b'
      },
      holdingNumber: {
        fontFamily: 'mono',
        fontSizeClass: 'text-xs sm:text-sm font-bold',
        badgeStyle: true,
        prefix: 'Flat/Hold:',
        color: '#0f172a'
      }
    },
    editableFields: ['houseName', 'proprietor', 'address', 'holdingNumber'],
    defaultValues: {
      houseName: 'Swapnonir Residence',
      proprietor: 'Dr. Sharmin Akter',
      address: 'Plot 312, Road 11/A, Dhanmondi',
      holdingNumber: 'Flat 5-C'
    },
    createdAt: '2026-01-20'
  },
  {
    id: 'tpl-frosted-glass',
    name: 'Gulshan Floating Frosted Glass',
    category: 'Contemporary Glass',
    supportedSizes: ['5:3', '4:2', '4:3'],
    thumbnail: '/templates/frosted-glass.png',
    description: 'Double-plate sandwich frosted architectural glass with chrome standoff cylindrical spacers and sleek midnight lettering.',
    material: '10mm Toughened Frosted Glass & SS-304 Standoffs',
    priceStartingAt: 3500,
    badge: 'Popular',
    style: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(226, 232, 240, 0.2) 100%)',
      borderColor: 'rgba(255, 255, 255, 0.7)',
      borderWidth: '2px',
      borderRadius: '14px',
      boxShadow: '0 25px 45px -12px rgba(15, 23, 42, 0.35), backdrop-filter: blur(16px)',
      standoffScrewType: 'silver-round',
      accentLineColor: '#0ea5e9',
      materialFinish: 'Satin Etched Safety Glass'
    },
    textConfig: {
      houseName: {
        fontFamily: 'sans',
        fontSizeClass: 'text-2xl sm:text-3xl font-extrabold',
        fontWeight: 'font-bold',
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        color: '#0f172a'
      },
      proprietor: {
        fontFamily: 'sans',
        fontSizeClass: 'text-xs sm:text-sm font-medium',
        fontWeight: 'font-semibold',
        prefix: 'Owner:',
        color: '#1e293b'
      },
      address: {
        fontFamily: 'sans',
        fontSizeClass: 'text-[11px] sm:text-xs',
        color: '#475569'
      },
      holdingNumber: {
        fontFamily: 'mono',
        fontSizeClass: 'text-xs sm:text-sm font-bold',
        badgeStyle: true,
        prefix: 'Holding:',
        color: '#0369a1'
      }
    },
    editableFields: ['houseName', 'proprietor', 'address', 'holdingNumber'],
    defaultValues: {
      houseName: 'The Khan Manor',
      proprietor: 'Engr. Tariqul Islam Khan',
      address: 'Road 54, Gulshan-2, Dhaka',
      holdingNumber: '19/G'
    },
    createdAt: '2026-01-22'
  },
  {
    id: 'tpl-heritage-rosewood',
    name: 'Heritage Rosewood & Gold Trim',
    category: 'Traditional Heritage',
    supportedSizes: ['5:3', '4:3'],
    thumbnail: '/templates/heritage-rosewood.png',
    description: 'Deep Indian rosewood grain finish adorned with baroque gold corner brackets and engraved serif typography.',
    material: 'Solid Indian Rosewood with Brass Corner Caps',
    priceStartingAt: 3600,
    badge: 'Featured',
    style: {
      background: 'linear-gradient(135deg, #2b110b 0%, #451a11 50%, #200a06 100%)',
      borderColor: '#b45309',
      borderWidth: '2px',
      borderRadius: '8px',
      boxShadow: '0 20px 30px -10px rgba(0,0,0,0.8), inset 0 2px 4px rgba(251,191,36,0.2)',
      standoffScrewType: 'gold-cap',
      accentLineColor: '#f59e0b',
      materialFinish: 'Hand-Polished Rosewood'
    },
    textConfig: {
      houseName: {
        fontFamily: 'serif',
        fontSizeClass: 'text-2xl sm:text-3xl',
        fontWeight: 'font-bold',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: '#fef3c7'
      },
      proprietor: {
        fontFamily: 'serif',
        fontSizeClass: 'text-xs sm:text-sm italic',
        fontWeight: 'font-medium',
        prefix: 'Family of:',
        color: '#fde68a'
      },
      address: {
        fontFamily: 'serif',
        fontSizeClass: 'text-[11px] sm:text-xs',
        color: '#fef08a'
      },
      holdingNumber: {
        fontFamily: 'mono',
        fontSizeClass: 'text-xs sm:text-sm font-bold',
        badgeStyle: false,
        prefix: 'Holding:',
        color: '#f59e0b'
      }
    },
    editableFields: ['houseName', 'proprietor', 'address', 'holdingNumber'],
    defaultValues: {
      houseName: 'Siddique Heritage',
      proprietor: 'Alhaj Abu Bakr Siddique',
      address: 'Shahjalal Upashahar, Sylhet',
      holdingNumber: 'Block D, #45'
    },
    createdAt: '2026-01-25'
  },
  {
    id: 'tpl-sylhet-slate',
    name: 'Sylhet Slate & Gilded Gold',
    category: 'Royal Brass & Slate',
    supportedSizes: ['5:3', '4:2'],
    thumbnail: '/templates/sylhet-slate.png',
    description: 'Textured charcoal slate rock facade with hand-gilded 24K gold foil carved letterings and industrial matte fixings.',
    material: 'Natural Riven Stone Slate + Gold Leaf Lacquer',
    priceStartingAt: 3100,
    style: {
      background: 'linear-gradient(135deg, #1e2229 0%, #15181e 50%, #0f1115 100%)',
      borderColor: 'rgba(217, 119, 6, 0.4)',
      borderWidth: '1px',
      borderRadius: '6px',
      boxShadow: '0 25px 35px -10px rgba(0,0,0,0.7)',
      standoffScrewType: 'black-hex',
      accentLineColor: '#d97706',
      materialFinish: 'Textured Natural Slate'
    },
    textConfig: {
      houseName: {
        fontFamily: 'serif',
        fontSizeClass: 'text-2xl sm:text-3xl font-bold',
        fontWeight: 'font-bold',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: '#fbbf24'
      },
      proprietor: {
        fontFamily: 'sans',
        fontSizeClass: 'text-xs sm:text-sm',
        fontWeight: 'font-medium',
        prefix: 'Proprietor:',
        color: '#e2e8f0'
      },
      address: {
        fontFamily: 'sans',
        fontSizeClass: 'text-[11px] sm:text-xs',
        color: '#94a3b8'
      },
      holdingNumber: {
        fontFamily: 'mono',
        fontSizeClass: 'text-xs sm:text-sm font-bold',
        badgeStyle: true,
        prefix: 'Holding:',
        color: '#f59e0b'
      }
    },
    editableFields: ['houseName', 'proprietor', 'address', 'holdingNumber'],
    defaultValues: {
      houseName: 'Green View Villa',
      proprietor: 'Prof. Masudur Rahman',
      address: 'Zindabazar Main Road, Sylhet',
      holdingNumber: '107'
    },
    createdAt: '2026-01-28'
  },
  {
    id: 'tpl-uttara-backlit',
    name: 'Uttara Architectural Backlit Glow',
    category: 'Modern Acrylic',
    supportedSizes: ['5:3', '4:2'],
    thumbnail: '/templates/uttara-backlit.png',
    description: 'Double tier matte graphite faceplate with hidden amber halo warm backlight glow effect and laser stencil cutouts.',
    material: 'Matte Composite + Amber LED Diffuser Backplate',
    priceStartingAt: 3800,
    badge: 'New',
    style: {
      background: 'radial-gradient(circle at center, #262626 0%, #171717 100%)',
      borderColor: '#f59e0b',
      borderWidth: '1px',
      borderRadius: '12px',
      boxShadow: '0 0 25px rgba(245, 158, 11, 0.35), 0 20px 30px rgba(0,0,0,0.8)',
      standoffScrewType: 'brass-round',
      accentLineColor: '#f59e0b',
      glowEffect: '0 0 15px rgba(245, 158, 11, 0.4)',
      materialFinish: 'Matte Powder-Coat with Amber Glow'
    },
    textConfig: {
      houseName: {
        fontFamily: 'sans',
        fontSizeClass: 'text-2xl sm:text-3xl font-black',
        fontWeight: 'font-bold',
        textTransform: 'uppercase',
        letterSpacing: '0.16em',
        color: '#ffffff'
      },
      proprietor: {
        fontFamily: 'sans',
        fontSizeClass: 'text-xs sm:text-sm font-semibold',
        fontWeight: 'font-semibold',
        prefix: 'Proprietor:',
        color: '#fef08a'
      },
      address: {
        fontFamily: 'sans',
        fontSizeClass: 'text-[11px] sm:text-xs',
        color: '#cbd5e1'
      },
      holdingNumber: {
        fontFamily: 'mono',
        fontSizeClass: 'text-xs sm:text-sm font-bold',
        badgeStyle: true,
        prefix: 'Sector/Hold:',
        color: '#f59e0b'
      }
    },
    editableFields: ['houseName', 'proprietor', 'address', 'holdingNumber'],
    defaultValues: {
      houseName: 'The Hasan Residence',
      proprietor: 'Kamrul Hasan & Family',
      address: 'Sector 4, Road 18, Uttara, Dhaka',
      holdingNumber: 'Plot 42'
    },
    createdAt: '2026-02-01'
  },
  {
    id: 'tpl-bismillah-heritage',
    name: 'Bismillah Calligraphy Heritage',
    category: 'Traditional Heritage',
    supportedSizes: ['5:3', '4:3'],
    thumbnail: '/templates/bismillah-heritage.png',
    description: 'Islamic arabesque geometric filigree borders with top Bismillah emblem in shimmering gold mirror over dark walnut timber.',
    material: 'Rich Walnut Finish & Precision Golden Inlays',
    priceStartingAt: 2950,
    badge: 'Popular',
    style: {
      background: 'linear-gradient(135deg, #2d1810 0%, #432418 50%, #1f100a 100%)',
      borderColor: '#d4af37',
      borderWidth: '2px',
      borderRadius: '10px',
      boxShadow: '0 20px 30px -10px rgba(0,0,0,0.7), inset 0 0 10px rgba(212,175,55,0.15)',
      standoffScrewType: 'gold-cap',
      accentLineColor: '#d4af37',
      materialFinish: 'Walnut Grain with Islamic Arabesque Border'
    },
    textConfig: {
      houseName: {
        fontFamily: 'serif',
        fontSizeClass: 'text-2xl sm:text-3xl font-bold',
        fontWeight: 'font-bold',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: '#fef3c7'
      },
      proprietor: {
        fontFamily: 'serif',
        fontSizeClass: 'text-xs sm:text-sm italic',
        fontWeight: 'font-medium',
        prefix: 'Resident:',
        color: '#fde68a'
      },
      address: {
        fontFamily: 'sans',
        fontSizeClass: 'text-[11px] sm:text-xs',
        color: '#e2e8f0'
      },
      holdingNumber: {
        fontFamily: 'mono',
        fontSizeClass: 'text-xs sm:text-sm font-bold',
        badgeStyle: true,
        prefix: 'Holding:',
        color: '#d4af37'
      }
    },
    editableFields: ['houseName', 'proprietor', 'address', 'holdingNumber'],
    defaultValues: {
      houseName: 'Baitun Noor',
      proprietor: 'Al-Haj Maulana Abdullah',
      address: 'Lalbagh Road, Old Dhaka',
      holdingNumber: 'Holding 8/2'
    },
    createdAt: '2026-02-05'
  },
  {
    id: 'tpl-nordic-ash',
    name: 'Nordic Ash & Crisp White',
    category: 'Classic Wood',
    supportedSizes: ['5:3', '4:2', '4:3'],
    thumbnail: '/templates/nordic-ash.png',
    description: 'Subtle light Scandinavian ash wood grain panel with laser-contoured pure white 3D letterings and brushed silver fittings.',
    material: 'Natural Blonde Ash Wood & Pure White Cast Acrylic',
    priceStartingAt: 2750,
    style: {
      background: 'linear-gradient(135deg, #d9cfbe 0%, #ede6d9 50%, #c4b59f 100%)',
      borderColor: '#bcaaa4',
      borderWidth: '1px',
      borderRadius: '10px',
      boxShadow: '0 16px 28px -10px rgba(80,60,40,0.3)',
      standoffScrewType: 'silver-round',
      accentLineColor: '#5d4037',
      materialFinish: 'Satin Blonde Ash'
    },
    textConfig: {
      houseName: {
        fontFamily: 'sans',
        fontSizeClass: 'text-2xl sm:text-3xl font-extrabold',
        fontWeight: 'font-bold',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: '#3e2723'
      },
      proprietor: {
        fontFamily: 'sans',
        fontSizeClass: 'text-xs sm:text-sm font-semibold',
        fontWeight: 'font-semibold',
        prefix: 'Family:',
        color: '#4e342e'
      },
      address: {
        fontFamily: 'sans',
        fontSizeClass: 'text-[11px] sm:text-xs font-medium',
        color: '#5d4037'
      },
      holdingNumber: {
        fontFamily: 'mono',
        fontSizeClass: 'text-xs sm:text-sm font-bold',
        badgeStyle: true,
        prefix: 'No:',
        color: '#ffffff'
      }
    },
    editableFields: ['houseName', 'proprietor', 'address', 'holdingNumber'],
    defaultValues: {
      houseName: 'The Sen Residence',
      proprietor: 'Dr. Debabrata Sen & Family',
      address: 'Mymensingh Road, Shahi Eidgah',
      holdingNumber: 'House 56'
    },
    createdAt: '2026-02-10'
  },
  {
    id: 'tpl-industrial-titanium',
    name: 'Industrial Brushed Titanium',
    category: 'Royal Brass & Slate',
    supportedSizes: ['5:3', '4:2'],
    thumbnail: '/templates/brushed-titanium.png',
    description: 'Anodized brushed titanium plate with CNC micro-grooves, recessed industrial typography, and knurled socket screws.',
    material: 'Aerospace Grade 3mm Anodized Alloy',
    priceStartingAt: 3400,
    style: {
      background: 'linear-gradient(135deg, #475569 0%, #334155 50%, #1e293b 100%)',
      borderColor: '#94a3b8',
      borderWidth: '1.5px',
      borderRadius: '6px',
      boxShadow: '0 20px 30px -10px rgba(15,23,42,0.6), inset 0 1px 0 rgba(255,255,255,0.2)',
      standoffScrewType: 'black-hex',
      accentLineColor: '#38bdf8',
      materialFinish: 'Brushed Titanium Finish'
    },
    textConfig: {
      houseName: {
        fontFamily: 'mono',
        fontSizeClass: 'text-2xl sm:text-3xl font-black',
        fontWeight: 'font-bold',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        color: '#f8fafc'
      },
      proprietor: {
        fontFamily: 'sans',
        fontSizeClass: 'text-xs sm:text-sm tracking-wide',
        fontWeight: 'font-semibold',
        prefix: 'Proprietor:',
        color: '#93c5fd'
      },
      address: {
        fontFamily: 'mono',
        fontSizeClass: 'text-[11px] sm:text-xs',
        color: '#cbd5e1'
      },
      holdingNumber: {
        fontFamily: 'mono',
        fontSizeClass: 'text-xs sm:text-sm font-bold',
        badgeStyle: true,
        prefix: 'Holding:',
        color: '#38bdf8'
      }
    },
    editableFields: ['houseName', 'proprietor', 'address', 'holdingNumber'],
    defaultValues: {
      houseName: 'The Apex House',
      proprietor: 'Engr. Farhan Zaman',
      address: 'Baridhara Diplomatic Zone, Dhaka',
      holdingNumber: 'Block 2, #14'
    },
    createdAt: '2026-02-14'
  },
  {
    id: 'tpl-emerald-palace',
    name: 'Emerald Palace Royal Brass',
    category: 'Royal Brass & Slate',
    supportedSizes: ['5:3', '4:3'],
    thumbnail: '/templates/emerald-palace.png',
    description: 'Deep royal British emerald lacquer with mirror brass border pinstriping and grand serif engraved lettering.',
    material: 'Mirror Polished Brass on High-Lustre Emerald Plate',
    priceStartingAt: 3350,
    badge: 'New',
    style: {
      background: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #022c22 100%)',
      borderColor: '#fbbf24',
      borderWidth: '2px',
      borderRadius: '10px',
      boxShadow: '0 20px 35px -10px rgba(2,44,34,0.7)',
      standoffScrewType: 'brass-round',
      accentLineColor: '#fbbf24',
      materialFinish: 'Emerald Lacquer & Brass Trim'
    },
    textConfig: {
      houseName: {
        fontFamily: 'serif',
        fontSizeClass: 'text-2xl sm:text-3xl font-bold',
        fontWeight: 'font-bold',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: '#fef3c7'
      },
      proprietor: {
        fontFamily: 'serif',
        fontSizeClass: 'text-xs sm:text-sm italic',
        fontWeight: 'font-medium',
        prefix: 'Resident:',
        color: '#fde68a'
      },
      address: {
        fontFamily: 'sans',
        fontSizeClass: 'text-[11px] sm:text-xs',
        color: '#a7f3d0'
      },
      holdingNumber: {
        fontFamily: 'mono',
        fontSizeClass: 'text-xs sm:text-sm font-bold',
        badgeStyle: true,
        prefix: 'Holding:',
        color: '#fbbf24'
      }
    },
    editableFields: ['houseName', 'proprietor', 'address', 'holdingNumber'],
    defaultValues: {
      houseName: 'Zahir Manzil',
      proprietor: 'Justice S. M. Zahirul Haque',
      address: 'Eskaton Garden Road, Ramna, Dhaka',
      holdingNumber: 'Holding 31'
    },
    createdAt: '2026-02-18'
  },
  {
    id: 'tpl-banani-matte',
    name: 'Banani Monolith Matte Black',
    category: 'Modern Acrylic',
    supportedSizes: ['5:3', '4:2', '4:3'],
    thumbnail: '/templates/banani-matte.png',
    description: 'Minimalist zero-glare matte charcoal composite with ultra-crisp laser etched white architectural typography.',
    material: 'Non-Reflective Matte Poly-Composite 6mm',
    priceStartingAt: 2300,
    badge: 'Best Value',
    style: {
      background: '#18181b',
      borderColor: '#3f3f46',
      borderWidth: '1px',
      borderRadius: '8px',
      boxShadow: '0 20px 30px -10px rgba(0,0,0,0.6)',
      standoffScrewType: 'black-hex',
      accentLineColor: '#52525b',
      materialFinish: 'Zero-Glare Matte Finish'
    },
    textConfig: {
      houseName: {
        fontFamily: 'sans',
        fontSizeClass: 'text-2xl sm:text-3xl font-extrabold',
        fontWeight: 'font-bold',
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        color: '#fafafa'
      },
      proprietor: {
        fontFamily: 'sans',
        fontSizeClass: 'text-xs sm:text-sm font-semibold',
        fontWeight: 'font-semibold',
        prefix: 'Proprietor:',
        color: '#d4d4d8'
      },
      address: {
        fontFamily: 'sans',
        fontSizeClass: 'text-[11px] sm:text-xs',
        color: '#a1a1aa'
      },
      holdingNumber: {
        fontFamily: 'mono',
        fontSizeClass: 'text-xs sm:text-sm font-bold',
        badgeStyle: false,
        prefix: 'Hold:',
        color: '#ffffff'
      }
    },
    editableFields: ['houseName', 'proprietor', 'address', 'holdingNumber'],
    defaultValues: {
      houseName: 'The Karim Residence',
      proprietor: 'Ar. Nabil Karim',
      address: 'Road 11, Block D, Banani, Dhaka',
      holdingNumber: 'House 88'
    },
    createdAt: '2026-02-22'
  },
  {
    id: 'tpl-vintage-bronze',
    name: 'Vintage Estate Weathered Bronze',
    category: 'Traditional Heritage',
    supportedSizes: ['5:3', '4:3'],
    thumbnail: '/templates/vintage-bronze.png',
    description: 'Classical weathered cast bronze antique patina with 3D raised border frame and antique gilded numbers.',
    material: 'Hand-Cast Antiqued Bronze Resin Composite',
    priceStartingAt: 3500,
    style: {
      background: 'linear-gradient(135deg, #27201c 0%, #3e332c 50%, #201a16 100%)',
      borderColor: '#8d7b68',
      borderWidth: '2.5px',
      borderRadius: '8px',
      boxShadow: '0 25px 35px -10px rgba(20,15,10,0.8), inset 0 2px 4px rgba(255,255,255,0.06)',
      standoffScrewType: 'brass-round',
      accentLineColor: '#a79277',
      materialFinish: 'Antique Bronze Relief'
    },
    textConfig: {
      houseName: {
        fontFamily: 'serif',
        fontSizeClass: 'text-2xl sm:text-3xl font-bold',
        fontWeight: 'font-bold',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: '#f1dec9'
      },
      proprietor: {
        fontFamily: 'serif',
        fontSizeClass: 'text-xs sm:text-sm italic',
        fontWeight: 'font-medium',
        prefix: 'Owned by:',
        color: '#d0b8a8'
      },
      address: {
        fontFamily: 'sans',
        fontSizeClass: 'text-[11px] sm:text-xs',
        color: '#c8b6a6'
      },
      holdingNumber: {
        fontFamily: 'mono',
        fontSizeClass: 'text-xs sm:text-sm font-bold',
        badgeStyle: true,
        prefix: 'Holding:',
        color: '#d0b8a8'
      }
    },
    editableFields: ['houseName', 'proprietor', 'address', 'holdingNumber'],
    defaultValues: {
      houseName: 'Anandadhara Estate',
      proprietor: 'Mr. & Mrs. R. K. Majumder',
      address: 'Shahbagh Heritage Lane, Dhaka',
      holdingNumber: 'Estate #7'
    },
    createdAt: '2026-02-25'
  },
  {
    id: 'tpl-duotone-navy',
    name: 'Contemporary Duotone Navy & Frost',
    category: 'Contemporary Glass',
    supportedSizes: ['5:3', '4:2'],
    thumbnail: '/templates/duotone-navy.png',
    description: 'Split dual-tone architectural panel featuring deep navy matte paired with frosted glass edge and metallic gold accents.',
    material: 'Midnight Navy Poly-Board & Frosted Acrylic Layer',
    priceStartingAt: 2650,
    badge: 'New',
    style: {
      background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 65%, rgba(248,250,252,0.15) 65%, rgba(248,250,252,0.25) 100%)',
      borderColor: 'rgba(56, 189, 248, 0.4)',
      borderWidth: '1px',
      borderRadius: '12px',
      boxShadow: '0 20px 35px -10px rgba(15,23,42,0.6)',
      standoffScrewType: 'silver-round',
      accentLineColor: '#38bdf8',
      materialFinish: 'Duotone Acrylic Composite'
    },
    textConfig: {
      houseName: {
        fontFamily: 'sans',
        fontSizeClass: 'text-2xl sm:text-3xl font-extrabold',
        fontWeight: 'font-bold',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: '#f8fafc'
      },
      proprietor: {
        fontFamily: 'sans',
        fontSizeClass: 'text-xs sm:text-sm font-semibold',
        fontWeight: 'font-semibold',
        prefix: 'Proprietor:',
        color: '#38bdf8'
      },
      address: {
        fontFamily: 'sans',
        fontSizeClass: 'text-[11px] sm:text-xs',
        color: '#94a3b8'
      },
      holdingNumber: {
        fontFamily: 'mono',
        fontSizeClass: 'text-xs sm:text-sm font-bold',
        badgeStyle: true,
        prefix: 'Holding:',
        color: '#ffffff'
      }
    },
    editableFields: ['houseName', 'proprietor', 'address', 'holdingNumber'],
    defaultValues: {
      houseName: 'The Haque Residence',
      proprietor: 'Dr. Imtiaz Haque',
      address: 'Bashundhara R/A, Block C, Dhaka',
      holdingNumber: 'Plot 104'
    },
    createdAt: '2026-03-01'
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
