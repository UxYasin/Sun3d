'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth, DEMO_USERS } from '@/lib/auth-context';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const redirectTarget = searchParams.get('redirect') || '/dashboard';
  const templateId = searchParams.get('templateId');
  const size = searchParams.get('size');

  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password, role);
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

  const handleQuickFill = (targetRole: 'customer' | 'admin') => {
    setRole(targetRole);
    setEmail(DEMO_USERS[targetRole].email);
    setPassword('password123');
  };

  return (
    <div className="w-full max-w-md bg-white rounded-[24px] border border-neutral-200 p-6 sm:p-8 font-sans">
      <div className="text-center mb-6">
        <span className="text-2xl font-black text-neutral-950 font-serif italic block mb-2">
          Sun<span className="text-[#8b3dff] not-italic font-sans">3D</span>
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">
          লগইন করুন
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          {templateId
            ? 'ডিজাইন কাস্টমাইজ করতে লগইন করুন।'
            : 'আপনার সেভ করা নেমপ্লেট ও অর্ডার ট্র্যাক করতে লগইন করুন।'}
        </p>
      </div>

      {success ? (
        <div className="py-8 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <h3 className="font-bold text-base text-neutral-900">
            লগইন সফল হয়েছে!
          </h3>
          <p className="text-xs text-neutral-500">আপনাকে রিডাইরেক্ট করা হচ্ছে...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-[12px] text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-[#8b3dff]"
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
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-[12px] text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-[#8b3dff]"
            />
          </div>

          {/* 1-Click Demo Profiles */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
              ডেমো অ্যাকাউন্ট দিয়ে টেস্ট করুন:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('customer')}
                className={`py-2 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  role === 'customer'
                    ? 'bg-[#8b3dff] text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                কাস্টমার ডেমো
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className={`py-2 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  role === 'admin'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                অ্যাডমিন ডেমো
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-canva-pill btn-canva-primary py-3 text-sm font-bold cursor-pointer mt-4"
          >
            {isSubmitting ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
          </button>
        </form>
      )}

      <div className="mt-6 pt-4 border-t border-neutral-100 text-center text-xs text-neutral-500">
        কোনো অ্যাকাউন্ট নেই?{' '}
        <Link
          href={`/register${templateId ? `?templateId=${templateId}&size=${size || '5:3'}` : ''}`}
          className="text-[#8b3dff] font-bold hover:underline"
        >
          নতুন অ্যাকাউন্ট খুলুন
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Suspense fallback={<div className="text-xs text-neutral-500">লোড হচ্ছে...</div>}>
          <LoginFormContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
