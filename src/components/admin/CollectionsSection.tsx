import { useState, useRef } from 'react';
import { Collection } from '../../store';
import { Plus, Trash2, Edit2, Camera, Loader2 } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';

interface CollectionsSectionProps {
  collections: Collection[];
  onAdd: (coll: Omit<Collection, 'id'>) => void;
  onUpdate: (id: string, data: Partial<Collection>) => void;
  onDelete: (id: string) => void;
}

export function CollectionsSection({ collections, onAdd, onUpdate, onDelete }: CollectionsSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newColl, setNewColl] = useState({ name: '', description: '', image: '' });

  const handleAdd = () => {
    onAdd({ ...newColl, createdAt: new Date().toISOString() });
    setNewColl({ name: '', description: '', image: '' });
    setShowAdd(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const storageRef = ref(storage, `collections/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setNewColl({ ...newColl, image: downloadURL });
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">Product Collections</h2>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Manage your jewelry sets and seasons</p>
          </div>
          <button 
            onClick={() => setShowAdd(true)}
            className="bg-primary text-white px-6 py-2.5 text-[9px] font-black uppercase tracking-widest hover:bg-accent transition-colors shadow-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Collection
          </button>
        </div>

        {showAdd && (
          <div className="p-8 bg-gray-50 border-b border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Collection Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Summer Glow" 
                  value={newColl.name}
                  onChange={(e) => setNewColl({ ...newColl, name: e.target.value })}
                  className="w-full bg-white border border-gray-200 p-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Description</label>
                <input 
                  type="text" 
                  placeholder="Collection tagline" 
                  value={newColl.description}
                  onChange={(e) => setNewColl({ ...newColl, description: e.target.value })}
                  className="w-full bg-white border border-gray-200 p-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Collection Image</label>
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    placeholder="Image URL or upload" 
                    value={newColl.image}
                    onChange={(e) => setNewColl({ ...newColl, image: e.target.value })}
                    className="flex-1 bg-white border border-gray-200 p-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent"
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-primary text-white p-4 hover:bg-accent transition-colors disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={handleAdd}
                  disabled={!newColl.name}
                  className="flex-1 bg-accent text-white py-4 text-[9px] font-black uppercase tracking-widest hover:bg-primary transition-all disabled:opacity-50"
                >
                  Save
                </button>
                <button 
                  onClick={() => setShowAdd(false)}
                  className="px-6 bg-white border border-gray-200 text-gray-400 text-[9px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-muted-foreground uppercase tracking-[0.2em] text-[9px] font-black">
              <tr>
                <th className="px-8 py-5">Collection</th>
                <th className="px-8 py-5">Description</th>
                <th className="px-8 py-5">Created At</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {collections.map((coll) => (
                <tr key={coll.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      {coll.image && (
                        <div className="w-10 h-10 bg-gray-100 overflow-hidden">
                          <img src={coll.image} alt={coll.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <span className="font-black uppercase text-xs">{coll.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-muted-foreground text-xs font-bold">{coll.description || 'No description'}</td>
                  <td className="px-8 py-6 text-muted-foreground text-[10px] font-black uppercase">{new Date(coll.createdAt).toLocaleDateString()}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 bg-gray-50 hover:bg-accent hover:text-white transition-all"><Edit2 className="h-4 w-4" /></button>
                      <button 
                        onClick={() => onDelete(coll.id)}
                        className="p-2 bg-gray-50 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
