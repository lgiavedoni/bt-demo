import { NextResponse } from 'next/server';
import { getProductBySlug, getProductByKey } from '@/lib/commercetools';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    // Try to find by slug first
    let product = await getProductBySlug(slug);

    // If not found by slug, try by key
    if (!product) {
      product = await getProductByKey(slug);
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
