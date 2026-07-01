import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuthStore } from '../store';
import { Link } from 'react-router-dom';
import { Copy, CheckCircle2, TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react';

export function Affiliate() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex flex-col items-center justify-center max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6">bllag Agent Program</h1>
        <p className="text-muted-foreground mb-8">Please log in to view your agent dashboard.</p>
        <Link 
          to="/login" 
          className="bg-primary text-primary-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (user?.role !== 'agent') {
    return (
      <div className="pt-32 pb-24 min-h-screen max-w-4xl mx-auto px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-muted p-12 border border-gray-200"
        >
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">Become a bllag Agent</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
            Earn up to 15% commission on every sale you refer. Share your love for bllag jewelry with your audience and get rewarded.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <div className="bg-background w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4 border border-muted">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-bold uppercase tracking-widest text-sm mb-2">1. Share</h3>
              <p className="text-sm text-muted-foreground">Share your unique link on social media or your blog.</p>
            </div>
            <div>
              <div className="bg-background w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4 border border-muted">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-bold uppercase tracking-widest text-sm mb-2">2. Track</h3>
              <p className="text-sm text-muted-foreground">Monitor your clicks and conversions in real-time.</p>
            </div>
            <div>
              <div className="bg-background w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4 border border-muted">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-bold uppercase tracking-widest text-sm mb-2">3. Earn</h3>
              <p className="text-sm text-muted-foreground">Get paid monthly for every successful referral.</p>
            </div>
          </div>
          <Link
            to="/contact"
            className="bg-primary text-primary-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors inline-block"
          >
            Apply for Program
          </Link>
        </motion.div>
      </div>
    );
  }

  const affiliateLink = `https://bllag.com/?ref=${user?.name.toLowerCase().replace(/\s+/g, '') || 'user'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-24 pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2">Agent Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}. Here's your performance overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-muted p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest">Total Earnings</h3>
              <DollarSign className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-black">Coming Soon</p>
          </div>
          <div className="bg-muted p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest">Total Clicks</h3>
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-black">Coming Soon</p>
          </div>
          <div className="bg-muted p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest">Conversions</h3>
              <BarChart3 className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-black">Coming Soon</p>
          </div>
        </div>

        <div className="bg-muted p-8 border border-gray-200 mb-12">
          <h2 className="text-xl font-bold uppercase tracking-tight mb-4">Your Referral Link</h2>
          <p className="text-sm text-muted-foreground mb-6">Share this link to start earning commissions on referrals.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              readOnly 
              value={affiliateLink}
              className="flex-1 bg-background border border-gray-300 p-4 focus:outline-none focus:border-accent font-mono text-sm"
            />
            <button 
              onClick={handleCopy}
              className="bg-primary text-primary-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-muted p-8 border border-gray-200">
          <h2 className="text-xl font-bold uppercase tracking-tight mb-6">Recent Referrals</h2>
          <div className="text-center py-16 border border-dashed border-gray-200">
            <BarChart3 className="h-10 w-10 mx-auto text-gray-300 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No affiliate data yet</p>
            <p className="text-[9px] text-muted-foreground mt-2">Your referred orders will appear here once customers start purchasing through your link.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
