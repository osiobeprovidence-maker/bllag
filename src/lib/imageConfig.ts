export type ImageTypeId =
  | 'heroBanner'
  | 'promotionalBannerDesktop'
  | 'promotionalBannerMobile'
  | 'product'
  | 'collection'
  | 'category'
  | 'campaign'
  | 'flashSale'
  | 'membership'
  | 'profileAvatar'
  | 'mediaLibrary';

export interface ImageTypeConfig {
  id: ImageTypeId;
  label: string;
  recommendedWidth: number;
  recommendedHeight: number;
  aspectRatio: string;
  minWidth: number;
  minHeight: number;
  maxSizeMB: number;
  accept: string;
  description: string;
  expectedRatio?: number;
}

export const IMAGE_CONFIGS: Record<ImageTypeId, ImageTypeConfig> = {
  heroBanner: {
    id: 'heroBanner',
    label: 'Hero Banner',
    recommendedWidth: 1920,
    recommendedHeight: 900,
    aspectRatio: '16:9',
    minWidth: 1200,
    minHeight: 560,
    maxSizeMB: 5,
    accept: 'image/jpeg,image/png,image/webp',
    description: '1200×560 min · 1920×900 recommended · 16:9',
    expectedRatio: 16 / 9,
  },
  promotionalBannerDesktop: {
    id: 'promotionalBannerDesktop',
    label: 'Promo Banner (Desktop)',
    recommendedWidth: 1920,
    recommendedHeight: 900,
    aspectRatio: '16:9',
    minWidth: 800,
    minHeight: 350,
    maxSizeMB: 5,
    accept: 'image/jpeg,image/png,image/webp',
    description: '800×350 min · 1920×900 recommended · 16:9',
    expectedRatio: 16 / 9,
  },
  promotionalBannerMobile: {
    id: 'promotionalBannerMobile',
    label: 'Promo Banner (Mobile)',
    recommendedWidth: 600,
    recommendedHeight: 800,
    aspectRatio: '3:4',
    minWidth: 300,
    minHeight: 400,
    maxSizeMB: 5,
    accept: 'image/jpeg,image/png,image/webp',
    description: '300×400 min · 600×800 recommended · 3:4',
    expectedRatio: 3 / 4,
  },
  product: {
    id: 'product',
    label: 'Product Image',
    recommendedWidth: 1000,
    recommendedHeight: 1250,
    aspectRatio: '4:5',
    minWidth: 500,
    minHeight: 625,
    maxSizeMB: 5,
    accept: 'image/jpeg,image/png,image/webp',
    description: '500×625 min · 1000×1250 recommended · 4:5',
    expectedRatio: 4 / 5,
  },
  collection: {
    id: 'collection',
    label: 'Collection Image',
    recommendedWidth: 1200,
    recommendedHeight: 1200,
    aspectRatio: '1:1',
    minWidth: 600,
    minHeight: 600,
    maxSizeMB: 5,
    accept: 'image/jpeg,image/png,image/webp',
    description: '600×600 min · 1200×1200 recommended · 1:1',
    expectedRatio: 1,
  },
  category: {
    id: 'category',
    label: 'Category Image',
    recommendedWidth: 200,
    recommendedHeight: 200,
    aspectRatio: '1:1',
    minWidth: 100,
    minHeight: 100,
    maxSizeMB: 2,
    accept: 'image/jpeg,image/png,image/webp',
    description: '100×100 min · 200×200 recommended · 1:1',
    expectedRatio: 1,
  },
  campaign: {
    id: 'campaign',
    label: 'Campaign Banner',
    recommendedWidth: 1920,
    recommendedHeight: 900,
    aspectRatio: '16:9',
    minWidth: 800,
    minHeight: 350,
    maxSizeMB: 5,
    accept: 'image/jpeg,image/png,image/webp',
    description: '800×350 min · 1920×900 recommended · 16:9',
    expectedRatio: 16 / 9,
  },
  flashSale: {
    id: 'flashSale',
    label: 'Flash Sale Banner',
    recommendedWidth: 1200,
    recommendedHeight: 800,
    aspectRatio: '3:2',
    minWidth: 600,
    minHeight: 400,
    maxSizeMB: 5,
    accept: 'image/jpeg,image/png,image/webp',
    description: '600×400 min · 1200×800 recommended · 3:2',
    expectedRatio: 3 / 2,
  },
  membership: {
    id: 'membership',
    label: 'Membership Banner',
    recommendedWidth: 1920,
    recommendedHeight: 600,
    aspectRatio: '16:5',
    minWidth: 960,
    minHeight: 300,
    maxSizeMB: 5,
    accept: 'image/jpeg,image/png,image/webp',
    description: '960×300 min · 1920×600 recommended · 16:5',
    expectedRatio: 16 / 5,
  },
  profileAvatar: {
    id: 'profileAvatar',
    label: 'Profile Avatar',
    recommendedWidth: 300,
    recommendedHeight: 300,
    aspectRatio: '1:1',
    minWidth: 150,
    minHeight: 150,
    maxSizeMB: 2,
    accept: 'image/jpeg,image/png,image/webp',
    description: '150×150 min · 300×300 recommended · 1:1',
    expectedRatio: 1,
  },
  mediaLibrary: {
    id: 'mediaLibrary',
    label: 'Media Library',
    recommendedWidth: 1920,
    recommendedHeight: 900,
    aspectRatio: '16:9',
    minWidth: 400,
    minHeight: 200,
    maxSizeMB: 10,
    accept: 'image/jpeg,image/png,image/webp,image/gif',
    description: '400×200 min · 1920×900 recommended · 16:9 · Max 10MB',
    expectedRatio: 16 / 9,
  },
};

export const FOCAL_POINTS = [
  { value: 'center', label: 'Center' },
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'top left', label: 'Top Left' },
  { value: 'top right', label: 'Top Right' },
  { value: 'bottom left', label: 'Bottom Left' },
  { value: 'bottom right', label: 'Bottom Right' },
] as const;
