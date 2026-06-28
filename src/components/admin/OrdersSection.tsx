import { ShoppingBag } from 'lucide-react';
import { Order } from '../../store';
import { EmptyState } from '../ui/EmptyState';

interface OrdersSectionProps {
  orders: Order[];
  onUpdate: (id: string, data: Partial<Order>) => void;
}

export function OrdersSection({ orders, onUpdate }: OrdersSectionProps) {
  if (orders.length === 0) {
    return (
      <EmptyState 
        icon={ShoppingBag}
        title="No Orders Yet"
        message="The luxury market is waiting. Your sales history will appear here once the first acquisition is made."
      />
    );
  }

  return (
    <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-black uppercase tracking-tight">Sales & Logistics</h2>
        <div className="flex gap-3">
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Total {orders.length} orders</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-muted-foreground uppercase tracking-[0.2em] text-[9px] font-black">
            <tr>
              <th className="px-8 py-5">Order ID</th>
              <th className="px-8 py-5">Customer</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5">Tracking</th>
              <th className="px-8 py-5 text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6 font-black text-accent uppercase">{order.id.slice(0, 8)}</td>
                <td className="px-8 py-6 font-black uppercase text-xs">{order.customerName}</td>
                <td className="px-8 py-6">
                  <select 
                    value={order.status}
                    onChange={(e) => onUpdate(order.id, { status: e.target.value as any })}
                    className="text-[9px] font-black uppercase tracking-widest bg-gray-50 border border-gray-200 px-3 py-1 focus:outline-none focus:border-accent"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-8 py-6">
                  <input 
                    type="text"
                    placeholder="Tracking #"
                    value={order.trackingNumber || ''}
                    onBlur={(e) => onUpdate(order.id, { trackingNumber: e.target.value })}
                    className="text-[9px] font-black uppercase tracking-widest bg-gray-50 border border-gray-200 px-3 py-1 w-32 focus:outline-none focus:border-accent"
                  />
                </td>
                <td className="px-8 py-6 text-right font-black">₦{order.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
