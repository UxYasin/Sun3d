'use client';

import React from 'react';

interface HowItWorksSectionProps {
  onStartClick: () => void;
}

export function HowItWorksSection({ onStartClick }: HowItWorksSectionProps) {
  const steps = [
    {
      num: '০১',
      title: 'টেমপ্লেট বেছে নিন',
      desc: '১৪টি এক্সক্লুসিভ ডিজাইনের মধ্য থেকে আপনার পছন্দের মেটিরিয়াল ও লুক সিলেক্ট করুন।'
    },
    {
      num: '০২',
      title: 'সাইজ ও রেশিও নির্ধারণ',
      desc: '৫:৩, ৪:২ বা ৪:৩—আপনার বাড়ির দেয়াল বা দরজার উপযুক্ত মাপ নির্বাচন করুন।'
    },
    {
      num: '০৩',
      title: 'নাম ও তথ্য লিখুন',
      desc: 'বাড়ির নাম, হোল্ডিং নম্বর ও প্রোপাইটর লিখুন। সাথে সাথে লাইভ ৩ডি প্রিভিউ দেখুন।'
    },
    {
      num: '০৪',
      title: 'হোম ডেলিভারি গ্রহণ',
      desc: 'বিকাশ বা নগদে পেমেন্ট করুন। লেজার কাটিং শেষে সারা বাংলাদেশে হোম ডেলিভারি পৌঁছে যাবে।'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 tracking-tight font-sans">
            সহজ ৪টি ধাপে আপনার নেমপ্লেট পান
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-600">
            কোন জটিলতা ছাড়া মাত্র ৩ মিনিটে প্রিমিয়াম নেমপ্লেট অর্ডার করুন
          </p>
        </div>

        {/* 4 Flat Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="rounded-[20px] p-6 bg-[#f8f9fa] border border-neutral-200/80 flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-black text-[#8b3dff] font-mono">
                  {step.num}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-neutral-950 mt-3">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Centered CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={onStartClick}
            className="btn-canva-pill btn-canva-primary px-8 py-3 text-base font-bold cursor-pointer"
          >
            Start designing • এখনই শুরু করুন
          </button>
        </div>
      </div>
    </section>
  );
}
