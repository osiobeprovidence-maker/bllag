import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Book, MessageSquare, Truck, Shield, CreditCard, ShoppingBag, HelpCircle, ArrowRight } from 'lucide-react';

export function HelpCenter() {
  const categories = [
    { id: 'orders', name: 'Order Artifacts', description: 'Tracking, modifications, and confirmation', icon: ShoppingBag },
    { id: 'logistics', name: 'Global Logistics', description: 'Shipping speeds, regions, and vault handling', icon: Truck },
    { id: 'financial', name: 'Financial Protocols', description: 'Payment methods, installments, and billing', icon: CreditCard },
    { id: 'security', name: 'Vault Security', description: 'Account access, encryption, and privacy', icon: Shield },
    { id: 'returns', name: 'Exchanges & Returns', description: 'Policy guidelines and return logistics', icon: Book },
    { id: 'concierge', name: 'VIP Concierge', description: 'Bespoke artifacts and private viewings', icon: HelpCircle }
  ];

  const popularArticles = [
    'How do I track my Royal Gold shipment?',
    'What is the bllag installment protocol?',
    'How to verify artifact authenticity?',
    'Managing international customs & duties',
    'Updating vault access credentials'
  ];

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-20">
          <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">Concierge Support</h1>
          <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-12">System Support Hub</h2>
          
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search for solutions or artifacts..."
              className="w-full bg-white border border-gray-200 pl-16 pr-8 py-6 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-accent shadow-2xl"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/faq?category=${category.id}`}
              className="bg-white border border-gray-200 p-10 hover:border-accent group transition-all"
            >
              <div className="w-16 h-16 bg-gray-50 flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-white transition-colors">
                <category.icon className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-tight mb-3">{category.name}</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed mb-6">
                {category.description}
              </p>
              <span className="text-[9px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
                Explore Solutions
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2">
            <h3 className="text-xs font-black uppercase tracking-widest mb-8 border-b border-gray-100 pb-4">Prominent Inquiries</h3>
            <div className="space-y-4">
              {popularArticles.map((article, i) => (
                <Link 
                  key={i}
                  to="/faq"
                  className="flex items-center justify-between p-6 bg-gray-50 border border-gray-100 hover:bg-white hover:border-accent transition-all group"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">{article}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transform transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-primary p-12 text-white">
            <MessageSquare className="h-10 w-10 mb-8 opacity-50" />
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">Direct Concierge</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-10 opacity-70">
              Can't find what you're looking for? Speak directly with a bllag concierge member for personalized assistance.
            </p>
            <Link 
              to="/contact"
              className="block w-full bg-accent text-white py-5 text-center text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-primary transition-all"
            >
              Initiate Transmission
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
