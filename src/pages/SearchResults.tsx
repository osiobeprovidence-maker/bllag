import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, ShoppingBag, Heart } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useShopStore } from '../store';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const allProducts = useQuery(api.products.list) ?? [];
  const { addToCart, toggleWishlist } = useShopStore();

  const filteredProducts = query
    ? allProducts.filter((p: any) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase())
      )
    : allProducts;

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">Search Exploration</h1>
              <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none">
                Results for: <span className="text-muted-foreground italic">"{query}"</span>
              </h2>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <span>{filteredProducts.length} Artifacts Found</span>
              <div className="h-4 w-px bg-gray-200"></div>
              <button className="flex items-center gap-2 hover:text-accent transition-colors">
                <SlidersHorizontal className="h-4 w-4" />
                Refine Search
              </button>
            </div>
          </div>
        </header>

        {filteredProducts.length > 0 ? (
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
                    <div className="absolute top-4 left-4 bg-white px-2 py-1 text-[8px] font-black uppercase tracking-widest">
                      {product.category}
                    </div>
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button 
                        onClick={(e) => { e.preventDefault(); addToCart({ ...product, id: product._id } as any); }}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
                      >
                        <ShoppingBag className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={(e) => { e.preventDefault(); toggleWishlist({ ...product, id: product._id } as any); }}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75"
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
        ) : (
          <div className="py-32 text-center bg-gray-50 border border-dashed border-gray-200">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-6 opacity-20" />
            <h3 className="text-xl font-black uppercase tracking-tight mb-2">No Artifacts Found</h3>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-8">Try adjusting your filters or search terms</p>
            <Link 
              to="/shop"
              className="inline-block bg-primary text-white px-12 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all"
            >
              Browse Full Inventory
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
