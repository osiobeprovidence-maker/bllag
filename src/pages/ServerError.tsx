import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { AlertTriangle, RefreshCw, MessageSquare, ArrowLeft } from 'lucide-react';

export function ServerError() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 pt-32">
      <div className="max-w-2xl w-full text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-500/20">
            <AlertTriangle className="h-10 w-10 text-white" />
          </div>

          <div className="space-y-6">
            <h1 className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500">System Handshake Failure</h1>
            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none">Internal Server Error</h2>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">
              The BLAG digital infrastructure is currently experiencing a critical handshake failure. Our technical logistics team has been notified.
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-8 text-left max-w-md mx-auto">
            <code className="text-[9px] font-mono text-muted-foreground leading-loose block">
              STATUS_CODE: 500<br/>
              ERROR_LOG: HANDSHAKE_TIMEOUT_VAULT_NODE_01<br/>
              TIMESTAMP: {new Date().toISOString()}<br/>
              ATTEMPT: 03/05
            </code>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <button 
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto bg-primary text-white px-12 py-6 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-2xl flex items-center justify-center gap-3"
            >
              <RefreshCw className="h-4 w-4" />
              Re-establish Link
            </button>
            <Link 
              to="/contact"
              className="w-full sm:w-auto bg-white border border-gray-200 px-12 py-6 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-3"
            >
              <MessageSquare className="h-4 w-4" />
              Signal Concierge
            </Link>
          </div>

          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Safety
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
