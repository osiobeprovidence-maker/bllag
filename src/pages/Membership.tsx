import React from 'react';
import { motion } from 'motion/react';
import { Check, Crown, Star, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store';
import { Navigate, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function Membership() {
  const { isAuthenticated, user, sessionId } = useAuthStore();
  const navigate = useNavigate();

  const membershipData = useQuery(
    api.memberships.getByUser,
    isAuthenticated && sessionId ? { sessionId } : 'skip'
  );

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const tiers = [
    {
      name: 'Silver',
      price: 5000,
      icon: Star,
      color: 'text-gray-400',
      perks: [
        '5% discount on all purchases',
        'Early access to new drops',
        'Free shipping on orders over ₦50k',
        'Exclusive member newsletter'
      ]
    },
    {
      name: 'Gold',
      price: 15000,
      icon: Crown,
      color: 'text-yellow-500',
      perks: [
        '10% discount on all purchases',
        '24h early access to all collections',
        'Free shipping on all orders',
        'Priority customer support',
        'Birthday gift voucher (₦10k)'
      ],
      recommended: true
    },
    {
      name: 'Platinum',
      price: 35000,
      icon: ShieldCheck,
      color: 'text-indigo-500',
      perks: [
        '15% discount on all purchases',
        'VIP access to private events',
        'Personal concierge shopper',
        'Free ring resizing & polishing',
        'Custom engraved packaging'
      ]
    }
  ];

  const handleSubscribe = (tier: typeof tiers[0]) => {
    alert(`You've selected the ${tier.name} plan (₦${tier.price.toLocaleString()}/mo). Proceed to checkout to complete your subscription.`);
    navigate('/wallet/top-up');
  };

  const currentTier = membershipData && membershipData.active
    ? membershipData.tier
    : null;

  return (
    <div className="pt-24 pb-24 min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4 block">Exclusive Circle</span>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none">
              bllag <span className="text-accent italic font-serif">Membership</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Elevate your luxury experience with curated rewards, priority access to rare drops, and bespoke services designed for our most discerning patrons.
            </p>
          </motion.div>
        </div>

        {membershipData === undefined ? (
          <div className="mb-16 flex items-center justify-center p-10">
            <Loader2 className="h-6 w-6 text-accent animate-spin" />
          </div>
        ) : currentTier ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-16 bg-white border border-gray-100 p-10 text-center max-w-2xl mx-auto shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
            <Zap className="h-10 w-10 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">Current Status</span>
            <h2 className="text-3xl font-black uppercase tracking-tight">Active: {currentTier}</h2>
            {membershipData.expiresAt && (
              <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mt-4">
                Expires: {new Date(membershipData.expiresAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            )}
          </motion.div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {tiers.map((tier, index) => {
            const isCurrent = currentTier?.toLowerCase() === tier.name.toLowerCase();
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
                className={`relative bg-white p-10 border ${
                  tier.recommended ? 'border-accent shadow-2xl z-10' : 'border-gray-100 shadow-sm'
                } flex flex-col group transition-all duration-500`}
              >
                {tier.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white text-[9px] font-black uppercase tracking-[0.2em] px-6 py-2 shadow-lg">
                    Most Preferred
                  </div>
                )}
                
                <div className="mb-10">
                  <div className={`inline-flex p-4 ${tier.recommended ? 'bg-accent/5' : 'bg-gray-50'} mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <tier.icon className={`h-8 w-8 ${tier.color}`} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tighter">₦{tier.price.toLocaleString()}</span>
                    <span className="text-muted-foreground text-[9px] uppercase tracking-[0.2em] font-black">/ mo</span>
                  </div>
                </div>

                <div className="space-y-6 mb-12 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-gray-50 pb-2">Plan Benefits</p>
                  <ul className="space-y-4">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-3 text-[11px] leading-relaxed">
                        <Check className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="font-medium">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSubscribe(tier)}
                  disabled={isCurrent}
                  className={`w-full py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                    isCurrent
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : tier.recommended 
                        ? 'bg-accent text-white hover:bg-black hover:shadow-xl' 
                        : 'bg-primary text-primary-foreground hover:bg-accent'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : 'Select Plan'}
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-32 pt-20 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4 block">The Privilege</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-10 leading-none">Why Join <br/>The Circle?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              <div className="group">
                <div className="w-10 h-1 bg-accent mb-6 group-hover:w-20 transition-all duration-500"></div>
                <h4 className="font-black uppercase tracking-widest text-xs mb-3">Superior Value</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">Our patrons save an average of ₦150k annually through exclusive member pricing and complimentary global logistics.</p>
              </div>
              <div className="group">
                <div className="w-10 h-1 bg-accent mb-6 group-hover:w-20 transition-all duration-500"></div>
                <h4 className="font-black uppercase tracking-widest text-xs mb-3">Immediate Access</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">Limited editions often vanish in minutes. Members receive a 24-hour head start on all seasonal drops and collaborations.</p>
              </div>
              <div className="group">
                <div className="w-10 h-1 bg-accent mb-6 group-hover:w-20 transition-all duration-500"></div>
                <h4 className="font-black uppercase tracking-widest text-xs mb-3">Artisanal Care</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">Platinum members benefit from lifelong maintenance and concierge resizing services to ensure their heirlooms remain perfect.</p>
              </div>
              <div className="group">
                <div className="w-10 h-1 bg-accent mb-6 group-hover:w-20 transition-all duration-500"></div>
                <h4 className="font-black uppercase tracking-widest text-xs mb-3">Bespoke Gifting</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">Access to personalized engraving and luxury packaging options that turn every purchase into a statement of elegance.</p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 bg-white p-12 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black uppercase tracking-tight mb-8">Service FAQ</h3>
            <div className="space-y-2">
              <details className="group border-b border-gray-50 py-4">
                <summary className="list-none font-black text-[10px] uppercase tracking-widest cursor-pointer flex justify-between items-center group-open:text-accent transition-colors">
                  Membership Cancellation
                  <Plus className="h-3 w-3 group-open:rotate-45 transition-transform" />
                </summary>
                <div className="overflow-hidden">
                  <p className="text-[11px] text-muted-foreground pt-4 leading-relaxed">You may terminate your subscription at any moment via your profile dashboard. Benefits will remain active until the conclusion of your current billing period.</p>
                </div>
              </details>
              <details className="group border-b border-gray-50 py-4">
                <summary className="list-none font-black text-[10px] uppercase tracking-widest cursor-pointer flex justify-between items-center group-open:text-accent transition-colors">
                  Billing Logistics
                  <Plus className="h-3 w-3 group-open:rotate-45 transition-transform" />
                </summary>
                <div className="overflow-hidden">
                  <p className="text-[11px] text-muted-foreground pt-4 leading-relaxed">Subscription dues are automatically debited from your bllag Wallet every 30 days. Please maintain a sufficient balance to avoid service interruption.</p>
                </div>
              </details>
              <details className="group border-b border-gray-50 py-4">
                <summary className="list-none font-black text-[10px] uppercase tracking-widest cursor-pointer flex justify-between items-center group-open:text-accent transition-colors">
                  Plan Upgrades
                  <Plus className="h-3 w-3 group-open:rotate-45 transition-transform" />
                </summary>
                <div className="overflow-hidden">
                  <p className="text-[11px] text-muted-foreground pt-4 leading-relaxed">You can transition between tiers at any time. The new billing cycle and benefits will commence immediately upon selection.</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
