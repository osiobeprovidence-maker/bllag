import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { Order, Notification, Review } from '../store';

export function useCustomerData() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const qOrders = query(
      collection(db, 'orders'), 
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'orders'));

    const qNotifications = query(
      collection(db, 'notifications'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubNotifications = onSnapshot(qNotifications, (snapshot) => {
      setNotifications(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Notification)));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'notifications'));

    return () => {
      unsubOrders();
      unsubNotifications();
    };
  }, [auth.currentUser]);

  const markNotificationAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `notifications/${id}`);
    }
  };

  const addReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'reviews'), {
        ...review,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'reviews');
    }
  };

  return {
    orders,
    notifications,
    loading,
    markNotificationAsRead,
    addReview,
  };
}
