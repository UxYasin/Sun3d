'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { MOCK_TEMPLATES } from '@/data/mock-templates';
import { NameplatePreview } from '@/components/nameplate/NameplatePreview';
import { OrderReviewModal } from '@/components/editor/OrderReviewModal';
import { PaymentInstructionsModal } from '@/components/orders/PaymentInstructionsModal';
import { OrderStoreService } from '@/lib/order-store';
import {
  Template,
  NameplateSize,
  NameplateDesignState,
  CustomerOrder,
  TypographyConfig,
  ColorConfig
} from '@/types/nameplate';
import {
  ArrowLeft,
  Maximize2,
  RotateCcw,
  Type,
  Palette,
  Layers,
  Ruler,
  ZoomIn,
  ZoomOut,
  X
} from 'lucide-react';

const COLOR_PRESETS = [
  { name: 'গোল্ডেন মিরর (Gold)', value: '#f6d365', bg: 'bg-[#f6d365]' },
  { name: 'ডায়মন্ড হোয়াইট (White)', value: '#ffffff', bg: 'bg-white' },
  { name: 'ওয়ার্ম অ্যাম্বার (Amber)', value: '#fbbf24', bg: 'bg-amber-400' },
  { name: 'প্লাটিনাম সিলভার (Silver)', value: '#e2e8f0', bg: 'bg-slate-200' },
  { name: 'রোজ গোল্ড (Rose)', value: '#fda4af', bg: 'bg-rose-300' },
  { name: 'জেট ব্ল্যাক (Black)', value: '#0f172a', bg: 'bg-slate-900' }
];

