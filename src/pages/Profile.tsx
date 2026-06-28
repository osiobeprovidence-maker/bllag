import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { User, Package, Settings, LogOut, Shield, Briefcase, MapPin, Phone, Mail, Wallet, Gift, CreditCard, ArrowUpRight, ArrowDownLeft, Crown, Check, Zap, Camera, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db, auth } from '../lib/firebase';

export function Profile() {
  const { user, logout, updateBalance, updateAddress, updateProfileImage } = useAuthStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'settings' | 'wallet' | 'about' | 'contact' | 'agent' | 'membership' | 'address'>('info');
  const [giftEmail, setGiftEmail] = useState('');
  const [giftAmount, setGiftAmount] = useState('');
  
  const [addressForm, setAddressForm] = useState(user?.address || {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria'
  });

  if (!user) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Not Logged In</h1>
        <p className="text-muted-foreground mb-8 text-center">Please log in to view your profile.</p>
        <Link to="/login" className="bg-primary text-primary-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors">
          Go to Login
        </Link>
      </div>
    );
  }

  const handleUpdateAddress = async (newAddress: any) => {
    if (!auth.currentUser) return;
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        address: newAddress
      });
      alert('Address updated!');
      setActiveTab('info');
    } catch (error) {
      console.error('Address update failed:', error);
      alert('Failed to update address.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !auth.currentUser) return;

    try {
      setIsUploading(true);
      const storageRef = ref(storage, `profiles/${user.email}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update Firestore
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        profileImage: downloadURL
      });
      
      alert('Profile image updated!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const orders = [
    { id: '#ORD-7829', date: 'Oct 12, 2023', status: 'Delivered', total: '₦24,500' },
    { id: '#ORD-7512', date: 'Sep 28, 2023', status: 'Processing', total: '₦12,800' },
  ];

  return (
    <div className="pt-24 pb-24 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-muted p-8 border border-gray-200 text-center mb-6">
            <div className="relative group mx-auto mb-4 w-24 h-24">
              <div className="w-full h-full bg-background border border-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute inset-0 bg-black/40 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <Camera className="h-6 w-6 mb-1" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Change</span>
                  </>
                )}
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight">{user.name}</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              {user.role === 'admin' && <Shield className="h-4 w-4 text-accent" />}
              {user.role === 'agent' && <Briefcase className="h-4 w-4 text-accent" />}
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{user.role}</span>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('info')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors border ${
                activeTab === 'info' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-gray-200 hover:border-accent'
              }`}
            >
              <User className="h-4 w-4" /> Personal Info
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors border ${
                activeTab === 'orders' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-gray-200 hover:border-accent'
              }`}
            >
              <Package className="h-4 w-4" /> Order History
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors border ${
                activeTab === 'wallet' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-gray-200 hover:border-accent'
              }`}
            >
              <Wallet className="h-4 w-4" /> My Wallet
            </button>
            <button
              onClick={() => setActiveTab('membership')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors border ${
                activeTab === 'membership' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-gray-200 hover:border-accent'
              }`}
            >
              <Crown className="h-4 w-4" /> Membership
            </button>
            <button
              onClick={() => setActiveTab('address')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors border ${
                activeTab === 'address' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-gray-200 hover:border-accent'
              }`}
            >
              <MapPin className="h-4 w-4" /> Shipping Address
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors border ${
                activeTab === 'settings' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-gray-200 hover:border-accent'
              }`}
            >
              <Settings className="h-4 w-4" /> Settings
            </button>
            
            <button
              onClick={() => setActiveTab('about')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors border ${
                activeTab === 'about' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-gray-200 hover:border-accent'
              }`}
            >
              <Shield className="h-4 w-4" /> About Us
            </button>
            
            <button
              onClick={() => setActiveTab('contact')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors border ${
                activeTab === 'contact' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-gray-200 hover:border-accent'
              }`}
            >
              <Phone className="h-4 w-4" /> Contact Support
            </button>
            
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors border bg-accent text-white border-accent"
              >
                <Shield className="h-4 w-4" /> Admin Panel
              </Link>
            )}
            
            {user.role === 'agent' && (
              <button
                onClick={() => setActiveTab('agent')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors border ${
                  activeTab === 'agent' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-gray-200 hover:border-accent'
                }`}
              >
                <Briefcase className="h-4 w-4" /> Agent Portal
              </button>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors border bg-background border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 mt-8"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'info' && (
              <div className="space-y-8">
                <div className="border-b pb-4">
                  <h1 className="text-3xl font-black uppercase tracking-tight">Personal Information</h1>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-muted p-6 border border-gray-200">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Contact Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-accent" />
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Email</p>
                          <p className="font-medium">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-accent" />
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Phone</p>
                          <p className="font-medium">+234 800 123 4567</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-6 border border-gray-200">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Default Address</h3>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-accent mt-1" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Shipping Address</p>
                        {user.address ? (
                          <>
                            <p className="font-medium">{user.address.street}</p>
                            <p className="text-sm">{user.address.city}, {user.address.state} {user.address.zipCode}</p>
                            <p className="text-sm">{user.address.country}</p>
                          </>
                        ) : (
                          <p className="font-medium text-muted-foreground italic">No address saved</p>
                        )}
                        <button 
                          onClick={() => setActiveTab('address')}
                          className="mt-3 text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
                        >
                          {user.address ? 'Edit Address' : 'Add Address'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-6 border border-gray-200">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Account Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-black">12</p>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Total Orders</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black">4</p>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Reviews</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black">2</p>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Wishlists</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black">₦145k</p>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Spent</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-8">
                <div className="border-b pb-4">
                  <h1 className="text-3xl font-black uppercase tracking-tight">Recent Orders</h1>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-muted-foreground uppercase tracking-widest text-xs border-b border-gray-200">
                      <tr>
                        <th className="pb-4 font-normal">Order ID</th>
                        <th className="pb-4 font-normal">Date</th>
                        <th className="pb-4 font-normal">Status</th>
                        <th className="pb-4 font-normal text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                          <td className="py-6 font-bold">{order.id}</td>
                          <td className="py-6 text-muted-foreground">{order.date}</td>
                          <td className="py-6">
                            <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-6 text-right font-black">{order.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'wallet' && (
              <div className="space-y-8">
                <div className="border-b pb-4 flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">My Wallet</h1>
                    <p className="text-muted-foreground text-sm">Manage your funds, gifting, and installments.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Current Balance</p>
                    <p className="text-3xl font-black text-accent">₦{user.walletBalance.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Gifting Section */}
                  <div className="bg-muted p-6 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Gift className="h-5 w-5 text-accent" />
                      <h3 className="text-xs font-bold uppercase tracking-widest">Send a Gift</h3>
                    </div>
                    <div className="space-y-4">
                      <input 
                        type="email" 
                        placeholder="Recipient Email"
                        value={giftEmail}
                        onChange={(e) => setGiftEmail(e.target.value)}
                        className="w-full bg-background border border-gray-300 p-3 text-sm focus:outline-none focus:border-accent transition-colors"
                      />
                      <input 
                        type="number" 
                        placeholder="Amount (₦)"
                        value={giftAmount}
                        onChange={(e) => setGiftAmount(e.target.value)}
                        className="w-full bg-background border border-gray-300 p-3 text-sm focus:outline-none focus:border-accent transition-colors"
                      />
                      <button 
                        onClick={() => {
                          const amt = parseFloat(giftAmount);
                          if (amt > 0 && amt <= user.walletBalance) {
                            updateBalance(-amt, 'gift', `Gift to ${giftEmail}`);
                            setGiftAmount('');
                            setGiftEmail('');
                            alert('Gift sent successfully!');
                          }
                        }}
                        className="w-full bg-primary text-primary-foreground py-3 text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors"
                      >
                        Send Gift Credits
                      </button>
                    </div>
                  </div>

                  {/* Pay Small Small Section */}
                  <div className="bg-muted p-6 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="h-5 w-5 text-accent" />
                      <h3 className="text-xs font-bold uppercase tracking-widest">Pay Small Small (Layaway)</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                      Active installment plans and upcoming payments.
                    </p>
                    <div className="space-y-3">
                      {user.installments.length > 0 ? (
                        user.installments.map((plan) => (
                          <div key={plan.id} className="bg-background p-3 border border-gray-100 flex justify-between items-center">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-tight line-clamp-1">{plan.productName}</p>
                              <p className="text-[10px] text-muted-foreground">{plan.paidInstallments} of {plan.installmentsCount} payments made</p>
                            </div>
                            <p className="font-bold text-xs">₦{(plan.totalAmount / plan.installmentsCount).toLocaleString()}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-center py-4 text-muted-foreground uppercase tracking-widest">No active plans</p>
                      )}
                      <button className="w-full border border-primary text-primary py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors">
                        View All Plans
                      </button>
                    </div>
                  </div>
                </div>

                {/* Transaction History */}
                <div className="bg-muted p-6 border border-gray-200">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-6">Transaction History</h3>
                  <div className="space-y-4">
                    {user.transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${tx.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {tx.amount > 0 ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{tx.description}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{new Date(tx.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <p className={`font-black ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.amount > 0 ? '+' : ''}₦{tx.amount.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'address' && (
              <div className="space-y-8">
                <div className="border-b pb-4">
                  <h1 className="text-3xl font-black uppercase tracking-tight">Shipping Address</h1>
                  <p className="text-muted-foreground text-sm">Your primary delivery destination.</p>
                </div>
                
                <div className="bg-muted p-8 border border-gray-200 max-w-2xl">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleUpdateAddress(addressForm);
                    }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest mb-1 block">Street Address</label>
                        <input 
                          type="text" 
                          required
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                          className="w-full bg-background border border-gray-300 p-3 text-sm focus:outline-none focus:border-accent transition-colors"
                          placeholder="House No, Street Name"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest mb-1 block">City</label>
                          <input 
                            type="text" 
                            required
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                            className="w-full bg-background border border-gray-300 p-3 text-sm focus:outline-none focus:border-accent transition-colors"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest mb-1 block">State / Region</label>
                          <input 
                            type="text" 
                            required
                            value={addressForm.state}
                            onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                            className="w-full bg-background border border-gray-300 p-3 text-sm focus:outline-none focus:border-accent transition-colors"
                            placeholder="State"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest mb-1 block">ZIP / Postal Code</label>
                          <input 
                            type="text" 
                            required
                            value={addressForm.zipCode}
                            onChange={(e) => setAddressForm({...addressForm, zipCode: e.target.value})}
                            className="w-full bg-background border border-gray-300 p-3 text-sm focus:outline-none focus:border-accent transition-colors"
                            placeholder="ZIP Code"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest mb-1 block">Country</label>
                          <select 
                            value={addressForm.country}
                            onChange={(e) => setAddressForm({...addressForm, country: e.target.value})}
                            className="w-full bg-background border border-gray-300 p-3 text-sm focus:outline-none focus:border-accent transition-colors h-[46px]"
                          >
                            <option value="Nigeria">Nigeria</option>
                            <option value="Ghana">Ghana</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="bg-primary text-primary-foreground px-12 py-4 text-xs font-black uppercase tracking-widest hover:bg-accent transition-colors"
                    >
                      Save Address
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'membership' && (
              <div className="space-y-8">
                <div className="border-b pb-4 flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">Membership Status</h1>
                    <p className="text-muted-foreground text-sm">Manage your subscription and perks.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Current Level</p>
                    <p className={`text-3xl font-black uppercase ${
                      user.membership.level === 'platinum' ? 'text-indigo-600' : 
                      user.membership.level === 'gold' ? 'text-yellow-500' : 
                      user.membership.level === 'silver' ? 'text-gray-400' : 'text-muted-foreground'
                    }`}>
                      {user.membership.level === 'none' ? 'Guest' : user.membership.level}
                    </p>
                  </div>
                </div>

                {user.membership.status === 'active' ? (
                  <div className="space-y-6">
                    <div className="bg-muted p-8 border border-gray-200">
                      <div className="flex items-center gap-4 mb-6">
                        <Zap className="h-8 w-8 text-accent" />
                        <div>
                          <h3 className="font-black uppercase tracking-tight">Your Benefits are Active</h3>
                          <p className="text-xs text-muted-foreground">Next renewal: {new Date(user.membership.nextBillingDate!).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Member-only discounts applied</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Free global shipping unlocked</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Link to="/membership" className="bg-primary text-primary-foreground px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors">
                        Change Plan
                      </Link>
                      <button className="border border-gray-300 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                        Cancel Membership
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted p-12 border border-gray-200 text-center">
                    <Crown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-black uppercase tracking-tight mb-4">Unlock Exclusive Perks</h3>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">Join the BLAG community and enjoy priority access, special discounts, and luxury services.</p>
                    <Link to="/membership" className="bg-primary text-primary-foreground px-12 py-4 text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors inline-block">
                      View Membership Plans
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-8">
                <div className="border-b pb-4">
                  <h1 className="text-3xl font-black uppercase tracking-tight">About BLAG</h1>
                </div>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="text-lg">BLAG is a premium jewelry brand dedicated to timeless elegance and modern craftsmanship.</p>
                  <p>Founded in 2023, we focus on creating pieces that tell a story. Every item is handcrafted with precision and care, using the finest materials available.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    <div className="bg-muted p-8 border border-gray-200">
                      <h3 className="text-primary font-black uppercase tracking-tight mb-4">Our Mission</h3>
                      <p>To empower individuals through self-expression and beauty, one piece at a time.</p>
                    </div>
                    <div className="bg-muted p-8 border border-gray-200">
                      <h3 className="text-primary font-black uppercase tracking-tight mb-4">Our Vision</h3>
                      <p>To become the world's most trusted and beloved digital-first luxury jewelry brand.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-8">
                <div className="border-b pb-4">
                  <h1 className="text-3xl font-black uppercase tracking-tight">Contact Support</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <p className="text-muted-foreground">Our support team is available 24/7 to assist you with any inquiries.</p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Mail className="h-5 w-5 text-accent" />
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold">Email Us</p>
                          <p className="text-sm">support@blag.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Phone className="h-5 w-5 text-accent" />
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold">Call Us</p>
                          <p className="text-sm">+234 800 BLAG HELP</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <form className="space-y-4 bg-muted p-8 border border-gray-200">
                    <input type="text" placeholder="Subject" className="w-full bg-background border border-gray-300 p-3 text-sm focus:outline-none focus:border-accent" />
                    <textarea placeholder="Message" rows={4} className="w-full bg-background border border-gray-300 p-3 text-sm focus:outline-none focus:border-accent" />
                    <button className="w-full bg-primary text-primary-foreground py-4 text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'agent' && (
              <div className="space-y-8">
                <div className="border-b pb-4">
                  <h1 className="text-3xl font-black uppercase tracking-tight">Agent Dashboard</h1>
                  <p className="text-muted-foreground text-sm">Manage your referrals and commissions.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-muted p-6 border border-gray-200 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Referrals</p>
                    <p className="text-3xl font-black">142</p>
                  </div>
                  <div className="bg-muted p-6 border border-gray-200 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Active Commissions</p>
                    <p className="text-3xl font-black text-accent">₦42,500</p>
                  </div>
                  <div className="bg-muted p-6 border border-gray-200 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Conversion Rate</p>
                    <p className="text-3xl font-black">12.4%</p>
                  </div>
                </div>
                <div className="bg-muted p-8 border border-gray-200">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Your Referral Link</h3>
                  <div className="flex gap-2">
                    <input 
                      readOnly 
                      value={`https://blag.com/?ref=${user.name.toLowerCase().replace(/\s+/g, '')}`}
                      className="flex-1 bg-background border border-gray-300 p-3 text-xs font-mono"
                    />
                    <button className="bg-primary text-primary-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest">Copy</button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <div className="border-b pb-4">
                  <h1 className="text-3xl font-black uppercase tracking-tight">Account Settings</h1>
                </div>
                
                <div className="max-w-xl space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Display Name</label>
                    <input 
                      type="text" 
                      defaultValue={user.name}
                      className="w-full bg-background border border-gray-300 p-3 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={user.email}
                      className="w-full bg-background border border-gray-300 p-3 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div className="pt-4">
                    <button className="bg-primary text-primary-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
