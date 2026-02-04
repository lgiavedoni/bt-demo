'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface Category {
  id: string;
  name: Record<string, string>;
  slug: Record<string, string>;
}

const defaultNavItems = [
  { name: 'Broadband', slug: 'broadband' },
  { name: 'TV', slug: 'tv' },
  { name: 'Sport', slug: 'sport' },
  { name: 'Mobile', slug: 'mobile' },
  { name: 'Home Phone', slug: 'home-phone' },
  { name: 'Business', slug: 'business' },
];

function getLocalizedValue(obj: Record<string, string> | undefined, locale = 'en'): string {
  if (!obj) return '';
  return obj[locale] || obj['en'] || Object.values(obj)[0] || '';
}

const TopBar = () => (
  <div className="bg-[#6B6B6B] text-white py-2 px-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
      <div className="flex items-center gap-6">
        <Link href="#" className="hover:underline transition-all">For the home</Link>
        <Link href="#" className="hover:underline transition-all">For business and public sector</Link>
        <Link href="#" className="hover:underline transition-all">For global business</Link>
        <span className="text-gray-400">|</span>
        <Link href="#" className="hover:underline transition-all flex items-center gap-1">
          UK
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  </div>
);

const BTLogo = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="white"/>
    <path d="M14 14h8c3 0 5 1.5 5 4.5 0 2-1 3.5-3 4v.1c2.5.5 4 2.5 4 5 0 3.5-2.5 5.4-6 5.4h-8V14zm4 7h3c1.5 0 2.5-.8 2.5-2.3 0-1.4-1-2.2-2.5-2.2h-3v4.5zm0 8h3.5c2 0 3-1 3-2.8 0-1.8-1.2-2.7-3.2-2.7H18v5.5z" fill="#5514B4"/>
    <path d="M30 17h-3v-3h10v3h-3v16h-4V17z" fill="#5514B4"/>
  </svg>
);

const SearchBar = () => (
  <div className="hidden lg:flex flex-1 max-w-xl mx-8">
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Type to search..."
        className="w-full px-4 py-2.5 pr-12 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF80FF]"
      />
      <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-[#5514B4] transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  </div>
);

const rightNavItems = [
  { name: 'Help', href: '#' },
  { name: 'My BT', href: '#' },
  { name: 'Email', href: '#' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { itemCount } = useCart();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Use categories from commercetools if available, otherwise use defaults
  const navItems = categories.length > 0
    ? categories.slice(0, 6).map(cat => ({
        name: getLocalizedValue(cat.name),
        slug: getLocalizedValue(cat.slug),
      }))
    : defaultNavItems;

  return (
    <header className="sticky top-0 z-50">
      <TopBar />
      <nav className="bg-[#5514B4] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
              <BTLogo />
            </Link>

            {/* Search Bar */}
            <SearchBar />

            {/* Right Icons */}
            <div className="hidden lg:flex items-center gap-4">
              <button className="p-2 hover:bg-[#7B4CC4] rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-[#7B4CC4] rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <Link href="/cart" className="p-2 hover:bg-[#7B4CC4] rounded-full transition-colors relative block">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E6FF00] text-[#5514B4] text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Category Navigation */}
          <div className="hidden lg:flex items-center gap-1 pb-2 -mx-2">
            {loading ? (
              // Loading skeleton
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-24 bg-[#7B4CC4] rounded animate-pulse mx-2" />
                ))}
              </>
            ) : (
              navItems.map((item) => (
                <div
                  key={item.slug}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.slug)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={`/category/${item.slug}`}
                    className={`py-2 px-4 font-medium transition-all hover:text-[#FF80FF] flex items-center gap-1 ${
                      activeDropdown === item.slug ? 'text-[#FF80FF]' : ''
                    }`}
                  >
                    {item.name}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                  {activeDropdown === item.slug && (
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#FF80FF] animate-fade-in" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 animate-fade-in">
              {/* Mobile Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Type to search..."
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
                />
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.slug}
                  href={`/category/${item.slug}`}
                  className="block py-3 px-4 font-medium hover:bg-[#7B4CC4] rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <hr className="my-4 border-[#7B4CC4]" />
              {rightNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-3 px-4 font-medium hover:bg-[#7B4CC4] rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
