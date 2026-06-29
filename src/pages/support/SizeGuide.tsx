import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Ruler, Info, Scale, Box } from 'lucide-react';

export function SizeGuide() {
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
          <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">Precision Metrics</h1>
          <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-12">Universal Size Guide</h2>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest max-w-xl leading-relaxed">
            Ensuring your luxury artifacts fit with absolute precision. Use our calibrated metrics for an optimal experience.
          </p>
        </header>

        <div className="space-y-20">
          <section className="space-y-12">
            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-4">
              <Ruler className="h-6 w-6 text-accent" />
              Eternal Bands (Rings)
            </h3>
            <div className="bg-white border border-gray-200 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest">EU Size</th>
                    <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest">US Size</th>
                    <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest">Inner Circumference</th>
                    <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest">Inner Diameter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { eu: '48', us: '4.5', circ: '48.0 mm', diam: '15.3 mm' },
                    { eu: '50', us: '5.25', circ: '50.0 mm', diam: '15.9 mm' },
                    { eu: '52', us: '6.0', circ: '51.8 mm', diam: '16.5 mm' },
                    { eu: '54', us: '6.75', circ: '54.0 mm', diam: '17.2 mm' },
                    { eu: '56', us: '7.5', circ: '56.0 mm', diam: '17.8 mm' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="p-6 text-[11px] font-bold">{row.eu}</td>
                      <td className="p-6 text-[11px] font-bold">{row.us}</td>
                      <td className="p-6 text-[11px] font-bold text-muted-foreground">{row.circ}</td>
                      <td className="p-6 text-[11px] font-bold text-muted-foreground">{row.diam}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white border border-gray-200 p-10 space-y-6">
              <Scale className="h-8 w-8 text-accent" />
              <h3 className="text-sm font-black uppercase tracking-tight">Royal Collars (Necklaces)</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                Our standard gold chains are dispatched in 16, 18, and 20 inch lengths. Custom lengths are available via the Bespoke Service portal.
              </p>
            </section>
            <section className="bg-white border border-gray-200 p-10 space-y-6">
              <Box className="h-8 w-8 text-accent" />
              <h3 className="text-sm font-black uppercase tracking-tight">Celestial Links (Bracelets)</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                Measured at the widest point of the wrist. We recommend adding 15mm to your wrist circumference for a comfort fit.
              </p>
            </section>
          </div>

          <div className="bg-muted p-12 border border-gray-200">
            <div className="flex items-start gap-6">
              <Info className="h-6 w-6 text-accent mt-1" />
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight mb-4">Measurement Handshake</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                  Unsure of your metrics? We can dispatch a physical bllag Calibrated Sizer to your destination free of charge. Contact the concierge to initiate this dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
