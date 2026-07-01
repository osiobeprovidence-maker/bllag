import { useState } from 'react';
import { Megaphone, Tag, Users, Sparkles, Plus, Edit2, Trash2, X, Play, Pause, BarChart3, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EmptyState } from '../ui/EmptyState';
import { ImageUploader } from './ImageUploader';

type MarketingTab = 'campaigns' | 'coupons' | 'ad-placement' | 'audience-segments';

const CAMPAIGN_TYPES = [
  { value: 'homepage-banner', label: 'Homepage Banner' },
  { value: 'popup', label: 'Popup' },
  { value: 'coupon', label: 'Coupon Campaign' },
  { value: 'email', label: 'Email Campaign' },
  { value: 'announcement-bar', label: 'Announcement Bar' },
  { value: 'flash-sale', label: 'Flash Sale' },
  { value: 'featured-collection', label: 'Featured Collection' },
  { value: 'seasonal-promotion', label: 'Seasonal Promotion' },
];

const AUDIENCE_OPTIONS = [
  { value: 'everyone', label: 'Everyone' },
  { value: 'new-customers', label: 'New Customers' },
  { value: 'returning-customers', label: 'Returning Customers' },
  { value: 'vip', label: 'VIP Members' },
  { value: 'subscribers', label: 'Subscribers' },
  { value: 'custom', label: 'Custom Segment' },
];

interface MarketingSectionProps {
  campaigns: any[];
  coupons: any[];
  createCampaign: (data: any) => any;
  updateCampaign: (id: string, data: any) => any;
  removeCampaign: (id: string) => any;
  createCoupon: (data: any) => any;
  updateCoupon: (id: string, data: any) => any;
  removeCoupon: (id: string) => any;
}

export function MarketingSection({
  campaigns, coupons,
  createCampaign, updateCampaign, removeCampaign,
  createCoupon, updateCoupon, removeCoupon,
}: MarketingSectionProps) {
  const [activeTab, setActiveTab] = useState<MarketingTab>('campaigns');

  const tabs: { id: MarketingTab; name: string; icon: any }[] = [
    { id: 'campaigns', name: 'Campaigns', icon: Megaphone },
    { id: 'coupons', name: 'Coupons', icon: Tag },
    { id: 'ad-placement', name: 'Ad Placement', icon: LinkIcon },
    { id: 'audience-segments', name: 'Audience Segments', icon: Users },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-muted-foreground hover:bg-gray-50 hover:text-primary'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'campaigns' && (
        <CampaignsTab campaigns={campaigns} createCampaign={createCampaign} updateCampaign={updateCampaign} removeCampaign={removeCampaign} />
      )}
      {activeTab === 'coupons' && (
        <CouponsTab coupons={coupons} createCoupon={createCoupon} updateCoupon={updateCoupon} removeCoupon={removeCoupon} />
      )}
      {activeTab === 'ad-placement' && <AdPlacementTab />}
      {activeTab === 'audience-segments' && <AudienceSegmentsTab />}
    </div>
  );
}

