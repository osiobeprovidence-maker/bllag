import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Lock, Smartphone, Fingerprint, Eye, EyeOff, ArrowLeft, Save } from 'lucide-react';

export function Security() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/settings" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-12"
        >
          <ArrowLeft className="h-3 w-3" />
          System Settings
        </Link>

        <header className="mb-16">
          <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">Encryption Protocols</h1>
          <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none">Vault Security</h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white border border-gray-200 p-8 lg:p-12">
              <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                <Lock className="h-4 w-4 text-accent" />
                Access Credentials
              </h3>
              <form className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Authentication Code</label>
                  <div className="relative">
                    <input 
                      type={showCurrentPassword ? 'text' : 'password'} 
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Authentication Code</label>
                    <div className="relative">
                      <input 
                        type={showNewPassword ? 'text' : 'password'} 
                        className="w-full bg-gray-50 border border-gray-200 px-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confirm New Code</label>
                    <input 
                      type="password" 
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <button className="bg-primary text-white px-8 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all flex items-center gap-3">
                  <Save className="h-4 w-4" />
                  Update Credentials
                </button>
              </form>
            </section>

            <section className="bg-white border border-gray-200 p-8 lg:p-12">
              <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                <Smartphone className="h-4 w-4 text-accent" />
                Multi-Factor Handshake
              </h3>
              <div className="flex items-center justify-between p-6 bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white flex items-center justify-center text-muted-foreground">
                    <Fingerprint className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-tight mb-1">Two-Step Verification</h4>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Enhanced security for large transactions</p>
                  </div>
                </div>
                <button className="bg-accent text-white px-6 py-3 text-[9px] font-black uppercase tracking-widest hover:bg-primary transition-all">
                  Enable
                </button>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-muted p-8 border border-gray-200">
              <h3 className="text-xs font-black uppercase tracking-widest mb-4">Security Level</h3>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-1.5 flex-1 bg-green-500 rounded-full"></div>
                <div className="h-1.5 flex-1 bg-green-500 rounded-full"></div>
                <div className="h-1.5 flex-1 bg-gray-200 rounded-full"></div>
                <div className="h-1.5 flex-1 bg-gray-200 rounded-full"></div>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                Your vault security is <span className="text-primary">Standard</span>. Enable Two-Step Verification to achieve <span className="text-accent">Obsidian Level</span> security.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-8">
              <h3 className="text-xs font-black uppercase tracking-widest mb-6">Device Sessions</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">Current Session</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">Lagos, NG — Chrome / MacOS</p>
                  </div>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                </div>
                <button className="text-[9px] font-black uppercase tracking-widest text-accent hover:underline">
                  Terminate All Other Sessions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
