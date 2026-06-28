import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { products } from '../data/products';
import { useShopStore, Review as ReviewType } from '../store';
import { useCustomerData } from '../hooks/useCustomerData';
import React, { useState, useEffect } from 'react';
import { Heart, ChevronRight, ChevronLeft, Minus, Plus, Star, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);
  const { addToCart, toggleWishlist, isInWishlist } = useShopStore();
  const { addReview } = useCustomerData();
  const [quantity, setQuantity] = useState(1);
  const [isPaySmallSmall, setIsPaySmallSmall] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'materials' | 'shipping' | 'reviews'>('description');
  const [productReviews, setProductReviews] = useState<ReviewType[]>([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    if (!id) return;
    const q = query(collection(db, 'reviews'), where('productId', '==', id), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setProductReviews(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ReviewType)));
    }, (error) => {
      console.error("Error fetching reviews:", error);
    });
    return unsub;
  }, [id]);

  if (!product) {
    return <div className="pt-32 text-center">Product not found</div>;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, { isPaySmallSmall, isGift });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("Please log in to submit a review.");
      return;
    }
    await addReview({
      productId: id!,
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName || 'Anonymous',
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    });
    setReviewForm({ rating: 5, comment: '' });
  };

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <Helmet>
        <title>{product.name} - BLAQ Luxury Collections</title>
        <meta name="description" content={`Experience the ${product.name}. ${product.description}`} />
      </Helmet>
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-muted-foreground uppercase tracking-widest mb-8">
        <button onClick={() => navigate('/')} className="hover:text-primary">Home</button>
        <ChevronRight className="h-3 w-3" />
        <button onClick={() => navigate(`/shop?category=${product.category}`)} className="hover:text-primary">{product.category}</button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-primary">{product.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
        {/* Images */}
        <div className="md:w-1/2 flex gap-4">
          <div className="hidden lg:flex flex-col gap-4 w-20">
            {[1, 2, 3].map((i) => (
              <button key={i} className="aspect-[3/4] bg-muted overflow-hidden">
                <img referrerPolicy="no-referrer" src={product.image} alt="" className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
          <div className="flex-1 aspect-[3/4] bg-muted relative overflow-hidden group">
            <img 
              referrerPolicy="no-referrer"
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Info */}
        <div className="md:w-1/2 flex flex-col pt-4">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <div className="flex text-accent text-sm">
                {'★'.repeat(Math.floor(product.rating || 5))}{'☆'.repeat(5 - Math.floor(product.rating || 5))}
              </div>
              <span className="text-sm text-blue-600 underline cursor-pointer">{product.reviews || 0} Reviews</span>
            </div>
            <span className="text-sm text-gray-500">|</span>
            <span className="text-sm text-gray-500">10k+ sold</span>
          </div>

          <div className="flex items-end gap-3 mb-6 bg-muted/50 p-4 border border-primary/5 rounded-sm">
            <span className="text-3xl font-black text-accent">₦{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through mb-1">₦{product.originalPrice.toLocaleString()}</span>
            )}
            {product.discount && (
              <span className="bg-accent text-white text-xs font-bold px-2 py-1 mb-1 ml-2">-{product.discount}% OFF</span>
            )}
          </div>

          <p className="text-muted-foreground font-light leading-relaxed mb-10">
            {product.description}
          </p>

          <div className="flex flex-col md:flex-row items-stretch space-y-4 md:space-y-0 md:space-x-4 mb-4">
            <div className="flex items-center border border-muted w-full md:w-32 justify-between">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-muted transition-colors font-bold text-xl"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-center font-bold">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-muted transition-colors font-bold text-xl"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-accent transition-colors"
            >
              Add to Bag
            </button>
            
            <button 
              onClick={() => toggleWishlist(product)}
              className="p-4 border border-muted hover:border-black transition-colors flex items-center justify-center group"
            >
              <Heart className={cn("h-6 w-6 transition-colors", isInWishlist(product.id) ? "fill-accent text-accent" : "text-gray-500 group-hover:text-black")} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => setIsPaySmallSmall(!isPaySmallSmall)}
              className={cn(
                "flex items-center justify-center gap-2 border py-3 px-4 transition-all group",
                isPaySmallSmall ? "border-accent bg-accent/5 shadow-inner" : "border-muted hover:border-accent"
              )}
            >
              <div className="flex flex-col items-center text-center">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest transition-colors",
                  isPaySmallSmall ? "text-accent" : "text-muted-foreground group-hover:text-accent"
                )}>Pay Small Small</span>
                <span className="text-xs font-black">₦{(product.price / 4).toLocaleString()} / mo</span>
              </div>
            </button>
            <button 
              onClick={() => setIsGift(!isGift)}
              className={cn(
                "flex items-center justify-center gap-2 border py-3 px-4 transition-all group",
                isGift ? "border-accent bg-accent/5 shadow-inner" : "border-muted hover:border-accent"
              )}
            >
              <div className="flex flex-col items-center text-center">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest transition-colors",
                  isGift ? "text-accent" : "text-muted-foreground group-hover:text-accent"
                )}>Send as Gift</span>
                <span className="text-xs font-black">Digital Receipt</span>
              </div>
            </button>
          </div>

          {/* Details Tabs */}
          <div className="mt-12 border-t border-muted pt-8">
            <div className="flex space-x-8 mb-6">
              {[
                { id: 'description', label: 'Details' },
                { id: 'materials', label: 'Materials' },
                { id: 'shipping', label: 'Shipping' },
                { id: 'reviews', label: `Reviews (${productReviews.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "text-sm uppercase tracking-widest pb-2 border-b transition-colors",
                    activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-primary"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-muted-foreground font-light leading-relaxed"
            >
              {activeTab === 'description' && (
                <p>Designed in our Paris studio, this piece is crafted to be worn every day. Layer it with your favorite pieces or let it shine on its own.</p>
              )}
              {activeTab === 'materials' && (
                <ul className="list-disc pl-4 space-y-2">
                  <li>Solid 18k Gold</li>
                  <li>Ethically sourced diamonds (VS+ clarity)</li>
                  <li>Nickel-free and hypoallergenic</li>
                </ul>
              )}
              {activeTab === 'shipping' && (
                <p>Free express shipping on all orders over $200. Returns accepted within 30 days of delivery. Custom pieces are final sale.</p>
              )}
              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Write a Review</h4>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button 
                          key={s} 
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                        >
                          <Star className={cn("h-4 w-4", s <= reviewForm.rating ? "fill-accent text-accent" : "text-gray-300")} />
                        </button>
                      ))}
                    </div>
                    <textarea 
                      required
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Share your thoughts on this piece..."
                      className="w-full bg-white border border-gray-200 p-4 text-xs focus:outline-none focus:border-accent"
                      rows={3}
                    />
                    <button type="submit" className="bg-primary text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-colors">
                      Submit Review
                    </button>
                  </form>

                  <div className="space-y-6">
                    {productReviews.length === 0 ? (
                      <p className="text-center py-8 italic">No reviews yet. Be the first to review!</p>
                    ) : (
                      productReviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-6">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex text-accent text-[10px] mb-1">
                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                              </div>
                              <p className="font-black text-[10px] uppercase tracking-widest text-primary">{review.userName}</p>
                            </div>
                            <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs italic leading-relaxed text-gray-600">"{review.comment}"</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <div className="mt-20 border-t border-muted pt-12">
        <h2 className="text-2xl font-bold uppercase mb-6">More To Love</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4).map(p => (
            <Link key={p.id} to={`/product/${p.id}`} className="group block bg-white border border-muted hover:shadow-md transition-shadow">
              <div className="aspect-[4/5] bg-muted relative overflow-hidden">
                <img referrerPolicy="no-referrer" src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {p.discount && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-accent text-white text-xs font-bold px-2 py-1">-{p.discount}%</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-sm text-gray-800 line-clamp-2 mb-1 group-hover:text-accent transition-colors">{p.name}</h3>
                <div className="flex items-center gap-1 mb-1">
                  <div className="flex text-accent text-[10px]">
                    {'★'.repeat(Math.floor(p.rating || 5))}{'☆'.repeat(5 - Math.floor(p.rating || 5))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-accent">₦{p.price.toLocaleString()}</span>
                  {p.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">₦{p.originalPrice.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
