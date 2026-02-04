import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import {
  createApiBuilderFromCtpClient,
  type ApiRoot,
} from '@commercetools/platform-sdk';

const projectKey = process.env.CTP_PROJECT_KEY || 'demo_btcc';

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: process.env.CTP_AUTH_URL || 'https://auth.europe-west1.gcp.commercetools.com',
  projectKey,
  credentials: {
    clientId: process.env.CTP_CLIENT_ID || 'CCzRVFo0hfTApX5iTV7xfoji',
    clientSecret: process.env.CTP_CLIENT_SECRET || 'pCkUIiZki3E_Jxj-ZldzvFrJtKtRqlmV',
  },
  scopes: [process.env.CTP_SCOPES || 'manage_project:demo_btcc'],
  fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: process.env.CTP_API_URL || 'https://api.europe-west1.gcp.commercetools.com',
  fetch,
};

const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .build();

export const apiRoot: ApiRoot = createApiBuilderFromCtpClient(ctpClient);

export const getProjectApi = () => apiRoot.withProjectKey({ projectKey });

// Fetch all categories
export async function getCategories() {
  try {
    const response = await getProjectApi()
      .categories()
      .get({
        queryArgs: {
          limit: 100,
          sort: 'orderHint asc',
        },
      })
      .execute();
    return response.body.results;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Fetch category by slug
export async function getCategoryBySlug(slug: string) {
  try {
    // Try different locale variations
    const locales = ['en', 'en-US', 'en-GB'];

    for (const locale of locales) {
      try {
        const response = await getProjectApi()
          .categories()
          .get({
            queryArgs: {
              where: `slug(${locale}="${slug}")`,
              limit: 1,
            },
          })
          .execute();

        if (response.body.results[0]) {
          return response.body.results[0];
        }
      } catch {
        // Try next locale
      }
    }

    // Fallback: fetch all categories and find by slug
    const allCategories = await getCategories();
    return allCategories.find(cat => {
      const catSlug = cat.slug?.en || cat.slug?.['en-US'] || cat.slug?.['en-GB'] || Object.values(cat.slug || {})[0];
      return catSlug === slug;
    }) || null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

// Fetch category by ID
export async function getCategoryById(id: string) {
  try {
    const response = await getProjectApi()
      .categories()
      .withId({ ID: id })
      .get()
      .execute();
    return response.body;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

// Fetch products by category (includes subtree)
export async function getProductsByCategory(categoryId: string) {
  try {
    const response = await getProjectApi()
      .productProjections()
      .search()
      .get({
        queryArgs: {
          'filter.query': `categories.id:subtree("${categoryId}")`,
          limit: 50,
        },
      })
      .execute();

    if (response.body.results.length > 0) {
      return response.body.results;
    }

    // Fallback: try direct category filter
    const directResponse = await getProjectApi()
      .productProjections()
      .search()
      .get({
        queryArgs: {
          filter: `categories.id:"${categoryId}"`,
          limit: 50,
        },
      })
      .execute();

    return directResponse.body.results;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

// Create a cart
export async function createCart() {
  try {
    const response = await getProjectApi()
      .carts()
      .post({
        body: {
          currency: 'USD',
          country: 'US',
        },
      })
      .execute();
    return response.body;
  } catch (error) {
    console.error('Error creating cart:', error);
    return null;
  }
}

// Get cart by ID
export async function getCart(cartId: string) {
  try {
    const response = await getProjectApi()
      .carts()
      .withId({ ID: cartId })
      .get()
      .execute();
    return response.body;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
}

// Add item to cart
export async function addToCart(cartId: string, cartVersion: number, productId: string, variantId: number = 1, quantity: number = 1) {
  try {
    const response = await getProjectApi()
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: cartVersion,
          actions: [
            {
              action: 'addLineItem',
              productId,
              variantId,
              quantity,
            },
          ],
        },
      })
      .execute();
    return response.body;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return null;
  }
}

// Remove item from cart
export async function removeFromCart(cartId: string, cartVersion: number, lineItemId: string) {
  try {
    const response = await getProjectApi()
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: cartVersion,
          actions: [
            {
              action: 'removeLineItem',
              lineItemId,
            },
          ],
        },
      })
      .execute();
    return response.body;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return null;
  }
}

// Update cart item quantity
export async function updateCartItemQuantity(cartId: string, cartVersion: number, lineItemId: string, quantity: number) {
  try {
    const response = await getProjectApi()
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: cartVersion,
          actions: [
            {
              action: 'changeLineItemQuantity',
              lineItemId,
              quantity,
            },
          ],
        },
      })
      .execute();
    return response.body;
  } catch (error) {
    console.error('Error updating cart:', error);
    return null;
  }
}

// Fetch all products
export async function getAllProducts() {
  try {
    const response = await getProjectApi()
      .productProjections()
      .search()
      .get({
        queryArgs: {
          limit: 100,
        },
      })
      .execute();
    return response.body.results;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Fetch product by slug
export async function getProductBySlug(slug: string) {
  try {
    // Try using product projections query with where clause
    const response = await getProjectApi()
      .productProjections()
      .get({
        queryArgs: {
          where: `slug(en="${slug}")`,
          limit: 1,
        },
      })
      .execute();

    if (response.body.results[0]) {
      return response.body.results[0];
    }

    // Fallback: search all products and find by slug
    const searchResponse = await getProjectApi()
      .productProjections()
      .search()
      .get({
        queryArgs: {
          limit: 500,
        },
      })
      .execute();

    return searchResponse.body.results.find(p => {
      const productSlug = p.slug?.en || p.slug?.['en-GB'] || Object.values(p.slug || {})[0];
      return productSlug === slug;
    }) || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Fetch product by key
export async function getProductByKey(key: string) {
  try {
    const response = await getProjectApi()
      .productProjections()
      .withKey({ key })
      .get()
      .execute();
    return response.body;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Fetch product by ID
export async function getProductById(id: string) {
  try {
    const response = await getProjectApi()
      .productProjections()
      .withId({ ID: id })
      .get()
      .execute();
    return response.body;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Helper to format price
export function formatPrice(price: { centAmount: number; currencyCode: string }) {
  const amount = price.centAmount / 100;
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: price.currencyCode,
  }).format(amount);
}

// Helper to get localized value
export function getLocalizedValue(
  localizedString: Record<string, string> | undefined,
  locale: string = 'en'
): string {
  if (!localizedString) return '';
  return localizedString[locale] || localizedString['en'] || Object.values(localizedString)[0] || '';
}
