'use client';

import Link from 'next/link';
import type { PromoBannerContent } from '@/lib/contentful';

interface PromoBannerProps {
  content?: PromoBannerContent;
}

const defaultContent: PromoBannerContent = {
  text: "Don't have BT Broadband yet? Find your available deals",
  linkUrl: '#',
};

export default function PromoBanner({ content = defaultContent }: PromoBannerProps) {
  return (
    <div className="bg-white py-4 text-center border-b border-gray-100">
      <Link
        href={content.linkUrl}
        className="text-[#5514B4] font-medium hover:underline transition-all inline-flex items-center gap-2"
      >
        {content.text}
        <span className="text-[#FF80FF]">&rarr;</span>
      </Link>
    </div>
  );
}
