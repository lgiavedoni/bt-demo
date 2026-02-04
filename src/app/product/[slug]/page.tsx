'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

interface ProductVariant {
  id: number;
  sku?: string;
  images?: { url: string; label?: string }[];
  prices?: { value: { centAmount: number; currencyCode: string } }[];
  attributes?: { name: string; value: unknown }[];
}

interface Product {
  id: string;
  name: Record<string, string>;
  slug: Record<string, string>;
  description?: Record<string, string>;
  masterVariant: ProductVariant;
  variants: ProductVariant[];
}

function getLocalizedValue(obj: Record<string, string> | undefined, locale = 'en'): string {
  if (!obj) return '';
  return obj[locale] || obj['en'] || Object.values(obj)[0] || '';
}

function formatPrice(price: { centAmount: number; currencyCode: string }): string {
  const amount = price.centAmount / 100;
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: price.currencyCode,
  }).format(amount);
}

// Strip HTML tags from description
function stripHtml(html: string | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart, loading: cartLoading } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        setSelectedVariant(data.masterVariant);

        // Set default selections
        const colorAttr = data.masterVariant.attributes?.find((a: { name: string }) => a.name === 'color');
        const storageAttr = data.masterVariant.attributes?.find((a: { name: string }) => a.name === 'storage');
        if (colorAttr) setSelectedColor(String(colorAttr.value));
        if (storageAttr) setSelectedStorage(String(storageAttr.value));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/2">
                <div className="aspect-square bg-gray-200 rounded-2xl" />
              </div>
              <div className="lg:w-1/2 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-24" />
                <div className="h-10 bg-gray-200 rounded w-3/4" />
                <div className="h-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The product you are looking for does not exist.'}</p>
          <Link href="/" className="btn-primary inline-block">
            Return Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const name = getLocalizedValue(product.name);
  const description = getLocalizedValue(product.description);
  const currentVariant = selectedVariant || product.masterVariant;
  const images = currentVariant.images || [];
  const price = currentVariant.prices?.[0]?.value;
  const allVariants = [product.masterVariant, ...product.variants];

  // Extract unique colors and storage options
  const colors = [...new Set(allVariants.map(v =>
    v.attributes?.find(a => a.name === 'color')?.value as string
  ).filter(Boolean))];

  const storages = [...new Set(allVariants.map(v =>
    v.attributes?.find(a => a.name === 'storage')?.value as string
  ).filter(Boolean))];

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const variant = allVariants.find(v =>
      v.attributes?.find(a => a.name === 'color')?.value === color &&
      (!selectedStorage || v.attributes?.find(a => a.name === 'storage')?.value === selectedStorage)
    );
    if (variant) {
      setSelectedVariant(variant);
      setSelectedImage(0);
    }
  };

  const handleStorageChange = (storage: string) => {
    setSelectedStorage(storage);
    const variant = allVariants.find(v =>
      v.attributes?.find(a => a.name === 'storage')?.value === storage &&
      (!selectedColor || v.attributes?.find(a => a.name === 'color')?.value === selectedColor)
    );
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const handleAddToCart = async () => {
    if (!product || !currentVariant) return;

    const priceValue = currentVariant.prices?.[0]?.value;
    const imageUrl = currentVariant.images?.[0]?.url;

    await addToCart(
      product.id,
      currentVariant.id,
      1,
      {
        name,
        price: priceValue ? priceValue.centAmount / 100 : 0,
        currency: priceValue?.currencyCode || 'USD',
        image: imageUrl,
      }
    );

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-[#5514B4]">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/category/mobile" className="hover:text-[#5514B4]">Products</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{name}</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Image Gallery */}
          <div className="lg:w-1/2">
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4">
              {images[selectedImage] ? (
                <Image
                  src={images[selectedImage].url}
                  alt={name}
                  fill
                  className="object-contain p-8"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? 'border-[#5514B4]' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`${name} view ${idx + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2">
            <div className="flex items-start justify-between mb-2">
              <span className="text-[#5514B4] font-medium">Apple</span>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{name}</h1>

            <p className="text-gray-600 mb-8">{stripHtml(description)}</p>

            {/* Action Links */}
            <div className="border rounded-xl divide-y mb-8">
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium">Product details</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">Log in for personalised offers</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">Get this phone SIM Free</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Choose colour</h3>
                <div className="flex gap-4">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`flex-1 border-2 rounded-xl p-4 text-center transition-all ${
                        selectedColor === color
                          ? 'border-[#5514B4] bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full mx-auto mb-2"
                        style={{
                          backgroundColor:
                            color.toLowerCase() === 'cosmic orange' ? '#E67E22' :
                            color.toLowerCase() === 'silver' ? '#C0C0C0' :
                            color.toLowerCase() === 'black' ? '#1a1a1a' :
                            color.toLowerCase() === 'white' ? '#f5f5f5' :
                            '#888',
                        }}
                      />
                      <span className="text-sm font-medium">{color}</span>
                      {selectedColor === color && (
                        <svg className="w-4 h-4 text-[#5514B4] mx-auto mt-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Storage Selection */}
            {storages.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Choose storage</h3>
                <div className="flex gap-4">
                  {storages.map((storage) => (
                    <button
                      key={storage}
                      onClick={() => handleStorageChange(storage)}
                      className={`flex-1 border-2 rounded-xl p-4 text-center transition-all ${
                        selectedStorage === storage
                          ? 'border-[#5514B4] bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm font-medium">{storage}</span>
                      {selectedStorage === storage && (
                        <svg className="w-4 h-4 text-[#5514B4] mx-auto mt-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            {price && (
              <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Monthly device cost</span>
                <span className="text-2xl font-bold text-gray-900">{formatPrice(price)}</span>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading}
                className={`btn-primary flex-1 py-4 flex items-center justify-center gap-2 ${
                  addedToCart ? 'bg-green-600 hover:bg-green-700' : ''
                } ${cartLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {cartLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding...
                  </>
                ) : addedToCart ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Added to basket!
                  </>
                ) : (
                  'Add to basket'
                )}
              </button>
              <button className="btn-secondary flex-1 py-4">
                Compare
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
