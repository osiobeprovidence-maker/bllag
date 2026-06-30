/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useAuthStore } from './store';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Checkout } from './pages/Checkout';
import { AdminDashboard } from './pages/AdminDashboard';
import { Collections } from './pages/Collections';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Affiliate } from './pages/Affiliate';
import { Profile } from './pages/Profile';
import { Wallet } from './pages/Wallet';
import { Membership } from './pages/Membership';
import { Orders } from './pages/Orders';
import { Notifications } from './pages/Notifications';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { SearchResults } from './pages/SearchResults';
import { CategoryListing } from './pages/CategoryListing';
import { OrderDetails } from './pages/OrderDetails';
import { OrderTracking } from './pages/OrderTracking';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentFailed } from './pages/PaymentFailed';
import { AddressBook } from './pages/AddressBook';
import { AddEditAddress } from './pages/AddEditAddress';
import { Settings } from './pages/Settings';
import { Security } from './pages/Security';
import { HelpCenter } from './pages/support/HelpCenter';
import { FAQ } from './pages/support/FAQ';
import { ReturnsRefunds } from './pages/support/ReturnsRefunds';
import { TermsConditions } from './pages/support/TermsConditions';
import { PrivacyPolicy } from './pages/support/PrivacyPolicy';
import { SizeGuide } from './pages/support/SizeGuide';
import { AuthenticationProtocol } from './pages/support/AuthenticationProtocol';
import { BespokeService } from './pages/BespokeService';
import { Sustainability } from './pages/support/Sustainability';
import { AccessibilityStatement } from './pages/support/AccessibilityStatement';
import { CookiesPolicy } from './pages/support/CookiesPolicy';
import { NotFound } from './pages/NotFound';
import { ServerError } from './pages/ServerError';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const upsertUser = useMutation(api.users.upsert);

  useEffect(() => {
    let unsubDoc: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const role = firebaseUser.email === 'riderezzy@gmail.com' ? 'admin' : 'customer';

        setUser({
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          role: role as any,
          walletBalance: 50000,
          transactions: [],
          installments: [],
          membership: { level: 'none', status: 'inactive' }
        });

        unsubDoc = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUser({
              name: firebaseUser.displayName || data.name || 'User',
              email: firebaseUser.email || data.email || '',
              role: role as any,
              profileImage: data.profileImage,
              address: data.address,
              walletBalance: data.walletBalance ?? 50000,
              transactions: data.transactions ?? [],
              installments: data.installments ?? [],
              membership: data.membership ?? { level: 'none', status: 'inactive' }
            });

            upsertUser({
              firebaseUid: firebaseUser.uid,
              name: firebaseUser.displayName || data.name || 'User',
              email: firebaseUser.email || data.email || '',
              role: role,
              walletBalance: data.walletBalance ?? 50000,
            });
          } else {
            setDoc(doc(db, 'users', firebaseUser.uid), {
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              walletBalance: 50000,
              createdAt: new Date().toISOString()
            }).catch((err) => {
              console.error("Error creating Firestore user doc:", err);
            });

            upsertUser({
              firebaseUid: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              role: role,
              walletBalance: 50000,
            });
          }
        }, (error) => {
          console.error("Error fetching user profile:", error);
        });
      } else {
        if (unsubDoc) unsubDoc();
        setUser(null);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubDoc) unsubDoc();
    };
  }, [setUser, upsertUser]);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <ScrollToTop />
          <Helmet>
            <title>bllag - Luxury Jewelry & High-End Collections</title>
            <meta name="description" content="Discover the finest luxury jewelry, royal gold collections, and minimalist diamonds at bllag. Crafted with precision and elegance." />
          </Helmet>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/affiliate" element={<Affiliate />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/order/:id" element={<OrderDetails />} />
                <Route path="/order-tracking" element={<OrderTracking />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/category/:category" element={<CategoryListing />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-failed" element={<PaymentFailed />} />
                <Route path="/address-book" element={<AddressBook />} />
                <Route path="/address-book/add" element={<AddEditAddress />} />
                <Route path="/address-book/edit/:id" element={<AddEditAddress />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/security" element={<Security />} />
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/returns" element={<ReturnsRefunds />} />
                <Route path="/size-guide" element={<SizeGuide />} />
                <Route path="/authentication" element={<AuthenticationProtocol />} />
                <Route path="/bespoke" element={<BespokeService />} />
                <Route path="/sustainability" element={<Sustainability />} />
                <Route path="/accessibility" element={<AccessibilityStatement />} />
                <Route path="/cookies" element={<CookiesPolicy />} />
                <Route path="/terms" element={<TermsConditions />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/error" element={<ServerError />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
