import { createClient, Entry, EntrySkeletonType } from 'contentful';

// Contentful client configuration - requires environment variables
const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN;

// Create clients only if credentials are available
const client = spaceId && accessToken ? createClient({
  space: spaceId,
  accessToken: accessToken,
}) : null;

const previewClient = spaceId && previewToken ? createClient({
  space: spaceId,
  accessToken: previewToken,
  host: 'preview.contentful.com',
}) : null;

export function getClient(preview = false) {
  const selectedClient = preview ? previewClient : client;
  if (!selectedClient) {
    console.warn('Contentful client not configured. Using default content.');
    return null;
  }
  return selectedClient;
}

// Content Type Interfaces
export interface HeroContent {
  title: string;
  subtitle: string;
}

export interface PromoBannerContent {
  text: string;
  linkUrl: string;
}

export interface ExclusiveDealsContent {
  badge: string;
  title: string;
  subtitle: string;
  ctaText1: string;
  ctaText2: string;
  imageUrl: string;
}

export interface EeTvSectionContent {
  badge: string;
  title: string;
  description: string;
  features: string[];
  ctaText1: string;
  ctaText2: string;
  imageUrl: string;
}

export interface ProductCardContent {
  category: string;
  categoryColor: string;
  title: string;
  description: string;
  ctaText: string;
  imageUrl: string;
}

export interface BtEeSectionContent {
  title: string;
  subtitle: string;
  products: ProductCardContent[];
}

export interface HomepageContent {
  hero: HeroContent;
  promoBanner: PromoBannerContent;
  exclusiveDeals: ExclusiveDealsContent;
  eeTvSection: EeTvSectionContent;
  btEeSection: BtEeSectionContent;
}

// Default content (fallback when Contentful is empty)
export const defaultHomepageContent: HomepageContent = {
  hero: {
    title: 'Upgrade your home with BT Broadband',
    subtitle: 'Fast, reliable BT Broadband and EE TV packages for busy households.',
  },
  promoBanner: {
    text: "Don't have BT Broadband yet? Find your available deals",
    linkUrl: '#',
  },
  exclusiveDeals: {
    badge: 'Trusted, reliable broadband',
    title: 'Exclusive deals just for you',
    subtitle: 'Already a BT customer? Unlock personalised offers on broadband and TV.',
    ctaText1: 'Log in for exclusive deals',
    ctaText2: 'Manage My BT account',
    imageUrl: 'https://www.bt.com/content/dam/bt/storefront/bt-home/newcust/images/mainherobanner/2025/march/Homepage_NewCust_MainHero_v2_Desktop_1920x1200.webp',
  },
  eeTvSection: {
    badge: 'EE TV',
    title: 'Experience entertainment like never before',
    description: 'Stream your favourite shows, movies, and sports all in one place. With EE TV, you get access to premium content from Netflix, Disney+, Apple TV+, and more.',
    features: [
      'Over 100+ channels included',
      'Premium streaming apps built-in',
      'Pause and rewind live TV',
      'Voice control with your remote',
    ],
    ctaText1: 'Get EE TV',
    ctaText2: 'Learn more',
    imageUrl: 'https://www.bt.com/content/dam/bt/consumer/homepage-images/Cards/products/ee-tv-box.png',
  },
  btEeSection: {
    title: 'BT + EE, the ultimate home entertainment',
    subtitle: "Power your home with BT's Full Fibre Broadband (up to 900Mbps) and tailor your EE TV with Sky Sports, Netflix, or Now Cinema. Grab the best of both worlds.",
    products: [
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
    ],
  },
};

// Helper to extract text from RichText field
function extractTextFromRichText(richText: unknown): string {
  if (!richText || typeof richText !== 'object') return '';
  const rt = richText as { content?: Array<{ content?: Array<{ value?: string }> }> };
  if (!rt.content) return '';

  return rt.content
    .map((node) => {
      if (node.content) {
        return node.content.map((child) => child.value || '').join('');
      }
      return '';
    })
    .join('\n');
}

// Fetch homepage content from Contentful
export async function getHomepageContent(preview = false): Promise<HomepageContent> {
  try {
    const contentfulClient = getClient(preview);
    if (!contentfulClient) {
      return defaultHomepageContent;
    }
    // Fetch individual section types
    return await fetchSectionContent(contentfulClient);
  } catch (error) {
    console.error('Error fetching Contentful content:', error);
    return defaultHomepageContent;
  }
}

