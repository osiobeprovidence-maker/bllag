import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import heroBanner from '../assets/images/jewelry_hero_banner_1782380026708.jpg';

function HeroSlider({ banners }: { banners: any[] }) {
  const [current, setCurrent] = useState(0);
  const autoplay = useQuery(api.websiteSettings.get, { key: 'slider_autoplay' });
  const interval = useQuery(api.websiteSettings.get, { key: 'slider_interval' });
  const transition = useQuery(api.websiteSettings.get, { key: 'slider_transition' });
  const loop = useQuery(api.websiteSettings.get, { key: 'slider_loop' });
  const speed = useQuery(api.websiteSettings.get, { key: 'slider_speed' });

  const autoplayEnabled = autoplay?.value === true || autoplay?.value === 'true';
  const intervalMs = parseInt(interval?.value) || 5000;
  const transitionType = transition?.value || 'fade';
  const loopEnabled = loop?.value === true || loop?.value === 'true';
  const animSpeed = parseInt(speed?.value) || 500;

  const next = useCallback(() => {
    setCurrent((c) => (c + 1 >= banners.length ? (loopEnabled ? 0 : c) : c + 1));
  }, [banners.length, loopEnabled]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 < 0 ? (loopEnabled ? banners.length - 1 : 0) : c - 1));
  }, [banners.length, loopEnabled]);

  useEffect(() => {
    if (!autoplayEnabled || banners.length < 2) return;
    const timer = setInterval(next, intervalMs);
    return () => clearInterval(timer);
  }, [autoplayEnabled, banners.length, intervalMs, next]);

  if (banners.length === 0) {
    return (
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-background pt-20">
        <div className="absolute inset-0 z-0 bg-[#ffe5e5]">
          <img referrerPolicy="no-referrer" src={heroBanner} alt="Jewelry Sale" className="w-full h-full object-cover object-center opacity-80" />
        </div>
        <div className="relative z-10 text-center text-primary px-4 bg-white/90 p-8 m-4 max-w-lg shadow-xl">
          <div className="mb-2">
            <span className="text-accent font-bold text-lg uppercase tracking-wider">Mega Sale Event</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-black">
            UP TO <span className="text-accent">70%</span> OFF
          </h1>
          <p className="text-base text-gray-700 font-medium mb-6">Hot trendy jewelry arriving daily. Don't miss out on these steals!</p>
          <Link to="/shop" className="bg-black text-white px-10 py-4 text-sm uppercase font-bold hover:bg-accent transition-colors inline-flex items-center w-full justify-center">
            Shop Sale <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-background pt-20">
      {banners.map((banner, i) => (
        <div
          key={banner._id}
          className="absolute inset-0 z-0 transition-opacity"
          style={{ opacity: i === current ? 1 : 0, transitionDuration: `${animSpeed}ms` }}
        >
          <img referrerPolicy="no-referrer" src={banner.image} alt={banner.mainHeading} className="w-full h-full object-cover object-center" />
        </div>
      ))}
      <div className="relative z-10 text-center text-primary px-4 bg-white/90 p-8 m-4 max-w-lg shadow-xl">
        {banners[current]?.smallHeading && (
          <div className="mb-2">
            <span className="text-accent font-bold text-lg uppercase tracking-wider">{banners[current].smallHeading}</span>
          </div>
        )}
        {banners[current]?.mainHeading && (
          <motion.h1 key={current} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-black"
          >
            {banners[current].mainHeading}
          </motion.h1>
        )}
        {banners[current]?.description && (
          <motion.p key={`desc-${current}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-gray-700 font-medium mb-6"
          >
            {banners[current].description}
          </motion.p>
        )}
        <motion.div key={`cta-${current}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Link to={banners[current]?.ctaLink || '/shop'}
            className="bg-black text-white px-10 py-4 text-sm uppercase font-bold hover:bg-accent transition-colors inline-flex items-center w-full justify-center"
          >
            {banners[current]?.ctaText || 'Shop Now'} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </motion.div>
      </div>
      {banners.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 z-20 top-1/2 -translate-y-1/2 bg-white/80 p-2 hover:bg-white transition-colors"><ChevronLeft className="h-6 w-6" /></button>
          <button onClick={next} className="absolute right-4 z-20 top-1/2 -translate-y-1/2 bg-white/80 p-2 hover:bg-white transition-colors"><ChevronRight className="h-6 w-6" /></button>
          <div className="absolute bottom-8 z-20 flex gap-2">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full transition-colors ${i === current ? 'bg-accent' : 'bg-white/60'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export function Home() {
  const allProducts = useQuery(api.products.list);
  const products = allProducts ?? [];
  const bestSellers = products.filter((p: any) => p.isBestSeller).slice(0, 4);
  const banners = useQuery(api.homepageBanners.getActive);
  const categories = useQuery(api.categoryImages.list);
  const sections = useQuery(api.homepageSections.list);
  const promoBanners = useQuery(api.promotionalBanners.getActive);

  const sectionMap: Record<string, any> = {};
  (sections ?? []).forEach((s: any) => { sectionMap[s.sectionKey] = s; });

  const flashSaleSection = sectionMap['flash-sale'];
  const trendingSection = sectionMap['trending'];
  const membershipSection = sectionMap['membership-banner'];
  const brandValuesSection = sectionMap['brand-values'];
  const instagramSection = sectionMap['instagram'];

  const showFlashSale = flashSaleSection?.visible !== false;
  const showTrending = trendingSection?.visible !== false;
  const showMembership = membershipSection?.visible !== false;
  const showBrandValues = brandValuesSection?.visible !== false;
  const showInstagram = instagramSection?.visible !== false;

  const flashSaleProducts = products.filter((p: any) => p.isNew || p.discount).slice(0, 10);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSlider banners={banners ?? []} />

      <section className="py-8 bg-white border-b border-muted">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex gap-6 justify-start md:justify-center min-w-max">
            {(categories ?? []).map((cat: any) => (
              <Link key={cat._id} to={cat.link || `/shop?category=${cat.name}`} className="flex flex-col items-center group w-20 cursor-pointer">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-accent transition-all p-0.5 mb-2">
                  <img referrerPolicy="no-referrer" src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="text-xs font-medium text-gray-700 group-hover:text-accent text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {showFlashSale && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold uppercase">{flashSaleSection?.title || 'Flash Sale'}</h2>
            <Link to="/shop" className="text-sm font-bold text-accent hover:underline">View All &gt;</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {flashSaleProducts.map((product: any) => (
              <Link key={product._id} to={`/product/${product._id}`} className="group block bg-white border border-muted hover:shadow-md transition-shadow">
                <div className="relative overflow-hidden aspect-[4/5] bg-muted">
                  <img referrerPolicy="no-referrer" src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {product.discount && <div className="absolute top-2 left-2"><span className="bg-accent text-white text-xs font-bold px-2 py-1">-{product.discount}%</span></div>}
                  {product.isNew && !product.discount && <div className="absolute top-2 left-2"><span className="bg-black text-white text-[10px] font-bold px-2 py-1">NEW</span></div>}
                  <div className="absolute bottom-2 left-2"><span className="bg-white/90 backdrop-blur-sm text-black text-[9px] font-black px-2 py-1 uppercase tracking-tighter shadow-sm">Pay Small Small</span></div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm text-gray-800 line-clamp-2 mb-1 group-hover:text-accent transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-1">
                    <div className="flex text-accent text-[10px]">{'★'.repeat(Math.floor(product.rating || 5))}{'☆'.repeat(5 - Math.floor(product.rating || 5))}</div>
                    <span className="text-[10px] text-muted-foreground">({product.reviews || 0})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-accent">₦{product.price.toLocaleString()}</span>
                    {product.originalPrice && <span className="text-xs text-muted-foreground line-through">₦{product.originalPrice.toLocaleString()}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {showMembership && (
        <section className="my-16 mx-4 sm:mx-6 lg:mx-auto max-w-7xl relative overflow-hidden">
          <div className="relative h-[400px] md:h-[500px]">
            <img referrerPolicy="no-referrer"
              src={promoBanners?.[0]?.desktopImage || 'https://images.unsplash.com/photo-1573408302185-9146fe634ad0?auto=format&fit=crop&q=80&w=2000'}
              alt={promoBanners?.[0]?.title || 'Membership Banner'}
              className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-8 text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col items-center">
                <span className="bg-accent text-white font-black px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] mb-6">
                  {promoBanners?.[0]?.subtitle || 'Exclusive Invitation'}
                </span>
                <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4 leading-none">
                  {promoBanners?.[0]?.title || 'Join the <span class="text-accent">bllag</span> Circle'}
                  {!promoBanners?.[0]?.title && <>Join the <span className="text-accent">bllag</span> Circle</>}
                </h2>
                <p className="text-sm md:text-lg mb-8 font-medium max-w-xl opacity-90 leading-relaxed">
                  {promoBanners?.[0]?.ctaText || 'Unlock 15% flat discounts, priority access to new drops, and free global shipping on every order.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Link to={promoBanners?.[0]?.ctaLink || '/membership'}
                    className="bg-white text-black px-12 py-4 text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all duration-300">
                    {promoBanners?.[0]?.ctaText || 'Become a Member'}
                  </Link>
                  <Link to="/shop"
                    className="bg-transparent border border-white text-white px-12 py-4 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
                    Explore Shop
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {showTrending && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold uppercase">{trendingSection?.title || 'Trending Now'}</h2>
            <Link to="/shop" className="text-sm font-bold text-accent hover:underline">Shop Trending &gt;</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {bestSellers.map((product: any) => (
              <Link key={product._id} to={`/product/${product._id}`} className="group block bg-white border border-muted hover:shadow-md transition-shadow">
                <div className="relative overflow-hidden aspect-[4/5] bg-muted">
                  <img referrerPolicy="no-referrer" src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2"><span className="bg-black text-white text-[10px] font-bold px-2 py-1">HOT</span></div>
                  <div className="absolute bottom-2 left-2"><span className="bg-white/90 backdrop-blur-sm text-black text-[9px] font-black px-2 py-1 uppercase tracking-tighter shadow-sm">Pay Small Small</span></div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm text-gray-800 line-clamp-2 mb-1 group-hover:text-accent transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-1">
                    <div className="flex text-accent text-[10px]">{'★'.repeat(Math.floor(product.rating || 5))}{'☆'.repeat(5 - Math.floor(product.rating || 5))}</div>
                    <span className="text-[10px] text-muted-foreground">({product.reviews || 0})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-primary">₦{product.price.toLocaleString()}</span>
                    {product.originalPrice && <span className="text-xs text-muted-foreground line-through">₦{product.originalPrice.toLocaleString()}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {showBrandValues && (
        <section className="py-20 bg-muted/50 border-t border-primary/5">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <h3 className="font-bold uppercase text-lg mb-3">Ethically Sourced</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">We work exclusively with suppliers who guarantee conflict-free diamonds and recycled gold.</p>
            </div>
            <div>
              <h3 className="font-bold uppercase text-lg mb-3">Handcrafted</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Each piece is meticulously crafted by skilled artisans in our dedicated studios.</p>
            </div>
            <div>
              <h3 className="font-bold uppercase text-lg mb-3">Lifetime Warranty</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">We stand by our quality. Enjoy free repairs and maintenance for life on all purchases.</p>
            </div>
          </div>
        </section>
      )}

      {showInstagram && (
        <section className="py-24 border-t border-muted">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">@blag_official</h2>
            <p className="text-sm text-muted-foreground uppercase tracking-widest">Follow us on Instagram</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 px-1">
            {[
              { bg: 'bg-rose-200', label: 'IG-1' },
              { bg: 'bg-amber-200', label: 'IG-2' },
              { bg: 'bg-emerald-200', label: 'IG-3' },
              { bg: 'bg-violet-200', label: 'IG-4' },
            ].map((item, i) => (
              <div key={i} className="relative aspect-square group overflow-hidden bg-gray-100 flex items-center justify-center">
                <div className={`w-full h-full ${item.bg} flex items-center justify-center`}>
                  <Instagram className="text-white/60 h-12 w-12" />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <Instagram className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
