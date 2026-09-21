'use client';

import React from 'react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onSelectTemplate: (templateId: string) => void;
}

export function HeroSection({ onExploreClick }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden text-white pt-16 sm:pt-24 pb-20 sm:pb-28 canva-hero-gradient">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Top Tag */}
        <div className="inline-block mb-4 px-4 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs sm:text-sm font-medium tracking-wide">
          অনলাইন ৩ডি নেমপ্লেট মেকার • বাংলাদেশ
        </div>

        {/* Canva Inspired Hero Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight font-sans">
          What will you design today?
        </h1>

        {/* Bangla Subheading */}
        <p className="mt-4 sm:mt-5 text-lg sm:text-2xl font-medium text-white/95 max-w-2xl mx-auto leading-relaxed">
          আজকে আপনার স্বপ্নের বাড়ির জন্য কী ডিজাইন করবেন?
        </p>

        <p className="mt-2 text-sm sm:text-base text-white/80 max-w-xl mx-auto font-normal">
          সহজেই বাড়ির নাম, প্রোপাইটর ও হোল্ডিং নম্বর দিয়ে প্রিমিয়াম এক্রিলিক, সলিড সেগুন কাঠ ও মেটাল নেমপ্লেট তৈরি করুন।
        </p>

        {/* Centered White Pill CTA Button */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <button
            onClick={onExploreClick}
            className="btn-canva-pill btn-canva-white px-8 py-3.5 text-base sm:text-lg font-bold hover:scale-105 active:scale-95 transition-all shadow-none cursor-pointer"
          >
            Start designing • ডিজাইন শুরু করুন
          </button>
        </div>

        {/* Floating Canva-Style Creative Element Badges (Matching Screenshot 1) */}
        <div className="mt-14 sm:mt-18 pt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 max-w-4xl mx-auto select-none pointer-events-none">
          {/* Text Badge */}
          <div className="animate-float bg-white/20 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/30 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-serif font-black text-white">T</span>
            <span className="text-[10px] sm:text-xs font-semibold text-white/90 mt-1">টেক্সট ও ফন্ট</span>
          </div>

          {/* Color Wheel Badge */}
          <div className="animate-float-delayed w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-rose-400 via-amber-300 to-emerald-400 border-2 border-white flex items-center justify-center text-xs font-black text-neutral-900">
            কালার
          </div>

          {/* Sticky Note Badge */}
          <div className="animate-float bg-[#fef08a] text-neutral-900 rounded-xl p-3 sm:p-4 rotate-[-3deg] border border-yellow-300/60 flex flex-col items-start min-w-[100px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">হোল্ডিং নং</span>
            <span className="text-sm sm:text-base font-black">#১২/এ ধানমন্ডি</span>
          </div>

          {/* 3D Heart / Family Badge */}
          <div className="animate-float-delayed bg-gradient-to-br from-rose-500 to-pink-400 text-white rounded-2xl p-3 sm:p-4 border border-white/40 flex items-center gap-1.5">
            <span className="text-xl sm:text-2xl">❤️</span>
            <span className="text-xs sm:text-sm font-bold">রহমান ভিলা</span>
          </div>

          {/* Ratio / Dimension Badge */}
          <div className="animate-float bg-white/20 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/30 flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-white text-[#0f1015] px-2 py-0.5 rounded-md">
              ৫ : ৩
            </span>
            <span className="text-xs font-semibold text-white">স্ট্যান্ডার্ড সাইজ</span>
          </div>

          {/* Standoff Screws / Material Badge */}
          <div className="animate-float-delayed bg-white/20 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/30 text-xs font-semibold text-white">
            স্টেইনলেস স্টিল স্ক্রু
          </div>
        </div>
      </div>
    </section>
  );
}
