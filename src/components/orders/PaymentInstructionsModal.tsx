'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomerOrder, PaymentMethod } from '@/types/nameplate';
import { OrderStoreService } from '@/lib/order-store';

interface PaymentInstructionsModalProps {
  order: CustomerOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSubmitted?: (updatedOrder: CustomerOrder) => void;
}

export function PaymentInstructionsModal({
  order,
  isOpen,
  onClose,
  onPaymentSubmitted
}: PaymentInstructionsModalProps) {
  const router = useRouter();
  const paymentSettings = OrderStoreService.getPaymentSettings();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(order?.paymentMethod || 'bKash');
  const [transactionId, setTransactionId] = useState('');
  const [senderPhone, setSenderPhone] = useState(order?.customerPhone || '+880 17');
  const [paymentNote, setPaymentNote] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !order) return null;

  const currentNumber = selectedMethod === 'bKash' ? paymentSettings.bkashNumber : paymentSettings.nagadNumber;
  const currentInstructions = selectedMethod === 'bKash' ? paymentSettings.bkashInstructions : paymentSettings.nagadInstructions;
  const currentAccountType = selectedMethod === 'bKash' ? paymentSettings.bkashAccountType : paymentSettings.nagadAccountType;

  const handleCopyNumber = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(currentNumber);
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2000);
    }
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) return;

    setIsSubmitting(true);
    try {
      const updated = OrderStoreService.submitOrderPayment({
        orderId: order.id,
        paymentMethod: selectedMethod,
        transactionId: transactionId.trim().toUpperCase(),
        senderPhone: senderPhone.trim(),
        paymentNote: paymentNote.trim() || undefined
      });

      setIsSuccess(true);
      if (updated && onPaymentSubmitted) {
        onPaymentSubmitted(updated);
      }

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        router.push(`/orders/${order.id}`);
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white rounded-[24px] border border-neutral-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-950">
              বিকাশ / নগদ পেমেন্ট নির্দেশিকা
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              অর্ডার নং: <span className="font-mono font-bold text-neutral-800">{order.orderNumber}</span> • প্রদেয়: <span className="font-bold text-neutral-900">৳{order.price.toLocaleString()} BDT</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitPayment} className="p-5 sm:p-6 space-y-5">
          {/* Method Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-neutral-100 p-1 rounded-full">
            <button
              type="button"
              onClick={() => setSelectedMethod('bKash')}
              className={`py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedMethod === 'bKash'
                  ? 'bg-white text-[#e2136e] shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              বিকাশ (bKash)
            </button>
            <button
              type="button"
              onClick={() => setSelectedMethod('Nagad')}
              className={`py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedMethod === 'Nagad'
                  ? 'bg-white text-[#f7941d] shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              নগদ (Nagad)
            </button>
          </div>

          {/* Account Number Box */}
          <div className="p-4 rounded-[16px] bg-[#fafafa] border border-neutral-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                {selectedMethod} পার্সোনাল নম্বর ({currentAccountType})
              </span>
              <span className="text-lg sm:text-xl font-mono font-bold text-neutral-950">
                {currentNumber}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyNumber}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-200 hover:bg-neutral-300 text-neutral-800 transition-colors cursor-pointer"
            >
              {copiedNumber ? 'কপি হয়েছে!' : 'কপি করুন'}
            </button>
          </div>

          {/* Instruction Note */}
          <div className="text-xs text-neutral-600 bg-amber-50/70 p-3 rounded-[12px] border border-amber-200/60 leading-relaxed">
            {currentInstructions}
          </div>

          {/* Transaction ID Input */}
          <div>
            <label className="block text-xs font-bold text-neutral-900 mb-1.5">
              ট্রানজেকশন আইডি (TrxID) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="যেমন: BK99X44221 বা 7H49A1209"
              className="w-full px-4 py-2.5 rounded-[12px] border border-neutral-300 font-mono text-sm uppercase tracking-wider focus:outline-none focus:border-[#0073ff]"
            />
          </div>

          {/* Sender Phone */}
          <div>
            <label className="block text-xs font-bold text-neutral-900 mb-1.5">
              যে নম্বর থেকে টাকা পাঠিয়েছেন <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              placeholder="+880 17..."
              className="w-full px-4 py-2.5 rounded-[12px] border border-neutral-300 text-sm focus:outline-none focus:border-[#0073ff]"
            />
          </div>

          {/* Payment Note */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              অতিরিক্ত নোট (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              placeholder="যেমন: পার্সোনাল বিকাশ ওয়ালেট থেকে পাঠানো হয়েছে"
              className="w-full px-4 py-2 rounded-[12px] border border-neutral-300 text-xs focus:outline-none focus:border-[#0073ff]"
            />
          </div>

          {/* Success or Submit Button */}
          {isSuccess ? (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-full text-center text-xs font-bold border border-emerald-200">
              পেমেন্ট তথ্য সফলভাবে জমা হয়েছে! ট্র্যাকিং পেজে নিয়ে যাওয়া হচ্ছে...
            </div>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || !transactionId.trim()}
              className="w-full btn-canva-pill btn-canva-primary py-3 text-sm font-bold cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'জমা হচ্ছে...' : 'পেমেন্ট তথ্য জমা দিন'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
