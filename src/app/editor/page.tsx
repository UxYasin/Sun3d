'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const Editor = dynamic(
  () => import('@/features/editor/components/editor').then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white gap-3">
        <Loader className="w-8 h-8 animate-spin text-[#0073ff]" />
        <span className="text-sm font-semibold text-neutral-600">Canva স্টুডিও লোড হচ্ছে...</span>
      </div>
    ),
  }
);
import { MOCK_TEMPLATES } from '@/data/mock-templates';
import { resolveSize } from '@/lib/template-utils';
import { OrderReviewModal } from '@/components/editor/OrderReviewModal';
import { PaymentInstructionsModal } from '@/components/orders/PaymentInstructionsModal';
import { useAuth } from '@/lib/auth-context';
import { OrderStoreService } from '@/lib/order-store';
import { CustomerOrder, NameplateDesignState, NameplateSize, Template } from '@/types/nameplate';
import { Loader } from 'lucide-react';

function CanvasEditorPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const queryTemplateId = searchParams.get('templateId');
  const querySize = searchParams.get('size') as NameplateSize | null;
  const queryDesignId = searchParams.get('designId');

  const [activeTemplate, setActiveTemplate] = useState<Template>(MOCK_TEMPLATES[0]);
  const [activeCreatedOrder, setActiveCreatedOrder] = useState<CustomerOrder | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [designState, setDesignState] = useState<NameplateDesignState>({
    templateId: 'tpl-obsidian-gold',
    size: '2:1',
    houseName: 'রহমান ভিলা',
    proprietor: 'মো: আনিসুর রহমান',
    address: 'বাড়ি ২৪, রোড ৭, ধানমন্ডি, ঢাকা',
    holdingNumber: '১২/এ',
    typography: {
      fontFamily: 'serif',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSizeScale: 'standard'
    },
    colors: {
      textColor: '#f6d365',
      accentColor: '#d4af37'
    }
  });

  useEffect(() => {
    let resolvedTemplateId = queryTemplateId;
    let resolvedSize = querySize;

    if (typeof window !== 'undefined') {
      if (!resolvedTemplateId) {
        resolvedTemplateId = localStorage.getItem('sun3d_selected_template_id');
      }
      if (!resolvedSize) {
        resolvedSize = localStorage.getItem('sun3d_selected_size') as NameplateSize | null;
      }
    }

    if (queryDesignId) {
      const existingDesign = OrderStoreService.getDesignById(queryDesignId);
      if (existingDesign) {
        resolvedTemplateId = existingDesign.templateId;
        resolvedSize = existingDesign.size;
        setDesignState({
          id: existingDesign.id,
          templateId: existingDesign.templateId,
          size: existingDesign.size,
          houseName: existingDesign.houseName,
          proprietor: existingDesign.proprietor,
          address: existingDesign.address,
          holdingNumber: existingDesign.holdingNumber,
          typography: existingDesign.typography || {
            fontFamily: 'serif',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSizeScale: 'standard'
          },
          colors: existingDesign.colors || {
            textColor: '#f6d365',
            accentColor: '#d4af37'
          }
        });
      }
    }

    const found = MOCK_TEMPLATES.find((t) => t.id === resolvedTemplateId) || MOCK_TEMPLATES[0];
    setActiveTemplate(found);

    const safeSize = resolvedSize && found.supportedSizes.includes(resolvedSize) ? resolvedSize : (found.supportedSizes[0] || '2:1');

    if (!queryDesignId) {
      setDesignState((prev) => ({
        ...prev,
        templateId: found.id,
        size: safeSize,
        houseName: prev.houseName || found.defaultValues.houseName,
        proprietor: prev.proprietor || found.defaultValues.proprietor,
        address: prev.address || found.defaultValues.address,
        holdingNumber: prev.holdingNumber || found.defaultValues.holdingNumber,
        colors: {
          textColor: found.textConfig.houseName.color,
          accentColor: found.textConfig.proprietor.color
        }
      }));
    }
  }, [queryTemplateId, querySize, queryDesignId]);

  const handleOrderClick = () => {
    if (!user) {
      router.push(`/login?redirect=/editor&templateId=${activeTemplate.id}&size=${designState.size}`);
      return;
    }
    setIsReviewModalOpen(true);
  };

  const handleOrderConfirmed = (order: CustomerOrder) => {
    setActiveCreatedOrder(order);
    setIsReviewModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handleSaveCanvas = (values: { json: string; height: number; width: number }) => {
    if (user) {
      OrderStoreService.saveDesign({
        userId: user.id,
        templateId: activeTemplate.id,
        size: designState.size,
        houseName: designState.houseName,
        proprietor: designState.proprietor,
        address: designState.address,
        holdingNumber: designState.holdingNumber,
        typography: designState.typography,
        colors: designState.colors,
      });
    }
  };

  const activeSize = resolveSize(
    activeTemplate,
    designState.size,
    designState.customSize
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <Editor
        initialData={{
          id: queryDesignId || activeTemplate.id,
          width: activeSize.width,
          height: activeSize.height,
        }}
        onSave={handleSaveCanvas}
        onOrder={handleOrderClick}
      />

      {/* Order Review Modal */}
      {user && (
        <OrderReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          template={activeTemplate}
          designState={designState}
          user={user}
          onOrderConfirmed={handleOrderConfirmed}
        />
      )}

      {/* Payment Modal */}
      <PaymentInstructionsModal
        isOpen={isPaymentModalOpen}
        order={activeCreatedOrder}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-white gap-3">
          <Loader className="w-8 h-8 animate-spin text-[#0073ff]" />
          <span className="text-sm font-semibold text-neutral-600">Canva স্টুডিও লোড হচ্ছে...</span>
        </div>
      }
    >
      <CanvasEditorPageContent />
    </Suspense>
  );
}
