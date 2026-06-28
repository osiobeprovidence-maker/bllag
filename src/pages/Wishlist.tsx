import { Link } from 'react-router-dom';
import { useShopStore } from '../store';
import { motion } from 'motion/react';
import { X, ShoppingBag } from 'lucide-react';

export function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useShopStore();

  if (wishlist.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex flex-col items-center justify-center max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mb-8">Save items you love to your wishlist to easily find them later.</p>
        <Link 
          to="/shop" 
          className="inline-block bg-primary text-primary-foreground px-8 py-4 text-sm uppercase tracking-widest hover:bg-accent transition-colors"
        >
          Discover Pieces
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">Wishlist</h1>
      <p className="text-muted-foreground text-sm uppercase tracking-widest mb-12">
        {wishlist.length} Items Saved
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {wishlist.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
          >
            <div className="relative overflow-hidden mb-4 bg-muted aspect-[3/4]">
              <img 
                referrerPolicy="no-referrer"
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <button 
                onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white text-black transition-colors rounded-full opacity-0 group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full flex items-center justify-center bg-white/90 backdrop-blur-sm text-black py-3 text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" /> Add to Cart
                </button>
              </div>
            </div>
            <Link to={`/product/${product.id}`}>
              <h3 className="text-sm font-medium tracking-wide mb-1 group-hover:text-accent transition-colors">{product.name}</h3>
              <p className="text-sm text-muted-foreground">₦{product.price.toLocaleString()}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
