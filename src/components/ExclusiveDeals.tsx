'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import type { ExclusiveDealsContent } from '@/lib/contentful';

interface ExclusiveDealsProps {
  content?: ExclusiveDealsContent;
}

const defaultContent: ExclusiveDealsContent = {
  badge: 'Trusted, reliable broadband',
  title: 'Exclusive deals just for you',
  subtitle: 'Already a BT customer? Unlock personalised offers on broadband and TV.',
  ctaText1: 'Log in for exclusive deals',
  ctaText2: 'Manage My BT account',
  imageUrl: 'https://www.bt.com/content/dam/bt/storefront/bt-home/newcust/images/mainherobanner/2025/march/Homepage_NewCust_MainHero_v2_Desktop_1920x1200.webp',
};

export default function ExclusiveDeals({ content = defaultContent }: ExclusiveDealsProps) {
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
        <div
          className={`relative rounded-3xl overflow-hidden transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="flex flex-col lg:flex-row">
            {/* Left Content - Yellow/Purple gradient */}
            <div className="lg:w-1/2 bg-gradient-to-br from-[#E6FF00] via-[#E6FF00] to-[#5514B4] p-8 lg:p-12 relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#FF80FF] rounded-full opacity-20 blur-3xl" />
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#5514B4] rounded-full opacity-30 blur-3xl" />

              <div className="relative z-10">
                <span className="inline-block bg-gray-800 text-white text-sm px-4 py-2 rounded-full mb-6">
                  {content.badge}
                </span>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  {content.title}
                </h2>
                <p className="text-white/90 text-lg mb-8">
                  {content.subtitle}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="btn-secondary bg-white text-[#5514B4] hover:bg-gray-100 border-0">
                    {content.ctaText1}
                  </button>
                  <button className="btn-primary">
                    {content.ctaText2}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-[500px]">
              <Image
                src={content.imageUrl}
                alt="Family enjoying BT Broadband"
                fill
                className="object-cover"
                priority
              />
              {/* Light streak effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#5514B4]/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FF80FF]/30 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
