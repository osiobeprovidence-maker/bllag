import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { SlidersHorizontal, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useShopStore } from '../store';

export function CategoryListing() {
  const { category } = useParams();
  const allProducts = useQuery(api.products.list) ?? [];
  const { addToCart, toggleWishlist } = useShopStore();
  const filteredProducts = category
    ? allProducts.filter((p: any) => p.category.toLowerCase() === category.toLowerCase())
    : allProducts;

  const categoryMetadata: Record<string, any> = {
    'Necklaces': {
      title: 'Royal Collars',
      description: 'Hand-crafted necklaces designed to grace the neck with unparalleled elegance and royal gold.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop'
    },
    'Earrings': {
      title: 'Luminous Studs',
      description: 'Capture the light with our curated collection of diamond and precious stone earrings.',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop'
    },
    'Rings': {
      title: 'Eternal Bands',
      description: 'Symbols of commitment and luxury, crafted from the finest materials in our vault.',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop'
    },
    'Bracelets': {
      title: 'Celestial Links',
      description: 'Sophisticated wristwear that blends modern minimalism with traditional craftsmanship.',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop'
    }
  };

  const meta = categoryMetadata[category || 'Necklaces'] || categoryMetadata['Necklaces'];

  return (
    <div className="pt-20 pb-20">
      <header className="relative h-[60vh] flex items-center justify-center overflow-hidden mb-20">
        <img 
          src={meta.image} 
          alt={category} 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-6">Archive Selection</h1>
          <h2 className="text-5xl lg:text-8xl font-black uppercase tracking-tighter text-white leading-none mb-8">
            {meta.title}
          </h2>
          <p className="text-white/80 text-sm font-bold uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
            {meta.description}
          </p>
        </div>
      </header>

      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="flex items-center gap-6">
            <h3 className="text-xs font-black uppercase tracking-widest">{category} Collection</h3>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{filteredProducts.length} Artifacts</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-accent transition-colors">
              <SlidersHorizontal className="h-4 w-4" />
              Filter Artifacts
            </button>
            <div className="h-4 w-px bg-gray-200"></div>
            <select className="bg-transparent text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer">
              <option>Newest First</option>
              <option>Price: High to Low</option>
              <option>Price: Low to High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {filteredProducts.map((product, index) => (
            <motion.div 
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <Link to={`/product/${product._id}`}>
                <div className="relative aspect-[4/5] bg-[#F8F9FA] overflow-hidden mb-6">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button 
                        onClick={(e) => { e.preventDefault(); addToCart({ ...product, id: product._id } as any); }}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-all"
                      >
                        <ShoppingBag className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={(e) => { e.preventDefault(); toggleWishlist({ ...product, id: product._id } as any); }}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-all"
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </Link>
              <div className="space-y-1">
                <h3 className="text-xs font-black uppercase tracking-widest">{product.name}</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">₦{product.price.toLocaleString()}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <footer className="mt-32 pt-20 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-6">Explore Other Vaults</h3>
              <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8">
                Discover more high-end collections and limited edition artifacts across our various jewelry categories.
              </p>
              <div className="flex flex-wrap gap-4">
                {Object.keys(categoryMetadata).filter(c => c !== category).map(cat => (
                  <Link 
                    key={cat}
                    to={`/category/${cat}`}
                    className="bg-white border border-gray-200 px-6 py-3 text-[9px] font-black uppercase tracking-widest hover:border-accent transition-all"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
            <div className="relative h-64 bg-muted overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop" 
                alt="New Arrivals"
                className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center p-8">
                <h4 className="text-white text-xl font-black uppercase tracking-tight mb-4">Limited Editions</h4>
                <Link to="/shop" className="text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-2 group/btn">
                  View Collection
                  <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
