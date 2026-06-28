import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, Bell, Shield, User, Globe, Moon, CreditCard, ArrowLeft, ChevronRight } from 'lucide-react';

export function Settings() {
  const settingGroups = [
    {
      title: 'Personal Configuration',
      items: [
        { id: 'profile', name: 'Profile Metadata', description: 'Update your personal identity and public artifacts', icon: User, path: '/profile' },
        { id: 'address', name: 'Logistics Repository', description: 'Manage your primary and secondary destinations', icon: Globe, path: '/address-book' },
      ]
    },
    {
      title: 'Security & Access',
      items: [
        { id: 'security', name: 'Vault Security', description: 'Modify access credentials and multi-factor protocols', icon: Shield, path: '/security' },
        { id: 'notifications', name: 'Signal Preferences', description: 'Configure alerts for orders and market insights', icon: Bell, path: '/notifications' },
      ]
    },
    {
      title: 'Financial & Interface',
      items: [
        { id: 'billing', name: 'Payment Protocols', description: 'Stored cards and financial history logs', icon: CreditCard, path: '/wallet' },
        { id: 'appearance', name: 'Visual Interface', description: 'Switch between Light and Obsidian themes', icon: Moon, path: '#' },
      ]
    }
  ];

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/profile" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-12"
        >
          <ArrowLeft className="h-3 w-3" />
          Account Dashboard
        </Link>

        <header className="mb-16">
          <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">Core Optimization</h1>
          <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none">System Settings</h2>
        </header>

        <div className="space-y-16">
          {settingGroups.map((group) => (
            <section key={group.title}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-8 border-b border-gray-100 pb-4">
                {group.title}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {group.items.map((item) => (
                  <Link 
                    key={item.id}
                    to={item.path}
                    className="flex items-center justify-between p-6 bg-white border border-gray-200 hover:border-accent group transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-gray-50 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-tight mb-1">{item.name}</h4>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-all transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
