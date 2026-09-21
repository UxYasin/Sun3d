'use client';

import React, { useState, useMemo } from 'react';
import { Template, NameplateSize } from '@/types/nameplate';
import { MOCK_TEMPLATES } from '@/data/mock-templates';
import { TemplateCard } from '@/components/home/TemplateCard';
import { TemplateDetailModal } from '@/components/home/TemplateDetailModal';
import { Search } from 'lucide-react';

interface TemplateGalleryProps {
  onStartCustomization: (template: Template, size: NameplateSize) => void;
}

export function TemplateGallery({ onStartCustomization }: TemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('All');

  // Detail Modal State (Canva Screenshot 4)
  const [detailTemplate, setDetailTemplate] = useState<Template | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Category labels in natural Bengali
  const categories = [
    { id: 'All', label: 'সব টেমপ্লেট' },
    { id: 'Modern', label: 'মডার্ন এক্রিলিক' },
    { id: 'Natural', label: 'সলিড সেগুন কাঠ' },
    { id: 'Heritage', label: 'হেরিটেজ ও ব্রাস' },
    { id: 'Minimal', label: 'মিনিমালিস্ট' },
    { id: 'Marble', label: 'মার্বেল ও স্টোন' }
  ];

  // Filtering Logic
  const filteredTemplates = useMemo(() => {
    return MOCK_TEMPLATES.filter((template) => {
      if (selectedCategory !== 'All' && template.category !== selectedCategory) {
        return false;
      }
      if (selectedSizeFilter !== 'All' && !template.supportedSizes.includes(selectedSizeFilter as NameplateSize)) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = template.name.toLowerCase().includes(query);
        const matchesDesc = template.description.toLowerCase().includes(query);
        const matchesMat = template.material.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesMat) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedSizeFilter]);

  const handleCardClick = (template: Template, size: NameplateSize) => {
    setDetailTemplate(template);
    setIsDetailOpen(true);
  };

  const handleModalCustomize = (template: Template, size: NameplateSize) => {
    setIsDetailOpen(false);
    onStartCustomization(template, size);
  };

  const handleStartDesigningFast = () => {
    const defaultTemplate = MOCK_TEMPLATES[0];
    onStartCustomization(defaultTemplate, '5:3');
  };

  return (
    <section id="templates" className="py-16 sm:py-24 bg-[#ffffff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading matching Canva Screenshot 3 */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950 font-sans">
            Templates for absolutely anything
          </h2>
          <p className="mt-3 text-lg sm:text-xl text-neutral-600 font-medium">
            সব ধরনের বাড়ির জন্য আকর্ষণীয় রেডিমেড ৩ডি টেমপ্লেট
          </p>

          {/* Action Buttons directly under heading (Canva Screenshot 3) */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleStartDesigningFast}
              className="btn-canva-pill btn-canva-primary px-6 py-2.5 text-sm sm:text-base font-bold cursor-pointer"
            >
              Start designing for free • বিনামূল্যে ডিজাইন শুরু করুন
            </button>
            <a
              href="#templates"
              className="btn-canva-pill btn-canva-outline px-6 py-2.5 text-sm sm:text-base font-semibold"
            >
              Browse all templates • সব টেমপ্লেট দেখুন
            </a>
          </div>
        </div>

        {/* Filter Controls Bar - Clean, flat, no shadows */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-neutral-100">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#8b3dff] text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box - Flat, clean */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="টেমপ্লেট খুঁজুন (কাঠ, এক্রিলিক, মার্বেল)..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-full text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-[#8b3dff]"
            />
          </div>
        </div>

        {/* Ratio Selector Filter Pills */}
        <div className="mt-4 flex items-center gap-2 text-xs text-neutral-600">
          <span className="font-semibold text-neutral-900">অনুপাত / রেশিও ফিল্টার:</span>
          {['All', '5:3', '4:2', '4:3'].map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSizeFilter(size)}
              className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                selectedSizeFilter === size
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {size === 'All' ? 'সকল সাইজ' : `${size} সাইজ`}
            </button>
          ))}
          <span className="ml-auto text-neutral-500 font-medium">
            মোট {filteredTemplates.length}টি টেমপ্লেট
          </span>
        </div>

        {/* Template Cards Grid - 20px rounded, flat */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={handleCardClick}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-16 bg-neutral-50 rounded-[24px] border border-neutral-200">
            <p className="text-base font-semibold text-neutral-700">কোন টেমপ্লেট খুঁজে পাওয়া যায়নি</p>
            <p className="text-xs text-neutral-500 mt-1">দয়া করে অন্য কোনো ক্যাটাগরি বা নাম দিয়ে চেষ্টা করুন।</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedSizeFilter('All');
              }}
              className="mt-4 px-4 py-2 rounded-full text-xs font-semibold bg-[#8b3dff] text-white cursor-pointer"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        )}
      </div>

      {/* Canva Detail Modal (Screenshot 4) */}
      <TemplateDetailModal
        template={detailTemplate}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onCustomize={handleModalCustomize}
      />
    </section>
  );
}
