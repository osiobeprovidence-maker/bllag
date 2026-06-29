import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, Lock, Eye, Database, Search } from 'lucide-react';

export function PrivacyPolicy() {
  const points = [
    {
      title: 'Metadata Harvesting',
      content: 'We collect minimal identity metadata required for artifact dispatch and financial verification. This includes name, delivery destination, and encrypted communication channels.',
      icon: Database
    },
    {
      title: 'Encryption Standards',
      content: 'All personal artifacts stored in our digital vault are secured with military-grade 256-bit AES encryption. We do not sell your metadata to external aggregators.',
      icon: Lock
    },
    {
      title: 'Behavioral Insights',
      content: 'We monitor interface interactions to optimize vault accessibility and refine artifact recommendations. This data is anonymized and stored on secure private clouds.',
      icon: Eye
    },
    {
      title: 'Right to Erasure',
      content: 'You maintain the sovereign right to request total metadata erasure from our systems. Note that this will terminate your vault access and order history.',
      icon: Shield
    }
  ];

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
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">Data Governance</h1>
          <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-8">Privacy Policy</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Version Protocol 2.4.1 — Active Cycle</p>
        </header>

        <div className="space-y-12">
          <div className="prose prose-sm max-w-none">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-loose mb-12">
              At bllag, we view privacy not as a setting, but as a fundamental luxury right. Our digital vault protocols are designed to ensure your identity remains as secure as the artifacts you acquire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {points.map((point, i) => (
              <div key={i} className="bg-white border border-gray-200 p-10 space-y-6">
                <div className="w-12 h-12 bg-gray-50 flex items-center justify-center text-accent">
                  <point.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-tight">{point.title}</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                  {point.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 p-12 bg-gray-900 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <Search className="h-10 w-10 text-accent opacity-50" />
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Transparency Log</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">View our real-time system audit logs</p>
              </div>
            </div>
            <button className="bg-accent text-white px-10 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-primary transition-all whitespace-nowrap">
              Access Audit Node
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
