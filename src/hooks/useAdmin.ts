import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuthStore } from '../store';

export function useAdmin() {
  const { isAuthenticated, user, sessionId } = useAuthStore();
  const rawProducts = useQuery(api.products.list);
  const rawCollections = useQuery(api.collections.list);
  const rawOrders = useQuery(api.orders.list);
  const rawUsers = useQuery(api.users.list);
  const rawInstallments = useQuery(api.installments.list);
  const rawBanners = useQuery(api.homepageBanners.list);
  const rawCategoryImages = useQuery(api.categoryImages.listAll);
  const rawSections = useQuery(api.homepageSections.list);
  const rawPromoBanners = useQuery(api.promotionalBanners.list);
  const rawMedia = useQuery(api.mediaLibrary.list);
  const rawSettings = useQuery(api.websiteSettings.getAll);
  const rawCampaigns = useQuery(api.campaigns.list);
  const rawCoupons = useQuery(api.coupons.list);

  const addProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const deleteProduct = useMutation(api.products.remove);
  const addCollection = useMutation(api.collections.create);
  const updateOrder = useMutation(api.orders.updateStatus);
  const createBanner = useMutation(api.homepageBanners.create);
  const updateBanner = useMutation(api.homepageBanners.update);
  const removeBanner = useMutation(api.homepageBanners.remove);
  const reorderBanner = useMutation(api.homepageBanners.reorder);
  const createCategory = useMutation(api.categoryImages.create);
  const updateCategory = useMutation(api.categoryImages.update);
  const removeCategory = useMutation(api.categoryImages.remove);
  const upsertSection = useMutation(api.homepageSections.upsert);
  const updateSection = useMutation(api.homepageSections.update);
  const createPromoBanner = useMutation(api.promotionalBanners.create);
  const updatePromoBanner = useMutation(api.promotionalBanners.update);
  const removePromoBanner = useMutation(api.promotionalBanners.remove);
  const setSetting = useMutation(api.websiteSettings.set);
  const createMedia = useMutation(api.mediaLibrary.create);
  const removeMedia = useMutation(api.mediaLibrary.remove);
  const createCampaign = useMutation(api.campaigns.create);
  const updateCampaign = useMutation(api.campaigns.update);
  const removeCampaign = useMutation(api.campaigns.remove);
  const createCoupon = useMutation(api.coupons.create);
  const updateCoupon = useMutation(api.coupons.update);
  const removeCoupon = useMutation(api.coupons.remove);

  const isAdmin = isAuthenticated && user?.role === 'admin';

  const products = (rawProducts ?? []).map((p) => ({
    ...p,
    id: p._id,
  }));

  const collections = (rawCollections ?? []).map((c) => ({
    ...c,
    id: c._id,
    createdAt: new Date(c._creationTime).toISOString(),
  }));

  const orders = (rawOrders ?? []).map((o) => ({
    ...o,
    id: o._id,
    createdAt: o.createdAt || new Date(o._creationTime).toISOString(),
    updatedAt: o.updatedAt || new Date(o._creationTime).toISOString(),
  }));

  const customers = rawUsers === undefined ? undefined
    : rawUsers.filter((u) => u.role === 'customer').map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        spent: 0,
        orders: 0,
        membership: 'Silver' as const,
      }));

  const installments = rawInstallments === undefined ? undefined
    : rawInstallments.map((i) => ({
        ...i,
        id: i._id,
      }));

  const banners = (rawBanners ?? []).map((b: any) => ({ ...b, id: b._id }));
  const categoryImages = (rawCategoryImages ?? []).map((c: any) => ({ ...c, id: c._id }));
  const sections = (rawSections ?? []).map((s: any) => ({ ...s, id: s._id }));
  const promoBanners = (rawPromoBanners ?? []).map((p: any) => ({ ...p, id: p._id }));
  const media = (rawMedia ?? []).map((m: any) => ({ ...m, id: m._id }));
  const campaigns = (rawCampaigns ?? []).map((c: any) => ({ ...c, id: c._id }));
  const coupons = (rawCoupons ?? []).map((c: any) => ({ ...c, id: c._id }));
  const settings = rawSettings ?? {};

  const wrap = (fn: any) => (data: any) => fn({ sessionId, ...data });
  const wrapWithId = (fn: any) => (id: string, data: any) => fn({ sessionId, id: id as any, ...data });
  const wrapIdOnly = (fn: any) => (id: string) => fn({ sessionId, id: id as any });

  return {
    products: isAdmin ? products : [],
    collections: isAdmin ? collections : [],
    orders: isAdmin ? orders : [],
    customers: isAdmin && rawUsers !== undefined ? (customers ?? []) : undefined,
    installments: isAdmin && rawInstallments !== undefined ? (installments ?? []) : undefined,
    banners: isAdmin ? banners : [],
    categoryImages: isAdmin ? categoryImages : [],
    sections: isAdmin ? sections : [],
    promoBanners: isAdmin ? promoBanners : [],
    media: isAdmin ? media : [],
    campaigns: isAdmin ? campaigns : [],
    coupons: isAdmin ? coupons : [],
    settings: isAdmin ? settings : {},
    loading: !isAdmin ? false : rawProducts === undefined,
    addProduct: (product: any) => addProduct(product),
    updateProduct: (id: string, product: any) => updateProduct({ id: id as any, ...product }),
    deleteProduct: (id: string) => deleteProduct({ id: id as any }),
    addCollection: (coll: any) => addCollection(coll),
    updateOrder: (id: string, data: any) => updateOrder({ id: id as any, ...data }),
    createBanner: wrap(createBanner),
    updateBanner: wrapWithId(updateBanner),
    removeBanner: wrapIdOnly(removeBanner),
    reorderBanner: (items: { id: string; displayOrder: number }[]) =>
      reorderBanner({ sessionId, items: items.map(i => ({ id: i.id as any, displayOrder: i.displayOrder })) }),
    createCategory: wrap(createCategory),
    updateCategory: wrapWithId(updateCategory),
    removeCategory: wrapIdOnly(removeCategory),
    upsertSection: (data: any) => upsertSection({ sessionId, ...data }),
    createPromoBanner: wrap(createPromoBanner),
    updatePromoBanner: wrapWithId(updatePromoBanner),
    removePromoBanner: wrapIdOnly(removePromoBanner),
    setSetting: (key: string, value: any) => setSetting({ sessionId, key, value }),
    createMedia: wrap(createMedia),
    removeMedia: wrapIdOnly(removeMedia),
    createCampaign: wrap(createCampaign),
    updateCampaign: wrapWithId(updateCampaign),
    removeCampaign: wrapIdOnly(removeCampaign),
    createCoupon: wrap(createCoupon),
    updateCoupon: wrapWithId(updateCoupon),
    removeCoupon: wrapIdOnly(removeCoupon),
  };
}
