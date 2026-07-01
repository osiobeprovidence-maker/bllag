import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Filter, Download, ChevronRight, Activity } from 'lucide-react';
import { Order } from '../../store';
import { EmptyState } from '../ui/EmptyState';

interface OverviewSectionProps {
  stats: any[];
  orders: Order[];
}

export function OverviewSection({ stats, orders }: OverviewSectionProps) {
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-12">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-accent/5"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3 bg-gray-50 text-primary group-hover:bg-accent group-hover:text-white transition-colors">
                <stat.icon className="h-5 w-5" />
              </div>
              <div className={`flex items-center text-[10px] font-black px-2 py-1 ${
                stat.trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.name}</p>
              <h3 className="text-3xl font-black tracking-tighter">{stat.value}</h3>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <button 
          onClick={() => setIsActivityOpen(!isActivityOpen)}
          className="lg:hidden w-full bg-white border border-gray-200 p-5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] shadow-sm"
        >
          Activity & Live Feed
          <ChevronRight className={`h-4 w-4 transition-transform ${isActivityOpen ? 'rotate-90' : ''}`} />
        </button>

        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${isActivityOpen ? 'block' : 'hidden lg:grid'}`}>
          <div className="lg:col-span-2 bg-white border border-gray-100 shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black uppercase tracking-tight">Recent Orders</h2>
              <div className="flex gap-2">
                <button className="p-2 bg-gray-50 hover:bg-gray-100 transition-colors"><Filter className="h-4 w-4" /></button>
                <button className="p-2 bg-gray-50 hover:bg-gray-100 transition-colors"><Download className="h-4 w-4" /></button>
              </div>
            </div>
            {recentOrders.length === 0 ? (
              <EmptyState
                icon={Activity}
                title="No Recent Orders"
                message="Customer orders will appear here as they are placed."
              />
            ) : (
              <div className="space-y-6">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors border-l-2 border-transparent hover:border-accent">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white border border-gray-100 flex items-center justify-center font-black text-xs text-accent">#ORD</div>
                      <div>
                        <p className="text-sm font-black uppercase">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{order.customerName} • {order.shippingAddress?.city || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black">₦{order.total.toLocaleString()}</p>
                      <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">{order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-black uppercase tracking-tight mb-8">Live Feed</h2>
            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
              {orders.length === 0 ? (
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest text-center py-12">No recent activity</p>
              ) : (
                orders.slice(0, 4).map((order, i) => (
                  <div key={order.id} className="flex gap-4 relative z-10">
                    <div className={`w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${
                      order.status === 'delivered' ? 'bg-green-500' : 
                      order.status === 'shipped' ? 'bg-blue-500' : 
                      order.status === 'cancelled' ? 'bg-red-500' : 'bg-accent'
                    }`}></div>
                    <div>
                      <p className="text-xs font-bold leading-tight">Order {order.status}: {order.items.map(i => i.name).join(', ').slice(0, 40)}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="w-full mt-8 py-3 text-[10px] font-black uppercase tracking-widest border border-gray-200 hover:bg-gray-50 transition-colors">
              View System Logs
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
