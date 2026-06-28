import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Leaf, Shield, Globe, Users, Heart } from 'lucide-react';

export function Sustainability() {
  const pillars = [
    {
      title: 'Ethical Extraction',
      content: 'We exclusively source gold and gemstones from certified mines that adhere to fair labor protocols and environmental rehabilitation standards.',
      icon: Leaf
    },
    {
      title: 'Zero Waste Vault',
      content: 'Our manufacturing facilities utilize a closed-loop filtration system, ensuring zero precious metal loss and minimal environmental impact.',
      icon: Shield
    },
    {
      title: 'Community Uplift',
      content: 'A portion of every artifact sale is reinvested into the communities where our materials are sourced, supporting education and infrastructure.',
      icon: Users
    },
    {
      title: 'Carbon Handshake',
      content: 'Our global logistics network is optimized to reduce delivery hops, and we offset all dispatch emissions through certified conservation projects.',
      icon: Globe
    }
  ];

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <Link 
          to="/about" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-12"
        >
          <ArrowLeft className="h-3 w-3" />
          About the Vault
        </Link>

        <header className="mb-20 text-center">
          <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">Eternal Responsibility</h1>
          <h2 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-12">Luxury With Integrity</h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest leading-relaxed">
              BLAG artifacts are designed to endure for generations—not just in their craftsmanship, but in the positive legacy they leave behind on our planet and its people.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          {pillars.map((pillar, i) => (
            <div key={i} className="bg-white border border-gray-200 p-12 space-y-6">
              <div className="w-16 h-16 bg-gray-50 flex items-center justify-center text-accent">
                <pillar.icon className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-tight">{pillar.title}</h3>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                {pillar.content}
              </p>
            </div>
          ))}
        </div>

        <div className="relative h-[60vh] overflow-hidden flex items-center justify-center text-center">
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-20"
          />
          <div className="relative z-10 max-w-xl px-6">
            <Heart className="h-12 w-12 text-accent mx-auto mb-8" />
            <h3 className="text-4xl font-black uppercase tracking-tighter text-primary mb-6">Transparency Matters</h3>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-loose mb-10">
              We publish an annual ESG (Environmental, Social, and Governance) report detailng our progress toward a fully circular luxury economy.
            </p>
            <button className="bg-primary text-white px-10 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
              Download 2026 ESG Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
