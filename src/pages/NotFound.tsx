import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, ArrowLeft, Ghost, MapPin } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 pt-32">
      <div className="max-w-2xl w-full text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="relative inline-block">
            <h1 className="text-[120px] lg:text-[200px] font-black uppercase tracking-tighter leading-none text-gray-50 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Ghost className="h-20 w-20 text-accent animate-bounce" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter">Artifact Missing</h2>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">
              The coordinate you requested does not exist in our digital vault. It may have been relocated or terminated.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link 
              to="/"
              className="w-full sm:w-auto bg-primary text-white px-12 py-6 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-2xl flex items-center justify-center gap-3"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Core
            </Link>
            <Link 
              to="/shop"
              className="w-full sm:w-auto bg-gray-50 border border-gray-200 px-12 py-6 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-3"
            >
              <Search className="h-4 w-4" />
              Explore Inventory
            </Link>
          </div>

          <div className="pt-12 flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground">
            <MapPin className="h-3 w-3" />
            SYSTEM_ERROR: UNKNOWN_COORDINATE_712
          </div>
        </motion.div>
      </div>
    </div>
  );
}
