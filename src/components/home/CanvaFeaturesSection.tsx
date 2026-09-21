'use client';

import React, { useState } from 'react';

interface CanvaFeaturesSectionProps {
  onExploreClick: () => void;
}

export function CanvaFeaturesSection({ onExploreClick }: CanvaFeaturesSectionProps) {
  const [activeTab, setActiveTab] = useState<'acrylic' | 'teak' | 'marble' | 'villa'>('acrylic');

  return (
    <section id="features" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Canva Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950 font-sans">
            Tools to power your best work
          </h2>
          <p className="mt-3 text-lg sm:text-xl text-neutral-600 font-medium">
            আপনার স্বপ্নের বাড়ির জন্য তৈরি করুন প্রিমিয়াম নেমপ্লেট
          </p>
        </div>

        {/* Canva Pill Category Switcher */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center p-1.5 rounded-full bg-neutral-100 border border-neutral-200 gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('acrylic')}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'acrylic'
                  ? 'bg-[#8b3dff] text-white'
                  : 'text-neutral-700 hover:text-neutral-950'
              }`}
            >
              এক্রিলিক ৩ডি
            </button>
            <button
              onClick={() => setActiveTab('teak')}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'teak'
                  ? 'bg-[#8b3dff] text-white'
                  : 'text-neutral-700 hover:text-neutral-950'
              }`}
            >
              সলিড সেগুন কাঠ
            </button>
            <button
              onClick={() => setActiveTab('marble')}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'marble'
                  ? 'bg-[#8b3dff] text-white'
                  : 'text-neutral-700 hover:text-neutral-950'
              }`}
            >
              মার্বেল ও স্টোন
            </button>
            <button
              onClick={() => setActiveTab('villa')}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'villa'
                  ? 'bg-[#8b3dff] text-white'
                  : 'text-neutral-700 hover:text-neutral-950'
              }`}
            >
              ভিলা ও ডুপ্লেক্স
            </button>
          </div>
        </div>

        {/* 2 Bold Rounded Cards (Matching Canva Screenshot 2) */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Purple Gradient Card */}
          <div className="rounded-[24px] bg-gradient-to-br from-[#8b3dff] via-[#9e54ff] to-[#b374ff] text-white p-8 sm:p-12 flex flex-col justify-between min-h-[380px] relative overflow-hidden">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider mb-4">
                লাইভ ডিজাইন এডিটর
              </span>
              <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                সহজে আপনার বাড়ির নামপ্লেট সাজান
              </h3>
              <p className="mt-3 text-sm sm:text-base text-white/90 max-w-md font-normal leading-relaxed">
                কোন গ্রাফিক্স অভিজ্ঞতার প্রয়োজন নেই। টাইপ করলেই স্ক্রিনে সাথে সাথে ৩ডি প্রিভিউ ফুটে উঠবে।
              </p>
            </div>

            <div className="mt-8">
              <button
                onClick={onExploreClick}
                className="btn-canva-pill btn-canva-white px-6 py-2.5 text-sm font-bold text-neutral-950 cursor-pointer"
              >
                Explore Templates
              </button>
            </div>
          </div>

          {/* Card 2: Coral / Red Gradient Card */}
          <div className="rounded-[24px] bg-gradient-to-br from-[#ff5436] via-[#ff6a48] to-[#ff855f] text-white p-8 sm:p-12 flex flex-col justify-between min-h-[380px] relative overflow-hidden">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider mb-4">
                প্রিমিয়াম ম্যানুফ্যাকচারিং
              </span>
              <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                পছন্দের ম্যাটেরিয়াল ও কালার নির্বাচন করুন
              </h3>
              <p className="mt-3 text-sm sm:text-base text-white/90 max-w-md font-normal leading-relaxed">
                ১০০% ওয়েদারপ্রুফ এক্রিলিক, সলিড সেগুন কাঠ ও গোল্ডেন মিরর। সাথে ফ্রি এস এস স্ট্যান্ডঅফ স্ক্রু।
              </p>
            </div>

            <div className="mt-8">
              <button
                onClick={onExploreClick}
                className="btn-canva-pill btn-canva-white px-6 py-2.5 text-sm font-bold text-neutral-950 cursor-pointer"
              >
                Explore Materials
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
