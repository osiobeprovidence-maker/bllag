import { create } from 'zustand';
import { persist } from 'zustand/middleware';
type UserRole = 'admin' | 'customer' | 'agent';

interface Transaction {
  id: string;
  type: 'deposit' | 'payment' | 'gift' | 'installment';
  amount: number;
  date: string;
  description: string;
}

interface InstallmentPlan {
  id: string;
  productName: string;
  totalAmount: number;
  paidAmount: number;
  installmentsCount: number;
  paidInstallments: number;
  nextPaymentDate: string;
  status: 'active' | 'completed';
}

interface Membership {
  level: 'none' | 'silver' | 'gold' | 'platinum';
  status: 'active' | 'inactive';
  nextBillingDate?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: { 
    name: string; 
    email: string; 
    role: UserRole;
    profileImage?: string;
    walletBalance: number;
    emailVerified?: boolean;
    transactions: Transaction[];
    installments: InstallmentPlan[];
    membership: Membership;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  } | null;
  login: (name: string, email: string, role: UserRole) => void;
  logout: () => void;
  setUser: (user: AuthState['user']) => void;
  updateProfileImage: (imageUrl: string) => void;
  updateBalance: (amount: number, type: Transaction['type'], description: string, installmentData?: { productName: string, totalAmount: number, installmentsCount?: number, frequency?: 'weekly' | 'monthly', startDate?: string }) => void;
  updateMembership: (level: Membership['level']) => void;
  updateAddress: (address: NonNullable<AuthState['user']>['address']) => void;
}

export const useAuthStore = create<AuthState>()(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (name, email, role) => set({ 
        isAuthenticated: true, 
        user: { 
          name, 
          email, 
          role, 
          walletBalance: 50000,
          transactions: [
            { id: '1', type: 'deposit', amount: 50000, date: new Date().toISOString(), description: 'Welcome Bonus' }
          ],
          installments: [],
          membership: { level: 'none', status: 'inactive' }
        } 
      }),
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
      setUser: (user) => set({ 
        isAuthenticated: !!user, 
        user: user ? {
          ...user,
          profileImage: user.profileImage,
          walletBalance: user.walletBalance ?? 50000,
          transactions: user.transactions ?? [{ id: '1', type: 'deposit', amount: 50000, date: new Date().toISOString(), description: 'Welcome Bonus' }],
          installments: user.installments ?? [],
          membership: user.membership ?? { level: 'none', status: 'inactive' }
        } : null 
      }),
      updateProfileImage: (imageUrl) => set((state) => {
        if (!state.user) return state;
        return {
          user: {
            ...state.user,
            profileImage: imageUrl
          }
        };
      }),
      updateMembership: (level) => set((state) => {
        if (!state.user) return state;
        const newMembership: Membership = {
          level,
          status: level === 'none' ? 'inactive' : 'active',
          nextBillingDate: level === 'none' ? undefined : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };

        return {
          user: {
            ...state.user,
            membership: newMembership
          }
        };
      }),
      updateAddress: (address) => set((state) => {
        if (!state.user) return state;

        return {
          user: {
            ...state.user,
            address
          }
        };
      }),
      updateBalance: (amount, type, description, installmentData) => set((state) => {
        if (!state.user) return state;
        
        const newTransaction: Transaction = {
          id: Math.random().toString(36).substring(7),
          type,
          amount,
          date: new Date().toISOString(),
          description
        };

        const installments = [...state.user.installments];
        let newInstallment: InstallmentPlan | null = null;

        if (type === 'installment' && installmentData) {
          const frequency = installmentData.frequency || 'weekly';
          const installmentsCount = installmentData.installmentsCount || 4;
          const startDate = installmentData.startDate ? new Date(installmentData.startDate) : new Date();
          
          const nextDate = new Date(startDate);
          if (frequency === 'weekly') {
            nextDate.setDate(nextDate.getDate() + 7);
          } else {
            nextDate.setMonth(nextDate.getMonth() + 1);
          }

          newInstallment = {
            id: Math.random().toString(36).substring(7),
            productName: installmentData.productName,
            totalAmount: installmentData.totalAmount,
            paidAmount: Math.abs(amount),
            installmentsCount: installmentsCount,
            paidInstallments: 1,
            nextPaymentDate: nextDate.toISOString(),
            status: 'active'
          };
          installments.push(newInstallment);
        }

        const newBalance = state.user.walletBalance + amount;
        const newTransactions = [newTransaction, ...state.user.transactions];

        return {
          user: {
            ...state.user,
            walletBalance: newBalance,
            transactions: newTransactions,
            installments
          }
        };
      }),
    })
);

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  category: string;
  image: string;
  description: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

interface CartItem extends Product {
  quantity: number;
  isPaySmallSmall?: boolean;
  isGift?: boolean;
  pssConfig?: {
    frequency: 'weekly' | 'monthly';
    startDate: string;
    installments: number;
  };
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  customerEmail: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  trackingNumber?: string;
  shippingAddress: NonNullable<AuthState['user']>['address'];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order_update' | 'promotion' | 'system';
  read: boolean;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt: string;
}

interface ShopState {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, quantity?: number, options?: { isPaySmallSmall?: boolean; isGift?: boolean }) => void;
  removeFromCart: (productId: string, options?: { isPaySmallSmall?: boolean; isGift?: boolean }) => void;
  updateQuantity: (productId: string, quantity: number, options?: { isPaySmallSmall?: boolean; isGift?: boolean }) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  cartTotal: () => number;
  cartCount: () => number;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      addToCart: (product, quantity = 1, options = {}) =>
        set((state) => {
          const existing = state.cart.find((item) => 
            item.id === product.id && 
            item.isPaySmallSmall === options.isPaySmallSmall && 
            item.isGift === options.isGift
          );
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                (item.id === product.id && 
                 item.isPaySmallSmall === options.isPaySmallSmall && 
                 item.isGift === options.isGift)
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity, ...options }] };
        }),
      removeFromCart: (productId, options = {}) =>
        set((state) => ({
          cart: state.cart.filter((item) => 
            !(item.id === productId && 
              item.isPaySmallSmall === options.isPaySmallSmall && 
              item.isGift === options.isGift)
          ),
        })),
      updateQuantity: (productId, quantity, options = {}) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            (item.id === productId && 
             item.isPaySmallSmall === options.isPaySmallSmall && 
             item.isGift === options.isGift) 
              ? { ...item, quantity: Math.max(1, quantity) } 
              : item
          ),
        })),
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (product) =>
        set((state) => {
          const exists = state.wishlist.some((item) => item.id === product.id);
          if (exists) {
            return {
              wishlist: state.wishlist.filter((item) => item.id !== product.id),
            };
          }
          return { wishlist: [...state.wishlist, product] };
        }),
      isInWishlist: (productId) => get().wishlist.some((item) => item.id === productId),
      cartTotal: () => get().cart.reduce((total, item) => total + item.price * item.quantity, 0),
      cartCount: () => get().cart.reduce((count, item) => count + item.quantity, 0),
    }),
    {
      name: 'blag-shop-storage',
    }
  )
);
