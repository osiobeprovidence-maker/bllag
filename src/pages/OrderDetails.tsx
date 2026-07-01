import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Package, MapPin, CreditCard, ChevronRight, Download, Loader2 } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const order = useQuery(api.orders.getById, id ? { id: id as any } : 'skip');

  if (!order && order !== null) {
    return (
      <div className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center py-20">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center py-20">
          <Package className="h-16 w-16 mx-auto mb-6 text-gray-300" />
          <h1 className="text-2xl font-black uppercase tracking-tight mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-8">This order does not exist or has been removed.</p>
          <Link to="/orders" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors">
            <ArrowLeft className="h-3 w-3" />
            Return to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/orders" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-12"
        >
          <ArrowLeft className="h-3 w-3" />
          Return to Orders
        </Link>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-black uppercase tracking-tighter">Order {order.orderNumber}</h1>
              <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full ${
                order.status === 'Delivered' ? 'bg-green-500 text-white' :
                order.status === 'Shipped' ? 'bg-blue-500 text-white' :
                order.status === 'Processing' ? 'bg-amber-500 text-white' :
                'bg-gray-500 text-white'
              }`}>
                {order.status}
              </span>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-6 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
            <Download className="h-4 w-4" />
            Download Invoice
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section className="bg-white border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <Package className="h-4 w-4 text-accent" />
                <h2 className="text-xs font-black uppercase tracking-widest">Items Purchased</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="p-6 flex gap-6">
                    <div className="w-20 h-20 bg-[#F8F9FA] overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-[10px] font-black uppercase tracking-widest mb-1">{item.name}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Quantity: {item.quantity}</p>
                      <p className="text-xs font-bold">₦{item.price.toLocaleString()}</p>
                    </div>
                    <button className="text-[8px] font-black uppercase tracking-widest text-accent self-center hover:underline">
                      Write Review
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <Package className="h-4 w-4 text-accent" />
                <h2 className="text-xs font-black uppercase tracking-widest">Tracking Status</h2>
              </div>
              <div className="p-8">
                {order.trackingNumber ? (
                  <div className="relative space-y-12 after:absolute after:left-[7px] after:top-[14px] after:bottom-[14px] after:w-px after:bg-gray-200">
                    <div className="relative pl-8 flex items-start gap-4">
                      <div className="absolute left-0 top-1.5 w-4 h-4 bg-accent rounded-full ring-4 ring-accent/10 z-10"></div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1">{order.status}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Tracking: {order.trackingNumber}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-10 w-10 mx-auto mb-4 text-gray-300" />
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">No tracking information available yet.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-white border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="h-4 w-4 text-accent" />
                <h2 className="text-xs font-black uppercase tracking-widest">Shipping Address</h2>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest leading-loose">
                <p>{order.customerName}</p>
                <p className="text-muted-foreground">{order.shippingAddress?.street}</p>
                <p className="text-muted-foreground">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                <p className="text-muted-foreground">{order.shippingAddress?.zipCode}, {order.shippingAddress?.country}</p>
              </div>
            </section>

            <section className="bg-white border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="h-4 w-4 text-accent" />
                <h2 className="text-xs font-black uppercase tracking-widest">Payment Summary</h2>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest leading-loose text-muted-foreground">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span className="text-primary">₦{(order.subtotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span className="text-primary">{order.shipping === 0 ? 'Free' : `₦${(order.shipping || 0).toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <span className="text-primary">Total Paid</span>
                  <span className="text-primary text-sm font-black">₦{(order.total || 0).toLocaleString()}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
