import { Link } from 'react-router-dom';
import { useShopStore, useAuthStore } from '../store';
import { Minus, Plus, X, ArrowRight, Zap, Crown } from 'lucide-react';
import { motion } from 'motion/react';

export function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useShopStore();
  const { user, isAuthenticated } = useAuthStore();

  const subtotal = cartTotal();
  
  let discountRate = 0;
  let freeShipping = false;
  
  if (isAuthenticated && user?.membership.status === 'active') {
    if (user.membership.level === 'silver') discountRate = 0.05;
    if (user.membership.level === 'gold') {
      discountRate = 0.10;
      freeShipping = true;
    }
    if (user.membership.level === 'platinum') {
      discountRate = 0.15;
      freeShipping = true;
    }
  }

  const discount = subtotal * discountRate;
  const shipping = freeShipping ? 0 : (subtotal > 100000 ? 0 : 2500);
  const total = subtotal - discount + shipping;

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex flex-col items-center justify-center max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6">Your Bag is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/shop" 
          className="inline-block bg-primary text-primary-foreground px-8 py-4 text-sm uppercase tracking-widest hover:bg-accent transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-12">Shopping Bag</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
          <div className="hidden sm:grid grid-cols-6 gap-4 text-xs uppercase tracking-widest text-muted-foreground border-b border-muted pb-4 mb-6">
            <div className="col-span-3">Product</div>
            <div className="text-center">Price</div>
            <div className="text-center">Quantity</div>
            <div className="text-right">Total</div>
          </div>

          <div className="space-y-6">
            {cart.map((item, index) => (
              <motion.div 
                key={`${item.id}-${item.isPaySmallSmall}-${item.isGift}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-6 gap-4 items-center border-b border-muted pb-6"
              >
                <div className="col-span-1 sm:col-span-3 flex gap-4">
                  <div className="w-24 aspect-[4/5] bg-muted flex-shrink-0">
                    <img referrerPolicy="no-referrer" src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <Link to={`/product/${item.id}`} className="font-medium tracking-wide hover:text-accent transition-colors mb-1">
                      {item.name}
                    </Link>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest bg-gray-100 px-2 py-0.5">{item.category}</span>
                      {item.isPaySmallSmall && (
                        <span className="text-[10px] text-accent font-black uppercase tracking-widest bg-accent/5 px-2 py-0.5 border border-accent/20">Pay Small Small</span>
                      )}
                      {item.isGift && (
                        <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest bg-indigo-50 px-2 py-0.5 border border-indigo-100">Gift Receipt</span>
                      )}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id, { isPaySmallSmall: item.isPaySmallSmall, isGift: item.isGift })}
                      className="text-xs text-muted-foreground uppercase tracking-widest mt-1 flex items-center hover:text-red-500 transition-colors w-fit"
                    >
                      <X className="h-3 w-3 mr-1" /> Remove
                    </button>
                  </div>
                </div>
                
                <div className="hidden sm:block text-center text-sm">
                  ₦{item.price.toLocaleString()}
                </div>
                
                <div className="flex justify-center sm:justify-center">
                  <div className="flex items-center border border-muted">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1, { isPaySmallSmall: item.isPaySmallSmall, isGift: item.isGift })}
                      className="p-2 hover:bg-muted transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1, { isPaySmallSmall: item.isPaySmallSmall, isGift: item.isGift })}
                      className="p-2 hover:bg-muted transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="text-right text-sm font-medium">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-muted p-8 border border-gray-200">
            <h2 className="text-xl font-black uppercase tracking-tight mb-8">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground uppercase tracking-widest font-bold text-[10px]">Subtotal</span>
                <span className="font-bold">₦{subtotal.toLocaleString()}</span>
              </div>
              {discountRate > 0 && (
                <div className="flex justify-between text-sm text-accent">
                  <span className="uppercase tracking-widest font-bold text-[10px]">Member Discount ({discountRate * 100}%)</span>
                  <span className="font-bold">-₦{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground uppercase tracking-widest font-bold text-[10px]">Shipping</span>
                <span className="font-bold">{shipping === 0 ? 'FREE' : `₦${shipping.toLocaleString()}`}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-300 pt-6 mb-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest">Total Amount</span>
                <span className="text-3xl font-black">₦{total.toLocaleString()}</span>
              </div>
              
              <div className="bg-white/50 p-4 border border-gray-100 mt-6">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">Pay Small Small Option</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold">₦{(total / 4).toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">x 4 weeks</span></span>
                  <span className="bg-accent text-white text-[8px] font-black px-2 py-0.5 uppercase tracking-widest">Interest Free</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              {isAuthenticated && user?.membership.status === 'active' ? (
                <div className="flex items-start gap-4 p-4 bg-accent/5 border border-accent/20">
                  <Zap className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-black uppercase tracking-tight text-[10px]">Membership Active: {user.membership.level}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">Member benefits applied.</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-accent/5 border border-accent/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="h-4 w-4 text-accent" />
                    <span className="font-black uppercase tracking-tight text-[10px]">Join bllag Circle</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-4 leading-relaxed">Save up to 15% and get free shipping on all orders.</p>
                  <Link 
                    to="/membership"
                    className="block text-center border border-primary text-primary py-2 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-colors"
                  >
                    View Plans
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              to="/checkout"
              className="w-full flex items-center justify-center bg-primary text-primary-foreground py-5 text-xs font-black uppercase tracking-widest hover:bg-accent transition-colors group"
            >
              Proceed to Checkout
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
