import { useState } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Search, 
  Plus, 
  LayoutDashboard, 
  CreditCard, 
  Megaphone, 
  ChevronRight,
  Palette
} from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore, Product } from '../store';
import { useAdmin } from '../hooks/useAdmin';
import { CardSkeleton, TableRowSkeleton } from '../components/ui/Skeleton';

// Modular Components
import { OverviewSection } from '../components/admin/OverviewSection';
import { ProductsSection } from '../components/admin/ProductsSection';
import { OrdersSection } from '../components/admin/OrdersSection';
import { CustomersSection } from '../components/admin/CustomersSection';
import { InstallmentsSection } from '../components/admin/InstallmentsSection';
import { MarketingSection } from '../components/admin/MarketingSection';
import { AddProductModal } from '../components/admin/AddProductModal';
import { AnalyticsSection } from '../components/admin/AnalyticsSection';
import { CollectionsSection } from '../components/admin/CollectionsSection';
import { WebsiteCustomization } from '../components/admin/WebsiteCustomization';

type AdminTab = 'overview' | 'analytics' | 'products' | 'collections' | 'orders' | 'customers' | 'installments' | 'marketing' | 'customization';

export function AdminDashboard() {
  const { isAuthenticated, user } = useAuthStore();
  const { products, orders, collections, customers, installments, loading, addProduct, updateProduct, deleteProduct, updateOrder, addCollection,
    banners, categoryImages, sections, promoBanners, media, settings,
    campaigns, coupons,
    createBanner, updateBanner, removeBanner, reorderBanner,
    createCategory, updateCategory, removeCategory,
    upsertSection, createPromoBanner, updatePromoBanner, removePromoBanner,
    setSetting,     createMedia, removeMedia, renameMedia, updateAlt,
    createCampaign, updateCampaign, removeCampaign,
    createCoupon, updateCoupon, removeCoupon,
    instagramPosts, instagramSettings,
    createInstagramPost, updateInstagramPost, removeInstagramPost, reorderInstagramPosts, updateInstagramSettings,
  } = useAdmin();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowAddProduct(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAddProduct(true);
  };

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const avgOrderValue = totalRevenue / Math.max(orders.length, 1);
  const activeSales = orders.filter(o => o.status !== 'delivered').length;
  const stats = [
    { name: 'Total Revenue', value: `₦${totalRevenue.toLocaleString()}`, change: `+₦${Math.round(avgOrderValue).toLocaleString()}`, trend: 'up', icon: DollarSign },
    { name: 'Active Sales', value: activeSales.toString(), change: `+${activeSales}`, trend: 'up', icon: ShoppingCart },
    { name: 'Inventory Count', value: products.length.toString(), change: `+${products.length}`, trend: 'up', icon: Package },
    { name: 'Total Customers', value: (customers?.length ?? 0).toString(), change: `+${customers?.length ?? 0}`, trend: 'up', icon: Users },
  ];

  const sidebarLinks = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'analytics', name: 'Analytics', icon: CreditCard },
    { id: 'collections', name: 'Collections', icon: Package },
    { id: 'products', name: 'Products & Inventory', icon: Package },
    { id: 'orders', name: 'Orders & Sales', icon: ShoppingCart },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'installments', name: 'Pay Small Small', icon: CreditCard },
    { id: 'customization', name: 'Website Customization', icon: Palette },
    { id: 'marketing', name: 'Marketing & Ads', icon: Megaphone },
  ];

  const renderSkeletons = () => (
    <div className="space-y-6">
      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="bg-white border border-gray-200">
          {[1, 2, 3, 4, 5].map(i => <TableRowSkeleton key={i} />)}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen bg-[#F8F9FA] flex overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-30 hidden lg:flex lg:flex-col">
        <div className="p-8 border-b border-gray-100 shrink-0">
          <Link to="/" className="text-2xl font-black uppercase tracking-tighter">
            bllag<span className="text-accent italic">.HQ</span>
          </Link>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">Admin Control Center</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-6 space-y-2">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id as AdminTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                activeTab === link.id 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'text-muted-foreground hover:bg-gray-50 hover:text-primary'
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.name}
              {activeTab === link.id && <ChevronRight className="ml-auto h-3 w-3" />}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100 shrink-0">
          <div className="p-4 bg-accent/5 border border-accent/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest">System Live</span>
            </div>
            <p className="text-[9px] text-muted-foreground leading-tight">Server: NGA-LAG-01<br/>Status: 99.9% Uptime</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-0">
        {/* Top Bar */}
        <header className="shrink-0 bg-[#F8F9FA] border-b border-gray-200 px-6 lg:px-10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter text-primary">
                {sidebarLinks.find(l => l.id === activeTab)?.name}
              </h1>
              
              {/* Mobile Tab Select Dropdown */}
              <div className="lg:hidden mt-4 relative">
                <select 
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value as AdminTab)}
                  className="appearance-none bg-white border border-gray-200 pl-4 pr-10 py-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent w-full min-w-[240px] shadow-sm"
                >
                  {sidebarLinks.map(link => (
                    <option key={link.id} value={link.id}>{link.name}</option>
                  ))}
                </select>
                <ChevronRight className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none text-muted-foreground" />
              </div>

              <div className="hidden lg:flex items-center gap-2 mt-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Dashboard</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] font-black text-accent uppercase tracking-widest">{activeTab}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Global Search..." 
                  className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 text-xs font-bold w-64 focus:outline-none focus:border-accent"
                />
              </div>
              <button 
                onClick={handleAddProduct}
                className="bg-primary text-white p-3 hover:bg-accent transition-colors shadow-lg shrink-0"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                renderSkeletons()
              ) : (
                <>
                  {activeTab === 'overview' && <OverviewSection stats={stats} orders={orders} />}
                  {activeTab === 'analytics' && <AnalyticsSection orders={orders} />}
                  {activeTab === 'collections' && (
                    <CollectionsSection 
                      collections={collections} 
                      onAdd={addCollection}
                      onUpdate={() => {}}
                      onDelete={() => {}}
                    />
                  )}
                  {activeTab === 'products' && (
                    <ProductsSection 
                      products={products} 
                      onEdit={handleEditProduct} 
                      onDelete={deleteProduct}
                      onAdd={handleAddProduct}
                    />
                  )}
                  {activeTab === 'orders' && <OrdersSection orders={orders} onUpdate={updateOrder} />}
                  {activeTab === 'customers' && <CustomersSection customers={customers} onViewAnalytics={() => setActiveTab('analytics')} />}
                  {activeTab === 'installments' && <InstallmentsSection installments={installments} />}
                  {activeTab === 'customization' && (
                    <WebsiteCustomization
                      banners={banners}
                      categoryImages={categoryImages}
                      sections={sections}
                      promoBanners={promoBanners}
                      media={media}
                      settings={settings}
                      createBanner={createBanner}
                      updateBanner={updateBanner}
                      removeBanner={removeBanner}
                      reorderBanner={reorderBanner}
                      createCategory={createCategory}
                      updateCategory={updateCategory}
                      removeCategory={removeCategory}
                      upsertSection={upsertSection}
                      createPromoBanner={createPromoBanner}
                      updatePromoBanner={updatePromoBanner}
                      removePromoBanner={removePromoBanner}
                      setSetting={setSetting}
                      createMedia={createMedia}
                      removeMedia={removeMedia}
                      renameMedia={renameMedia}
                      updateAlt={updateAlt}
                      instagramPosts={instagramPosts}
                      instagramSettings={instagramSettings}
                      createInstagramPost={createInstagramPost}
                      updateInstagramPost={updateInstagramPost}
                      removeInstagramPost={removeInstagramPost}
                      reorderInstagramPosts={reorderInstagramPosts}
                      updateInstagramSettings={updateInstagramSettings}
                    />
                  )}
                  {activeTab === 'marketing' && (
                    <MarketingSection
                      campaigns={campaigns}
                      coupons={coupons}
                      createCampaign={createCampaign}
                      updateCampaign={updateCampaign}
                      removeCampaign={removeCampaign}
                      createCoupon={createCoupon}
                      updateCoupon={updateCoupon}
                      removeCoupon={removeCoupon}
                    />
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      {showAddProduct && (
        <AddProductModal 
          product={editingProduct} 
          onClose={() => setShowAddProduct(false)} 
          onSave={editingProduct ? (data) => updateProduct(editingProduct.id, data) : addProduct}
        />
      )}
    </div>
  );
}