// Fetch individual sections if no homepage entry exists
async function fetchSectionContent(contentfulClient: ReturnType<typeof createClient>): Promise<HomepageContent> {
  const content: HomepageContent = { ...defaultHomepageContent };

  try {
    // Fetch hero section
    const heroEntries = await contentfulClient.getEntries({
      content_type: 'heroSection',
      limit: 1,
    });
    if (heroEntries.items.length > 0) {
      const hero = heroEntries.items[0].fields;
      content.hero = {
        title: (hero.title as string) || content.hero.title,
        subtitle: (hero.subtitle as string) || content.hero.subtitle,
      };
    }

    // Fetch promo banner
    const promoEntries = await contentfulClient.getEntries({
      content_type: 'promoBanner',
      limit: 1,
    });
    if (promoEntries.items.length > 0) {
      const promo = promoEntries.items[0].fields;
      content.promoBanner = {
        text: (promo.text as string) || content.promoBanner.text,
        linkUrl: (promo.linkUrl as string) || content.promoBanner.linkUrl,
      };
    }

    // Fetch exclusive deals section
    const dealsEntries = await contentfulClient.getEntries({
      content_type: 'exclusiveDeals',
      limit: 1,
    });
    if (dealsEntries.items.length > 0) {
      const deals = dealsEntries.items[0].fields;
      content.exclusiveDeals = {
        badge: (deals.badge as string) || content.exclusiveDeals.badge,
        title: (deals.title as string) || content.exclusiveDeals.title,
        subtitle: (deals.subtitle as string) || content.exclusiveDeals.subtitle,
        ctaText1: (deals.ctaText1 as string) || content.exclusiveDeals.ctaText1,
        ctaText2: (deals.ctaText2 as string) || content.exclusiveDeals.ctaText2,
        imageUrl: (deals.imageUrl as string) || parseImageUrl(deals.image) || content.exclusiveDeals.imageUrl,
      };
    }

    // Fetch EE TV section
    const eeTvEntries = await contentfulClient.getEntries({
      content_type: 'eeTvSection',
      limit: 1,
    });
    if (eeTvEntries.items.length > 0) {
      const eetv = eeTvEntries.items[0].fields;
      content.eeTvSection = {
        badge: (eetv.badge as string) || content.eeTvSection.badge,
        title: (eetv.title as string) || content.eeTvSection.title,
        description: (eetv.description as string) || content.eeTvSection.description,
        features: (eetv.features as string[]) || content.eeTvSection.features,
        ctaText1: (eetv.ctaText1 as string) || content.eeTvSection.ctaText1,
        ctaText2: (eetv.ctaText2 as string) || content.eeTvSection.ctaText2,
        imageUrl: (eetv.imageUrl as string) || parseImageUrl(eetv.image) || content.eeTvSection.imageUrl,
      };
    }

    // Fetch BT+EE section
    const btEeEntries = await contentfulClient.getEntries({
      content_type: 'btEeSection',
      limit: 1,
    });
    if (btEeEntries.items.length > 0) {
      const btee = btEeEntries.items[0].fields;
      content.btEeSection = {
        title: (btee.title as string) || content.btEeSection.title,
        subtitle: (btee.subtitle as string) || content.btEeSection.subtitle,
        products: content.btEeSection.products, // Products fetched separately
      };
    }

    // Fetch product cards
    const productEntries = await contentfulClient.getEntries({
      content_type: 'productCard',
      limit: 10,
      order: ['fields.order'],
    });
    if (productEntries.items.length > 0) {
      content.btEeSection.products = productEntries.items.map((entry) => {
        const fields = entry.fields;
        return {
          category: (fields.category as string) || '',
          categoryColor: (fields.categoryColor as string) || 'text-[#5514B4]',
          title: (fields.title as string) || '',
          description: (fields.description as string) || '',
          ctaText: (fields.ctaText as string) || '',
          imageUrl: (fields.imageUrl as string) || parseImageUrl(fields.image) || '',
        };
      });
    }
  } catch (error) {
    console.error('Error fetching section content:', error);
  }

  return content;
}

// Parse homepage entry
function parseHomepageEntry(entry: Entry<EntrySkeletonType>): HomepageContent {
  const fields = entry.fields;

  return {
    hero: {
      title: (fields.heroTitle as string) || defaultHomepageContent.hero.title,
      subtitle: (fields.heroSubtitle as string) || defaultHomepageContent.hero.subtitle,
    },
    promoBanner: {
      text: (fields.promoText as string) || defaultHomepageContent.promoBanner.text,
      linkUrl: (fields.promoLink as string) || defaultHomepageContent.promoBanner.linkUrl,
    },
    exclusiveDeals: {
      badge: (fields.dealsBadge as string) || defaultHomepageContent.exclusiveDeals.badge,
      title: (fields.dealsTitle as string) || defaultHomepageContent.exclusiveDeals.title,
      subtitle: (fields.dealsSubtitle as string) || defaultHomepageContent.exclusiveDeals.subtitle,
      ctaText1: (fields.dealsCta1 as string) || defaultHomepageContent.exclusiveDeals.ctaText1,
      ctaText2: (fields.dealsCta2 as string) || defaultHomepageContent.exclusiveDeals.ctaText2,
      imageUrl: parseImageUrl(fields.dealsImage) || defaultHomepageContent.exclusiveDeals.imageUrl,
    },
    eeTvSection: {
      badge: (fields.eeTvBadge as string) || defaultHomepageContent.eeTvSection.badge,
      title: (fields.eeTvTitle as string) || defaultHomepageContent.eeTvSection.title,
      description: (fields.eeTvDescription as string) || defaultHomepageContent.eeTvSection.description,
      features: (fields.eeTvFeatures as string[]) || defaultHomepageContent.eeTvSection.features,
      ctaText1: (fields.eeTvCta1 as string) || defaultHomepageContent.eeTvSection.ctaText1,
      ctaText2: (fields.eeTvCta2 as string) || defaultHomepageContent.eeTvSection.ctaText2,
      imageUrl: parseImageUrl(fields.eeTvImage) || defaultHomepageContent.eeTvSection.imageUrl,
    },
    btEeSection: {
      title: (fields.btEeTitle as string) || defaultHomepageContent.btEeSection.title,
      subtitle: (fields.btEeSubtitle as string) || defaultHomepageContent.btEeSection.subtitle,
      products: defaultHomepageContent.btEeSection.products, // Products would need linked entries
    },
  };
}

// Helper to parse image URL from Contentful Asset
function parseImageUrl(asset: unknown): string | null {
  if (!asset || typeof asset !== 'object') return null;
  const a = asset as { fields?: { file?: { url?: string } } };
  if (a.fields?.file?.url) {
    return a.fields.file.url.startsWith('//')
      ? `https:${a.fields.file.url}`
      : a.fields.file.url;
  }
  return null;
}

export { extractTextFromRichText };
