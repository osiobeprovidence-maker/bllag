import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Scale, Shield, Globe, FileText } from 'lucide-react';

export function TermsConditions() {
  const sections = [
    {
      title: 'Agreement Termination',
      content: 'By accessing the bllag vault and digital interface, you agree to comply with our established security and transaction protocols. We reserve the right to terminate access for any account exhibiting irregular behavioral patterns.'
    },
    {
      title: 'Intellectual Property',
      content: 'All artifact designs, holographic imagery, and brand nomenclature are the exclusive property of bllag HQ. Unauthorized replication of our luxury artifacts is strictly prohibited and protected by international law.'
    },
    {
      title: 'Transaction Protocols',
      content: 'Prices displayed are exclusive of regional logistics and customs duties unless specified. We utilize real-time gold market pricing which may fluctuate during your session.'
    },
    {
      title: 'Global Compliance',
      content: 'Our operations strictly adhere to international Anti-Money Laundering (AML) and Know Your Customer (KYC) regulations for high-value asset transfers.'
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
            <Scale className="h-8 w-8" />
          </div>
          <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">Legal Framework</h1>
          <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-8">Terms & Conditions</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Effective Solar Cycle: June 2026</p>
        </header>

        <div className="space-y-16">
          <div className="bg-white border border-gray-200 p-10 lg:p-16 space-y-12">
            {sections.map((section, i) => (
              <div key={i} className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-tight flex items-center gap-4">
                  <span className="text-accent italic">0{i + 1}.</span>
                  {section.title}
                </h3>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-loose">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/privacy" className="flex items-center justify-between p-8 bg-gray-50 border border-gray-100 hover:border-accent group transition-all">
              <div className="flex items-center gap-4">
                <Shield className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest">Privacy Policy</span>
              </div>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </Link>
            <div className="flex items-center justify-between p-8 bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-4">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] font-black uppercase tracking-widest">Jurisdiction: Lagos, NG</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
