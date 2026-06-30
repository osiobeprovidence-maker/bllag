import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuthStore } from '../store';

export function useAdmin() {
  const { isAuthenticated, user } = useAuthStore();
  const rawProducts = useQuery(api.products.list);
  const rawCollections = useQuery(api.collections.list);
  const rawOrders = useQuery(api.orders.list);
  const addProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const deleteProduct = useMutation(api.products.remove);
  const addCollection = useMutation(api.collections.create);
  const updateOrder = useMutation(api.orders.updateStatus);

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

  return {
    products: isAdmin ? products : [],
    collections: isAdmin ? collections : [],
    orders: isAdmin ? orders : [],
    loading: !isAdmin ? false : rawProducts === undefined,
    addProduct: (product: any) => addProduct(product),
    updateProduct: (id: string, product: any) => updateProduct({ id: id as any, ...product }),
    deleteProduct: (id: string) => deleteProduct({ id: id as any }),
    addCollection: (coll: any) => addCollection(coll),
    updateOrder: (id: string, data: any) => updateOrder({ id: id as any, ...data }),
  };
}
