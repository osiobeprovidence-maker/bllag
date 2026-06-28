import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { XCircle, RefreshCw, MessageSquare, AlertCircle, ArrowLeft } from 'lucide-react';

export function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-gray-200 p-12 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-500/20">
              <XCircle className="h-12 w-12 text-white" />
            </div>

            <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 mb-4">Transaction Interrupted</h1>
            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none mb-8">Payment Declined</h2>
            
            <div className="bg-red-50 border border-red-100 p-8 mb-12 text-left">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-red-600 mb-2">Possible Causes</h3>
                  <ul className="text-[10px] font-bold text-red-600/70 uppercase tracking-widest leading-loose list-disc pl-4">
                    <li>Insufficient funds in the provided account</li>
                    <li>Security protocols triggered by your financial institution</li>
                    <li>Incorrect card details or verification code</li>
                    <li>Network timeout during transaction handshake</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-3 bg-primary text-white py-5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Payment
              </button>
              <Link 
                to="/contact"
                className="flex items-center justify-center gap-3 bg-gray-50 border border-gray-200 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
              >
                <MessageSquare className="h-4 w-4" />
                Contact Support
              </Link>
            </div>

            <Link 
              to="/cart"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Return to Cart
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