function CampaignsTab({ campaigns, createCampaign, updateCampaign, removeCampaign }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', type: 'homepage-banner', description: '', bannerImage: '',
    ctaText: '', ctaLink: '', startDate: '', endDate: '', priority: 1,
    targetAudience: 'everyone', status: 'draft',
    views: 0, clicks: 0, ctr: 0, conversions: 0, revenue: 0,
  });

  const resetForm = () => {
    setForm({
      name: '', type: 'homepage-banner', description: '', bannerImage: '',
      ctaText: '', ctaLink: '', startDate: '', endDate: '', priority: 1,
      targetAudience: 'everyone', status: 'draft',
      views: 0, clicks: 0, ctr: 0, conversions: 0, revenue: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (c: any) => {
    setForm({
      name: c.name || '', type: c.type || 'homepage-banner', description: c.description || '',
      bannerImage: c.bannerImage || '', ctaText: c.ctaText || '', ctaLink: c.ctaLink || '',
      startDate: c.startDate || '', endDate: c.endDate || '', priority: c.priority ?? 1,
      targetAudience: c.targetAudience || 'everyone', status: c.status || 'draft',
      views: c.views ?? 0, clicks: c.clicks ?? 0, ctr: c.ctr ?? 0, conversions: c.conversions ?? 0, revenue: c.revenue ?? 0,
    });
    setEditingId(c.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateCampaign(editingId, form);
      } else {
        await createCampaign(form);
      }
      resetForm();
    } catch (err: any) {
      alert(err.message || 'Failed to save campaign');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateCampaign(id, { status: newStatus });
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  if (campaigns === undefined) {
    return <div className="flex items-center justify-center py-24"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-tight">Campaign Dashboard</h2>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all"
          >
            <Plus className="w-3 h-3" /> New Campaign
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 border-b border-gray-200 overflow-hidden"
            >
              <div className="p-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Campaign Name</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Campaign Type</label>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full bg-white border border-gray-200 p-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent">
                      {CAMPAIGN_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Target Audience</label>
                    <select value={form.targetAudience} onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                      className="w-full bg-white border border-gray-200 p-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent">
                      {AUDIENCE_OPTIONS.map((a) => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Priority</label>
                    <input type="number" min="1" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
                      className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Description</label>
                    <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
                  </div>
                  <div className="md:col-span-2">
                    <ImageUploader
                      value={form.bannerImage}
                      onChange={(url) => setForm({ ...form, bannerImage: url })}
                      label="Banner Image"
                      imageType="campaign"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">CTA Button</label>
                    <input type="text" value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                      className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Destination URL</label>
                    <input type="url" value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                      className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Start Date</label>
                    <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">End Date</label>
                    <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={!form.name}
                    className="flex-1 bg-primary text-white py-3 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all disabled:opacity-50">
                    {editingId ? 'Update Campaign' : 'Create Campaign'}
                  </button>
                  <button onClick={resetForm} className="px-6 py-3 border border-gray-300 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">Cancel</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {campaigns.length === 0 && !showForm ? (
          <div className="p-8">
            <EmptyState icon={Megaphone} title="No Campaigns" message="Launch your first campaign to start driving engagement and sales."
              action={{ label: 'Create Campaign', onClick: () => { resetForm(); setShowForm(true); } }} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-muted-foreground uppercase tracking-[0.2em] text-[9px] font-black">
                <tr>
                  <th className="px-8 py-5">Campaign</th>
                  <th className="px-8 py-5">Type</th>
                  <th className="px-8 py-5">Audience</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Performance</th>
                  <th className="px-8 py-5">Schedule</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {campaigns.map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-4">
                      <p className="font-black text-xs uppercase">{c.name}</p>
                      {c.description && <p className="text-[9px] text-muted-foreground font-bold tracking-widest truncate max-w-[200px]">{c.description}</p>}
                    </td>
                    <td className="px-8 py-4">
                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-[8px] font-black uppercase tracking-widest">
                        {CAMPAIGN_TYPES.find(t => t.value === c.type)?.label || c.type}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {AUDIENCE_OPTIONS.find(a => a.value === c.targetAudience)?.label || c.targetAudience}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`inline-flex items-center px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                        c.status === 'active' ? 'bg-green-50 text-green-700' :
                        c.status === 'paused' ? 'bg-amber-50 text-amber-700' :
                        c.status === 'completed' ? 'bg-blue-50 text-blue-700' :
                        c.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold">{c.views} views / {c.clicks} clicks</p>
                        <p className="text-[9px] text-muted-foreground font-bold tracking-widest">CTR: {c.ctr}% · Conv: {c.conversions} · ₦{c.revenue.toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <p className="text-[10px] font-bold">{c.startDate ? new Date(c.startDate).toLocaleDateString() : 'Now'}</p>
                      {c.endDate && <p className="text-[9px] text-muted-foreground">{new Date(c.endDate).toLocaleDateString()}</p>}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {(c.status === 'draft' || c.status === 'paused') && (
                          <button onClick={() => handleStatusChange(c.id, 'active')} className="p-2 hover:bg-green-50 transition-colors text-muted-foreground hover:text-green-600" title="Activate">
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {c.status === 'active' && (
                          <button onClick={() => handleStatusChange(c.id, 'paused')} className="p-2 hover:bg-amber-50 transition-colors text-muted-foreground hover:text-amber-600" title="Pause">
                            <Pause className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button onClick={() => handleEdit(c)} className="p-2 hover:bg-gray-100 transition-colors text-muted-foreground hover:text-primary">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => removeCampaign(c.id)} className="p-2 hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function CouponsTab({ coupons, createCoupon, updateCoupon, removeCoupon }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: '', discountType: 'percentage', percentage: 0, fixedAmount: 0,
    minSpend: 0, usageLimit: 0, usageCount: 0, expiryDate: '', active: true,
  });

  const resetForm = () => {
    setForm({ code: '', discountType: 'percentage', percentage: 0, fixedAmount: 0, minSpend: 0, usageLimit: 0, usageCount: 0, expiryDate: '', active: true });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (c: any) => {
    setForm({
      code: c.code || '', discountType: c.discountType || 'percentage', percentage: c.percentage ?? 0,
      fixedAmount: c.fixedAmount ?? 0, minSpend: c.minSpend ?? 0, usageLimit: c.usageLimit ?? 0,
      usageCount: c.usageCount ?? 0, expiryDate: c.expiryDate || '', active: c.active ?? true,
    });
    setEditingId(c.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateCoupon(editingId, form);
      } else {
        await createCoupon(form);
      }
      resetForm();
    } catch (err: any) {
      alert(err.message || 'Failed to save coupon');
    }
  };

  if (coupons === undefined) {
    return <div className="flex items-center justify-center py-24"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="bg-white border border-gray-200 shadow-sm">
      <div className="p-8 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-tight">Coupon Management</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
          <Plus className="w-3 h-3" /> New Coupon
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 border-b border-gray-200 overflow-hidden"
          >
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Coupon Code</label>
                  <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="w-full bg-white border border-gray-200 p-3 text-xs font-bold uppercase focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Discount Type</label>
                  <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full bg-white border border-gray-200 p-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                {form.discountType === 'percentage' ? (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Percentage (%)</label>
                    <input type="number" min="0" max="100" value={form.percentage} onChange={(e) => setForm({ ...form, percentage: Number(e.target.value) })}
                      className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Fixed Amount (₦)</label>
                    <input type="number" min="0" value={form.fixedAmount} onChange={(e) => setForm({ ...form, fixedAmount: Number(e.target.value) })}
                      className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
                  </div>
                )}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Minimum Spend (₦)</label>
                  <input type="number" min="0" value={form.minSpend} onChange={(e) => setForm({ ...form, minSpend: Number(e.target.value) })}
                    className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Usage Limit</label>
                  <input type="number" min="0" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
                    className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
                  <p className="text-[8px] text-muted-foreground mt-1 font-bold">0 = unlimited</p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Expiry Date</label>
                  <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
              </label>
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={!form.code}
                  className="flex-1 bg-primary text-white py-3 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all disabled:opacity-50">
                  {editingId ? 'Update Coupon' : 'Create Coupon'}
                </button>
                <button onClick={resetForm} className="px-6 py-3 border border-gray-300 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {coupons.length === 0 && !showForm ? (
        <div className="p-8">
          <EmptyState icon={Tag} title="No Coupons" message="Create discount coupons to drive sales and reward customers."
            action={{ label: 'Create Coupon', onClick: () => { resetForm(); setShowForm(true); } }} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-muted-foreground uppercase tracking-[0.2em] text-[9px] font-black">
              <tr>
                <th className="px-8 py-5">Code</th>
                <th className="px-8 py-5">Discount</th>
                <th className="px-8 py-5">Min Spend</th>
                <th className="px-8 py-5">Usage</th>
                <th className="px-8 py-5">Expiry</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((c: any) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-4 font-black text-sm uppercase tracking-widest">{c.code}</td>
                  <td className="px-8 py-4">
                    <span className="font-bold text-xs">
                      {c.discountType === 'percentage' ? `${c.percentage}%` : `₦${c.fixedAmount.toLocaleString()}`}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-xs font-bold">{c.minSpend > 0 ? `₦${c.minSpend.toLocaleString()}` : '—'}</td>
                  <td className="px-8 py-4 text-xs font-bold">
                    {c.usageCount}{c.usageLimit > 0 ? `/${c.usageLimit}` : ''}
                  </td>
                  <td className="px-8 py-4 text-xs font-bold">
                    {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-8 py-4">
                    <button onClick={() => updateCoupon(c.id, { active: !c.active })}
                      className={`inline-flex items-center px-3 py-1 text-[9px] font-black uppercase tracking-widest transition-colors ${
                        c.active ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}>
                      {c.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleEdit(c)} className="p-2 hover:bg-gray-100 transition-colors text-muted-foreground hover:text-primary">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => removeCoupon(c.id)} className="p-2 hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdPlacementTab() {
  return (
    <div className="bg-white border border-gray-200 shadow-sm p-8">
      <h2 className="text-xl font-black uppercase tracking-tight mb-6">Ad Placement</h2>
      <p className="text-[10px] text-muted-foreground font-bold mb-6 uppercase tracking-widest">Manage your store's visual ad placements</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-50 border border-gray-200 p-6 flex flex-col items-center text-center group cursor-default">
          <div className="p-4 bg-white mb-4 shadow-sm">
            <Megaphone className="h-6 w-6 text-accent" />
          </div>
          <h4 className="font-black text-sm uppercase mb-2">Hero Banners</h4>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Navigate to Website Customization → Hero Banners tab</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 p-6 flex flex-col items-center text-center group cursor-default">
          <div className="p-4 bg-white mb-4 shadow-sm">
            <BarChart3 className="h-6 w-6 text-accent" />
          </div>
          <h4 className="font-black text-sm uppercase mb-2">Promotional Banners</h4>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Navigate to Website Customization → Promotional Banners tab</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 p-6 flex flex-col items-center text-center group cursor-default">
          <div className="p-4 bg-white mb-4 shadow-sm">
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
          <h4 className="font-black text-sm uppercase mb-2">Popup & Announcements</h4>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Create a campaign with type "Popup" or "Announcement Bar"</p>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground mt-8 font-bold uppercase tracking-widest">
        Tip: Use the Campaigns tab to create targeted ad placements with scheduling and audience targeting.
      </p>
    </div>
  );
}

function AudienceSegmentsTab() {
  const segments = [
    { name: 'Everyone', count: '—', description: 'All registered users', color: 'bg-gray-100 text-gray-700' },
    { name: 'New Customers', count: '—', description: 'Users who joined within the last 30 days', color: 'bg-blue-50 text-blue-700' },
    { name: 'Returning Customers', count: '—', description: 'Users with 2+ orders', color: 'bg-green-50 text-green-700' },
    { name: 'VIP Members', count: '—', description: 'Members with highest tier membership', color: 'bg-purple-50 text-purple-700' },
    { name: 'Subscribers', count: '—', description: 'Users subscribed to marketing emails', color: 'bg-amber-50 text-amber-700' },
  ];

  return (
    <div className="bg-white border border-gray-200 shadow-sm">
      <div className="p-8 border-b border-gray-100">
        <h2 className="text-xl font-black uppercase tracking-tight">Audience Segments</h2>
        <p className="text-[10px] text-muted-foreground font-bold mt-2 uppercase tracking-widest">Target specific customer groups with your campaigns</p>
      </div>
      <div className="divide-y divide-gray-100">
        {segments.map((s) => (
          <div key={s.name} className="flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center font-black text-xs`}>
                {s.name.charAt(0)}
              </div>
              <div>
                <p className="font-black text-sm uppercase">{s.name}</p>
                <p className="text-[10px] text-muted-foreground font-bold tracking-widest">{s.description}</p>
              </div>
            </div>
            <span className="text-sm font-black text-muted-foreground">{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
