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

      </div>
    </section>
  );
}
