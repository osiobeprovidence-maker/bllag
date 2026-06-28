import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet as WalletIcon, Gift, CreditCard, ArrowUpRight, ArrowDownLeft, Plus, Send, Clock } from 'lucide-react';
import { useAuthStore } from '../store';
import { Navigate, Link } from 'react-router-dom';

export function Wallet() {
  const { isAuthenticated, user, updateBalance } = useAuthStore();
  const [giftEmail, setGiftEmail] = useState('');
  const [giftAmount, setGiftAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [showDeposit, setShowDeposit] = useState(false);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleGift = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(giftAmount);
    if (amt > 0 && amt <= user.walletBalance) {
      updateBalance(-amt, 'gift', `Gift to ${giftEmail}`);
      setGiftAmount('');
      setGiftEmail('');
      alert('Gift sent successfully!');
    } else {
      alert('Invalid amount or insufficient balance.');
    }
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (amt > 0) {
      updateBalance(amt, 'deposit', 'Wallet Top-up');
      setDepositAmount('');
      setShowDeposit(false);
      alert('Funds added successfully!');
    }
  };

  return (
    <div className="pt-24 pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight mb-2">My Wallet</h1>
            <p className="text-muted-foreground">Manage your BLAG credits, gifting, and installment plans.</p>
          </div>
          <div className="bg-muted p-6 border border-gray-200 min-w-[240px] text-right">
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Available Balance</p>
            <p className="text-4xl font-black text-accent">₦{user.walletBalance.toLocaleString()}</p>
            <button 
              onClick={() => setShowDeposit(true)}
              className="mt-4 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-colors w-full"
            >
              <Plus className="h-3 w-3" /> Top Up Wallet
            </button>
          </div>
        </div>

        {showDeposit && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-accent/5 p-8 border border-accent/20 max-w-2xl mx-auto"
          >
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">Top Up Funds</h3>
            <form onSubmit={handleDeposit} className="flex gap-4">
              <input 
                type="number" 
                placeholder="Amount (₦)"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                required
                className="flex-1 bg-background border border-gray-300 p-4 focus:outline-none focus:border-accent transition-colors"
              />
              <button type="submit" className="bg-accent text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors">
                Confirm
              </button>
              <button 
                type="button"
                onClick={() => setShowDeposit(false)}
                className="px-4 py-4 text-xs font-bold uppercase tracking-widest"
              >
                Cancel
              </button>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Controls */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Send Gift */}
              <div className="bg-muted p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <Gift className="h-6 w-6 text-accent" />
                  <h3 className="text-lg font-black uppercase tracking-tight">Gift Credits</h3>
                </div>
                <form onSubmit={handleGift} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Recipient Email</label>
                    <input 
                      type="email" 
                      value={giftEmail}
                      onChange={(e) => setGiftEmail(e.target.value)}
                      placeholder="friend@example.com"
                      required
                      className="w-full bg-background border border-gray-300 p-3 text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Amount (₦)</label>
                    <input 
                      type="number" 
                      value={giftAmount}
                      onChange={(e) => setGiftAmount(e.target.value)}
                      placeholder="0.00"
                      required
                      className="w-full bg-background border border-gray-300 p-3 text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <button type="submit" className="w-full bg-primary text-primary-foreground py-4 text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors flex items-center justify-center gap-2">
                    <Send className="h-4 w-4" /> Send Gift
                  </button>
                </form>
              </div>

              {/* Installments Tracking */}
              <div className="bg-muted p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="h-6 w-6 text-accent" />
                  <h3 className="text-lg font-black uppercase tracking-tight">Pay Small Small</h3>
                </div>
                <div className="space-y-4">
                  {user.installments.length > 0 ? (
                    user.installments.map((plan) => (
                      <div key={plan.id} className="bg-background p-4 border border-gray-100">
                        <p className="text-xs font-black uppercase mb-1 line-clamp-1">{plan.productName}</p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Next Payment: {new Date(plan.nextPaymentDate).toLocaleDateString()}</p>
                            <p className="text-sm font-bold">₦{(plan.totalAmount / plan.installmentsCount).toLocaleString()}</p>
                          </div>
                          <span className="text-[8px] font-black bg-accent text-white px-2 py-1 uppercase tracking-widest">
                            {plan.paidInstallments} of {plan.installmentsCount}
                          </span>
                        </div>
                        <div className="mt-3 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-accent h-full transition-all duration-500" 
                            style={{ width: `${(plan.paidInstallments / plan.installmentsCount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 border border-dashed border-gray-300">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">No active plans</p>
                    </div>
                  )}
                  <button className="w-full border border-gray-300 py-3 text-[10px] font-bold uppercase tracking-widest hover:border-accent transition-colors">
                    View All Installment Plans
                  </button>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-muted p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black uppercase tracking-tight">Transaction History</h3>
                <button className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline">Download Statement</button>
              </div>
              <div className="space-y-2">
                {user.transactions.map((tx) => (
                  <div key={tx.id} className="bg-background p-4 border border-gray-100 flex items-center justify-between hover:border-accent/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${tx.amount > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {tx.amount > 0 ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm uppercase tracking-tight">{tx.description}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{new Date(tx.date).toLocaleDateString()} • {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-black text-lg ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.amount > 0 ? '+' : ''}₦{tx.amount.toLocaleString()}
                      </p>
                      <p className="text-[8px] uppercase tracking-widest font-bold text-muted-foreground">{tx.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions / Summary */}
          <div className="space-y-8">
            <div className="bg-primary text-primary-foreground p-8">
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">Wallet Security</h3>
              <p className="text-sm text-primary-foreground/80 mb-6">Your wallet is protected by 256-bit encryption. Always keep your password private.</p>
              <button className="w-full bg-white text-primary py-3 text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-colors">
                Setup Pin
              </button>
            </div>

            <div className="bg-muted p-8 border border-gray-200">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b pb-2">Wallet FAQ</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase mb-1">How do I withdraw?</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Wallet credits can be used for purchases on BLAG. Direct withdrawals to bank accounts are processed within 24-48 hours.</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase mb-1">What is PSS?</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">"Pay Small Small" is our interest-free installment plan allowing you to spread payments over 6 weeks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