function EditorMain() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const queryTemplateId = searchParams.get('templateId');
  const querySize = searchParams.get('size') as NameplateSize | null;
  const queryDesignId = searchParams.get('designId');

  const [activeTemplate, setActiveTemplate] = useState<Template>(MOCK_TEMPLATES[0]);
  const [activeTab, setActiveTab] = useState<'text' | 'templates' | 'colors' | 'size'>('text');
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Modals
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeCreatedOrder, setActiveCreatedOrder] = useState<CustomerOrder | null>(null);

  // Unified Design State
  const [designState, setDesignState] = useState<NameplateDesignState>({
    templateId: 'tpl-obsidian-gold',
    size: '5:3',
    houseName: 'রহমান ভিলা',
    proprietor: 'মো: আনিসুর রহমান',
    address: 'বাড়ি ২৪, রোড ৭, ধানমন্ডি, ঢাকা',
    holdingNumber: '১২/এ',
    typography: {
      fontFamily: 'serif',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSizeScale: 'standard'
    },
    colors: {
      textColor: '#f6d365',
      accentColor: '#d4af37'
    }
  });

  // Load template from URL or local storage
  useEffect(() => {
    let resolvedTemplateId = queryTemplateId;
    let resolvedSize = querySize;

    if (typeof window !== 'undefined') {
      if (!resolvedTemplateId) {
        resolvedTemplateId = localStorage.getItem('sun3d_selected_template_id');
      }
      if (!resolvedSize) {
        resolvedSize = localStorage.getItem('sun3d_selected_size') as NameplateSize | null;
      }
    }

    if (queryDesignId) {
      const existingDesign = OrderStoreService.getDesignById(queryDesignId);
      if (existingDesign) {
        resolvedTemplateId = existingDesign.templateId;
        resolvedSize = existingDesign.size;
        setDesignState({
          id: existingDesign.id,
          templateId: existingDesign.templateId,
          size: existingDesign.size,
          houseName: existingDesign.houseName,
          proprietor: existingDesign.proprietor,
          address: existingDesign.address,
          holdingNumber: existingDesign.holdingNumber,
          typography: existingDesign.typography || {
            fontFamily: 'serif',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSizeScale: 'standard'
          },
          colors: existingDesign.colors || {
            textColor: '#f6d365',
            accentColor: '#d4af37'
          }
        });
      }
    }

    const found = MOCK_TEMPLATES.find((t) => t.id === resolvedTemplateId) || MOCK_TEMPLATES[0];
    setActiveTemplate(found);

    const safeSize = resolvedSize && found.supportedSizes.includes(resolvedSize) ? resolvedSize : (found.supportedSizes[0] || '5:3');

    if (!queryDesignId) {
      setDesignState((prev) => ({
        ...prev,
        templateId: found.id,
        size: safeSize,
        houseName: prev.houseName || found.defaultValues.houseName,
        proprietor: prev.proprietor || found.defaultValues.proprietor,
        address: prev.address || found.defaultValues.address,
        holdingNumber: prev.holdingNumber || found.defaultValues.holdingNumber,
        colors: {
          textColor: found.textConfig.houseName.color,
          accentColor: found.textConfig.proprietor.color
        }
      }));
    }
  }, [queryTemplateId, querySize, queryDesignId]);

  const handleRatioChange = (newSize: NameplateSize) => {
    if (!activeTemplate.supportedSizes.includes(newSize)) return;
    setDesignState((prev) => ({ ...prev, size: newSize }));
  };

  const handleTemplateSwitch = (t: Template) => {
    setActiveTemplate(t);
    const safeSize = t.supportedSizes.includes(designState.size) ? designState.size : (t.supportedSizes[0] || '5:3');
    setDesignState((prev) => ({
      ...prev,
      templateId: t.id,
      size: safeSize,
      colors: {
        textColor: t.textConfig.houseName.color,
        accentColor: t.style.accentLineColor
      }
    }));
  };

  const handleSaveDraft = () => {
    if (!user) {
      router.push(`/login?redirect=/editor&templateId=${activeTemplate.id}&size=${designState.size}`);
      return;
    }

    OrderStoreService.saveDesign({
      userId: user.id,
      templateId: designState.templateId,
      size: designState.size,
      houseName: designState.houseName,
      proprietor: designState.proprietor,
      address: designState.address,
      holdingNumber: designState.holdingNumber,
      typography: designState.typography,
      colors: designState.colors
    });

    setSaveToast('ড্রাফট সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleOrderConfirmed = (order: CustomerOrder) => {
    setActiveCreatedOrder(order);
    setIsReviewModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden font-sans">
      {/* 1. Canva Studio Top Navigation Bar */}
      <header className="h-14 sm:h-16 bg-[#0f1015] text-white px-4 sm:px-6 flex items-center justify-between z-30 shrink-0 select-none">
        {/* Left: Back & Project Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            title="হোমে ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-white truncate max-w-[150px] sm:max-w-xs">
                {designState.houseName || 'আমার বাড়ির নেমপ্লেট'}
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full hidden sm:inline">
                ক্লাউডে সংরক্ষিত
              </span>
            </div>
            <p className="text-[10px] text-white/50 hidden sm:block">
              {activeTemplate.name} • {designState.size} রেশিও
            </p>
          </div>
        </div>

        {/* Center: Canva Ratio Selector Pills */}
        <div className="hidden md:flex items-center bg-white/10 p-1 rounded-full gap-1">
          {activeTemplate.supportedSizes.map((size) => (
            <button
              key={size}
              onClick={() => handleRatioChange(size)}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                designState.size === size
                  ? 'bg-white text-[#0f1015]'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {size} রেশিও
            </button>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleSaveDraft}
            className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            ড্রাফট সংরক্ষণ
          </button>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="btn-canva-pill btn-canva-primary px-5 py-2 text-xs sm:text-sm font-bold cursor-pointer"
          >
            অর্ডার করুন • ৳{activeTemplate.priceStartingAt.toLocaleString()}
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-18 right-6 z-50 bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-md animate-fade-in">
          {saveToast}
        </div>
      )}

      {/* 2. Main Studio Area: Left Sidebar + Flyout Panel + Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Vertical Icon Strip (Canva Left Bar) */}
        <div className="w-16 sm:w-18 bg-[#0f1015] border-r border-white/10 flex flex-col items-center py-4 gap-4 shrink-0 select-none">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Type className="w-5 h-5" />
            <span className="text-[9px] font-semibold mt-1">টেক্সট</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[9px] font-semibold mt-1">টেমপ্লেট</span>
          </button>

          <button
            onClick={() => setActiveTab('colors')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all cursor-pointer ${
              activeTab === 'colors'
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Palette className="w-5 h-5" />
            <span className="text-[9px] font-semibold mt-1">কালার</span>
          </button>

          <button
            onClick={() => setActiveTab('size')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all cursor-pointer ${
              activeTab === 'size'
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Ruler className="w-5 h-5" />
            <span className="text-[9px] font-semibold mt-1">সাইজ</span>
          </button>
        </div>

        {/* Flyout Control Panel (Flat, Minimal, 20px Rounded Inputs) */}
        <div className="w-80 sm:w-96 bg-white border-r border-neutral-200 flex flex-col shrink-0 overflow-y-auto">
          {/* Panel Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-950">
              {activeTab === 'text' && 'নেমপ্লেটের টেক্সট ও টাইপোগ্রাফি'}
              {activeTab === 'templates' && 'টেমপ্লেট পরিবর্তন করুন'}
              {activeTab === 'colors' && 'কালার ও ফিনিশিং'}
              {activeTab === 'size' && 'সাইজ ও অনুপাত'}
            </h3>
          </div>

          {/* Tab 1: Text & Content Inputs */}
          {activeTab === 'text' && (
            <div className="p-4 sm:p-5 space-y-4">
              {/* House Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  ১. বাড়ির নাম / শিরোনাম
                </label>
                <input
                  type="text"
                  value={designState.houseName}
                  onChange={(e) => setDesignState((prev) => ({ ...prev, houseName: e.target.value }))}
                  placeholder="যেমন: রহমান ভিলা বা The Chowdhury's"
                  className="w-full px-3.5 py-2.5 rounded-[12px] border border-neutral-300 text-sm focus:outline-none focus:border-[#8b3dff]"
                />
              </div>

              {/* Proprietor Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  ২. মালিক / প্রোপাইটরের নাম
                </label>
                <input
                  type="text"
                  value={designState.proprietor}
                  onChange={(e) => setDesignState((prev) => ({ ...prev, proprietor: e.target.value }))}
                  placeholder="যেমন: মো: আনিসুর রহমান"
                  className="w-full px-3.5 py-2.5 rounded-[12px] border border-neutral-300 text-sm focus:outline-none focus:border-[#8b3dff]"
                />
              </div>

              {/* Holding Number */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  ৩. হোল্ডিং / ফ্ল্যাট নম্বর
                </label>
                <input
                  type="text"
                  value={designState.holdingNumber}
                  onChange={(e) => setDesignState((prev) => ({ ...prev, holdingNumber: e.target.value }))}
                  placeholder="যেমন: ১২/এ অথবা ফ্ল্যাট ৩-বি"
                  className="w-full px-3.5 py-2.5 rounded-[12px] border border-neutral-300 text-sm focus:outline-none focus:border-[#8b3dff]"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  ৪. সম্পূর্ণ ঠিকানা
                </label>
                <input
                  type="text"
                  value={designState.address}
                  onChange={(e) => setDesignState((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="যেমন: রোড ৭, সেক্টর ৪, উত্তরা, ঢাকা"
                  className="w-full px-3.5 py-2.5 rounded-[12px] border border-neutral-300 text-sm focus:outline-none focus:border-[#8b3dff]"
                />
              </div>

              {/* Typography controls */}
              <div className="pt-4 border-t border-neutral-100">
                <label className="block text-xs font-bold text-neutral-800 mb-2">
                  ফন্ট স্টাইল:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['serif', 'sans', 'mono'] as const).map((font) => (
                    <button
                      key={font}
                      type="button"
                      onClick={() =>
                        setDesignState((prev) => ({
                          ...prev,
                          typography: { ...(prev.typography || { fontWeight: 'bold', textAlign: 'center', fontSizeScale: 'standard' }), fontFamily: font }
                        }))
                      }
                      className={`py-2 rounded-[10px] text-xs font-bold capitalize transition-all cursor-pointer ${
                        designState.typography?.fontFamily === font
                          ? 'bg-[#8b3dff] text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {font === 'serif' ? 'সেরিফ (Serif)' : font === 'sans' ? 'স্যান্স (Sans)' : 'মোনো (Mono)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alignment */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-neutral-800 mb-2">
                  অ্যালাইনমেন্ট:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['left', 'center', 'right'] as const).map((align) => (
                    <button
                      key={align}
                      type="button"
                      onClick={() =>
                        setDesignState((prev) => ({
                          ...prev,
                          typography: { ...(prev.typography || { fontFamily: 'serif', fontWeight: 'bold', fontSizeScale: 'standard' }), textAlign: align }
                        }))
                      }
                      className={`py-1.5 rounded-[10px] text-xs font-bold capitalize transition-all cursor-pointer ${
                        designState.typography?.textAlign === align
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {align === 'left' ? 'বাম' : align === 'center' ? 'মাঝখান' : 'ডান'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Template Selection */}
          {activeTab === 'templates' && (
            <div className="p-4 sm:p-5 space-y-3">
              <p className="text-xs text-neutral-500 mb-2">
                যেকোনো টেমপ্লেট বেছে নিন, আপনার লেখা সংরক্ষিত থাকবে:
              </p>
              {MOCK_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => handleTemplateSwitch(tpl)}
                  className={`p-3 rounded-[16px] border transition-all cursor-pointer flex items-center justify-between ${
                    activeTemplate.id === tpl.id
                      ? 'border-[#8b3dff] bg-[#faf5ff]'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">{tpl.name}</h4>
                    <p className="text-[10px] text-neutral-500">{tpl.material}</p>
                  </div>
                  <span className="text-xs font-bold text-[#8b3dff]">৳{tpl.priceStartingAt.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Colors & Finish */}
          {activeTab === 'colors' && (
            <div className="p-4 sm:p-5 space-y-4">
              <p className="text-xs text-neutral-500">
                ৩ডি লেটারিং ও প্রিমিয়াম সারফেস ফিনিশ নির্বাচন করুন:
              </p>
              <div className="space-y-2.5">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() =>
                      setDesignState((prev) => ({
                        ...prev,
                        colors: { textColor: color.value, accentColor: color.value }
                      }))
                    }
                    className={`w-full p-3 rounded-[16px] border flex items-center gap-3 transition-all cursor-pointer ${
                      designState.colors?.textColor === color.value
                        ? 'border-[#8b3dff] bg-[#faf5ff]'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full border border-neutral-300 ${color.bg}`} />
                    <span className="text-xs font-bold text-neutral-900">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Size & Dimensions */}
          {activeTab === 'size' && (
            <div className="p-4 sm:p-5 space-y-3">
              <p className="text-xs text-neutral-500 mb-2">
                এই টেমপ্লেটের সাপোর্টেড সাইজসমূহ:
              </p>
              {activeTemplate.supportedSizes.map((size) => (
                <div
                  key={size}
                  onClick={() => handleRatioChange(size)}
                  className={`p-4 rounded-[16px] border transition-all cursor-pointer ${
                    designState.size === size
                      ? 'border-[#8b3dff] bg-[#faf5ff]'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-neutral-900">{size} অনুপাত</span>
                    {designState.size === size && (
                      <span className="text-xs font-bold text-[#8b3dff]">সিলেক্টেড</span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    {size === '5:3' && '১৫" × ৯" • বাউন্ডারি গেট ও মূল প্রবেশদ্বার'}
                    {size === '4:2' && '১৬" × ৮" • ডোর হেডার ও প্যানোরামিক ভিউ'}
                    {size === '4:3' && '১২" × ৯" • ফ্ল্যাটের দরজা ও কমপ্যাক্ট দেয়াল'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Main Workshop Canvas Viewport (70-75%) */}
        <div className="flex-1 bg-[#f8f9fa] relative flex items-center justify-center p-6 sm:p-12 overflow-auto">
          {/* Realistic Nameplate Live Simulation */}
          <div
            className="w-full max-w-2xl transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <NameplatePreview
              template={activeTemplate}
              size={designState.size}
              customValues={designState}
            />
          </div>

          {/* Canvas Floating Bottom Controls (Zoom & Fullscreen) */}
          <div className="absolute bottom-6 right-6 flex items-center bg-white border border-neutral-200 rounded-full p-1 shadow-xs gap-1 select-none">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(0.7, prev - 0.1))}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold px-2 text-neutral-700">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(1.4, prev + 0.1))}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-neutral-200 mx-1" />
            <button
              onClick={() => setZoomLevel(1)}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreenPreview(true)}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
              title="Fullscreen Preview"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {isFullscreenPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="relative w-full max-w-4xl flex flex-col items-center">
            <button
              onClick={() => setIsFullscreenPreview(false)}
              className="absolute -top-12 right-0 text-white font-bold text-sm bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 cursor-pointer"
            >
              ✕ বন্ধ করুন
            </button>
            <NameplatePreview
              template={activeTemplate}
              size={designState.size}
              customValues={designState}
            />
          </div>
        </div>
      )}

      {/* Order Review Modal */}
      {user && (
        <OrderReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          template={activeTemplate}
          designState={designState}
          user={user}
          onOrderConfirmed={handleOrderConfirmed}
        />
      )}

      {/* Payment Modal */}
      <PaymentInstructionsModal
        isOpen={isPaymentModalOpen}
        order={activeCreatedOrder}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold">লোড হচ্ছে...</div>}>
      <EditorMain />
    </Suspense>
  );
}
