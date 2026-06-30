import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuthStore } from '../store';

export function useCustomerData() {
  const user = useAuthStore((state) => state.user);
  const rawOrders = useQuery(api.orders.getByUser, user?.email ? { userId: user.email } : 'skip');
  const rawNotifications = useQuery(api.notifications.getByUser, user?.email ? { userId: user.email } : 'skip');
  const markAsRead = useMutation(api.notifications.markAsRead);
  const addReview = useMutation(api.reviews.create);

  const orders = (rawOrders ?? []).map((o) => ({
    ...o,
    id: o._id,
    createdAt: o.createdAt || new Date(o._creationTime).toISOString(),
    updatedAt: o.updatedAt || new Date(o._creationTime).toISOString(),
  }));

  const notifications = (rawNotifications ?? []).map((n) => ({
    ...n,
    id: n._id,
    createdAt: n.createdAt || new Date(n._creationTime).toISOString(),
  }));

  return {
    orders,
    notifications,
    loading: rawOrders === undefined,
    markNotificationAsRead: (id: string) => markAsRead({ id: id as any }),
    addReview: (review: any) => addReview(review),
  };
}
