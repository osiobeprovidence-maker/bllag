import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Wallet, ArrowRight, Loader2, AlertCircle, XCircle } from 'lucide-react';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuthStore } from '../store';

export function WalletPaymentSuccess() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const { isAuthenticated, sessionId, user } = useAuthStore();
  const verifyPayment = useAction(api.payments.verifyPayment);

  const [state, setState] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [amount, setAmount] = useState(0);
  const [newBalance, setNewBalance] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!reference || !sessionId) return;

    let cancelled = false;

    (async () => {
      try {
        const result = await verifyPayment({ sessionId, reference });
        if (cancelled) return;
        setAmount(result.amount);
        setNewBalance((user?.walletBalance ?? 0) + result.amount);
        setState('success');
      } catch (err: any) {
        if (cancelled) return;
        setErrorMsg(err.message || 'Failed to verify payment.');
        setState('error');
      }
    })();

    return () => { cancelled = true; };
  }, [reference, sessionId, verifyPayment]);

  if (!reference) {
    return <Navigate to="/wallet" replace />;
  }

  if (!isAuthenticated || !sessionId) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12 min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-gray-200 p-10 shadow-2xl text-center"
        >
          {state === 'verifying' && (
            <div className="py-12">
              <Loader2 className="h-16 w-16 animate-spin text-accent mx-auto mb-6" />
              <h1 className="text-xl font-black uppercase tracking-tight mb-3">Verifying Payment</h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Please wait while we confirm your transaction with Paystack.
              </p>
            </div>
          )}

          {state === 'success' && (
            <div>
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-[9px] font-black uppercase tracking-[0.3em] text-green-600 mb-3">Transaction Confirmed</h1>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Wallet Funded</h2>
              <p className="text-5xl font-black text-accent mb-6">+₦{amount.toLocaleString()}</p>
              <div className="bg-muted p-6 border border-gray-100 mb-8 text-left">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Reference</span>
                  <span className="text-xs font-mono font-bold">{reference}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">New Balance</span>
                  <span className="text-lg font-black">₦{newBalance.toLocaleString()}</span>
                </div>
              </div>
              <Link
                to="/wallet"
                className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground py-5 px-8 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all w-full"
              >
                <Wallet className="h-4 w-4" />
                Back to Wallet
              </Link>
            </div>
          )}

          {state === 'error' && (
            <div>
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/20">
                <XCircle className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-[9px] font-black uppercase tracking-[0.3em] text-red-600 mb-3">Verification Failed</h1>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Payment Not Credited</h2>
              <div className="bg-red-50 border border-red-100 p-6 mb-8 text-left">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest leading-relaxed">{errorMsg}</p>
                </div>
              </div>
              <div className="space-y-3">
                <Link
                  to="/wallet/top-up"
                  className="flex items-center justify-center gap-3 bg-primary text-primary-foreground py-4 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all"
                >
                  Try Again
                </Link>
                <Link
                  to="/wallet"
                  className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors py-2"
                >
                  <ArrowRight className="h-3 w-3" /> Back to Wallet
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
