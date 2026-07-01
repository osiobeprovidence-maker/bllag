import { useState, useEffect } from 'react';
import { Image, Trash2, Edit2, Plus, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { ImageUploader } from './ImageUploader';
import { FOCAL_POINTS } from '../../lib/imageConfig';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

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
  renameMedia?: (data: { id: string; name: string }) => any;
  updateAlt?: (data: { id: string; alt?: string; title?: string; description?: string }) => any;
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

type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

export function WebsiteCustomization({
  banners, categoryImages, sections, promoBanners, media, settings,
  createBanner, updateBanner, removeBanner, reorderBanner,
  createCategory, updateCategory, removeCategory,
  upsertSection, createPromoBanner, updatePromoBanner, removePromoBanner,
  setSetting, createMedia, removeMedia, renameMedia, updateAlt,
}: WebsiteCustomizationProps) {
  const [activeCmsTab, setActiveCmsTab] = useState<CmsTab>('slider-settings');
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');

  const allUndefined = banners === undefined && categoryImages === undefined && sections === undefined && promoBanners === undefined && media === undefined;
  if (allUndefined) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const maxWClass = previewDevice === 'mobile' ? 'max-w-[375px]' : previewDevice === 'tablet' ? 'max-w-[768px]' : 'max-w-full';

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between">
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
          <div className="flex items-center gap-1 px-4 border-l border-gray-100">
            {(['desktop', 'tablet', 'mobile'] as PreviewDevice[]).map((d) => (
              <button
                key={d}
                onClick={() => setPreviewDevice(d)}
                className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-all ${
                  previewDevice === d
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white text-muted-foreground border-gray-200 hover:border-accent'
                }`}
              >
                {d === 'desktop' ? 'Desktop' : d === 'tablet' ? 'Tablet' : 'Mobile'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`mx-auto transition-all duration-300 ${maxWClass}`}>

      {activeCmsTab === 'slider-settings' && (
        <SliderSettingsTab settings={settings} setSetting={setSetting} />
      )}
      {activeCmsTab === 'hero-banners' && (
        <HeroBannersTab banners={banners} createBanner={createBanner} updateBanner={updateBanner} removeBanner={removeBanner} reorderBanner={reorderBanner} media={media} />
      )}
      {activeCmsTab === 'category-images' && (
        <CategoryImagesTab categoryImages={categoryImages} createCategory={createCategory} updateCategory={updateCategory} removeCategory={removeCategory} media={media} />
      )}
      {activeCmsTab === 'homepage-sections' && (
        <HomepageSectionsTab sections={sections} upsertSection={upsertSection} />
      )}
      {activeCmsTab === 'promotional-banners' && (
        <PromotionalBannersTab promoBanners={promoBanners} createPromoBanner={createPromoBanner} updatePromoBanner={updatePromoBanner} removePromoBanner={removePromoBanner} media={media} />
      )}
      {activeCmsTab === 'media-library' && (
        <MediaLibraryTab media={media} createMedia={createMedia} removeMedia={removeMedia} renameMedia={renameMedia} updateAlt={updateAlt} />
      )}
      </div>
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

function HeroBannersTab({ banners, createBanner, updateBanner, removeBanner, reorderBanner, media }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    desktopImage: '', tabletImage: '', mobileImage: '', smallHeading: '', mainHeading: '',
    description: '', ctaText: '', ctaLink: '', displayOrder: 1, active: true,
    startDate: '', endDate: '', altText: '', objectPosition: 'center',
  });

  const resetForm = () => {
    setForm({ desktopImage: '', tabletImage: '', mobileImage: '', smallHeading: '', mainHeading: '', description: '', ctaText: '', ctaLink: '', displayOrder: 1, active: true, startDate: '', endDate: '', altText: '', objectPosition: 'center' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (b: any) => {
    setForm({
      desktopImage: b.desktopImage || '', tabletImage: b.tabletImage || '', mobileImage: b.mobileImage || '',
      smallHeading: b.smallHeading || '', mainHeading: b.mainHeading || '',
      description: b.description || '', ctaText: b.ctaText || '', ctaLink: b.ctaLink || '',
      displayOrder: b.displayOrder ?? 1, active: b.active ?? true,
      startDate: b.startDate || '', endDate: b.endDate || '', altText: b.altText || '',
      objectPosition: b.objectPosition || 'center',
    });
    setEditingId(b.id);
    setShowForm(true);
  };

  const handleSave = () => {
    const data = { ...form };
    if (!data.tabletImage) delete data.tabletImage;
    if (!data.mobileImage) delete data.mobileImage;
    if (!data.startDate) delete data.startDate;
    if (!data.endDate) delete data.endDate;
    if (editingId) {
      updateBanner(editingId, data);
    } else {
      createBanner(data);
    }
    resetForm();
  };

  const previewImage = form.desktopImage || form.mobileImage || '';

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <ImageUploader
                value={form.desktopImage}
                onChange={(url) => setForm({ ...form, desktopImage: url })}
                imageType="heroBanner"
                label="Desktop Image (16:9)"
                showAltInput={!form.desktopImage}
                altValue={form.altText}
                onAltChange={(val) => setForm({ ...form, altText: val })}
                mediaLibrary={media}
              />
            </div>
            <div>
              <ImageUploader
                value={form.tabletImage}
                onChange={(url) => setForm({ ...form, tabletImage: url })}
                label="Tablet Image (optional)"
                imageType="heroBanner"
                mediaLibrary={media}
              />
            </div>
            <div>
              <ImageUploader
                value={form.mobileImage}
                onChange={(url) => setForm({ ...form, mobileImage: url })}
                label="Mobile Image (optional)"
                imageType="heroBanner"
                mediaLibrary={media}
              />
            </div>
          </div>
          {previewImage && (
            <div className="bg-white border border-gray-200 overflow-hidden">
              <div className="relative h-[200px] md:h-[300px] bg-gray-100">
                <img
                  src={previewImage}
                  alt={form.altText || 'Preview'}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: form.objectPosition }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <div className="bg-white/90 text-black px-4 py-2 mb-4">
                    <span className="text-accent font-bold text-xs uppercase tracking-wider">{form.smallHeading || 'Small Heading'}</span>
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-white drop-shadow-lg mb-2">{form.mainHeading || 'Main Heading'}</h3>
                  <p className="text-sm text-white/80 mb-4 max-w-md">{form.description || 'Description text'}</p>
                  <span className="bg-white text-black px-8 py-3 text-xs font-bold uppercase tracking-widest">{form.ctaText || 'Shop Now'}</span>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Focal Point</label>
              <div className="flex flex-wrap gap-1">
                {FOCAL_POINTS.map((fp) => (
                  <button
                    key={fp.value}
                    type="button"
                    onClick={() => setForm({ ...form, objectPosition: fp.value })}
                    className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-all ${
                      form.objectPosition === fp.value
                        ? 'bg-accent text-white border-accent'
                        : 'bg-white text-muted-foreground border-gray-200 hover:border-accent'
                    }`}
                  >
                    {fp.label}
                  </button>
                ))}
              </div>
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
                      <img src={b.desktopImage || b.mobileImage} alt={b.altText || b.mainHeading} className="w-full h-full object-cover" />
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

function CategoryImagesTab({ categoryImages, createCategory, updateCategory, removeCategory, media }: any) {
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
              <ImageUploader
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                label="Category Image"
                imageType="category"
                mediaLibrary={media}
              />
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
            <div className="w-20 h-20 bg-gray-100 border border-gray-200 overflow-hidden rounded-full">
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

const SETTINGS_SECTIONS = ['flash-sale', 'membership-banner'];

function SectionRow({ section, onUpdate }: { section: any; onUpdate?: (s: any) => void }) {
  const [editing, setEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [title, setTitle] = useState(section.title || '');
  const [visible, setVisible] = useState(section.visible ?? true);
  const [displayOrder, setDisplayOrder] = useState(section.displayOrder ?? 1);
  const [settings, setSettings] = useState<Record<string, any>>(section.settings || {});
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    setTitle(section.title || '');
    setVisible(section.visible ?? true);
    setDisplayOrder(section.displayOrder ?? 1);
    setSettings(section.settings || {});
  }, [section]);

  const handleSave = () => {
    if (onUpdate) {
      const data: any = { ...section, title, visible, displayOrder };
      if (showSettings) {
        data.settings = settings;
      }
      onUpdate(data);
    }
    setEditing(false);
    setShowSettings(false);
  };

  const hasSettings = SETTINGS_SECTIONS.includes(section.sectionKey);

  return (
    <>
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
                {hasSettings && (
                  <button
                    type="button"
                    onClick={() => setShowSettings(!showSettings)}
                    className={`text-[10px] font-black uppercase tracking-widest ${showSettings ? 'text-accent' : 'text-muted-foreground'} hover:underline`}
                  >
                    {showSettings ? 'Hide Settings' : 'Section Settings'}
                  </button>
                )}
                <button onClick={handleSave} className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">Save</button>
                <button onClick={() => { setEditing(false); setShowSettings(false); }} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:underline">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setEditing(true)} className="p-2 hover:bg-gray-100 transition-colors text-muted-foreground hover:text-primary">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </td>
      </tr>
      {editing && showSettings && section.sectionKey === 'flash-sale' && (
        <tr>
          <td colSpan={5} className="px-8 py-4 bg-gray-50 border-b border-gray-200">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest">Flash Sale Banner Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <ImageUploader
                    value={settings.image || ''}
                    onChange={(url) => setSettings({ ...settings, image: url })}
                    label="Banner Image"
                    imageType="flashSale"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">CTA Text</label>
                    <input type="text" value={settings.ctaText || ''} onChange={(e) => setSettings({ ...settings, ctaText: e.target.value })}
                      className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" placeholder="e.g. Shop Flash Sale" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">CTA Link</label>
                    <input type="url" value={settings.ctaLink || ''} onChange={(e) => setSettings({ ...settings, ctaLink: e.target.value })}
                      className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" placeholder="/shop" />
                  </div>
                </div>
              </div>
              {settings.image && (
                <div className="relative w-full max-w-sm aspect-[3/4] bg-gray-100 border border-gray-200 overflow-hidden">
                  <img src={settings.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 text-[8px] font-black uppercase tracking-widest">3:4 Preview</div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function PromotionalBannersTab({ promoBanners, createPromoBanner, updatePromoBanner, removePromoBanner, media }: any) {
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
              <ImageUploader
                value={form.desktopImage}
                onChange={(url) => setForm({ ...form, desktopImage: url })}
                label="Desktop Image"
                imageType="promotionalBannerDesktop"
                mediaLibrary={media}
              />
            </div>
            <div>
              <ImageUploader
                value={form.mobileImage}
                onChange={(url) => setForm({ ...form, mobileImage: url })}
                label="Mobile Image"
                imageType="promotionalBannerMobile"
                mediaLibrary={media}
              />
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
              <div className="w-full h-full relative">
                <img src={form.desktopImage} alt="Preview" className="w-full h-full object-cover" />
                {form.bgColor && (
                  <div className="absolute inset-0" style={{ backgroundColor: form.bgColor, opacity: form.overlayOpacity }} />
                )}
              </div>
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

function MediaLibraryTab({ media, createMedia, removeMedia, renameMedia, updateAlt }: any) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ url: '', name: '', alt: '', title: '', description: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAltEditor, setShowAltEditor] = useState<string | null>(null);
  const [altForm, setAltForm] = useState({ alt: '', title: '', description: '' });

  const handleSave = () => {
    createMedia({ url: form.url, name: form.name, alt: form.alt || undefined, title: form.title || undefined, description: form.description || undefined });
    setForm({ url: '', name: '', alt: '', title: '', description: '' });
    setShowForm(false);
  };

  const handleCopyUrl = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const handleRename = (id: string) => {
    if (editName.trim()) {
      renameMedia({ id, name: editName.trim() });
    }
    setEditingId(null);
    setEditName('');
  };

  const handleSaveAlt = (id: string) => {
    updateAlt({ id, alt: altForm.alt || undefined, title: altForm.title || undefined, description: altForm.description || undefined });
    setShowAltEditor(null);
  };

  const filtered = searchQuery
    ? media.filter((m: any) => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || (m.alt && m.alt.toLowerCase().includes(searchQuery.toLowerCase())))
    : media;

  return (
    <div className="bg-white border border-gray-200 shadow-sm">
      <div className="p-8 border-b border-gray-100 flex items-center justify-between gap-4">
        <h2 className="text-xl font-black uppercase tracking-tight shrink-0">Media Library</h2>
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media..."
            className="w-full bg-gray-50 border border-gray-200 p-2.5 text-xs font-bold focus:outline-none focus:border-accent"
          />
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shrink-0">
            <Plus className="w-3 h-3" /> Upload
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-gray-50 border-b border-gray-200 p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <ImageUploader
                value={form.url}
                onChange={(url) => setForm({ ...form, url })}
                label="Upload Image"
                imageType="mediaLibrary"
                showAltInput
                altValue={form.alt}
                onAltChange={(val) => setForm({ ...form, alt: val })}
                mediaLibrary={media}
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Title (optional)</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-muted-foreground">Description (optional)</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-white border border-gray-200 p-3 text-xs font-bold focus:outline-none focus:border-accent" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={!form.url || !form.name} className="flex-1 bg-primary text-white py-3 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all disabled:opacity-50">
              Save Media
            </button>
            <button onClick={() => { setShowForm(false); setForm({ url: '', name: '', alt: '', title: '', description: '' }); }} className="px-6 py-3 border border-gray-300 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">Cancel</button>
          </div>
        </div>
      )}

      {media.length === 0 && !showForm ? (
        <div className="p-8">
          <EmptyState icon={Image} title="No Media" message="Upload images to your media library for use across the site." />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-8">
          {filtered.map((m: any) => (
            <div key={m.id} className="bg-white border border-gray-200 overflow-hidden group">
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img src={m.url} alt={m.alt || m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleCopyUrl(m.url, m.id)}
                    className="bg-white text-black p-1.5 hover:bg-accent hover:text-white transition-all"
                    title="Copy URL"
                  >
                    {copiedId === m.id ? <Check className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => { setShowAltEditor(m.id); setAltForm({ alt: m.alt || '', title: m.title || '', description: m.description || '' }); }}
                    className="bg-white text-black p-1.5 hover:bg-accent hover:text-white transition-all"
                    title="Edit Alt Text"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeMedia(m.id)}
                    className="bg-red-500 text-white p-1.5 hover:bg-red-600 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                {editingId === m.id ? (
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 p-1 text-[9px] font-bold focus:outline-none focus:border-accent"
                      autoFocus
                      onKeyDown={(e) => { if (e.key === 'Enter') handleRename(m.id); if (e.key === 'Escape') { setEditingId(null); setEditName(''); } }}
                    />
                    <button onClick={() => handleRename(m.id)} className="text-accent text-[9px] font-black uppercase"><Check className="w-3 h-3" /></button>
                  </div>
                ) : (
                  <p
                    className="text-[10px] font-black uppercase tracking-widest truncate cursor-pointer hover:text-accent"
                    onDoubleClick={() => { setEditingId(m.id); setEditName(m.name); }}
                    title="Double-click to rename"
                  >{m.name}</p>
                )}
              </div>
              {showAltEditor === m.id && (
                <div className="border-t border-gray-100 p-3 space-y-2 bg-gray-50">
                  <input
                    type="text"
                    value={altForm.alt}
                    onChange={(e) => setAltForm({ ...altForm, alt: e.target.value })}
                    placeholder="Alt text"
                    className="w-full bg-white border border-gray-200 p-2 text-[9px] font-bold focus:outline-none focus:border-accent"
                  />
                  <input
                    type="text"
                    value={altForm.title}
                    onChange={(e) => setAltForm({ ...altForm, title: e.target.value })}
                    placeholder="Title"
                    className="w-full bg-white border border-gray-200 p-2 text-[9px] font-bold focus:outline-none focus:border-accent"
                  />
                  <textarea
                    value={altForm.description}
                    onChange={(e) => setAltForm({ ...altForm, description: e.target.value })}
                    placeholder="Description"
                    rows={2}
                    className="w-full bg-white border border-gray-200 p-2 text-[9px] font-bold focus:outline-none focus:border-accent"
                  />
                  <div className="flex gap-1">
                    <button onClick={() => handleSaveAlt(m.id)} className="text-accent text-[8px] font-black uppercase tracking-widest hover:underline">
                      Save
                    </button>
                    <button onClick={() => setShowAltEditor(null)} className="text-muted-foreground text-[8px] font-black uppercase tracking-widest hover:underline">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
