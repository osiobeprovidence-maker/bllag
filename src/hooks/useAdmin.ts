import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { Product, Collection, Order, useAuthStore } from '../store';

export function useAdmin() {
  const { isAuthenticated, user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only run listeners if authenticated as admin
    if (!isAuthenticated || user?.role !== 'admin') {
      setLoading(false);
      return;
    }

    const qProducts = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubProducts = onSnapshot(qProducts, (snapshot) => {
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'products'));

    const qCollections = query(collection(db, 'collections'), orderBy('createdAt', 'desc'));
    const unsubCollections = onSnapshot(qCollections, (snapshot) => {
      setCollections(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Collection)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'collections'));

    const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'orders'));

    return () => {
      unsubProducts();
      unsubCollections();
      unsubOrders();
    };
  }, [isAuthenticated, user?.role]);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'products');
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      await updateDoc(doc(db, 'products', id), {
        ...product,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  };

  const addCollection = async (coll: Omit<Collection, 'id'>) => {
    try {
      await addDoc(collection(db, 'collections'), {
        ...coll,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'collections');
    }
  };

  const updateOrder = async (id: string, data: Partial<Order>) => {
    try {
      await updateDoc(doc(db, 'orders', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${id}`);
    }
  };

  return {
    products,
    collections,
    orders,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    addCollection,
    updateOrder,
  };
}
