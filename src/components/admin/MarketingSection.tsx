import { Tag, Megaphone, Users, Sparkles } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';

export function MarketingSection() {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black uppercase tracking-tight">Active Promotions</h3>
            <button className="text-accent hover:underline text-[10px] font-black uppercase tracking-widest">Create New</button>
          </div>
          <EmptyState
            icon={Sparkles}
            title="No Active Campaigns"
            message="Launch your first campaign to start driving engagement and sales."
          />
        </div>

        <div className="bg-primary p-8 text-white">
          <h3 className="text-xl font-black uppercase tracking-tight mb-4 italic">Marketing Tools</h3>
          <p className="text-white/60 text-xs mb-8 leading-relaxed">
            Create targeted campaigns, manage discount codes, and track performance across all channels from one place.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div className="p-6 bg-white/10 border border-white/10">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1">Available Tools</p>
              <h4 className="text-xl font-black">4</h4>
            </div>
            <div className="p-6 bg-white/10 border border-white/10">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1">Status</p>
              <h4 className="text-xl font-black">Ready</h4>
            </div>
          </div>
          <button className="w-full mt-10 py-4 bg-white text-primary text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all">
            Full Marketing Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-gray-200 p-8 flex flex-col items-center text-center group cursor-pointer hover:border-accent transition-all">
          <div className="p-4 bg-gray-50 mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
            <Tag className="h-6 w-6" />
          </div>
          <h4 className="font-black text-sm uppercase mb-2">Coupon Management</h4>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Create and track promo codes</p>
        </div>
        <div className="bg-white border border-gray-200 p-8 flex flex-col items-center text-center group cursor-pointer hover:border-accent transition-all">
          <div className="p-4 bg-gray-50 mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
            <Megaphone className="h-6 w-6" />
          </div>
          <h4 className="font-black text-sm uppercase mb-2">Ad Placement</h4>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Manage store banners and popups</p>
        </div>
        <div className="bg-white border border-gray-200 p-8 flex flex-col items-center text-center group cursor-pointer hover:border-accent transition-all">
          <div className="p-4 bg-gray-50 mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
            <Users className="h-6 w-6" />
          </div>
          <h4 className="font-black text-sm uppercase mb-2">Audience Segments</h4>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Target specific customer tiers</p>
        </div>
      </div>
    </div>
  );
}
