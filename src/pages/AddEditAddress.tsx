import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Save, MapPin, Globe, Building2, Hash } from 'lucide-react';

export function AddEditAddress() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'Nigeria',
    isDefault: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save logic here
    navigate('/address-book');
  };

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <Link 
          to="/address-book" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-12"
        >
          <ArrowLeft className="h-3 w-3" />
          Address Repository
        </Link>

        <header className="mb-16">
          <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">Location Entry</h1>
          <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none">
            {isEditing ? 'Modify Destination' : 'New Destination'}
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="bg-white border border-gray-200 p-8 lg:p-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Address Label</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Home, Office, Vault"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Country / Territory</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <select 
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent appearance-none"
                  >
                    <option value="Nigeria">Nigeria</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Ghana">Ghana</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Street Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <input 
                  type="text" 
                  required
                  placeholder="Street name, building, apartment"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">City</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Lagos"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">State / Province</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Lagos State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Postal Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 101241"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition-colors ${formData.isDefault ? 'bg-accent' : 'bg-gray-200'}`}></div>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isDefault ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                  Set as Primary Destination
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-6">
            <button 
              type="submit"
              className="flex-1 bg-primary text-white py-6 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-2xl flex items-center justify-center gap-3"
            >
              <Save className="h-4 w-4" />
              Commit Address to Vault
            </button>
            <Link 
              to="/address-book"
              className="px-12 bg-white border border-gray-200 text-muted-foreground py-6 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center"
            >
              Abort
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
