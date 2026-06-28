import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Package, ArrowRight, Download, Heart } from 'lucide-react';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || '#ORD-9281';

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-gray-200 p-12 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Background Elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/20">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>

            <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4">Transaction Secured</h1>
            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none mb-8">Purchase Confirmed</h2>
            
            <div className="bg-muted p-8 border border-gray-100 mb-12 text-left">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Identity</span>
                <span className="text-sm font-black uppercase tracking-tighter text-primary">{orderId}</span>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                Thank you for choosing BLAG. Your order has been successfully processed and is now entering our logistics pipeline. A confirmation email has been dispatched to your vault.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              <Link 
                to="/orders"
                className="flex items-center justify-center gap-3 bg-primary text-white py-5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all"
              >
                <Package className="h-4 w-4" />
                View Order Status
              </Link>
              <button className="flex items-center justify-center gap-3 bg-gray-50 border border-gray-200 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
                <Download className="h-4 w-4" />
                Download Receipt
              </button>
            </div>

            <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                  <Heart className="h-4 w-4 fill-current" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-left">
                  Join our Affiliate program<br/>
                  <span className="text-muted-foreground">Earn 5% on every referral</span>
                </p>
              </div>
              <Link 
                to="/affiliate"
                className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2 hover:gap-3 transition-all"
              >
                Learn More
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
