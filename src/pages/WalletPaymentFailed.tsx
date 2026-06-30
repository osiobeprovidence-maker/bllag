import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { XCircle, RefreshCw, Wallet, AlertCircle, ArrowRight } from 'lucide-react';

export function WalletPaymentFailed() {
  return (
    <div className="pt-32 pb-20 px-6 lg:px-12 min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-gray-200 p-10 shadow-2xl text-center"
        >
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/20">
            <XCircle className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-[9px] font-black uppercase tracking-[0.3em] text-red-600 mb-3">Transaction Cancelled</h1>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-6">Payment Not Completed</h2>

          <div className="bg-red-50 border border-red-100 p-6 mb-8 text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest leading-relaxed mb-3">
                  Your payment was not completed. Possible reasons:
                </p>
                <ul className="text-[9px] font-bold text-red-600/70 uppercase tracking-widest leading-loose list-disc pl-4">
                  <li>You cancelled the payment on Paystack</li>
                  <li>Insufficient funds in the provided account</li>
                  <li>Bank authentication timed out</li>
                  <li>Network error during processing</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed mb-8">
            No amount has been deducted from your account. You can safely try again or return to your wallet.
          </p>

          <div className="space-y-3">
            <Link
              to="/wallet/top-up"
              className="flex items-center justify-center gap-3 bg-primary text-primary-foreground py-5 px-8 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all w-full"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Link>
            <Link
              to="/wallet"
              className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors py-3"
            >
              <Wallet className="h-3 w-3" /> Back to Wallet
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
