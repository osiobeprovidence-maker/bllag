import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, Search, Database, Globe, Award } from 'lucide-react';

export function AuthenticationProtocol() {
  const steps = [
    {
      title: 'Holographic Sealing',
      content: 'Every artifact is sealed with a tamper-evident holographic badge containing a unique cryptograph.',
      icon: ShieldCheck
    },
    {
      title: 'Blockchain Logging',
      content: 'Ownership transfers are logged on our private ledger to ensure immutable provenance history.',
      icon: Database
    },
    {
      title: 'Spectroscopic Audit',
      content: 'All gold and gemstones undergo a final laboratory audit before entering the vault.',
      icon: Search
    },
    {
      title: 'Certification Registry',
      content: 'Your digital certification is accessible via the BLAG portal using your unique order identity.',
      icon: Award
    }
  ];

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <Link 
          to="/help-center" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-12"
        >
          <ArrowLeft className="h-3 w-3" />
          Support Hub
        </Link>

        <header className="mb-20">
          <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">Provenance Verification</h1>
          <h2 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-12">Authentication Protocols</h2>
          <div className="flex flex-col md:flex-row items-center gap-8 p-10 bg-gray-50 border border-gray-200">
            <Globe className="h-16 w-16 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest leading-relaxed">
              BLAG artifacts represent the peak of luxury engineering. To protect your investment, we utilize a multi-layered verification handshake that ensures every piece is authentic, ethically sourced, and of royal quality.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="bg-white border border-gray-200 p-12 space-y-6 group hover:border-accent transition-all">
              <div className="w-16 h-16 bg-gray-50 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-tight">{step.title}</h3>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                {step.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 py-20 border-t border-gray-100 flex flex-col items-center text-center">
          <ShieldCheck className="h-16 w-16 text-accent mb-8" />
          <h3 className="text-2xl font-black uppercase tracking-tight mb-4">The BLAG Authenticator</h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-12 max-w-lg mx-auto leading-relaxed">
            Acquired an artifact from a secondary market? Use our global registry to verify its authenticity and provenance history.
          </p>
          <button className="bg-primary text-white px-12 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
            Initiate Verification Scan
          </button>
        </div>
      </div>
    </div>
  );
}
