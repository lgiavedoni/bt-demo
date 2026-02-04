'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import type { EeTvSectionContent } from '@/lib/contentful';

interface EETVSectionProps {
  content?: EeTvSectionContent;
}

const defaultContent: EeTvSectionContent = {
  badge: 'EE TV',
  title: 'Experience entertainment like never before',
  description: 'Stream your favourite shows, movies, and sports all in one place. With EE TV, you get access to premium content from Netflix, Disney+, Apple TV+, and more.',
  features: [
    'Over 100+ channels included',
    'Premium streaming apps built-in',
    'Pause and rewind live TV',
    'Voice control with your remote',
  ],
  ctaText1: 'Get EE TV',
  ctaText2: 'Learn more',
  imageUrl: 'https://www.bt.com/content/dam/bt/consumer/homepage-images/Cards/products/ee-tv-box.png',
};

export default function EETVSection({ content = defaultContent }: EETVSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left - EE TV Box Image */}
          <div
            className={`lg:w-1/2 bg-[#E6FF00] rounded-3xl overflow-hidden relative min-h-[400px] transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <Image
                src={content.imageUrl}
                alt="EE TV Box"
                width={500}
                height={400}
                className="object-contain"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-32 h-32 bg-[#5514B4]/10 rounded-full blur-2xl" />
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-[#FF80FF]/20 rounded-full blur-xl" />
          </div>

          {/* Right - EE TV Content */}
          <div
            className={`lg:w-1/2 bg-white rounded-3xl p-8 lg:p-12 flex flex-col justify-center transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <span className="inline-block bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-full mb-6 w-fit">
              {content.badge}
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {content.title}
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              {content.description}
            </p>
            <ul className="space-y-3 mb-8">
              {content.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-[#5514B4]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary">
                {content.ctaText1}
              </button>
              <button className="btn-secondary">
                {content.ctaText2}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
