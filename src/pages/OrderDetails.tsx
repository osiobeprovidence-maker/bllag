import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Package, MapPin, CreditCard, ChevronRight, Download } from 'lucide-react';
import { useAuthStore } from '../store';

export function OrderDetails() {
  const { id } = useParams();
  const { user } = useAuthStore();
  
  // Mock order for now - in a real app, you'd fetch this from Firestore
  const order = {
    id: id || '#ORD-7829',
    date: 'October 12, 2023',
    status: 'Delivered',
    total: 24500,
    items: [
      { id: '1', name: 'Royal Gold Chain', price: 15000, quantity: 1, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop' },
      { id: '2', name: 'Diamond Studs', price: 9500, quantity: 1, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop' }
    ],
    address: {
      street: '12 Luxury Way',
      city: 'Victoria Island',
      state: 'Lagos',
      zip: '101241',
      country: 'Nigeria'
    },
    payment: {
      method: 'Visa ending in 4242',
      subtotal: 24500,
      shipping: 0,
      tax: 0
    }
  };

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
              <h1 className="text-3xl font-black uppercase tracking-tighter">Order {order.id}</h1>
              <span className="bg-green-500 text-white px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full">
                {order.status}
              </span>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Placed on {order.date}
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
                {order.items.map((item) => (
                  <div key={item.id} className="p-6 flex gap-6">
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
                <div className="relative space-y-12 after:absolute after:left-[7px] after:top-[14px] after:bottom-[14px] after:w-px after:bg-gray-200">
                  <div className="relative pl-8 flex items-start gap-4">
                    <div className="absolute left-0 top-1.5 w-4 h-4 bg-accent rounded-full ring-4 ring-accent/10 z-10"></div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1">Delivered</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Lagos, NG — Oct 14, 2023 at 2:45 PM</p>
                    </div>
                  </div>
                  <div className="relative pl-8 flex items-start gap-4 opacity-50">
                    <div className="absolute left-0 top-1.5 w-4 h-4 bg-gray-300 rounded-full z-10"></div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1">Out for Delivery</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Lagos, NG — Oct 14, 2023 at 9:12 AM</p>
                    </div>
                  </div>
                </div>
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
                <p>{user?.name || 'Customer Name'}</p>
                <p className="text-muted-foreground">{order.address.street}</p>
                <p className="text-muted-foreground">{order.address.city}, {order.address.state}</p>
                <p className="text-muted-foreground">{order.address.zip}, {order.address.country}</p>
              </div>
            </section>

            <section className="bg-white border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="h-4 w-4 text-accent" />
                <h2 className="text-xs font-black uppercase tracking-widest">Payment Method</h2>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest leading-loose text-muted-foreground">
                <p className="text-primary">{order.payment.method}</p>
                <div className="h-px bg-gray-100 my-4"></div>
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span className="text-primary">₦{order.payment.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span className="text-primary">Free</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <span className="text-primary">Total Paid</span>
                  <span className="text-primary text-sm font-black">₦{order.total.toLocaleString()}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
