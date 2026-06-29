import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useShopStore, useAuthStore } from '../../store';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount, wishlist } = useShopStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Collections', path: '/collections' },
  ];

  if (!isAuthenticated) {
    navLinks.push({ name: 'About', path: '/about' });
    navLinks.push({ name: 'Contact', path: '/contact' });
  }

  if (isAuthenticated) {
    navLinks.push({ name: 'Wallet', path: '/wallet' });
    navLinks.push({ name: 'Membership', path: '/membership' });
  }

  if (isAuthenticated && user?.role === 'admin') {
    navLinks.push({ name: 'Dashboard', path: '/admin' });
  }

  return (
    <>
      <div className="bg-primary text-primary-foreground text-center py-2 text-[10px] tracking-[0.2em] uppercase font-medium w-full relative z-50">
        Free express shipping on all orders over $200
      </div>
      <header
        className={cn(
          'sticky top-0 left-0 right-0 z-40 transition-all duration-300 bg-background/90 backdrop-blur-md border-b border-primary/5 text-primary',
          isScrolled ? 'shadow-sm' : ''
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <button
              aria-label="Open mobile menu"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    'text-[11px] uppercase tracking-[0.2em] font-medium hover:text-accent transition-colors',
                    location.pathname === link.path && 'text-accent'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Logo */}
            <Link
              to="/"
              aria-label="bllag Home"
              className="text-3xl font-black uppercase tracking-widest absolute left-1/2 transform -translate-x-1/2"
            >
              <span>bllag</span>
            </Link>

            {/* Icons */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              <button 
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search products"
                className="hidden md:block hover:text-accent transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link to="/wishlist" aria-label={`View wishlist (${wishlist.length} items)`} className="hidden md:block hover:text-accent transition-colors relative">
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link to="/cart" aria-label={`View shopping bag (${cartCount()} items)`} className="hover:text-accent transition-colors relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount() > 0 && (
                  <span className="absolute -top-1 -right-2 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount()}
                  </span>
                )}
              </Link>
              <Link to={isAuthenticated ? "/profile" : "/login"} aria-label={isAuthenticated ? "View profile" : "Login"} className="hidden sm:block hover:text-accent transition-colors">
                <User className="h-5 w-5" />
              </Link>
              {isAuthenticated && (
                <button onClick={() => signOut(auth)} className="hidden sm:block text-xs uppercase tracking-widest font-bold hover:text-accent transition-colors">
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-0 z-[60] bg-background border-b border-muted shadow-lg p-6"
          >
            <div className="max-w-3xl mx-auto flex items-center gap-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <form onSubmit={handleSearch} className="flex-1">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium placeholder:text-muted-foreground"
                />
              </form>
              <button onClick={() => setIsSearchOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-12">
                <Link to="/" className="text-3xl font-black uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>
                  bllag
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex flex-col space-y-6 flex-1">
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }}
                  className="text-2xl font-bold uppercase tracking-tight hover:text-accent transition-colors flex items-center justify-between"
                >
                  Search
                  <Search className="h-6 w-6" />
                </button>
                <Link
                  to="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-bold uppercase tracking-tight hover:text-accent transition-colors flex items-center justify-between"
                >
                  Wishlist
                  <div className="flex items-center">
                    <Heart className="h-6 w-6" />
                    {wishlist.length > 0 && (
                      <span className="ml-2 bg-accent text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                        {wishlist.length}
                      </span>
                    )}
                  </div>
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-bold uppercase tracking-tight hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div className="flex justify-between items-center pt-6 border-t border-muted">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    <Link to="/profile" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="h-5 w-5" />
                      <span className="text-sm tracking-widest uppercase">Account</span>
                    </Link>
                    <button onClick={() => { signOut(auth); setIsMobileMenuOpen(false); }} className="text-sm tracking-widest uppercase text-accent font-bold">
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <User className="h-5 w-5" />
                    <span className="text-sm tracking-widest uppercase">Login</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
