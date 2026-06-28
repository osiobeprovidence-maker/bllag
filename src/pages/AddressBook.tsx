import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store';

export function AddressBook() {
  const { user } = useAuthStore();
  
  // Mock addresses - in real app fetch from Firestore
  const addresses = [
    {
      id: '1',
      label: 'Default Shipping',
      street: '12 Luxury Way, Penthouse B',
      city: 'Victoria Island',
      state: 'Lagos',
      zip: '101241',
      country: 'Nigeria',
      isDefault: true
    },
    {
      id: '2',
      label: 'Office HQ',
      street: 'Plot 45, Industrial Estate',
      city: 'Ikeja',
      state: 'Lagos',
      zip: '100271',
      country: 'Nigeria',
      isDefault: false
    }
  ];

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/profile" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-12"
        >
          <ArrowLeft className="h-3 w-3" />
          Account Dashboard
        </Link>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">Logistics Repository</h1>
            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none">Address Book</h2>
          </div>
          <Link 
            to="/address-book/add"
            className="flex items-center gap-3 bg-primary text-white px-8 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-xl"
          >
            <Plus className="h-4 w-4" />
            Append New Address
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {addresses.map((address) => (
            <motion.div 
              key={address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border p-8 relative group transition-all ${address.isDefault ? 'border-accent bg-accent/5' : 'border-gray-200 bg-white hover:border-accent/50'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full ${address.isDefault ? 'bg-accent text-white' : 'bg-gray-100 text-muted-foreground'}`}>
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-tight">{address.label}</h3>
                    {address.isDefault && (
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-accent">Primary Destination</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to={`/address-book/edit/${address.id}`} className="p-2 hover:text-accent transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </Link>
                  <button className="p-2 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-loose mb-8">
                <p>{user?.name}</p>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zip}</p>
                <p>{address.country}</p>
              </div>

              {!address.isDefault && (
                <button className="text-[9px] font-black uppercase tracking-widest text-accent hover:underline flex items-center gap-2">
                  Set as Primary Destination
                  <ArrowLeft className="h-3 w-3 rotate-180" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
