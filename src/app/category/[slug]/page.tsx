import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  getCategoryBySlug,
  getProductsByCategory,
  getAllProducts,
  getCategories,
  formatPrice,
  getLocalizedValue,
} from '@/lib/commercetools';
import type { ProductProjection, Category } from '@commercetools/platform-sdk';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Strip HTML tags from description
function stripHtml(html: string | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

function ProductCard({ product }: { product: ProductProjection }) {
  const name = getLocalizedValue(product.name);
  const description = getLocalizedValue(product.description);
  const slug = getLocalizedValue(product.slug);
  const masterVariant = product.masterVariant;
  const image = masterVariant.images?.[0]?.url;
  const price = masterVariant.prices?.[0]?.value;

  return (
    <Link
      href={`/product/${slug}`}
      className="bg-white rounded-2xl overflow-hidden card-hover border border-gray-100 group"
    >
      <div className="relative aspect-square bg-gray-50 p-4">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {product.masterVariant.attributes?.find(a => a.name === 'isNew')?.value && (
          <span className="absolute top-4 left-4 bg-[#5514B4] text-white text-xs font-semibold px-3 py-1 rounded-full">
            New
          </span>
        )}
      </div>
      <div className="p-6">
        <span className="text-[#5514B4] text-sm font-medium">
          {product.productType?.obj?.name || 'Product'}
        </span>
        <h3 className="text-xl font-bold text-gray-900 mt-1 mb-2 group-hover:text-[#5514B4] transition-colors">
          {name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {stripHtml(description)}
        </p>
        {price && (
          <p className="text-lg font-semibold text-gray-900">
            {formatPrice(price)}
            <span className="text-sm font-normal text-gray-500"> a month</span>
          </p>
        )}
        <button className="mt-4 text-[#5514B4] font-medium text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
          Buy {name}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </Link>
  );
}

function FilterSidebar({ categories }: { categories: Category[] }) {
  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-24">
        <div className="mb-6">
          <button className="flex items-center gap-2 text-gray-900 font-medium">
            Price
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">Categories</h3>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/category/${getLocalizedValue(cat.slug)}`}
                  className="text-gray-700 hover:text-[#5514B4] transition-colors"
                >
                  {getLocalizedValue(cat.name)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  // Get category by slug
  const category = await getCategoryBySlug(slug);
  const categories = await getCategories();

  let products: ProductProjection[] = [];
  let categoryName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

  if (category) {
    products = await getProductsByCategory(category.id);
    categoryName = getLocalizedValue(category.name);
  } else {
    // If category not found, show all products
    products = await getAllProducts();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-[#5514B4]">Home</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{categoryName}</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
          <p className="text-gray-600 mt-2">{products.length} products available</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <FilterSidebar categories={categories} />

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort bar */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-gray-700 font-medium">
                  Filter
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Sort by</span>
                <select className="border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5514B4]">
                  <option>Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Name: A-Z</option>
                </select>
              </div>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try a different category or check back later.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
