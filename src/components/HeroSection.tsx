'use client';

import { useEffect, useState } from 'react';
import type { HeroContent } from '@/lib/contentful';

interface HeroSectionProps {
  content?: HeroContent;
}

const defaultContent: HeroContent = {
  title: 'Upgrade your home with BT Broadband',
  subtitle: 'Fast, reliable BT Broadband and EE TV packages for busy households.',
};

export default function HeroSection({ content = defaultContent }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1
          className={`text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {content.title}
        </h1>
        <p
          className={`text-xl text-gray-600 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {content.subtitle}
        </p>
      </div>
    </section>
  );
}
