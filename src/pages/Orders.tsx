import { motion } from 'motion/react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { useCustomerData } from '../hooks/useCustomerData';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export function Orders() {
  const { orders, loading } = useCustomerData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Your Orders</h1>
          <p className="text-muted-foreground text-xs font-black uppercase tracking-widest">Track your luxury acquisitions and history</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 border-2 border-dashed border-gray-200">
            <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No orders found</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 overflow-hidden"
              >
                <div className="bg-gray-50 p-6 border-b border-gray-200 flex flex-wrap justify-between items-center gap-6">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Order Placed</p>
                      <p className="text-[10px] font-black uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Amount</p>
                      <p className="text-[10px] font-black uppercase tracking-widest">₦{order.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Order ID</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-accent">#{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>

                <div className="p-8">
                  <div className="space-y-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-6 items-center">
                        <img referrerPolicy="no-referrer" src={item.image} alt={item.name} className="w-20 h-20 object-cover grayscale hover:grayscale-0 transition-all shadow-sm" />
                        <div className="flex-1">
                          <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">{item.name}</h4>
                          <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest">₦{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.trackingNumber && (
                    <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-accent" />
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Tracking Number</p>
                          <p className="text-[10px] font-black uppercase tracking-widest">{order.trackingNumber}</p>
                        </div>
                      </div>
                      <button className="text-[9px] font-black uppercase tracking-widest text-accent hover:underline">Track Shipment</button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
