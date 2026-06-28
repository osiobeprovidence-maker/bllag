import { ShoppingBag, Filter, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { EmptyState } from '../components/ui/EmptyState';

const categoriesList = [
  'All', 'Necklaces', 'Rings', 'Earrings', 'Hand Chains', 'Leg Chains', 'Hair Accessories'
];

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const allProducts = useQuery(api.products.list);
  const products = allProducts ?? [];
  const currentCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('q') || '';
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProducts = products.filter((p: any) => {
    const matchesCategory = currentCategory === 'All' || p.category === currentCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-24 pb-24 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2">
          {searchQuery ? `Search: ${searchQuery}` : (currentCategory === 'All' ? 'All Jewelry' : currentCategory)}
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {filteredProducts.length} items found
          </p>
          {searchQuery && (
            <button 
              onClick={() => {
                searchParams.delete('q');
                setSearchParams(searchParams);
              }}
              className="text-xs font-bold uppercase tracking-widest text-accent hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="lg:hidden mb-6">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              aria-expanded={isFilterOpen}
              aria-controls="shop-filters"
              className="flex items-center space-x-2 text-sm uppercase tracking-widest border border-muted px-4 py-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          <div 
            id="shop-filters"
            className={cn(
              "lg:block space-y-10",
              isFilterOpen ? "block" : "hidden"
            )}
          >
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide mb-4 border-b pb-2">Categories</h3>
              <ul className="space-y-3">
                {categoriesList.map(category => (
                  <li key={category}>
                    <button
                      onClick={() => {
                        if (category === 'All') {
                          searchParams.delete('category');
                        } else {
                          searchParams.set('category', category);
                        }
                        setSearchParams(searchParams);
                        setIsFilterOpen(false);
                      }}
                      className={cn(
                        "text-sm transition-colors hover:text-accent flex w-full justify-between items-center",
                        currentCategory === category ? "text-accent font-bold" : "text-gray-700"
                      )}
                    >
                      <span>{category}</span>
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {category === 'All' ? products.length : products.filter((p: any) => p.category === category).length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mock Price Filter */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide mb-4 border-b pb-2">Price</h3>
              <ul className="space-y-3">
                {['Under ₦3,000', '₦3,000 - ₦5,000', 'Over ₦5,000'].map(price => (
                  <li key={price}>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-accent border-muted focus:ring-accent" />
                      <span className="text-sm text-gray-700">{price}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="py-20">
              <EmptyState 
                icon={ShoppingBag}
                title="No Pieces Found"
                message={searchQuery ? `We couldn't find any masterpieces matching "${searchQuery}".` : "No jewelry items found in this collection."}
                action={searchQuery ? {
                  label: "Clear Search",
                  onClick: () => {
                    searchParams.delete('q');
                    setSearchParams(searchParams);
                  }
                } : undefined}
              />
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-gray-500">{filteredProducts.length} items found</span>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground border p-2 bg-white">
                  <span>Sort by:</span>
                  <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                    <span>Recommended</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Link to={`/product/${product._id}`} className="group block bg-white border border-muted hover:shadow-md transition-shadow">
                      <div className="relative overflow-hidden aspect-[4/5] bg-muted">
                        <img 
                          referrerPolicy="no-referrer"
                          src={product.image} 
                          alt={product.name} 
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {product.discount && (
                          <div className="absolute top-2 left-2">
                            <span className="bg-accent text-white text-xs font-bold px-2 py-1">-{product.discount}%</span>
                          </div>
                        )}
                        {product.isNew && !product.discount && (
                          <div className="absolute top-2 left-2">
                            <span className="bg-black text-white text-[10px] font-bold px-2 py-1">NEW</span>
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2">
                          <span className="bg-white/90 backdrop-blur-sm text-black text-[9px] font-black px-2 py-1 uppercase tracking-tighter shadow-sm border border-black/5">
                            Pay Small Small
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm text-gray-800 line-clamp-2 mb-1 group-hover:text-accent transition-colors">{product.name}</h3>
                        <div className="flex items-center gap-1 mb-1">
                          <div className="flex text-accent text-[10px]">
                            {'★'.repeat(Math.floor(product.rating || 5))}{'☆'.repeat(5 - Math.floor(product.rating || 5))}
                          </div>
                          <span className="text-[10px] text-muted-foreground">({product.reviews || 0})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-accent">₦{product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">₦{product.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
