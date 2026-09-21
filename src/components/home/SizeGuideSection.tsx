'use client';

import React from 'react';

export function SizeGuideSection() {
  return (
    <section id="sizes" className="py-16 sm:py-20 bg-[#fafafa] border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 tracking-tight font-sans">
            ৩টি সুনির্দিষ্ট আর্কিটেকচারাল সাইজ
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-600">
            আপনার বাড়ি, ভিলা বা অ্যাপার্টমেন্টের প্রবেশদ্বারের জন্য পারফেক্ট মাপ
          </p>
        </div>

        {/* 3 Flat Size Cards (Zero heavy shadow, clean minimal Canva style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* 5:3 Ratio Card */}
          <div className="rounded-[20px] p-6 bg-white border border-neutral-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#8b3dff] bg-[#faf5ff] px-3 py-1 rounded-full border border-[#f3e8ff]">
                  সবচেয়ে জনপ্রিয়
                </span>
                <span className="text-xs font-mono font-bold text-neutral-500">অনুপাত ৫:৩</span>
              </div>

              <h3 className="text-lg font-bold text-neutral-900">
                স্ট্যান্ডার্ড ক্লাসিক (১৫" × ৯")
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                মেইন গেট, বাউন্ডারি ওয়াল ও ডুপ্লেক্স বাড়ির জন্য আদর্শ।
              </p>

              {/* Minimal Proportion Mockup */}
              <div className="my-6 p-4 bg-[#f8f9fa] rounded-xl flex items-center justify-center">
                <div className="w-36 aspect-[5/3] bg-[#8b3dff]/10 border border-[#8b3dff] rounded-lg flex items-center justify-center text-xs font-bold text-[#8b3dff]">
                  ৫ : ৩ রেশিও
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-600 space-y-1.5">
              <p>• ২০-৪০ ফুট দূর থেকে স্পষ্ট দৃশ্যমান</p>
              <p>• বাউন্ডারি দেয়াল ও গেটের জন্য উপযোগী</p>
            </div>
          </div>

          {/* 4:2 (2:1) Ratio Card */}
          <div className="rounded-[20px] p-6 bg-white border border-neutral-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  ওয়াইড ফরম্যাট
                </span>
                <span className="text-xs font-mono font-bold text-neutral-500">অনুপাত ৪:২</span>
              </div>

              <h3 className="text-lg font-bold text-neutral-900">
                মডার্ন প্যানোরামিক (১৬" × ৮")
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                লম্বা নাম ও পূর্ণাঙ্গ ঠিকানা এক লাইনে সাজানোর জন্য সেরা।
              </p>

              <div className="my-6 p-4 bg-[#f8f9fa] rounded-xl flex items-center justify-center">
                <div className="w-40 aspect-[4/2] bg-blue-500/10 border border-blue-500 rounded-lg flex items-center justify-center text-xs font-bold text-blue-600">
                  ৪ : ২ রেশিও
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-600 space-y-1.5">
              <p>• ডাবল ডোর ও ফ্ল্যাটের দরজার ওপর পারফেক্ট</p>
              <p>• হরিজন্টাল আধুনিক টাইপোগ্রাফি</p>
            </div>
          </div>

          {/* 4:3 Ratio Card */}
          <div className="rounded-[20px] p-6 bg-white border border-neutral-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  কমপ্যাক্ট ফরম্যাট
                </span>
                <span className="text-xs font-mono font-bold text-neutral-500">অনুপাত ৪:৩</span>
              </div>

              <h3 className="text-lg font-bold text-neutral-900">
                ভার্টিক্যাল এন্ট্রান্স (১২" × ৯")
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                অ্যাপার্টমেন্ট ডোর, বেল বাটন সাইড ও কমপ্যাক্ট স্পেসের জন্য।
              </p>

              <div className="my-6 p-4 bg-[#f8f9fa] rounded-xl flex items-center justify-center">
                <div className="w-32 aspect-[4/3] bg-emerald-500/10 border border-emerald-500 rounded-lg flex items-center justify-center text-xs font-bold text-emerald-700">
                  ৪ : ৩ রেশিও
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-600 space-y-1.5">
              <p>• ফ্ল্যাটের মূল দরজার পাশে লাগানোর উপযোগী</p>
              <p>• কম জায়গায় বেশি তথ্য প্রদর্শনের সুবিধা</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
