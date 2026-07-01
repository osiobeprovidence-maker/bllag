import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import { Product } from '../../store';
import { ImageUploader } from './ImageUploader';

interface AddProductModalProps {
  product?: Product | null;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id'>) => void;
}

export function AddProductModal({ product, onClose, onSave }: AddProductModalProps) {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    category: 'Necklaces',
    price: 0,
    originalPrice: 0,
    discount: 0,
    description: '',
    image: '',
    isBestSeller: false,
    isNew: true,
    rating: 5,
    reviews: 0
  });

  useEffect(() => {
    if (product) {
      const { id, ...rest } = product;
      setFormData(rest);
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-4xl shadow-2xl relative flex h-[80vh] overflow-hidden rounded-lg"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-muted-foreground hover:text-black transition-colors z-10"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="w-1/3 bg-gray-50 p-12 border-r border-gray-200 hidden md:block">
          <div className="mb-12">
            <span className="text-[10px] font-black uppercase tracking-widest text-accent mb-2 block">Step 01</span>
            <h3 className="text-2xl font-black uppercase tracking-tight">Collection Identity</h3>
            <p className="text-muted-foreground text-xs mt-4 leading-relaxed">Define the essence of your luxury piece. Choose high-resolution imagery and compelling technical details.</p>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-primary">
              <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center font-black text-[10px]">01</div>
              <span className="text-[10px] font-black uppercase tracking-widest">Basic Information</span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground opacity-50">
              <div className="w-8 h-8 rounded-full border-2 border-muted flex items-center justify-center font-black text-[10px]">02</div>
              <span className="text-[10px] font-black uppercase tracking-widest">Pricing & Inventory</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 p-12 overflow-y-auto">
          <div className="max-w-lg">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-10">
              {product ? 'Edit Collection Item' : 'Add Collection Item'}
            </h2>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest mb-3 block text-muted-foreground">Product Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b-2 border-gray-100 p-3 text-lg font-black uppercase focus:outline-none focus:border-accent transition-colors" 
                    placeholder="e.g. AURORA GOLD RING" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest mb-3 block text-muted-foreground">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 p-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent"
                    >
                      <option>Necklaces</option>
                      <option>Earrings</option>
                      <option>Rings</option>
                      <option>Hand Chains</option>
                      <option>Leg Chains</option>
                      <option>Hair Accessories</option>
                    </select>
                  </div>
                  <div>
                    <ImageUploader
                      value={formData.image}
                      onChange={(url) => setFormData({ ...formData, image: url })}
                      recommendedWidth={1500}
                      recommendedHeight={1500}
                      minWidth={500}
                      minHeight={500}
                      aspectRatio="1:1"
                      label="Product Imagery"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest mb-3 block text-muted-foreground">Retail Price (₦)</label>
                    <input 
                      type="number" 
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 p-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent" 
                      placeholder="0.00" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest mb-3 block text-muted-foreground">Original Price (₦)</label>
                    <input 
                      type="number" 
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 p-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent" 
                      placeholder="0.00" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest mb-3 block text-muted-foreground">Product Description</label>
                  <textarea 
                    rows={4} 
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 p-4 text-xs font-bold focus:outline-none focus:border-accent" 
                    placeholder="Describe the craftsmanship..."
                  ></textarea>
                </div>

                <div className="flex items-center gap-6">
                   <label className="flex items-center gap-3 cursor-pointer">
                     <input 
                       type="checkbox" 
                       checked={formData.isNew} 
                       onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                       className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                     />
                     <span className="text-[10px] font-black uppercase tracking-widest">New Arrival</span>
                   </label>
                   <label className="flex items-center gap-3 cursor-pointer">
                     <input 
                       type="checkbox" 
                       checked={formData.isBestSeller} 
                       onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                       className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                     />
                     <span className="text-[10px] font-black uppercase tracking-widest">Best Seller</span>
                   </label>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="submit"
                  className="flex-1 bg-primary text-white py-5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-xl"
                >
                  {product ? 'Update Piece' : 'Save & Publish'}
                </button>
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-8 bg-gray-100 text-gray-400 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
