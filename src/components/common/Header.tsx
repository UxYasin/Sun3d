'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface HeaderProps {
  onOpenAuth?: () => void;
  onSelectTemplatesClick?: () => void;
}

export function Header({ onOpenAuth, onSelectTemplatesClick }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleTemplatesClick = () => {
    if (onSelectTemplatesClick) {
      onSelectTemplatesClick();
    } else {
      router.push('/#templates');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Canva Inspired Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 font-serif italic select-none">
            Sun<span className="text-[#0073ff] not-italic font-sans">3D</span>
          </span>
          <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
            নেমপ্লেট স্টুডিও
          </span>
        </Link>

        {/* Center Nav Links - Clean text only, no icon clutter */}
        <nav className="hidden md:flex items-center gap-7 text-[15px] font-medium text-neutral-700">
          <Link href="/" className="hover:text-[#0073ff] transition-colors py-1">
            হোম
          </Link>
          <button
            onClick={handleTemplatesClick}
            className="hover:text-[#0073ff] transition-colors cursor-pointer py-1"
          >
            টেমপ্লেট গ্যালারি
          </button>
        </nav>

        {/* Right Actions - Canva Pill Style */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="text-xs sm:text-sm font-semibold bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-1.5 rounded-full transition-colors"
                >
                  Admin CMS
                </Link>
              )}

              <Link
                href="/dashboard"
                className="text-xs sm:text-sm font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 px-3.5 py-1.5 rounded-full transition-colors"
              >
                ড্যাশবোর্ড
              </Link>

              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="text-xs sm:text-sm font-medium text-neutral-500 hover:text-neutral-900 px-2 py-1 transition-colors"
              >
                লগআউট
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold text-neutral-700 hover:text-neutral-950 px-3 py-1.5 rounded-full hover:bg-neutral-100 transition-colors"
            >
              লগইন
            </Link>
          )}

          <button
            onClick={handleTemplatesClick}
            className="text-xs sm:text-sm font-semibold bg-[#0073ff] hover:bg-[#0059cc] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all cursor-pointer"
          >
            ডিজাইন শুরু করুন
          </button>
        </div>
      </div>
    </header>
  );
}
