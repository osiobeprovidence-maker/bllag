import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuthStore } from '../store';

export function useCustomerData() {
  const user = useAuthStore((state) => state.user);
  const orders = useQuery(api.orders.getByUser, user?.email ? { userId: user.email } : 'skip');
  const notifications = useQuery(api.notifications.getByUser, user?.email ? { userId: user.email } : 'skip');
  const markAsRead = useMutation(api.notifications.markAsRead);
  const addReview = useMutation(api.reviews.create);

  return {
    orders: orders ?? [],
    notifications: notifications ?? [],
    loading: orders === undefined,
    markNotificationAsRead: (id: string) => markAsRead({ id: id as any }),
    addReview: (review: any) => addReview(review),
  };
}
