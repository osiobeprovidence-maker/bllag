import { useState } from 'react';
import { Collection } from '../../store';
import { Plus, Trash2, Package } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { EmptyState } from '../ui/EmptyState';

interface CollectionsSectionProps {
  collections: Collection[];
  onAdd: (coll: Omit<Collection, 'id'>) => void;
  onUpdate: (id: string, data: Partial<Collection>) => void;
  onDelete: (id: string) => void;
}

export function CollectionsSection({ collections, onAdd, onUpdate, onDelete }: CollectionsSectionProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newColl, setNewColl] = useState({ name: '', description: '', image: '' });

  const handleAdd = () => {
    onAdd({ ...newColl, createdAt: new Date().toISOString() });
    setNewColl({ name: '', description: '', image: '' });
    setShowAdd(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black uppercase tracking-tight">Collections</h3>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all"
        >
          <Plus className="w-3 h-3" /> Add Collection
        </button>
      </div>

      {showAdd && (
        <div className="bg-gray-50 border border-gray-200 p-6 mb-6 space-y-4">
          <input 
            type="text" 
            placeholder="Collection Name"
            value={newColl.name}
            onChange={(e) => setNewColl({ ...newColl, name: e.target.value })}
            className="w-full bg-white border border-gray-200 p-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-accent"
          />
          <input 
            type="text" 
            placeholder="Description"
            value={newColl.description}
            onChange={(e) => setNewColl({ ...newColl, description: e.target.value })}
            className="w-full bg-white border border-gray-200 p-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-accent"
          />
          <ImageUploader
            value={newColl.image}
            onChange={(url) => setNewColl({ ...newColl, image: url })}
            imageType="collection"
            label="Collection Image"
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 bg-primary text-white py-3 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
              Save Collection
            </button>
            <button onClick={() => setShowAdd(false)} className="px-6 py-3 border border-gray-300 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {collections.length === 0 && !showAdd ? (
        <EmptyState icon={Package} title="No Collections" message="Create your first collection to organize products." action={{ label: "Add Collection", onClick: () => setShowAdd(true) }} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((coll) => (
            <div key={coll.id} className="bg-white border border-gray-200 shadow-sm overflow-hidden group">
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                {coll.image && (
                  <img src={coll.image} alt={coll.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
              </div>
              <div className="p-4">
                <h4 className="text-xs font-black uppercase tracking-widest mb-1">{coll.name}</h4>
                <p className="text-[10px] text-muted-foreground mb-3">{coll.description}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onDelete(coll.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 text-[10px] font-bold uppercase tracking-widest transition-colors"
                  >
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
