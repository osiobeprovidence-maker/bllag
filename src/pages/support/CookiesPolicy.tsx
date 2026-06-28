import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Cookie, Shield, Eye, Settings, Save } from 'lucide-react';

export function CookiesPolicy() {
  const cookieTypes = [
    {
      title: 'Essential Handshakes',
      description: 'Required for vault security, authentication, and order processing. These cannot be terminated.',
      status: 'Mandatory',
      icon: Shield
    },
    {
      title: 'Preference Metadata',
      description: 'Used to remember your interface selections, language protocols, and recently viewed artifacts.',
      status: 'User Choice',
      icon: Settings
    },
    {
      title: 'Analytic Insights',
      description: 'Helps us understand how the digital vault is utilized to optimize performance and navigation.',
      status: 'User Choice',
      icon: Eye
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
            <Cookie className="h-8 w-8" />
          </div>
          <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">Interface Tracking</h1>
          <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-8">Cookies Policy</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed max-w-xl">
            We utilize small data packets known as "cookies" to enhance your vault experience and secure your digital transactions.
          </p>
        </header>

        <div className="space-y-12">
          <div className="bg-white border border-gray-200 divide-y divide-gray-100">
            {cookieTypes.map((type, i) => (
              <div key={i} className="p-8 lg:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="flex items-start gap-6 max-w-xl">
                  <div className="w-12 h-12 bg-gray-50 flex items-center justify-center text-muted-foreground mt-1">
                    <type.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-tight mb-2">{type.title}</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                  <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${type.status === 'Mandatory' ? 'bg-primary text-white' : 'bg-gray-100 text-muted-foreground'}`}>
                    {type.status}
                  </span>
                  {type.status !== 'Mandatory' && (
                    <div className="w-12 h-6 bg-accent rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 p-10 bg-gray-900 text-white">
            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed opacity-70">
              Your choices are immediately committed to our local session vault.
            </p>
            <button className="bg-accent text-white px-10 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-primary transition-all flex items-center gap-3">
              <Save className="h-4 w-4" />
              Commit Selections
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
