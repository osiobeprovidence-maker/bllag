import { TrendingUp, Tag, Megaphone, Users } from 'lucide-react';

export function MarketingSection() {
  const campaigns = [
    { id: '1', name: 'Summer Solstice Drop', type: 'Ad Campaign', status: 'Running', performance: '+15.2%', budget: '₦250k' },
    { id: '2', name: 'CIRCLE15 - Welcome', type: 'Discount Code', status: 'Active', performance: '1,240 uses', budget: '15% Off' },
    { id: '3', name: 'Pay Small Small Awareness', type: 'Ad Campaign', status: 'Paused', performance: '0.5% CTR', budget: '₦50k' },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black uppercase tracking-tight">Active Promotions</h3>
            <button className="text-accent hover:underline text-[10px] font-black uppercase tracking-widest">Create New</button>
          </div>
          <div className="space-y-4">
            {campaigns.map(c => (
              <div key={c.id} className="p-5 bg-gray-50 border border-gray-100 hover:border-accent transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground block mb-1">{c.type}</span>
                    <h4 className="font-black text-sm uppercase group-hover:text-accent transition-colors">{c.name}</h4>
                  </div>
                  <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${
                    c.status === 'Running' || c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-accent" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{c.performance}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Value: {c.budget}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary p-8 text-white">
          <h3 className="text-xl font-black uppercase tracking-tight mb-4 italic">Marketing Insights</h3>
          <p className="text-white/60 text-xs mb-8 leading-relaxed">
            Your most successful campaign this month is "Summer Solstice Drop". Customers are most engaged with Instagram and TikTok referral traffic.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div className="p-6 bg-white/10 border border-white/10">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1">Top Referral</p>
              <h4 className="text-xl font-black">Instagram</h4>
            </div>
            <div className="p-6 bg-white/10 border border-white/10">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1">Conversion Rate</p>
              <h4 className="text-xl font-black">3.2%</h4>
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
