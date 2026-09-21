'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { MOCK_TEMPLATES } from '@/data/mock-templates';
import { OrderStoreService } from '@/lib/order-store';
import { CustomerDesign, CustomerOrder } from '@/types/nameplate';
import { NameplatePreview } from '@/components/nameplate/NameplatePreview';

type DashboardTab = 'designs' | 'orders' | 'account';

function DashboardContent() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<DashboardTab>('designs');
  const [designs, setDesigns] = useState<CustomerDesign[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/dashboard');
    } else if (user) {
      const loadUserContent = () => {
        setDesigns(OrderStoreService.getUserDesigns(user.id));
        setOrders(OrderStoreService.getUserOrders(user.id));
      };
      loadUserContent();
      OrderStoreService.syncWithServer().then(loadUserContent);

      const handleSync = () => loadUserContent();
      window.addEventListener('sun3d_store_synced', handleSync);
      return () => window.removeEventListener('sun3d_store_synced', handleSync);
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-[#8b3dff] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-neutral-500">ড্যাশবোর্ড লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const handleEditDesign = (design: CustomerDesign) => {
    router.push(`/editor?templateId=${design.templateId}&size=${design.size}&designId=${design.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full font-sans">
      {/* Top Welcome Header (Canva Flat Style) */}
      <div className="bg-white rounded-[24px] border border-neutral-200 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#8b3dff] text-white font-black text-xl flex items-center justify-center">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">
                {user.name}
              </h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-[#8b3dff] border border-purple-100">
                {user.role === 'admin' ? 'অ্যাডমিন' : 'কাস্টমার প্রোফাইল'}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              {user.email} • {user.phone || '+880 1711-223344'}
            </p>
          </div>
        </div>

        {/* Action Button: Create New */}
        <div className="flex items-center gap-3">
          <Link
            href="/#templates"
            className="btn-canva-pill btn-canva-primary text-xs sm:text-sm font-bold"
          >
            নতুন নেমপ্লেট তৈরি করুন
          </Link>

          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 px-3 py-2 rounded-full hover:bg-neutral-100 transition-colors"
          >
            লগআউট
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 mb-8">
        <button
          onClick={() => setActiveTab('designs')}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'designs'
              ? 'bg-[#8b3dff] text-white'
              : 'text-neutral-600 hover:text-neutral-950 bg-neutral-100'
          }`}
        >
          আমার ড্রাফট ডিজাইন ({designs.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#8b3dff] text-white'
              : 'text-neutral-600 hover:text-neutral-950 bg-neutral-100'
          }`}
        >
          অর্ডার ও ট্র্যাকিং ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('account')}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'account'
              ? 'bg-[#8b3dff] text-white'
              : 'text-neutral-600 hover:text-neutral-950 bg-neutral-100'
          }`}
        >
          প্রোফাইল সেটিংস
        </button>
      </div>

      {/* Tab 1: Saved Designs */}
      {activeTab === 'designs' && (
        <div>
          {designs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-[24px] border border-neutral-200 p-8">
              <h3 className="text-base font-bold text-neutral-900">কোন সেভ করা ডিজাইন নেই</h3>
              <p className="text-xs text-neutral-500 mt-1">টেমপ্লেট গ্যালারি থেকে আপনার পছন্দের ডিজাইন কাস্টমাইজ করুন।</p>
              <Link
                href="/#templates"
                className="mt-4 inline-block btn-canva-pill btn-canva-primary text-xs font-bold"
              >
                টেমপ্লেট দেখুন
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map((design) => {
                const tpl = MOCK_TEMPLATES.find((t) => t.id === design.templateId) || MOCK_TEMPLATES[0];
                return (
                  <div
                    key={design.id}
                    className="bg-white rounded-[20px] border border-neutral-200 overflow-hidden flex flex-col justify-between hover:border-[#8b3dff] transition-all"
                  >
                    <div className="p-5 bg-[#f8f9fa] border-b border-neutral-100 flex items-center justify-center min-h-[180px]">
                      <div className="w-full max-w-[260px]">
                        <NameplatePreview
                          template={tpl}
                          size={design.size}
                          customValues={design}
                          compact={true}
                        />
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm text-neutral-900 truncate">
                          {design.houseName}
                        </h4>
                        <span className="text-[11px] font-mono text-neutral-500">
                          {design.size}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 truncate">{design.proprietor}</p>
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">{design.address}</p>

                      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-800">
                          ৳{tpl.priceStartingAt.toLocaleString()} BDT
                        </span>
                        <button
                          onClick={() => handleEditDesign(design)}
                          className="btn-canva-pill btn-canva-primary px-4 py-1.5 text-xs font-bold cursor-pointer"
                        >
                          এডিট ও অর্ডার
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-[24px] border border-neutral-200 p-8">
              <h3 className="text-base font-bold text-neutral-900">কোন অর্ডার নেই</h3>
              <p className="text-xs text-neutral-500 mt-1">আপনার প্লেস করা সমস্ত অর্ডার এখানে দেখতে পাবেন।</p>
              <Link
                href="/#templates"
                className="mt-4 inline-block btn-canva-pill btn-canva-primary text-xs font-bold"
              >
                ডিজাইন শুরু করুন
              </Link>
            </div>
          ) : (
            orders.map((ord) => {
              const tpl = MOCK_TEMPLATES.find((t) => t.id === ord.templateId) || MOCK_TEMPLATES[0];
              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-[20px] border border-neutral-200 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-16 bg-[#f8f9fa] rounded-xl border border-neutral-100 flex items-center justify-center p-1 shrink-0">
                      <div className="scale-50 origin-center">
                        <NameplatePreview
                          template={tpl}
                          size={ord.size}
                          customValues={ord.finalDesignData}
                          compact={true}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-neutral-950">
                          {ord.orderNumber}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ord.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-700'
                              : ord.paymentStatus === 'submitted'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {ord.paymentStatus === 'paid' ? 'পেইড' : ord.paymentStatus === 'submitted' ? 'পেমেন্ট জমা হয়েছে' : 'বাকি'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 mt-0.5">
                        {ord.finalDesignData.houseName} • {tpl.name} ({ord.size})
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        প্রোডাকশন: <strong className="text-neutral-700">{ord.productionStatus}</strong> • তারিখ: {new Date(ord.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <span className="text-base font-bold text-neutral-950">
                      ৳{ord.price.toLocaleString()} BDT
                    </span>
                    <Link
                      href={`/orders/${ord.id}`}
                      className="btn-canva-pill btn-canva-outline text-xs font-bold px-4 py-2"
                    >
                      ট্র্যাকিং দেখুন
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 3: Account */}
      {activeTab === 'account' && (
        <div className="bg-white rounded-[24px] border border-neutral-200 p-6 sm:p-8 max-w-xl">
          <h3 className="text-base font-bold text-neutral-950 mb-4">কাস্টমার তথ্য</h3>
          <div className="space-y-3 text-sm text-neutral-700">
            <div>
              <span className="text-xs font-bold text-neutral-500 block">নাম:</span>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-500 block">ইমেইল:</span>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-500 block">ফোন নম্বর:</span>
              <p className="font-medium">{user.phone || '+880 1711-223344'}</p>
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-500 block">ভূমিকা (Role):</span>
              <p className="font-medium capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-500">লোড হচ্ছে...</div>}>
          <DashboardContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
