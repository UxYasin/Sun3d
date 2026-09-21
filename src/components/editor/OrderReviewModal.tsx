'use client';

import React, { useState } from 'react';
import { Template, NameplateDesignState, User, PaymentMethod, CustomerOrder } from '@/types/nameplate';
import { NameplatePreview } from '@/components/nameplate/NameplatePreview';
import { SIZE_LABELS } from '@/data/mock-templates';
import { OrderStoreService } from '@/lib/order-store';

interface OrderReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template;
  designState: NameplateDesignState;
  user: User;
  onOrderConfirmed: (order: CustomerOrder) => void;
}

export function OrderReviewModal({
  isOpen,
  onClose,
  template,
  designState,
  user,
  onOrderConfirmed
}: OrderReviewModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bKash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const sizeInfo = SIZE_LABELS[designState.size];
  const price = template.priceStartingAt;

  const handleConfirmOrder = () => {
    setIsSubmitting(true);
    try {
      const createdOrder = OrderStoreService.createOrder({
        customerId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || '+880 1711-223344',
        finalDesignData: designState,
        price,
        paymentMethod
      });

      OrderStoreService.saveDesign({
        userId: user.id,
        templateId: designState.templateId,
        size: designState.size,
        houseName: designState.houseName,
        proprietor: designState.proprietor,
        address: designState.address,
        holdingNumber: designState.holdingNumber,
        typography: designState.typography,
        colors: designState.colors
      });

      onOrderConfirmed(createdOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-3xl bg-white rounded-[24px] border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950">
              অর্ডার বিবরণী ও কনফার্মেশন
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              নামপ্লেটের লেখা ও কাস্টমার তথ্য যাচাই করে অর্ডার নিশ্চিত করুন
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6 flex-1">
          {/* Final Design Visual Preview */}
          <div className="bg-[#f8f9fa] rounded-[20px] p-6 border border-neutral-100 flex flex-col items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-3">
              চূড়ান্ত লেজার কাটিং প্রিভিউ
            </span>
            <div className="w-full max-w-md">
              <NameplatePreview
                template={template}
                size={designState.size}
                customValues={designState}
              />
            </div>
            <p className="text-xs text-neutral-500 mt-4 font-medium">
              রেশিও: {designState.size} • ডায়মেনশন: {sizeInfo.dimensions}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Information */}
            <div className="p-4 rounded-[16px] bg-[#fafafa] border border-neutral-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                ডেলিভারি গ্রাহক তথ্য
              </h4>
              <div className="space-y-1 text-xs text-neutral-700">
                <p><span className="font-semibold text-neutral-900">নাম:</span> {user.name}</p>
                <p><span className="font-semibold text-neutral-900">ইমেইল:</span> {user.email}</p>
                <p><span className="font-semibold text-neutral-900">ফোন:</span> {user.phone || '+880 1711-223344'}</p>
              </div>
            </div>

            {/* Template Specs */}
            <div className="p-4 rounded-[16px] bg-[#fafafa] border border-neutral-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                মেটিরিয়াল স্পেসিফিকেশন
              </h4>
              <div className="space-y-1 text-xs text-neutral-700">
                <p><span className="font-semibold text-neutral-900">টেমপ্লেট:</span> {template.name}</p>
                <p><span className="font-semibold text-neutral-900">ম্যাটেরিয়াল:</span> {template.material}</p>
                <p><span className="font-semibold text-neutral-900">ইনক্লুডেড:</span> ৪টি স্টেইনলেস স্টিল স্ক্রু ও ওয়াল প্লাগ</p>
              </div>
            </div>
          </div>

          {/* Submitted Text Summary */}
          <div className="p-4 rounded-[16px] bg-[#fafafa] border border-neutral-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
              সংযোজিত টেক্সট ও বিবরণ
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-neutral-200">
                <span className="text-[10px] text-neutral-400 block">বাড়ির নাম</span>
                <span className="font-bold text-neutral-900 truncate block">{designState.houseName}</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-neutral-200">
                <span className="text-[10px] text-neutral-400 block">মালিকের নাম</span>
                <span className="font-bold text-neutral-900 truncate block">{designState.proprietor}</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-neutral-200">
                <span className="text-[10px] text-neutral-400 block">হোল্ডিং নং</span>
                <span className="font-bold text-neutral-900 truncate block">{designState.holdingNumber}</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-neutral-200">
                <span className="text-[10px] text-neutral-400 block">ঠিকানা</span>
                <span className="font-bold text-neutral-900 truncate block">{designState.address}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-neutral-900 mb-2">
              পেমেন্ট মাধ্যম বেছে নিন:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('bKash')}
                className={`p-3.5 rounded-[16px] border text-left transition-all cursor-pointer ${
                  paymentMethod === 'bKash'
                    ? 'border-[#e2136e] bg-[#fdf2f7] text-[#e2136e]'
                    : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
                }`}
              >
                <span className="font-black text-base block">বিকাশ (bKash)</span>
                <span className="text-[11px] text-neutral-500">Send Money / পার্সোনাল নম্বর</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Nagad')}
                className={`p-3.5 rounded-[16px] border text-left transition-all cursor-pointer ${
                  paymentMethod === 'Nagad'
                    ? 'border-[#f7941d] bg-[#fef8f0] text-[#f7941d]'
                    : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
                }`}
              >
                <span className="font-black text-base block">নগদ (Nagad)</span>
                <span className="text-[11px] text-neutral-500">Send Money / পার্সোনাল নম্বর</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer with Price & Confirm Button */}
        <div className="p-5 sm:p-6 border-t border-neutral-100 bg-[#fafafa] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-neutral-500 block">সর্বমোট প্রদেয় মূল্য (স্ক্রু সহ)</span>
            <span className="text-2xl font-bold text-neutral-950">
              ৳{price.toLocaleString()} BDT
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-neutral-600 hover:bg-neutral-200 transition-colors"
            >
              এডিটরে ফিরে যান
            </button>
            <button
              onClick={handleConfirmOrder}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none btn-canva-pill btn-canva-primary px-7 py-2.5 text-xs sm:text-sm font-bold cursor-pointer"
            >
              {isSubmitting ? 'প্রসেসিং হচ্ছে...' : 'অর্ডার কনফার্ম ও পেমেন্ট'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
