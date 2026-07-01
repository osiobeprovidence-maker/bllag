import { useState, useEffect } from 'react';
import { Image, Trash2, Edit2, Plus, Loader2, Sparkles } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';

type CmsTab = 'slider-settings' | 'hero-banners' | 'category-images' | 'homepage-sections' | 'promotional-banners' | 'media-library';

interface WebsiteCustomizationProps {
  banners: any[];
  categoryImages: any[];
  sections: any[];
  promoBanners: any[];
  media: any[];
  settings: Record<string, unknown>;
  createBanner: (data: any) => any;
  updateBanner: (id: string, data: any) => any;
  removeBanner: (id: string) => any;
  reorderBanner: (items: { id: string; displayOrder: number }[]) => any;
  createCategory: (data: any) => any;
  updateCategory: (id: string, data: any) => any;
  removeCategory: (id: string) => any;
  upsertSection: (data: any) => any;
  createPromoBanner: (data: any) => any;
  updatePromoBanner: (id: string, data: any) => any;
  removePromoBanner: (id: string) => any;
  setSetting: (key: string, value: any) => any;
  createMedia: (data: any) => any;
  removeMedia: (id: string) => any;
}

const cmsTabs: { id: CmsTab; name: string }[] = [
  { id: 'slider-settings', name: 'Slider Settings' },
  { id: 'hero-banners', name: 'Hero Banners' },
  { id: 'category-images', name: 'Category Images' },
  { id: 'homepage-sections', name: 'Homepage Sections' },
  { id: 'promotional-banners', name: 'Promotional Banners' },
  { id: 'media-library', name: 'Media Library' },
];

const DEFAULT_SECTIONS = [
  { sectionKey: 'flash-sale', title: 'Flash Sale', visible: true, displayOrder: 1 },
  { sectionKey: 'featured-products', title: 'Featured Products', visible: true, displayOrder: 2 },
  { sectionKey: 'new-arrivals', title: 'New Arrivals', visible: true, displayOrder: 3 },
  { sectionKey: 'trending', title: 'Trending Now', visible: true, displayOrder: 4 },
  { sectionKey: 'membership-banner', title: 'Membership Banner', visible: true, displayOrder: 5 },
  { sectionKey: 'brand-values', title: 'Brand Values', visible: true, displayOrder: 6 },
  { sectionKey: 'instagram', title: 'Instagram Feed', visible: true, displayOrder: 7 },
];

export function WebsiteCustomization({
  banners, categoryImages, sections, promoBanners, media, settings,
  createBanner, updateBanner, removeBanner, reorderBanner,
  createCategory, updateCategory, removeCategory,
  upsertSection, createPromoBanner, updatePromoBanner, removePromoBanner,
  setSetting, createMedia, removeMedia,
}: WebsiteCustomizationProps) {
  const [activeCmsTab, setActiveCmsTab] = useState<CmsTab>('slider-settings');

  const allUndefined = banners === undefined && categoryImages === undefined && sections === undefined && promoBanners === undefined && media === undefined;
  if (allUndefined) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto">
        <div className="flex">
          {cmsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCmsTab(tab.id)}
              className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeCmsTab === tab.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-muted-foreground hover:bg-gray-50 hover:text-primary'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {activeCmsTab === 'slider-settings' && (
        <SliderSettingsTab settings={settings} setSetting={setSetting} />
      )}
      {activeCmsTab === 'hero-banners' && (
        <HeroBannersTab banners={banners} createBanner={createBanner} updateBanner={updateBanner} removeBanner={removeBanner} reorderBanner={reorderBanner} />
      )}
      {activeCmsTab === 'category-images' && (
        <CategoryImagesTab categoryImages={categoryImages} createCategory={createCategory} updateCategory={updateCategory} removeCategory={removeCategory} />
      )}
      {activeCmsTab === 'homepage-sections' && (
        <HomepageSectionsTab sections={sections} upsertSection={upsertSection} />
      )}
      {activeCmsTab === 'promotional-banners' && (
        <PromotionalBannersTab promoBanners={promoBanners} createPromoBanner={createPromoBanner} updatePromoBanner={updatePromoBanner} removePromoBanner={removePromoBanner} />
      )}
      {activeCmsTab === 'media-library' && (
        <MediaLibraryTab media={media} createMedia={createMedia} removeMedia={removeMedia} />
      )}
    </div>
  );
}

