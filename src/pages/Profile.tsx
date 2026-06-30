import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Package, Settings, LogOut, Shield, Briefcase, MapPin, Phone, Mail, Wallet, Gift, ArrowUpRight, ArrowDownLeft, Crown, Check, Camera, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function Profile() {
  const { user, sessionId, logout, updateBalance, updateAddress, updateProfileImage } = useAuthStore();
  const logoutMutation = useMutation(api.auth.logout);
  const navigate = useNavigate();
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

  const handleUpdateAddress = (newAddress: any) => {
    updateAddress(newAddress);
    alert('Address updated!');
    setActiveTab('info');
  };

  const handleLogout = async () => {
    if (sessionId) {
      await logoutMutation({ sessionId });
    }
    logout();
    navigate('/');
  };

  const handleImageUpload = () => {
    const url = prompt('Enter profile image URL:');
    if (url && user) {
      updateProfileImage(url);
      alert('Profile image updated!');
    }
  };

  const handleViewOrder = (orderId: string) => {
    navigate(`/order/${orderId}`);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText('https://bllag.xyz/ref/' + user.email);
    alert('Referral link copied!');
  };

  const handleGiftSend = () => {
    if (giftAmount && giftEmail) {
      updateBalance(-Math.abs(Number(giftAmount)), 'gift', `Gift to ${giftEmail}`);
      alert(`₦${giftAmount} gift sent to ${giftEmail}`);
      setGiftAmount('');
      setGiftEmail('');
    }
  };

  const sampleOrders = [
    { id: 'ORD-001', date: '2024-12-15', status: 'Delivered', total: 450000, items: 2 },
    { id: 'ORD-002', date: '2024-11-20', status: 'Processing', total: 1250000, items: 1 },
    { id: 'ORD-003', date: '2024-10-05', status: 'Shipped', total: 780000, items: 3 },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-muted border border-gray-200 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-black overflow-hidden">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <button 
                onClick={handleImageUpload}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-accent rounded-full flex items-center justify-center text-white"
                disabled={isUploading}
              >
                {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">{user.name}</h1>
              <p className="text-muted-foreground text-sm">{user.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary px-3 py-1">{user.role}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Wallet Balance</p>
              <p className="text-2xl sm:text-3xl font-black tracking-tight">₦{user.walletBalance?.toLocaleString() || '0'}</p>
              <button onClick={() => setActiveTab('wallet')} className="text-xs text-accent font-bold uppercase tracking-widest hover:underline mt-1">
                Manage Wallet
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1 bg-muted border border-gray-200 p-4">
              {[
                { id: 'info', label: 'Personal Info', icon: User },
                { id: 'orders', label: 'Order History', icon: Package },
                { id: 'wallet', label: 'Wallet', icon: Wallet },
                { id: 'address', label: 'Saved Address', icon: MapPin },
                { id: 'membership', label: 'Membership', icon: Crown },
                { id: 'settings', label: 'Settings', icon: Settings },
                { id: 'about', label: 'About', icon: Briefcase },
                { id: 'contact', label: 'Contact', icon: Phone },
                { id: 'agent', label: 'Become an Agent', icon: Shield },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                    activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'hover:bg-background'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'info' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-muted border border-gray-200 p-6 sm:p-8">
                <h2 className="text-lg font-black uppercase tracking-tight mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: 'Full Name', value: user.name },
                    { label: 'Email Address', value: user.email },
                    { label: 'Role', value: user.role },
                    { label: 'Wallet Balance', value: `₦${user.walletBalance?.toLocaleString() || '0'}` },
                  ].map((field, i) => (
                    <div key={i}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{field.label}</p>
                      <p className="text-sm font-bold">{field.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-muted border border-gray-200 p-6 sm:p-8">
                <h2 className="text-lg font-black uppercase tracking-tight mb-6">Order History</h2>
                <div className="space-y-4">
                  {sampleOrders.map((order) => (
                    <div key={order.id} className="bg-background border border-gray-200 p-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest">{order.id}</p>
                        <p className="text-[10px] text-muted-foreground">{order.date} · {order.items} item(s)</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">₦{order.total.toLocaleString()}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: order.status === 'Delivered' ? '#16a34a' : order.status === 'Shipped' ? '#2563eb' : '#d97706' }}>{order.status}</p>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => navigate('/orders')} className="w-full bg-primary text-primary-foreground py-3 text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors">
                    View All Orders
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'wallet' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-muted border border-gray-200 p-6 sm:p-8">
                  <h2 className="text-lg font-black uppercase tracking-tight mb-6">Wallet</h2>
                  <div className="bg-background border border-gray-200 p-6 text-center mb-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Available Balance</p>
                    <p className="text-4xl font-black tracking-tight">₦{user.walletBalance?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <button onClick={() => navigate('/wallet')} className="bg-primary text-primary-foreground py-4 text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors flex items-center justify-center gap-2">
                      <ArrowUpRight className="w-4 h-4" /> Fund Wallet
                    </button>
                    <button className="bg-background border border-gray-300 py-4 text-xs font-bold uppercase tracking-widest hover:border-accent transition-colors flex items-center justify-center gap-2">
                      <ArrowDownLeft className="w-4 h-4" /> Withdraw
                    </button>
                  </div>
                </div>

                <div className="bg-muted border border-gray-200 p-6 sm:p-8">
                  <h3 className="text-sm font-black uppercase tracking-tight mb-4">Recent Transactions</h3>
                  {user.transactions?.length > 0 ? (
                    <div className="space-y-3">
                      {user.transactions.slice(0, 5).map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between bg-background border border-gray-200 p-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'deposit' ? 'bg-green-100' : tx.type === 'gift' ? 'bg-purple-100' : tx.type === 'installment' ? 'bg-blue-100' : 'bg-red-100'}`}>
                              {tx.type === 'deposit' ? <ArrowUpRight className="w-4 h-4 text-green-600" /> : <ArrowDownLeft className="w-4 h-4 text-red-600" />}
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-widest">{tx.description}</p>
                              <p className="text-[10px] text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No transactions yet.</p>
                  )}
                </div>

                <div className="bg-muted border border-gray-200 p-6 sm:p-8">
                  <h3 className="text-sm font-black uppercase tracking-tight mb-4">Send a Gift</h3>
                  <div className="space-y-4">
                    <input type="email" placeholder="Recipient Email" value={giftEmail} onChange={(e) => setGiftEmail(e.target.value)} className="w-full bg-background border border-gray-300 p-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-accent" />
                    <input type="number" placeholder="Amount (₦)" value={giftAmount} onChange={(e) => setGiftAmount(e.target.value)} className="w-full bg-background border border-gray-300 p-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-accent" />
                    <button onClick={handleGiftSend} className="w-full bg-accent text-white py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-colors">
                      <Gift className="w-4 h-4 inline mr-2" /> Send Gift
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'address' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-muted border border-gray-200 p-6 sm:p-8">
                <h2 className="text-lg font-black uppercase tracking-tight mb-6">Saved Address</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Street Address', value: 'street' },
                    { label: 'City', value: 'city' },
                    { label: 'State', value: 'state' },
                    { label: 'Zip Code', value: 'zipCode' },
                    { label: 'Country', value: 'country' },
                  ].map((field) => (
                    <div key={field.value}>
                      <label className="text-[10px] font-bold uppercase tracking-widest mb-1 block">{field.label}</label>
                      <input
                        type="text"
                        value={(addressForm as any)[field.value]}
                        onChange={(e) => setAddressForm({ ...addressForm, [field.value]: e.target.value })}
                        className="w-full bg-background border border-gray-300 p-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-accent"
                      />
                    </div>
                  ))}
                  <button onClick={() => handleUpdateAddress(addressForm)} className="w-full bg-primary text-primary-foreground py-3 text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors">
                    Save Address
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'membership' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-muted border border-gray-200 p-6 sm:p-8">
                  <h2 className="text-lg font-black uppercase tracking-tight mb-6">Membership</h2>
                  {user.membership?.level && user.membership.level !== 'none' ? (
                    <div className="text-center bg-background border border-gray-200 p-6">
                      <Crown className="w-12 h-12 mx-auto mb-4 text-accent" />
                      <p className="text-2xl font-black uppercase tracking-tight mb-2">{user.membership.level} Member</p>
                      <p className="text-muted-foreground text-sm mb-4">Status: {user.membership.status}</p>
                      {user.membership.nextBillingDate && (
                        <p className="text-xs text-muted-foreground">Next billing: {new Date(user.membership.nextBillingDate).toLocaleDateString()}</p>
                      )}
                      <button onClick={() => navigate('/membership')} className="mt-6 bg-primary text-primary-foreground px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-accent">
                        Manage Membership
                      </button>
                    </div>
                  ) : (
                    <div className="text-center bg-background border border-gray-200 p-6">
                      <Crown className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-black uppercase tracking-tight mb-2">No Active Membership</p>
                      <p className="text-muted-foreground text-sm mb-6">Upgrade to Silver, Gold, or Platinum for exclusive benefits.</p>
                      <button onClick={() => navigate('/membership')} className="bg-primary text-primary-foreground px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-accent">
                        View Plans
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-muted border border-gray-200 p-6 sm:p-8">
                <h2 className="text-lg font-black uppercase tracking-tight mb-6">Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-background border border-gray-200 p-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest">Email Notifications</p>
                      <p className="text-[10px] text-muted-foreground">Receive order updates and promotions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent" />
                    </label>
                  </div>
                  <button onClick={() => navigate('/security')} className="w-full bg-background border border-gray-300 py-4 text-xs font-bold uppercase tracking-widest hover:border-accent transition-colors flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" /> Security Settings
                  </button>
                  <button onClick={() => navigate('/settings')} className="w-full bg-background border border-gray-300 py-4 text-xs font-bold uppercase tracking-widest hover:border-accent transition-colors">
                    More Settings
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'about' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-muted border border-gray-200 p-6 sm:p-8">
                <h2 className="text-lg font-black uppercase tracking-tight mb-6">About bllag</h2>
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>bllag is a luxury jewelry and high-end collections marketplace, delivering exceptional craftsmanship and timeless elegance.</p>
                  <p>We offer a curated selection of royal gold collections, minimalist diamonds, and bespoke pieces, each with a certificate of authenticity.</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'contact' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-muted border border-gray-200 p-6 sm:p-8">
                <h2 className="text-lg font-black uppercase tracking-tight mb-6">Contact Support</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-background border border-gray-200 p-4">
                    <Mail className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest">Email</p>
                      <p className="text-sm">support@bllag.xyz</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-background border border-gray-200 p-4">
                    <Phone className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest">Phone</p>
                      <p className="text-sm">+234 800 BLAG</p>
                    </div>
                  </div>
                  <button onClick={() => navigate('/help-center')} className="w-full bg-primary text-primary-foreground py-3 text-xs font-bold uppercase tracking-widest hover:bg-accent">
                    Visit Help Center
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'agent' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-muted border border-gray-200 p-6 sm:p-8">
                  <h2 className="text-lg font-black uppercase tracking-tight mb-6">Become a bllag Agent</h2>
                  <div className="text-center bg-background border border-gray-200 p-8">
                    <Shield className="w-16 h-16 mx-auto mb-6 text-accent" />
                    <h3 className="text-xl font-black uppercase tracking-tight mb-4">Earn While You Share</h3>
                    <p className="text-muted-foreground text-sm mb-6">Refer customers and earn commissions on every sale. Join our agent program today.</p>
                    <button onClick={() => navigate('/affiliate')} className="bg-primary text-primary-foreground px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
                <div className="bg-muted border border-gray-200 p-6 sm:p-8">
                  <h3 className="text-sm font-black uppercase tracking-tight mb-4">Your Referral Link</h3>
                  <div className="bg-background border border-gray-200 p-4 flex items-center justify-between">
                    <code className="text-xs">https://bllag.xyz/ref/{user.email}</code>
                    <button onClick={copyReferralLink} className="text-accent text-xs font-bold uppercase tracking-widest hover:underline">Copy</button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
