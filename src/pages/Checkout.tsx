import { ShoppingBag, ArrowLeft, CheckCircle2, Wallet, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useShopStore, useAuthStore } from '../store';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { EmptyState } from '../components/ui/EmptyState';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export function Checkout() {
  const { cart, cartTotal, clearCart } = useShopStore();
  const { isAuthenticated, user, updateBalance, updateAddress } = useAuthStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'installment'>('card');
  const [pssFrequency, setPssFrequency] = useState<'weekly' | 'monthly'>('weekly');
  const [pssInstallments, setPssInstallments] = useState(4);
  const [pssStartDate, setPssStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [useSavedAddress, setUseSavedAddress] = useState(!!user?.address);
  const [saveAddress, setSaveAddress] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string, discount: number } | null>(null);
  const navigate = useNavigate();

  const [checkoutAddress, setCheckoutAddress] = useState({
    email: user?.email || '',
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ')[1] || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'Nigeria'
  });

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

  const discount = (subtotal * discountRate) + (appliedCoupon?.discount || 0);
  const shipping = freeShipping ? 0 : (subtotal > 100000 ? 0 : 2500);
  const total = Math.max(0, subtotal - discount + shipping);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setAppliedCoupon({ code: 'WELCOME10', discount: 1000 });
    } else {
      alert('Invalid coupon code');
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (saveAddress && isAuthenticated && !useSavedAddress && auth.currentUser) {
      const newAddress = {
        street: checkoutAddress.street,
        city: checkoutAddress.city,
        state: checkoutAddress.state,
        zipCode: checkoutAddress.zipCode,
        country: checkoutAddress.country
      };
      
      updateAddress(newAddress);
      
      // Save to Firestore
      updateDoc(doc(db, 'users', auth.currentUser.uid), {
        address: newAddress
      });
    }

    if (paymentMethod === 'wallet') {
      if (!user || user.walletBalance < total) {
        alert('Insufficient wallet balance');
        return;
      }
      updateBalance(-total, 'payment', 'Order Checkout');
    } else if (paymentMethod === 'installment') {
      if (!isAuthenticated) {
        alert('Please login to use installment plan');
        return;
      }
      
      const productNames = cart.map(item => item.name).join(', ');
      updateBalance(-(total / pssInstallments), 'installment', `First Installment for ${productNames}`, {
        productName: productNames,
        totalAmount: total,
        installmentsCount: pssInstallments,
        frequency: pssFrequency,
        startDate: pssStartDate
      });
    }

    setIsSuccess(true);
    setTimeout(() => {
      clearCart();
      navigate('/');
    }, 3000);
  };

  if (cart.length === 0 && !isSuccess) {
    return (
      <div className="pt-32 pb-24 max-w-2xl mx-auto px-6">
        <EmptyState 
          icon={ShoppingBag}
          title="Checkout Unavailable"
          message="Your shopping bag is currently empty. Curate your collection before proceeding to acquisition."
          action={{
            label: "Go to Shop",
            onClick: () => navigate('/shop')
          }}
        />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md px-4"
        >
          <CheckCircle2 className="h-16 w-16 text-accent mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">Order Confirmed</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. We will send an email confirmation with your order details and tracking information shortly.
          </p>
          <p className="text-sm text-muted-foreground uppercase tracking-widest">Redirecting to home...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link to="/cart" className="inline-flex items-center text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-10">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Cart
      </Link>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Form */}
        <div className="lg:w-3/5">
          <form onSubmit={handleCheckout} className="space-y-8">
            <div className="bg-muted/30 p-6 border border-muted">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold uppercase tracking-tight">Shipping Details</h2>
                {user?.address && (
                  <button 
                    type="button"
                    onClick={() => setUseSavedAddress(!useSavedAddress)}
                    className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
                  >
                    {useSavedAddress ? 'Use different address' : 'Use saved address'}
                  </button>
                )}
              </div>

              {useSavedAddress && user?.address ? (
                <div className="bg-background p-4 border border-accent/20 relative group">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold mb-1">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.address.street}</p>
                      <p className="text-xs text-muted-foreground">{user.address.city}, {user.address.state} {user.address.zipCode}</p>
                      <p className="text-xs text-muted-foreground">{user.address.country}</p>
                      <p className="text-xs text-muted-foreground mt-2">{user.email}</p>
                    </div>
                    <div className="bg-accent text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">Saved Default</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact Information</h3>
                    <input 
                      type="email" 
                      placeholder="Email address" 
                      required
                      value={checkoutAddress.email}
                      onChange={(e) => setCheckoutAddress({...checkoutAddress, email: e.target.value})}
                      className="w-full bg-transparent border border-muted p-4 text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Shipping Address</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="First name" 
                        required 
                        value={checkoutAddress.firstName}
                        onChange={(e) => setCheckoutAddress({...checkoutAddress, firstName: e.target.value})}
                        className="w-full bg-transparent border border-muted p-4 text-sm focus:outline-none focus:border-accent transition-colors" 
                      />
                      <input 
                        type="text" 
                        placeholder="Last name" 
                        required 
                        value={checkoutAddress.lastName}
                        onChange={(e) => setCheckoutAddress({...checkoutAddress, lastName: e.target.value})}
                        className="w-full bg-transparent border border-muted p-4 text-sm focus:outline-none focus:border-accent transition-colors" 
                      />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Address" 
                      required 
                      value={checkoutAddress.street}
                      onChange={(e) => setCheckoutAddress({...checkoutAddress, street: e.target.value})}
                      className="w-full bg-transparent border border-muted p-4 text-sm focus:outline-none focus:border-accent transition-colors" 
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <input 
                        type="text" 
                        placeholder="City" 
                        required 
                        value={checkoutAddress.city}
                        onChange={(e) => setCheckoutAddress({...checkoutAddress, city: e.target.value})}
                        className="w-full bg-transparent border border-muted p-4 text-sm focus:outline-none focus:border-accent transition-colors col-span-1" 
                      />
                      <input 
                        type="text" 
                        placeholder="State" 
                        required 
                        value={checkoutAddress.state}
                        onChange={(e) => setCheckoutAddress({...checkoutAddress, state: e.target.value})}
                        className="w-full bg-transparent border border-muted p-4 text-sm focus:outline-none focus:border-accent transition-colors col-span-1" 
                      />
                      <input 
                        type="text" 
                        placeholder="ZIP code" 
                        required 
                        value={checkoutAddress.zipCode}
                        onChange={(e) => setCheckoutAddress({...checkoutAddress, zipCode: e.target.value})}
                        className="w-full bg-transparent border border-muted p-4 text-sm focus:outline-none focus:border-accent transition-colors col-span-1" 
                      />
                    </div>
                    
                    {isAuthenticated && (
                      <label className="flex items-center gap-2 cursor-pointer pt-2">
                        <input 
                          type="checkbox" 
                          checked={saveAddress}
                          onChange={(e) => setSaveAddress(e.target.checked)}
                          className="h-4 w-4 border-muted text-accent focus:ring-accent"
                        />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Save this address to my profile</span>
                      </label>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight mb-6">Payment Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border flex flex-col items-center gap-2 transition-colors ${paymentMethod === 'card' ? 'border-primary bg-muted' : 'border-muted hover:border-accent'}`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-4 border flex flex-col items-center gap-2 transition-colors ${paymentMethod === 'wallet' ? 'border-primary bg-muted' : 'border-muted hover:border-accent'}`}
                >
                  <Wallet className="h-5 w-5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Wallet</span>
                  {user && <span className="text-[8px] text-accent font-black">₦{user.walletBalance.toLocaleString()}</span>}
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('installment')}
                  className={`p-4 border flex flex-col items-center gap-2 transition-colors ${paymentMethod === 'installment' ? 'border-primary bg-muted' : 'border-muted hover:border-accent'}`}
                >
                  <div className="flex gap-1">
                    <span className="text-xs font-black">PSS</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Small Small</span>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="bg-muted p-6 border border-gray-300">
                  <div className="space-y-4">
                    <input type="text" placeholder="Card number" required={paymentMethod === 'card'} className="w-full bg-background border border-muted p-4 focus:outline-none focus:border-accent transition-colors" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="MM / YY" required={paymentMethod === 'card'} className="w-full bg-background border border-muted p-4 focus:outline-none focus:border-accent transition-colors" />
                      <input type="text" placeholder="CVC" required={paymentMethod === 'card'} className="w-full bg-background border border-muted p-4 focus:outline-none focus:border-accent transition-colors" />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="bg-accent/5 p-6 border border-accent/20">
                  <p className="text-sm font-medium mb-2">Pay with your BLAG Wallet</p>
                  <p className="text-xs text-muted-foreground">The total amount will be deducted from your available balance.</p>
                </div>
              )}

              {paymentMethod === 'installment' && (
                <div className="bg-primary/5 p-6 border border-primary/20">
                  <p className="text-sm font-bold uppercase tracking-tight mb-4">Pay Small Small (Installment Plan)</p>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">Frequency</label>
                        <select 
                          value={pssFrequency}
                          onChange={(e) => setPssFrequency(e.target.value as any)}
                          className="w-full bg-background border border-muted p-2 text-xs focus:outline-none focus:border-accent"
                        >
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">Installments (2-10)</label>
                        <input 
                          type="number" 
                          min="2" 
                          max="10"
                          value={pssInstallments}
                          onChange={(e) => setPssInstallments(parseInt(e.target.value) || 2)}
                          className="w-full bg-background border border-muted p-2 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">Start Date</label>
                      <input 
                        type="date" 
                        value={pssStartDate}
                        onChange={(e) => setPssStartDate(e.target.value)}
                        className="w-full bg-background border border-muted p-2 text-xs focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div className="space-y-2 border-t border-primary/10 pt-4">
                      <div className="flex justify-between text-xs">
                        <span>Due Today</span>
                        <span className="font-bold">₦{(total / pssInstallments).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Future Payments ({pssInstallments - 1})</span>
                        <span>₦{(total / pssInstallments).toLocaleString()} each</span>
                      </div>
                    </div>

                    <div className="p-3 bg-accent/10 border border-accent/20">
                      <p className="text-[10px] font-bold text-accent uppercase tracking-widest leading-relaxed">
                        ⚠️ Important: Goods will be delivered only after 100% of the payment has been completed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-primary text-primary-foreground py-5 text-sm uppercase tracking-widest hover:bg-accent transition-colors"
            >
              {paymentMethod === 'installment' ? `Pay First Installment ₦${(total/pssInstallments).toLocaleString()}` : `Pay ₦${total.toLocaleString()}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-2/5">
          <div className="bg-muted p-8 sticky top-32">
            <h2 className="text-xl font-bold uppercase tracking-tight mb-8">In Your Bag</h2>
            
            <div className="space-y-6 mb-8 max-h-96 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={`${item.id}-${item.isPaySmallSmall}-${item.isGift}`} className="flex gap-4">
                  <div className="w-16 h-20 bg-background relative flex-shrink-0">
                    <img referrerPolicy="no-referrer" src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium mb-1 line-clamp-1">{item.name}</h4>
                    <div className="flex flex-wrap gap-1">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest">{item.category}</p>
                      {item.isPaySmallSmall && <span className="text-[8px] text-accent font-black uppercase tracking-widest">PSS</span>}
                      {item.isGift && <span className="text-[8px] text-indigo-600 font-black uppercase tracking-widest">Gift</span>}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mb-8">
              <input 
                type="text" 
                placeholder="Coupon code" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-white border border-gray-300 p-3 text-[10px] font-black uppercase focus:outline-none focus:border-accent"
              />
              <button 
                type="button"
                onClick={handleApplyCoupon}
                className="px-6 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-colors"
              >
                Apply
              </button>
            </div>

              <div className="space-y-4 text-sm mb-6 border-b border-gray-300 pb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                {discountRate > 0 && (
                  <div className="flex justify-between text-accent font-medium">
                    <span>Member Discount ({discountRate * 100}%)</span>
                    <span>-₦{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₦${shipping.toLocaleString()}`}</span>
                </div>
              </div>
            
            <div className="flex justify-between text-lg font-medium">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
