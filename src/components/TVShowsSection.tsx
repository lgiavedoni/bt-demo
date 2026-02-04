'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

interface TVShow {
  title: string;
  image: string;
  platform: string;
  platformLogo?: string;
}

const tvShows: TVShow[] = [
  {
    title: 'The Morning Show',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=600&fit=crop',
    platform: 'Apple TV+',
  },
  {
    title: 'Breaking News',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
    platform: 'Netflix',
  },
  {
    title: 'City Lights',
    image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=400&h=600&fit=crop',
    platform: 'Apple TV+',
  },
  {
    title: 'The Crown',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=600&fit=crop',
    platform: 'Netflix',
  },
  {
    title: 'Nature Documentary',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop',
    platform: 'discovery+',
  },
  {
    title: 'Premier League',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=600&fit=crop',
    platform: 'TNT Sports',
  },
  {
    title: 'Blockbuster Movie',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
    platform: 'Sky Cinema',
  },
  {
    title: 'Drama Series',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
    platform: 'Sky Atlantic',
  },
];

export default function TVShowsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  return (
    <section ref={sectionRef} className="bg-black py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Award winning entertainment awaits
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            From live sports to blockbuster movies and binge-worthy box sets, find your perfect match.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button className="btn-secondary bg-transparent text-white border-white hover:bg-white hover:text-black">
              Add TV to your broadband
            </button>
            <button className="btn-primary bg-white text-black hover:bg-gray-200">
              Learn about EE TV
            </button>
          </div>
        </div>

        {/* TV Shows Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tvShows.map((show, index) => (
            <div
              key={index}
              className={`relative aspect-[3/4] rounded-xl overflow-hidden img-zoom cursor-pointer transition-all duration-500 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              <Image
                src={show.image}
                alt={show.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Platform badge */}
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-white/80 text-xs font-medium bg-black/50 px-2 py-1 rounded">
                  {show.platform}
                </span>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#5514B4]/0 hover:bg-[#5514B4]/30 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 hover:opacity-100 transition-opacity">
                  <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#5514B4] ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
