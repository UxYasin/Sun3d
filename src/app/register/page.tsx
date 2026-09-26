'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();

  const redirectTarget = searchParams.get('redirect') || '/dashboard';
  const templateId = searchParams.get('templateId');
  const size = searchParams.get('size');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+880 ');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(name, email, phone, password);
      setSuccess(true);

      let destination = redirectTarget;
      if (templateId && size && !destination.includes('templateId=')) {
        destination += `${destination.includes('?') ? '&' : '?'}templateId=${templateId}&size=${size}`;
      }

      setTimeout(() => {
        router.push(destination);
      }, 500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-[24px] border border-neutral-200 p-6 sm:p-8 font-sans">
      <div className="text-center mb-6">
        <span className="text-2xl font-black text-neutral-950 font-serif italic block mb-2">
          Sun<span className="text-[#0073ff] not-italic font-sans">3D</span>
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">
          নতুন অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          সহজেই নামপ্লেট তৈরি, ড্রাফট সেভ ও অর্ডার ট্র্যাক করতে যুক্ত হোন।
        </p>
      </div>

      {success ? (
        <div className="py-8 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <h3 className="font-bold text-base text-neutral-900">
            অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!
          </h3>
          <p className="text-xs text-neutral-500">আপনাকে রিডাইরেক্ট করা হচ্ছে...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              আপনার পুরো নাম
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: মো: আনিসুর রহমান"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-[12px] text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-[#0073ff]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              ইমেইল অ্যাড্রেস
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-[12px] text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-[#0073ff]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              মোবাইল নম্বর
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 1711-223344"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-[12px] text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-[#0073ff]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৬টি অক্ষর"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-[12px] text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-[#0073ff]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-canva-pill btn-canva-primary py-3 text-sm font-bold cursor-pointer mt-4"
          >
            {isSubmitting ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}
          </button>
        </form>
      )}

      <div className="mt-6 pt-4 border-t border-neutral-100 text-center text-xs text-neutral-500">
        ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
        <Link
          href={`/login${templateId ? `?templateId=${templateId}&size=${size || '2:1'}` : ''}`}
          className="text-[#0073ff] font-bold hover:underline"
        >
          লগইন করুন
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Suspense fallback={<div className="text-xs text-neutral-500">লোড হচ্ছে...</div>}>
          <RegisterFormContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
