'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import type { BtEeSectionContent, ProductCardContent } from '@/lib/contentful';

interface BTEESectionProps {
  content?: BtEeSectionContent;
}

const defaultProducts: ProductCardContent[] = [
  {
    category: 'BT Broadband',
    categoryColor: 'text-[#5514B4]',
    title: 'Reliable. Fast.',
    description: "BT's trusted network with brilliant services",
    ctaText: 'View your personalised deals',
    imageUrl: 'https://www.bt.com/content/dam/bt/consumer/homepage-images/Cards/products/bb-hub.png',
  },
  {
    category: 'iPhone offer',
    categoryColor: 'text-[#FF80FF]',
    title: 'Latest. iPhone 17 Pro',
    description: 'New exclusive offer - BT Broadband customers now get 30% off data plans, plus double data.',
    ctaText: 'Buy now',
    imageUrl: 'https://www.bt.com/content/dam/bt/consumer/homepage-images/Cards/products/iphone-16-pro.png',
  },
  {
    category: 'EE TV',
    categoryColor: 'text-[#5514B4]',
    title: 'Watch. Swap. Enjoy',
    description: 'Premium channels with the flexibility to swap each month',
    ctaText: 'Add EE TV to your broadband',
    imageUrl: 'https://www.bt.com/content/dam/bt/consumer/homepage-images/Cards/products/ee-tv-box.png',
  },
  {
    category: 'EE Sports',
    categoryColor: 'text-[#5514B4]',
    title: 'Live. Sports. Action',
    description: 'TNT Sports, Sky Sports included',
    ctaText: 'Buy TNT Sports',
    imageUrl: 'https://www.bt.com/content/dam/bt/consumer/homepage-images/Cards/products/tnt-sports.png',
  },
  {
    category: 'BT Business',
    categoryColor: 'text-[#5514B4]',
    title: 'Secure. Connected.',
    description: 'Business broadband solutions for your company',
    ctaText: 'Get unbeatable deals',
    imageUrl: 'https://www.bt.com/content/dam/bt/consumer/homepage-images/Cards/products/bb-hub.png',
  },
];

const defaultContent: BtEeSectionContent = {
  title: 'BT + EE, the ultimate home entertainment',
  subtitle: "Power your home with BT's Full Fibre Broadband (up to 900Mbps) and tailor your EE TV with Sky Sports, Netflix, or Now Cinema. Grab the best of both worlds.",
  products: defaultProducts,
};

export default function BTEESection({ content = defaultContent }: BTEESectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 340;
      const newPosition = direction === 'left'
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;

      carouselRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      setScrollPosition(carouselRef.current.scrollLeft);
    }
  };

  const products = content.products.length > 0 ? content.products : defaultProducts;

  return (
    <section ref={sectionRef} className="bg-[#5514B4] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {content.title}
          </h2>
          <p className="text-white/90 text-lg max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Product Cards Carousel */}
        <div className="relative">
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto hide-scrollbar scroll-smooth pb-4"
          >
            {products.map((product, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-[300px] bg-white rounded-2xl overflow-hidden card-hover transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  <span className={`text-sm font-semibold ${product.categoryColor}`}>
                    {product.category}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2 mb-3">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {product.description}
                  </p>
                  <button className="text-gray-700 font-medium text-sm hover:text-[#5514B4] transition-colors underline">
                    {product.ctaText}
                  </button>
                </div>
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-contain p-4"
                  />
                  {/* Arrow button */}
                  <button className="absolute bottom-4 left-4 w-12 h-12 bg-[#5514B4] rounded-full flex items-center justify-center text-white hover:bg-[#3D0D87] transition-colors group">
                    <svg
                      className="w-5 h-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => scroll('left')}
              className={`w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center text-white transition-all hover:border-white hover:bg-white/10 ${
                scrollPosition <= 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={scrollPosition <= 0}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white transition-all hover:bg-white/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
