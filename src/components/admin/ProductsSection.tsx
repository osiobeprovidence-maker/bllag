import { Search, Edit2, Trash2, Package } from 'lucide-react';
import { Product } from '../../store';
import { EmptyState } from '../ui/EmptyState';

interface ProductsSectionProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductsSection({ products, onEdit, onDelete }: ProductsSectionProps) {
  if (products.length === 0) {
    return (
      <EmptyState 
        icon={Package}
        title="No Inventory Items"
        message="Your digital vault is currently empty. Start by adding your first luxury masterpiece."
        action={{
          label: "Add New Piece",
          onClick: () => {} // This would be handled by parent modal state
        }}
      />
    );
  }

  return (
    <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">Active Collections</h2>
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Showing all {products.length} inventory items</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Filter products..." 
              className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-[10px] font-black uppercase w-full sm:w-64 focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-muted-foreground uppercase tracking-[0.2em] text-[9px] font-black">
            <tr>
              <th className="px-8 py-5">Item</th>
              <th className="px-8 py-5">Category</th>
              <th className="px-8 py-5">Retail Price</th>
              <th className="px-8 py-5">Stock Level</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-all group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-5">
                    <img referrerPolicy="no-referrer" src={product.image} alt={product.name} className="w-14 h-14 object-cover shadow-sm grayscale group-hover:grayscale-0 transition-all" />
                    <div>
                      <span className="font-black text-sm block group-hover:text-accent transition-colors">{product.name}</span>
                      <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black">SKU: {product.id.slice(0, 8)}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-3 py-1">{product.category}</span>
                </td>
                <td className="px-8 py-6 font-black text-primary">₦{product.price.toLocaleString()}</td>
                <td className="px-8 py-6">
                  <span className="text-green-600 font-black text-[10px] uppercase tracking-widest">Active</span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onEdit(product)}
                      className="p-2 bg-gray-50 hover:bg-accent hover:text-white transition-all"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this piece?')) {
                          onDelete(product.id);
                        }
                      }}
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
  );
}
