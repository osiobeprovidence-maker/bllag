import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet as WalletIcon, Gift, Plus, Send, Clock, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store';
import { Navigate, Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function Wallet() {
  const { isAuthenticated, user, sessionId, updateBalance } = useAuthStore();
  const [giftEmail, setGiftEmail] = useState('');
  const [giftAmount, setGiftAmount] = useState('');

  const transactions = useQuery(
    api.payments.getTransactions,
    isAuthenticated && sessionId ? { sessionId } : 'skip'
  );

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleDownloadStatement = () => {
    if (!transactions || transactions.length === 0) return;
    const headers = 'Date,Type,Amount,Reference,Status,Description\n';
    const rows = transactions.map((t: any) =>
      `${new Date(t.createdAt).toLocaleDateString()},${t.type},${t.amount},${t.reference},${t.status},"${t.description || ''}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bllag-wallet-statement-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

  return (
    <div className="pt-24 pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight mb-2">My Wallet</h1>
            <p className="text-muted-foreground">Manage your bllag credits, gifting, and installment plans.</p>
          </div>
          <div className="bg-muted p-6 border border-gray-200 min-w-[240px] text-right">
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Available Balance</p>
            <p className="text-4xl font-black text-accent">₦{user.walletBalance.toLocaleString()}</p>
            <Link
              to="/wallet/top-up"
              className="mt-4 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-colors w-full"
            >
              <Plus className="h-3 w-3" /> Top Up Wallet
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                <div className="text-center py-8 border border-dashed border-gray-300">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">No active plans</p>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-muted p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black uppercase tracking-tight">Transaction History</h3>
                <button onClick={handleDownloadStatement} className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline">Download Statement</button>
              </div>
              {transactions === undefined ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 text-accent animate-spin" />
                </div>
              ) : transactions.length > 0 ? (
                <div className="space-y-2">
                  {transactions.map((tx) => (
                    <div key={tx._id} className="bg-background p-4 border border-gray-100 flex items-center justify-between hover:border-accent/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${tx.amount > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {tx.amount > 0 ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm uppercase tracking-tight">{tx.description || tx.type}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{new Date(tx.createdAt).toLocaleDateString()} • {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
              ) : (
                <div className="text-center py-16 border border-dashed border-gray-200">
                  <WalletIcon className="h-10 w-10 mx-auto text-gray-300 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No transactions yet</p>
                  <p className="text-[9px] text-muted-foreground mt-2">Your wallet credits will appear here after you make a deposit.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions / Summary */}
          <div className="space-y-8">
            <div className="bg-primary text-primary-foreground p-8">
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">Wallet Security</h3>
              <p className="text-sm text-primary-foreground/80 mb-6">Your wallet is protected by 256-bit encryption.</p>
              <Link
                to="/security"
                className="block w-full bg-white text-primary py-3 text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-colors text-center"
              >
                Manage Security
              </Link>
            </div>

            <div className="bg-muted p-8 border border-gray-200">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b pb-2">Wallet FAQ</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase mb-1">How do I add funds?</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Use the Top Up button to add funds via Paystack.</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase mb-1">What is PSS?</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">"Pay Small Small" is our interest-free installment plan.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
