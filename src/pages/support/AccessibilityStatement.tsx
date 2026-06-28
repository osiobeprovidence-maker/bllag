import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, UserCheck, Shield, Eye, Smartphone, MessageSquare } from 'lucide-react';

export function AccessibilityStatement() {
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
          <div className="w-16 h-16 bg-accent/10 flex items-center justify-center text-accent mb-8">
            <UserCheck className="h-8 w-8" />
          </div>
          <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">Universal Access</h1>
          <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-8">Accessibility Statement</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed max-w-xl">
            We are committed to ensuring our luxury digital vault is accessible to all individuals, regardless of ability or technological interface.
          </p>
        </header>

        <div className="space-y-16">
          <div className="bg-white border border-gray-200 p-10 lg:p-16 space-y-12">
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-tight flex items-center gap-4">
                <span className="text-accent italic">01.</span>
                Visual Compliance
              </h3>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-loose">
                Our interface utilizes high-contrast typography and semantic structure to support screen reading protocols and visual enhancement tools.
              </p>
            </section>
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-tight flex items-center gap-4">
                <span className="text-accent italic">02.</span>
                Navigation Handshake
              </h3>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-loose">
                We support keyboard-only navigation throughout the vault, ensuring a seamless experience for those who do not utilize standard pointing devices.
              </p>
            </section>
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-tight flex items-center gap-4">
                <span className="text-accent italic">03.</span>
                Continuous Optimization
              </h3>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-loose">
                Our technical team performs monthly accessibility audits against WCAG 2.1 Level AA standards to identify and terminate interface barriers.
              </p>
            </section>
          </div>

          <div className="p-12 bg-muted border border-gray-200">
            <h3 className="text-xl font-black uppercase tracking-tight mb-6 text-center italic">Encountering Barriers?</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center leading-relaxed mb-10 max-w-md mx-auto">
              If you experience any difficulties accessing our digital inventory, please signal our concierge team for immediate assistance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                to="/contact"
                className="bg-primary text-white px-10 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all flex items-center gap-3"
              >
                <MessageSquare className="h-4 w-4" />
                Signal Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
