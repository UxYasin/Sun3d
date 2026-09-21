'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#0f1015] text-white border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <span className="text-2xl font-black tracking-tight text-white font-serif italic">
              Sun<span className="text-[#8b3dff] not-italic font-sans">3D</span>
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed">
              বাংলাদেশের সেরা অনলাইন কাস্টমাইজেবল নেমপ্লেট মেকার। এক্রিলিক, সেগুন কাঠ ও মেটালের নিখুঁত লেজার কাটিং।
            </p>
            <div className="text-xs text-emerald-400 font-semibold bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-800/60 w-fit">
              বিকাশ ও নগদ ভেরিফাইড পেমেন্ট
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              সাইজ ও রেশিও
            </h4>
            <ul className="text-xs text-neutral-400 space-y-1.5">
              <li>৫:৩ অনুপাত — ১৫" × ৯" (মেইন গেট ও বাউন্ডারি)</li>
              <li>৪:২ অনুপাত — ১৬" × ৮" (ডোর হেডার ও প্যানোরামিক)</li>
              <li>৪:৩ অনুপাত — ১২" × ৯" (ফ্ল্যাট ও অ্যাপার্টমেন্ট)</li>
            </ul>
          </div>

          {/* Materials */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              ম্যাটেরিয়াল
            </h4>
            <ul className="text-xs text-neutral-400 space-y-1.5">
              <li>কাস্ট হাই-গ্লস এক্রিলিক (মিরর গোল্ড)</li>
              <li>সিজনড চিটাগাং সেগুন কাঠ</li>
              <li>আর্কিটেকচারাল ফ্রস্টেড গ্লাস</li>
              <li>প্রাকৃতিক স্লেট স্টোন ও এচিং ব্রাস</li>
              <li>এস এস-৩০৪ স্ট্যান্ডঅফ স্ক্রু ফ্রি</li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              কাস্টমার সাপোর্ট
            </h4>
            <div className="text-xs text-neutral-400 space-y-1.5">
              <p>হটলাইন: +৮৮০ ১৮০০-৭৮৬৩৩৩ (সকাল ৯টা - রাত ৯টা)</p>
              <p>ইমেইল: support@sun3d.com.bd</p>
              <p>ওয়ার্কশপ: তেজগাঁও শিল্প এলাকা, ঢাকা-১২০৮</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Sun3D Nameplates. সর্বস্বত্ব সংরক্ষিত।</p>
          <p>তৈরি হয়েছে আধুনিক বাংলাদেশের সুন্দর বাড়িগুলোর জন্য।</p>
        </div>
      </div>
    </footer>
  );
}