function SliderSettingsTab({ settings, setSetting }: { settings: Record<string, unknown>; setSetting: (key: string, value: any) => any }) {
  const [form, setForm] = useState({
    autoplay: false,
    interval: 5000,
    animationSpeed: 500,
    loop: true,
    transition: 'fade',
    pauseOnHover: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setForm({
        autoplay: (settings.slider_autoplay as boolean) ?? false,
        interval: (settings.slider_interval as number) ?? 5000,
        animationSpeed: (settings.slider_animation_speed as number) ?? 500,
        loop: (settings.slider_loop as boolean) ?? true,
        transition: (settings.slider_transition as string) ?? 'fade',
        pauseOnHover: (settings.slider_pause_on_hover as boolean) ?? true,
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    await Promise.all([
      setSetting('slider_autoplay', form.autoplay),
      setSetting('slider_interval', form.interval),
      setSetting('slider_animation_speed', form.animationSpeed),
      setSetting('slider_loop', form.loop),
      setSetting('slider_transition', form.transition),
      setSetting('slider_pause_on_hover', form.pauseOnHover),
    ]);
    setSaving(false);
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm">
      <div className="p-8 border-b border-gray-100">
        <h2 className="text-xl font-black uppercase tracking-tight">Slider Settings</h2>
      </div>
      <div className="p-8 space-y-6">
        <label className="flex items-center gap-4 cursor-pointer">
          <input type="checkbox" checked={form.autoplay} onChange={(e) => setForm({ ...form, autoplay: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest">Autoplay</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Interval (ms)</label>
            <input type="number" value={form.interval} onChange={(e) => setForm({ ...form, interval: Number(e.target.value) })} className="w-full bg-gray-50 border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Animation Speed (ms)</label>
            <input type="number" value={form.animationSpeed} onChange={(e) => setForm({ ...form, animationSpeed: Number(e.target.value) })} className="w-full bg-gray-50 border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Transition</label>
            <select value={form.transition} onChange={(e) => setForm({ ...form, transition: e.target.value })} className="w-full bg-gray-50 border border-gray-200 p-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent">
              <option value="fade">Fade</option>
              <option value="slide">Slide</option>
            </select>
          </div>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-4 cursor-pointer">
            <input type="checkbox" checked={form.loop} onChange={(e) => setForm({ ...form, loop: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest">Loop</span>
          </label>
          <label className="flex items-center gap-4 cursor-pointer">
            <input type="checkbox" checked={form.pauseOnHover} onChange={(e) => setForm({ ...form, pauseOnHover: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest">Pause on Hover</span>
          </label>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-primary text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

function HeroBannersTab({ banners, createBanner, updateBanner, removeBanner, reorderBanner }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    image: '', smallHeading: '', mainHeading: '', description: '', ctaText: '', ctaLink: '',
    displayOrder: 1, active: true, startDate: '', endDate: '',
  });

  const resetForm = () => {
    setForm({ image: '', smallHeading: '', mainHeading: '', description: '', ctaText: '', ctaLink: '', displayOrder: 1, active: true, startDate: '', endDate: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (b: any) => {
    setForm({
      image: b.image || '', smallHeading: b.smallHeading || '', mainHeading: b.mainHeading || '',
      description: b.description || '', ctaText: b.ctaText || '', ctaLink: b.ctaLink || '',
      displayOrder: b.displayOrder ?? 1, active: b.active ?? true,
      startDate: b.startDate || '', endDate: b.endDate || '',
    });
    setEditingId(b.id);
    setShowForm(true);
  };

  const handleSave = () => {
    const data = { ...form };
    if (!data.startDate) delete data.startDate;
    if (!data.endDate) delete data.endDate;
    if (editingId) {
      updateBanner(editingId, data);
    } else {
      createBanner(data);
    }
    resetForm();
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm">
      <div className="p-8 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-tight">Hero Banners</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
          <Plus className="w-3 h-3" /> Add Banner
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border-b border-gray-200 p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Image URL</label>
              <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Small Heading</label>
              <input type="text" value={form.smallHeading} onChange={(e) => setForm({ ...form, smallHeading: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Main Heading</label>
              <input type="text" value={form.mainHeading} onChange={(e) => setForm({ ...form, mainHeading: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Description</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">CTA Text</label>
              <input type="text" value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">CTA Link</label>
              <input type="url" value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Display Order</label>
              <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Start Date</label>
                <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">End Date</label>
                <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
              </div>
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
          </label>
          {form.image && (
            <div className="w-full h-32 bg-gray-100 border border-gray-200 overflow-hidden">
              <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex-1 bg-primary text-white py-3 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
              {editingId ? 'Update Banner' : 'Save Banner'}
            </button>
            <button onClick={resetForm} className="px-6 py-3 border border-gray-300 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">Cancel</button>
          </div>
        </div>
      )}

      {banners.length === 0 && !showForm ? (
        <div className="p-8">
          <EmptyState icon={Sparkles} title="No Banners" message="Add your first hero banner to showcase products and promotions." />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-muted-foreground uppercase tracking-[0.2em] text-[9px] font-black">
              <tr>
                <th className="px-8 py-5">Image</th>
                <th className="px-8 py-5">Heading</th>
                <th className="px-8 py-5">CTA</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Order</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {banners.map((b: any) => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="w-16 h-12 bg-gray-100 border border-gray-200 overflow-hidden">
                      <img src={b.image} alt={b.mainHeading} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <p className="font-black text-xs uppercase">{b.mainHeading}</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">{b.smallHeading}</p>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-[10px] font-bold">{b.ctaText}</span>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`inline-flex items-center px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                      b.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {b.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-8 py-4 font-black text-xs">{b.displayOrder}</td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(b)} className="p-2 hover:bg-gray-100 transition-colors text-muted-foreground hover:text-primary">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => removeBanner(b.id)} className="p-2 hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-500">
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

function CategoryImagesTab({ categoryImages, createCategory, updateCategory, removeCategory }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', image: '', link: '', displayOrder: 1, visible: true });

  const resetForm = () => {
    setForm({ name: '', image: '', link: '', displayOrder: 1, visible: true });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (c: any) => {
    setForm({ name: c.name || '', image: c.image || '', link: c.link || '', displayOrder: c.displayOrder ?? 1, visible: c.visible ?? true });
    setEditingId(c.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingId) {
      updateCategory(editingId, form);
    } else {
      createCategory(form);
    }
    resetForm();
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm">
      <div className="p-8 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-tight">Category Images</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
          <Plus className="w-3 h-3" /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border-b border-gray-200 p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Image URL</label>
              <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Link</label>
              <input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Display Order</label>
              <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest">Visible</span>
          </label>
          {form.image && (
            <div className="w-full h-32 bg-gray-100 border border-gray-200 overflow-hidden">
              <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex-1 bg-primary text-white py-3 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
              {editingId ? 'Update Category' : 'Save Category'}
            </button>
            <button onClick={resetForm} className="px-6 py-3 border border-gray-300 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">Cancel</button>
          </div>
        </div>
      )}

      {categoryImages.length === 0 && !showForm ? (
        <div className="p-8">
          <EmptyState icon={Image} title="No Category Images" message="Add category images to showcase your product categories." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-8">
          {categoryImages.map((c: any) => (
            <div key={c.id} className="bg-white border border-gray-200 overflow-hidden group">
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                {c.image && <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest ${
                    c.visible ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}>
                    {c.visible ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-xs font-black uppercase tracking-widest mb-1">{c.name}</h4>
                <p className="text-[9px] text-muted-foreground font-bold tracking-widest mb-3 truncate">{c.link}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(c)} className="flex items-center gap-1 text-accent hover:text-accent/70 text-[10px] font-bold uppercase tracking-widest transition-colors">
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => removeCategory(c.id)} className="flex items-center gap-1 text-red-500 hover:text-red-700 text-[10px] font-bold uppercase tracking-widest transition-colors">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HomepageSectionsTab({ sections, upsertSection }: any) {
  const [sectionData, setSectionData] = useState<any[]>([]);

  useEffect(() => {
    if (sections && sections.length > 0) {
      setSectionData(sections.map((s: any) => ({ ...s })));
    }
  }, [sections]);

  const handleSaveDefaults = () => {
    DEFAULT_SECTIONS.forEach((s) => upsertSection(s));
  };

  const handleUpdate = (s: any) => {
    upsertSection({ sectionKey: s.sectionKey, title: s.title, visible: s.visible, displayOrder: s.displayOrder });
  };

  const data = sections && sections.length > 0 ? sections : DEFAULT_SECTIONS;

  return (
    <div className="bg-white border border-gray-200 shadow-sm">
      <div className="p-8 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-tight">Homepage Sections</h2>
        {(!sections || sections.length === 0) && (
          <button onClick={handleSaveDefaults} className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
            <Plus className="w-3 h-3" /> Create Default Sections
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-muted-foreground uppercase tracking-[0.2em] text-[9px] font-black">
            <tr>
              <th className="px-8 py-5">Section Key</th>
              <th className="px-8 py-5">Title</th>
              <th className="px-8 py-5">Visible</th>
              <th className="px-8 py-5">Display Order</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((s: any) => (
              <SectionRow key={s.sectionKey} section={s} onUpdate={sections && sections.length > 0 ? handleUpdate : undefined} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectionRow({ section, onUpdate }: { section: any; onUpdate?: (s: any) => void }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(section.title || '');
  const [visible, setVisible] = useState(section.visible ?? true);
  const [displayOrder, setDisplayOrder] = useState(section.displayOrder ?? 1);

  useEffect(() => {
    setTitle(section.title || '');
    setVisible(section.visible ?? true);
    setDisplayOrder(section.displayOrder ?? 1);
  }, [section]);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({ ...section, title, visible, displayOrder });
    }
    setEditing(false);
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-8 py-6">
        <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-[9px] font-black uppercase tracking-widest">{section.sectionKey}</span>
      </td>
      <td className="px-8 py-6">
        {editing ? (
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-white border border-gray-200 p-2 text-xs font-bold w-48 focus:outline-none focus:border-accent" />
        ) : (
          <p className="font-black text-xs uppercase">{title || section.sectionKey}</p>
        )}
      </td>
      <td className="px-8 py-6">
        {editing ? (
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest">{visible ? 'Visible' : 'Hidden'}</span>
          </label>
        ) : (
          <span className={`inline-flex items-center px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
            section.visible ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            {section.visible ? 'Visible' : 'Hidden'}
          </span>
        )}
      </td>
      <td className="px-8 py-6">
        {editing ? (
          <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} className="bg-white border border-gray-200 p-2 text-xs font-bold w-20 focus:outline-none focus:border-accent" />
        ) : (
          <p className="font-black text-xs">{section.displayOrder}</p>
        )}
      </td>
      <td className="px-8 py-6 text-right">
        {onUpdate && (
          editing ? (
            <div className="flex items-center justify-end gap-2">
              <button onClick={handleSave} className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">Save</button>
              <button onClick={() => setEditing(false)} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:underline">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="p-2 hover:bg-gray-100 transition-colors text-muted-foreground hover:text-primary">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )
        )}
      </td>
    </tr>
  );
}

function PromotionalBannersTab({ promoBanners, createPromoBanner, updatePromoBanner, removePromoBanner }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    desktopImage: '', mobileImage: '', title: '', subtitle: '', ctaText: '', ctaLink: '',
    bgColor: '', overlayOpacity: 0.5, priority: 1, active: true, startDate: '', endDate: '',
  });

  const resetForm = () => {
    setForm({ desktopImage: '', mobileImage: '', title: '', subtitle: '', ctaText: '', ctaLink: '', bgColor: '', overlayOpacity: 0.5, priority: 1, active: true, startDate: '', endDate: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (b: any) => {
    setForm({
      desktopImage: b.desktopImage || '', mobileImage: b.mobileImage || '', title: b.title || '',
      subtitle: b.subtitle || '', ctaText: b.ctaText || '', ctaLink: b.ctaLink || '',
      bgColor: b.bgColor || '', overlayOpacity: b.overlayOpacity ?? 0.5, priority: b.priority ?? 1,
      active: b.active ?? true, startDate: b.startDate || '', endDate: b.endDate || '',
    });
    setEditingId(b.id);
    setShowForm(true);
  };

  const handleSave = () => {
    const data = { ...form };
    if (!data.mobileImage) delete data.mobileImage;
    if (!data.subtitle) delete data.subtitle;
    if (!data.bgColor) delete data.bgColor;
    if (!data.startDate) delete data.startDate;
    if (!data.endDate) delete data.endDate;
    if (editingId) {
      updatePromoBanner(editingId, data);
    } else {
      createPromoBanner(data);
    }
    resetForm();
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm">
      <div className="p-8 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-tight">Promotional Banners</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
          <Plus className="w-3 h-3" /> Add Promo Banner
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border-b border-gray-200 p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Desktop Image URL</label>
              <input type="url" value={form.desktopImage} onChange={(e) => setForm({ ...form, desktopImage: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Mobile Image URL</label>
              <input type="url" value={form.mobileImage} onChange={(e) => setForm({ ...form, mobileImage: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Subtitle</label>
              <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">CTA Text</label>
              <input type="text" value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">CTA Link</label>
              <input type="url" value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Background Color</label>
              <input type="text" value={form.bgColor} onChange={(e) => setForm({ ...form, bgColor: e.target.value })} placeholder="#000000" className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Overlay Opacity (0-1)</label>
              <input type="number" step="0.1" min="0" max="1" value={form.overlayOpacity} onChange={(e) => setForm({ ...form, overlayOpacity: Number(e.target.value) })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Priority</label>
              <input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Start Date</label>
                <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">End Date</label>
                <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
              </div>
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
          </label>
          {form.desktopImage && (
            <div className="w-full h-32 bg-gray-100 border border-gray-200 overflow-hidden">
              <img src={form.desktopImage} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex-1 bg-primary text-white py-3 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
              {editingId ? 'Update Promo Banner' : 'Save Promo Banner'}
            </button>
            <button onClick={resetForm} className="px-6 py-3 border border-gray-300 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">Cancel</button>
          </div>
        </div>
      )}

      {promoBanners.length === 0 && !showForm ? (
        <div className="p-8">
          <EmptyState icon={Sparkles} title="No Promotional Banners" message="Add promotional banners to highlight campaigns and offers." />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-muted-foreground uppercase tracking-[0.2em] text-[9px] font-black">
              <tr>
                <th className="px-8 py-5">Image</th>
                <th className="px-8 py-5">Title</th>
                <th className="px-8 py-5">CTA</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Priority</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {promoBanners.map((b: any) => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="w-16 h-12 bg-gray-100 border border-gray-200 overflow-hidden">
                      <img src={b.desktopImage} alt={b.title} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <p className="font-black text-xs uppercase">{b.title}</p>
                    {b.subtitle && <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">{b.subtitle}</p>}
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-[10px] font-bold">{b.ctaText}</span>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`inline-flex items-center px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                      b.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {b.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-8 py-4 font-black text-xs">{b.priority}</td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(b)} className="p-2 hover:bg-gray-100 transition-colors text-muted-foreground hover:text-primary">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => removePromoBanner(b.id)} className="p-2 hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-500">
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

function MediaLibraryTab({ media, createMedia, removeMedia }: any) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ url: '', name: '' });

  const handleSave = () => {
    createMedia(form);
    setForm({ url: '', name: '' });
    setShowForm(false);
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm">
      <div className="p-8 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-tight">Media Library</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
          <Plus className="w-3 h-3" /> Add Media
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border-b border-gray-200 p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Image URL</label>
              <input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
            </div>
          </div>
          {form.url && (
            <div className="w-full h-32 bg-gray-100 border border-gray-200 overflow-hidden">
              <img src={form.url} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex-1 bg-primary text-white py-3 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">Save Media</button>
            <button onClick={() => { setShowForm(false); setForm({ url: '', name: '' }); }} className="px-6 py-3 border border-gray-300 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">Cancel</button>
          </div>
        </div>
      )}

      {media.length === 0 && !showForm ? (
        <div className="p-8">
          <EmptyState icon={Image} title="No Media" message="Upload images to your media library for use across the site." />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-8">
          {media.map((m: any) => (
            <div key={m.id} className="bg-white border border-gray-200 overflow-hidden group">
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img src={m.url} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button
                  onClick={() => removeMedia(m.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-[10px] font-black uppercase tracking-widest truncate">{m.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
