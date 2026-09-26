'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { OrderStoreService } from '@/lib/order-store';
import { MOCK_TEMPLATES, SIZE_LABELS } from '@/data/mock-templates';
import { CustomerOrder, ProductionStatus } from '@/types/nameplate';
import { NameplatePreview } from '@/components/nameplate/NameplatePreview';
import { PaymentInstructionsModal } from '@/components/orders/PaymentInstructionsModal';
import { ArrowLeft } from 'lucide-react';

const PRODUCTION_STEPS: { status: ProductionStatus; label: string; desc: string }[] = [
  { status: 'New', label: 'অর্ডার সম্পন্ন', desc: 'পেমেন্ট তথ্যের অপেক্ষায়' },
  { status: 'Payment Pending', label: 'পেমেন্ট জমা হয়েছে', desc: 'TrxID যাচাই চলছে' },
  { status: 'Working', label: 'লেজার কাটিং চলছে', desc: 'নিখুঁত কাটিং ও ফিনিশিং' },
  { status: 'Ready', label: 'প্যাকেজিং ও রেডি', desc: 'স্ক্রু সহ কুরিয়ারে হস্তান্তর' },
  { status: 'Completed', label: 'ডেলিভারি সম্পন্ন', desc: 'গ্রাহকের ঠিকানায় পৌঁছেছে' }
];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    const found = OrderStoreService.getOrderById(resolvedParams.id);
    if (found) {
      setOrder(found);
    }
    fetch(`/api/orders/${encodeURIComponent(resolvedParams.id)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
        }
      })
      .catch(() => {});
  }, [resolvedParams.id]);

  if (isLoading) {
    return <div className="p-12 text-center text-xs text-neutral-500">লোড হচ্ছে...</div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#fafafa]">
        <Header />
        <div className="max-w-md mx-auto my-auto text-center p-8 bg-white rounded-[24px] border border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900">অর্ডার খুঁজে পাওয়া যায়নি</h2>
          <p className="text-xs text-neutral-500 mt-2">অর্ডার আইডি #{resolvedParams.id} এর কোনো রেকর্ড পাওয়া যায়নি।</p>
          <Link
            href="/dashboard"
            className="mt-5 inline-block btn-canva-pill btn-canva-primary text-xs font-bold"
          >
            ড্যাশবোর্ডে ফিরে যান
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const template = MOCK_TEMPLATES.find((t) => t.id === order.templateId) || MOCK_TEMPLATES[0];
  const sizeInfo = SIZE_LABELS[order.size];
  const currentStepIndex = PRODUCTION_STEPS.findIndex((s) => s.status === order.productionStatus);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between font-sans">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ড্যাশবোর্ডে ফিরে যান</span>
          </Link>

          <span className="text-xs font-mono font-bold text-neutral-500">
            অর্ডার নং: {order.orderNumber}
          </span>
        </div>

        {/* 1. Production Progress Tracker (Canva Flat 20px Rounded) */}
        <div className="bg-white rounded-[20px] p-6 sm:p-8 border border-neutral-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0073ff]">
                লাইভ ট্র্যাকিং
              </span>
              <h1 className="text-2xl font-bold text-neutral-950 mt-0.5">
                অর্ডার স্ট্যাটাস ও অগ্রগতি
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  order.paymentStatus === 'paid'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : order.paymentStatus === 'submitted'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                পেমেন্ট: {order.paymentStatus === 'paid' ? 'পরিশোধিত (Verified)' : order.paymentStatus === 'submitted' ? 'যাচাই চলছে (Submitted)' : 'বাকি (Unpaid)'}
              </span>
            </div>
          </div>

          {/* 5 Steps Timeline */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-5 gap-4">
            {PRODUCTION_STEPS.map((step, idx) => {
              const isPast = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.status} className="flex flex-col items-center text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isPast
                        ? 'bg-[#0073ff] text-white'
                        : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <h4 className={`text-xs font-bold mt-2.5 ${isCurrent ? 'text-[#0073ff]' : 'text-neutral-800'}`}>
                    {step.label}
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Re-enter TrxID CTA if Unpaid or Rejected */}
          {(order.paymentStatus === 'unpaid' || order.paymentStatus === 'rejected') && (
            <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#f0f7ff] p-4 rounded-[16px]">
              <div>
                <h4 className="text-xs font-bold text-[#0073ff]">পেমেন্ট সম্পন্ন করুন</h4>
                <p className="text-xs text-neutral-600 mt-0.5">বিকাশ বা নগদে টাকা পাঠিয়ে TrxID সাবমিট করুন।</p>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="btn-canva-pill btn-canva-primary px-5 py-2 text-xs font-bold cursor-pointer"
              >
                TrxID সাবমিট করুন
              </button>
            </div>
          )}
        </div>

        {/* 2. Order Preview & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Preview */}
          <div className="lg:col-span-7 bg-white rounded-[20px] p-6 border border-neutral-200 flex flex-col items-center justify-center">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-4">
              নেমপ্লেটের চূড়ান্ত প্রিভিউ
            </span>
            <div className="w-full max-w-md">
              <NameplatePreview
                template={template}
                size={order.size}
                customValues={order.finalDesignData}
              />
            </div>
            <p className="text-xs text-neutral-500 mt-4">
              সাইজ: {sizeInfo.label} ({sizeInfo.dimensions}) • অনুপাত {order.size}
            </p>
          </div>

          {/* Right Details */}
          <div className="lg:col-span-5 space-y-4">
            {/* Customer Details */}
            <div className="bg-white rounded-[20px] p-5 border border-neutral-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                গ্রাহক ও ডেলিভারি তথ্য
              </h4>
              <div className="space-y-1.5 text-xs text-neutral-700">
                <p><span className="font-semibold text-neutral-900">নাম:</span> {order.customerName}</p>
                <p><span className="font-semibold text-neutral-900">ইমেইল:</span> {order.customerEmail}</p>
                <p><span className="font-semibold text-neutral-900">ফোন:</span> {order.customerPhone}</p>
                <p><span className="font-semibold text-neutral-900">ঠিকানা:</span> {order.finalDesignData.address}</p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-[20px] p-5 border border-neutral-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                পেমেন্ট সামারি
              </h4>
              <div className="space-y-1.5 text-xs text-neutral-700">
                <p><span className="font-semibold text-neutral-900">মাধ্যম:</span> {order.paymentMethod}</p>
                <p><span className="font-semibold text-neutral-900">ট্রানজেকশন আইডি:</span> <span className="font-mono font-bold text-neutral-900">{order.transactionId || 'এখনও জমা দেওয়া হয়নি'}</span></p>
                <div className="pt-3 mt-2 border-t border-neutral-100 flex items-center justify-between">
                  <span className="font-bold text-neutral-900">মোট পরিশোধিতব্য:</span>
                  <span className="text-lg font-bold text-neutral-950">৳{order.price.toLocaleString()} BDT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Payment Instructions Modal */}
      <PaymentInstructionsModal
        isOpen={isPaymentModalOpen}
        order={order}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSubmitted={(updated) => setOrder(updated)}
      />
    </div>
  );
}
