import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuthStore } from '../store';
import { Link } from 'react-router-dom';
import { Copy, CheckCircle2, TrendingUp, Users, DollarSign } from 'lucide-react';

export function Affiliate() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // If not authenticated, prompt to login
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

  // If authenticated but not an agent, show landing page to join
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

  // Agent Dashboard
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
            <p className="text-3xl font-black">₦45,000</p>
            <p className="text-xs text-muted-foreground mt-2">+12% from last month</p>
          </div>
          <div className="bg-muted p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest">Total Clicks</h3>
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-black">1,204</p>
            <p className="text-xs text-muted-foreground mt-2">+5% from last month</p>
          </div>
          <div className="bg-muted p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest">Conversions</h3>
              <Users className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-black">34</p>
            <p className="text-xs text-muted-foreground mt-2">2.8% conversion rate</p>
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-muted-foreground uppercase tracking-widest text-xs border-b border-gray-300">
                <tr>
                  <th className="pb-4 font-normal">Date</th>
                  <th className="pb-4 font-normal">Order Value</th>
                  <th className="pb-4 font-normal">Commission</th>
                  <th className="pb-4 font-normal text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {[
                  { date: 'Oct 24, 2023', value: '₦12,500', comm: '₦1,875', status: 'Paid' },
                  { date: 'Oct 22, 2023', value: '₦8,000', comm: '₦1,200', status: 'Pending' },
                  { date: 'Oct 18, 2023', value: '₦24,000', comm: '₦3,600', status: 'Paid' },
                ].map((ref, i) => (
                  <tr key={i}>
                    <td className="py-4">{ref.date}</td>
                    <td className="py-4">{ref.value}</td>
                    <td className="py-4 font-medium text-accent">{ref.comm}</td>
                    <td className="py-4 text-right">
                      <span className={`px-2 py-1 text-xs uppercase tracking-widest ${ref.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {ref.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
