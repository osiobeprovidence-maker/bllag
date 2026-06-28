import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-widest uppercase">BLAG</h2>
            <p className="text-sm text-gray-400 max-w-xs">
              Trendy jewelry that doesn't break the bank. Upgrade your look with our daily drops.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-accent transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-accent transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="font-bold uppercase text-lg mb-6 tracking-wide">Shop</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/shop?category=Necklaces" className="hover:text-white transition-colors">Necklaces</Link></li>
              <li><Link to="/shop?category=Rings" className="hover:text-white transition-colors">Rings</Link></li>
              <li><Link to="/shop?category=Earrings" className="hover:text-white transition-colors">Earrings</Link></li>
              <li><Link to="/shop?category=Hand Chains" className="hover:text-white transition-colors">Hand Chains</Link></li>
              <li><Link to="/shop?category=Leg Chains" className="hover:text-white transition-colors">Leg Chains</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold uppercase text-lg mb-6 tracking-wide">Customer Care</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/jewelry-care" className="hover:text-white transition-colors">Jewelry Care</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold uppercase text-lg mb-6 tracking-wide">The List</h3>
            <p className="text-sm text-gray-400 mb-4">
              Sign up for updates on new collections and exclusive offers.
            </p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email Address"
                className="bg-transparent border-b border-gray-600 px-0 py-2 text-sm w-full focus:outline-none focus:border-accent text-white"
              />
              <button type="submit" className="border-b border-gray-600 px-2 py-2 hover:border-accent hover:text-accent transition-colors">
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} BLAG. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
