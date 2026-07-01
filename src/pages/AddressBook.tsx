import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuthStore } from '../store';

export function AddressBook() {
  const { user, sessionId } = useAuthStore();
  const addresses = useQuery(api.addresses.list, sessionId ? { sessionId } : 'skip');
  const removeAddress = useMutation(api.addresses.remove);

  const handleRemove = async (id: any) => {
    if (!sessionId) return;
    await removeAddress({ sessionId, id });
  };

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

        {addresses === undefined ? (
          <div className="text-center py-20">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Loading addresses...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-200">
            <MapPin className="h-16 w-16 mx-auto mb-6 text-gray-300" />
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">No Addresses Saved</h3>
            <p className="text-muted-foreground text-sm mb-8">Add your first shipping address to get started.</p>
            <Link 
              to="/address-book/add"
              className="inline-flex items-center gap-3 bg-primary text-white px-8 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Address
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {addresses.map((address: any, idx: number) => (
              <motion.div 
                key={address._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border border-gray-200 bg-white p-8 relative group hover:border-accent/50 transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-tight">{address.label || 'Address'}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/address-book/edit/${address._id}`} className="p-2 hover:text-accent transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </Link>
                    <button onClick={() => handleRemove(address._id)} className="p-2 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-loose mb-8">
                  <p>{user?.name}</p>
                  <p>{address.street}</p>
                  <p>{address.city}, {address.state} {address.zipCode}</p>
                  <p>{address.country}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
