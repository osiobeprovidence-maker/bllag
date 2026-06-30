import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Wallet, CreditCard, Shield, Loader2, AlertCircle } from 'lucide-react';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuthStore } from '../store';

const MIN_AMOUNT = 100;
const MAX_AMOUNT = 5_000_000;

function formatComma(value: string): string {
  const num = value.replace(/[^0-9]/g, '');
  if (!num) return '';
  return Number(num).toLocaleString();
}

export function WalletTopUp() {
  const { isAuthenticated, user, sessionId } = useAuthStore();
  const initializePayment = useAction(api.payments.initializePayment);

  const [rawAmount, setRawAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated || !user || !sessionId) {
    return <Navigate to="/login" replace />;
  }

  const numericAmount = parseInt(rawAmount.replace(/[^0-9]/g, ''), 10) || 0;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatComma(e.target.value);
    setRawAmount(formatted);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (numericAmount < MIN_AMOUNT) {
      setError(`Minimum top-up amount is ₦${MIN_AMOUNT.toLocaleString()}`);
      return;
    }
    if (numericAmount > MAX_AMOUNT) {
      setError(`Maximum top-up amount is ₦${MAX_AMOUNT.toLocaleString()}`);
      return;
    }

    setLoading(true);
    try {
      const result = await initializePayment({
        sessionId,
        email: user.email,
        amount: numericAmount,
        callbackUrl: `${window.location.origin}/wallet/payment-success`,
      });
      window.location.href = result.authorizationUrl;
    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12 min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 p-10 shadow-2xl"
        >
          <Link
            to="/wallet"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Wallet
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="h-6 w-6 text-accent" />
            <h1 className="text-2xl font-black uppercase tracking-tight">Top Up Wallet</h1>
          </div>

          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed mb-8">
            Fund your bllag wallet securely via Paystack. Your balance can be used for purchases, gifting, and installment plans.
          </p>

          <div className="bg-muted p-6 border border-gray-100 mb-8">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Current Balance</p>
            <p className="text-3xl font-black text-accent">₦{user.walletBalance.toLocaleString()}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                Amount (₦)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-muted-foreground">₦</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={rawAmount}
                  onChange={handleAmountChange}
                  placeholder="0"
                  className="w-full bg-background border border-gray-300 p-4 pl-10 text-2xl font-black tracking-tight focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <p className="text-[9px] text-muted-foreground mt-2 uppercase tracking-widest">
                Min ₦{MIN_AMOUNT.toLocaleString()} &middot; Max ₦{MAX_AMOUNT.toLocaleString()}
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-100 p-4">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || numericAmount === 0}
              className="w-full bg-primary text-primary-foreground py-5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Initializing Payment...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4" />
                  Fund Wallet &mdash; ₦{numericAmount.toLocaleString()}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              <Shield className="h-4 w-4 text-green-600" />
              Secured by Paystack &middot; 256-bit encryption
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
