import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, RefreshCw, ShieldCheck, Truck, Clock, AlertTriangle } from 'lucide-react';

export function ReturnsRefunds() {
  return (
    <div className="pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/help-center" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-12"
        >
          <ArrowLeft className="h-3 w-3" />
          Support Hub
        </Link>

        <header className="mb-20">
          <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">Post-Dispatch Protocols</h1>
          <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-12">Returns & Refunds</h2>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest max-w-xl leading-relaxed">
            Our commitment to artifact integrity extends beyond delivery. Review our security-first return and exchange protocols.
          </p>
        </header>

        <div className="space-y-20">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-gray-100 pb-20">
            <div className="md:col-span-1">
              <h3 className="text-sm font-black uppercase tracking-tight mb-4">The return window</h3>
              <div className="flex items-center gap-3 text-accent mb-4">
                <Clock className="h-5 w-5" />
                <span className="text-2xl font-black italic">14 Solar Days</span>
              </div>
            </div>
            <div className="md:col-span-2 space-y-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-loose">
              <p>You have exactly 14 solar days from the timestamp of delivery to initiate a return request via the concierge dashboard.</p>
              <p>Artifacts must be in their original vault-sealed state. Any tampering with security tags or holographic seals will void the return eligibility.</p>
            </div>
          </section>

          <section className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-3">
              <RefreshCw className="h-4 w-4 text-accent" />
              The Exchange Protocol
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 p-10">
                <ShieldCheck className="h-8 w-8 text-accent mb-6" />
                <h4 className="text-[11px] font-black uppercase tracking-tight mb-4">Authenticity Verification</h4>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                  Every returned artifact undergoes a rigorous 48-hour authenticity and condition audit in our central vault before refund approval.
                </p>
              </div>
              <div className="bg-white border border-gray-200 p-10">
                <Truck className="h-8 w-8 text-accent mb-6" />
                <h4 className="text-[11px] font-black uppercase tracking-tight mb-4">Security Logistics</h4>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                  We provide specialized security couriers for returns. Do not use standard postal services for high-value artifacts.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-red-50 border border-red-100 p-12">
            <div className="flex items-start gap-6">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-red-600 mb-4">Non-Returnable Artifacts</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] font-bold text-red-600/70 uppercase tracking-widest list-disc pl-4">
                  <li>Bespoke/Customized artifacts</li>
                  <li>Royal Gold bullion and liquid assets</li>
                  <li>Intimate jewelry (earrings) for hygienic reasons</li>
                  <li>Artifacts with broken security seals</li>
                  <li>Final clearance vault items</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-widest">Refund Distribution</h3>
            <div className="bg-white border border-gray-200 divide-y divide-gray-100">
              <div className="p-8 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest">Store Credit / Vault Wallet</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-accent">Immediate After Audit</span>
              </div>
              <div className="p-8 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest">Original Financial Instrument</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">5-7 Business Cycles</span>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-20 text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-8">Need to initiate a return?</p>
          <Link 
            to="/orders"
            className="inline-block bg-primary text-white px-12 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all"
          >
            Access Order History
          </Link>
        </div>
      </div>
    </div>
  );
}
