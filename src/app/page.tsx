'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { CanvaFeaturesSection } from '@/components/home/CanvaFeaturesSection';
import { TemplateGallery } from '@/components/home/TemplateGallery';
import { SizeGuideSection } from '@/components/home/SizeGuideSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { Footer } from '@/components/common/Footer';
import { AuthPlaceholderModal } from '@/components/common/AuthPlaceholderModal';
import { Template, NameplateSize } from '@/types/nameplate';
import { MOCK_TEMPLATES } from '@/data/mock-templates';
import { useAuth } from '@/lib/auth-context';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRedirectNotice, setAuthRedirectNotice] = useState<string | undefined>(undefined);
  const [selectedForCustomization, setSelectedForCustomization] = useState<{
    template: Template;
    size: NameplateSize;
  } | null>(null);

  const scrollToTemplates = () => {
    const el = document.getElementById('templates');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroSelectTemplate = (templateId: string) => {
    const tpl = MOCK_TEMPLATES.find((t) => t.id === templateId) || MOCK_TEMPLATES[0];
    handleStartCustomization(tpl, tpl.supportedSizes[0] || '5:3');
  };

  const handleStartCustomization = (template: Template, size: NameplateSize) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sun3d_selected_template_id', template.id);
      localStorage.setItem('sun3d_selected_size', size);
    }

    setSelectedForCustomization({ template, size });

    if (user) {
      router.push(`/editor?templateId=${template.id}&size=${size}`);
    } else {
      router.push(`/login?redirect=/editor&templateId=${template.id}&size=${size}`);
    }
  };

  const handleAuthSuccess = () => {
    if (selectedForCustomization) {
      router.push(`/editor?templateId=${selectedForCustomization.template.id}&size=${selectedForCustomization.size}`);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
      {/* Header */}
      <Header
        onOpenAuth={() => {
          setAuthRedirectNotice(undefined);
          setIsAuthModalOpen(true);
        }}
        onSelectTemplatesClick={scrollToTemplates}
      />

      {/* Main Canva-Style Page Content */}
      <main className="flex-1">
        {/* Canva Screenshot 1: Hero Section */}
        <HeroSection
          onExploreClick={scrollToTemplates}
          onSelectTemplate={handleHeroSelectTemplate}
        />

        {/* Canva Screenshot 2: Tools to power your best work */}
        <CanvaFeaturesSection onExploreClick={scrollToTemplates} />

        {/* Canva Screenshot 3 & 4: Templates for absolutely anything */}
        <TemplateGallery onStartCustomization={handleStartCustomization} />

        {/* Precise Architectural Sizes */}
        <SizeGuideSection />

        {/* Effortless 4-Step Process */}
        <HowItWorksSection onStartClick={scrollToTemplates} />
      </main>

      {/* Canva Dark Clean Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthPlaceholderModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessLogin={handleAuthSuccess}
        redirectNotice={authRedirectNotice}
      />
    </div>
  );
}
