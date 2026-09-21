'use client';

import React, { useState } from 'react';
import { User } from '@/types/nameplate';

interface AuthPlaceholderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin?: (user: User) => void;
  redirectNotice?: string;
}

export function AuthPlaceholderModal({
  isOpen,
  onClose,
  onSuccessLogin,
  redirectNotice
}: AuthPlaceholderModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Md. Anisur Rahman');
  const [phone, setPhone] = useState('+880 1711-223344');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: role === 'admin' ? 'usr-admin-01' : 'usr-cust-01',
      name: isRegister ? name : (role === 'admin' ? 'Admin Manager' : 'Md. Anisur Rahman'),
      email,
      phone,
      role,
      createdAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('sun3d_current_user', JSON.stringify(mockUser));
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      if (onSuccessLogin) {
        onSuccessLogin(mockUser);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in font-sans">
      <div
        className="relative w-full max-w-md bg-white rounded-[24px] border border-neutral-200 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <span className="text-2xl font-black text-neutral-950 font-serif italic block mb-2">
            Sun<span className="text-[#8b3dff] not-italic font-sans">3D</span>
          </span>
          <h3 className="text-xl font-bold text-neutral-950">
            {isRegister ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'সাইন ইন করুন'}
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            {redirectNotice || 'ডিজাইন সেভ করতে ও অর্ডার সম্পন্ন করতে লগইন করুন।'}
          </p>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h4 className="font-bold text-neutral-900">
              সফলভাবে সাইন ইন হয়েছে!
            </h4>
            <p className="text-xs text-neutral-500">আপনাকে রিডাইরেক্ট করা হচ্ছে...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  পুরো নাম
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: মো: আনিসুর রহমান"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-[12px] text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-[#8b3dff]"
                />
              </div>
            )}

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

            {/* Demo Quick Select */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                ডেমো প্রোফাইল:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRole('customer');
                    setEmail('customer@example.com');
                  }}
                  className={`py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    role === 'customer'
                      ? 'bg-[#8b3dff] text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  কাস্টমার ডেমো
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('admin');
                    setEmail('admin@sun3d.com');
                  }}
                  className={`py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
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
              className="w-full btn-canva-pill btn-canva-primary py-3 text-sm font-bold cursor-pointer mt-4"
            >
              {isRegister ? 'অ্যাকাউন্ট খুলুন' : 'লগইন করুন'}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-neutral-100 text-center text-xs text-neutral-500">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-[#8b3dff] font-bold hover:underline cursor-pointer"
          >
            {isRegister
              ? 'আগে থেকেই অ্যাকাউন্ট আছে? লগইন করুন'
              : 'নতুন অ্যাকাউন্ট খুলতে চান? রেজিস্ট্রেশন করুন'}
          </button>
        </div>
      </div>
    </div>
  );
}
