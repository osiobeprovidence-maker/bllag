import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Diamond, PenTool, Sparkles, MessageSquare, ChevronRight } from 'lucide-react';

export function BespokeService() {
  return (
    <div className="pt-20">
      <header className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1573408339301-016737618995?q=80&w=2000&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 scale-110"
        />
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-[12px] font-black uppercase tracking-[0.6em] text-accent mb-8">Bespoke Artifacts</h1>
            <h2 className="text-6xl lg:text-9xl font-black uppercase tracking-tighter text-white leading-none mb-12">
              Beyond the <span className="italic text-accent">Vault</span>
            </h2>
            <p className="text-white/60 text-sm font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed mb-12">
              Manifest your unique vision into reality through our private design commission service.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="bg-accent text-white px-12 py-6 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-primary transition-all">
                Commission Inquiry
              </button>
              <Link to="/contact" className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                Speak with a Designer
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent mb-6">The Process</h3>
            <h4 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-10">From Sketch to <span className="italic">Substance</span></h4>
            <div className="space-y-12">
              <div className="flex gap-8">
                <div className="w-12 h-12 bg-muted flex items-center justify-center flex-shrink-0 text-primary font-black italic">01</div>
                <div>
                  <h5 className="text-sm font-black uppercase tracking-tight mb-3">Vision Consultation</h5>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-loose">
                    Collaborate with our senior artisans to define the geometry, materials, and significance of your custom artifact.
                  </p>
                </div>
              </div>
              <div className="flex gap-8">
                <div className="w-12 h-12 bg-muted flex items-center justify-center flex-shrink-0 text-primary font-black italic">02</div>
                <div>
                  <h5 className="text-sm font-black uppercase tracking-tight mb-3">Architectural CAD</h5>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-loose">
                    We manifest your vision in high-fidelity 3D renders for your final approval before entering the physical phase.
                  </p>
                </div>
              </div>
              <div className="flex gap-8">
                <div className="w-12 h-12 bg-muted flex items-center justify-center flex-shrink-0 text-primary font-black italic">03</div>
                <div>
                  <h5 className="text-sm font-black uppercase tracking-tight mb-3">Vault Execution</h5>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-loose">
                    The artifact is precision-crafted by master goldsmiths in our secure facility, utilizing ethically sourced materials.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] bg-gray-100 mt-12">
              <img src="https://images.unsplash.com/photo-1588444839799-eb6ae52b1a6c?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover grayscale" />
            </div>
            <div className="aspect-[3/4] bg-gray-100">
              <img src="https://images.unsplash.com/photo-1616150638538-ffb0679a3fc4?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover grayscale" />
            </div>
          </div>
        </div>

        <div className="bg-primary p-12 lg:p-24 text-white text-center">
          <Sparkles className="h-12 w-12 text-accent mx-auto mb-10" />
          <h3 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter mb-8 italic">Reserved for the Bold</h3>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] max-w-xl mx-auto leading-relaxed mb-12 opacity-70">
            Bespoke commissions require a minimum artifact value of ₦2.5M. The typical manifest duration is 4-8 solar weeks.
          </p>
          <button className="bg-white text-primary px-12 py-6 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all">
            Secure Private Session
          </button>
        </div>
      </div>
    </div>
  );
}
