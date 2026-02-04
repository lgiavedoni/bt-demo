'use client';

import Link from 'next/link';

const footerLinks = {
  'Our products': [
    'Broadband',
    'TV',
    'Mobile',
    'Home Phone',
    'Sport',
  ],
  'Help & Support': [
    'Contact us',
    'My BT',
    'Track my order',
    'Billing',
    'Delivery',
  ],
  'About BT': [
    'About us',
    'Careers',
    'Press',
    'Sustainability',
    'Investors',
  ],
  'Legal': [
    'Privacy policy',
    'Terms & conditions',
    'Cookie policy',
    'Accessibility',
    'Modern slavery statement',
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Logo */}
        <div className="mb-12">
          <svg width="64" height="64" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="22" fill="#5514B4"/>
            <path d="M14 14h8c3 0 5 1.5 5 4.5 0 2-1 3.5-3 4v.1c2.5.5 4 2.5 4 5 0 3.5-2.5 5.4-6 5.4h-8V14zm4 7h3c1.5 0 2.5-.8 2.5-2.3 0-1.4-1-2.2-2.5-2.2h-3v4.5zm0 8h3.5c2 0 3-1 3-2.8 0-1.8-1.2-2.7-3.2-2.7H18v5.5z" fill="white"/>
            <path d="M30 17h-3v-3h10v3h-3v16h-4V17z" fill="white"/>
          </svg>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex gap-4 mb-8">
          {['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'].map((social) => (
            <Link
              key={social}
              href="#"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#5514B4] transition-colors"
            >
              <span className="sr-only">{social}</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </Link>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} British Telecommunications plc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
