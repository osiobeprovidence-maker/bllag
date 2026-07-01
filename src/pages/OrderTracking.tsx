import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Package, Truck, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuthStore } from '../store';

export function OrderTracking() {
  const { sessionId } = useAuthStore();
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const orders = useQuery(
    api.orders.getBySession,
    isTracking && sessionId ? { sessionId } : 'skip'
  );

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
  };

  const matchedOrder = orders?.find(
    (o) => o.orderNumber === orderId || o.trackingNumber === orderId
  );

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-20">
          <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">Logistics Management</h1>
          <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-6">Track Your Artifact</h2>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest max-w-xl mx-auto leading-relaxed">
            Monitor the journey of your luxury artifacts from our vault to your doorstep in real-time.
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-2">
              <form onSubmit={handleTrack} className="bg-white border border-gray-200 p-8 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Tracking Inquiry</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Order ID</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. #ORD-7829"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 p-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Billing Email</label>
                    <input 
                      type="email" 
                      required
                      placeholder="vault@bllag.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 p-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent transition-all"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-primary text-white py-5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all flex items-center justify-center gap-3"
                  >
                    Locate Shipment
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-3">
              {isTracking ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  {orders === undefined ? (
                    <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-gray-200 bg-gray-50/50">
                      <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Searching for your order...
                      </p>
                    </div>
                  ) : !matchedOrder ? (
                    <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-gray-200 bg-gray-50/50">
                      <Package className="h-16 w-16 text-muted-foreground opacity-20 mb-6" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground max-w-xs">
                        No tracking information found
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-muted p-8 border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                              Status: <span className={matchedOrder.status === 'delivered' ? 'text-green-600' : 'text-accent'}>{matchedOrder.status}</span>
                            </p>
                            <p className="text-lg font-black uppercase tracking-tight">Order #{matchedOrder.orderNumber}</p>
                          </div>
                          <Package className="h-10 w-10 text-muted-foreground opacity-20" />
                        </div>
                        {matchedOrder.status !== 'delivered' && matchedOrder.status !== 'cancelled' && (
                          <>
                            <div className="h-1.5 bg-gray-200 w-full rounded-full overflow-hidden">
                              <div className={`h-full bg-accent ${matchedOrder.status === 'processing' ? 'w-1/3' : matchedOrder.status === 'shipped' ? 'w-2/3' : 'w-1/4'}`}></div>
                            </div>
                            <div className="flex justify-between mt-3 text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                              <span className={matchedOrder.status === 'pending' ? 'text-accent' : ''}>Ordered</span>
                              <span className={matchedOrder.status === 'processing' ? 'text-accent' : ''}>Processing</span>
                              <span className={matchedOrder.status === 'shipped' ? 'text-accent' : ''}>Shipping</span>
                              <span>Delivered</span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-widest border-b border-gray-100 pb-4 flex items-center gap-2">
                          <Truck className="h-4 w-4 text-accent" />
                          Shipment History
                        </h4>
                        <div className="relative space-y-10 pl-6 after:absolute after:left-[7px] after:top-[14px] after:bottom-[14px] after:w-px after:bg-gray-200">
                          <div className="relative">
                            <div className="absolute -left-6 top-1.5 w-4 h-4 bg-accent rounded-full ring-4 ring-accent/10 z-10"></div>
                            <p className="text-[10px] font-black uppercase tracking-widest">Order Confirmed</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{new Date(matchedOrder.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                          {matchedOrder.status !== 'pending' && (
                            <div className="relative">
                              <div className="absolute -left-6 top-1.5 w-4 h-4 bg-gray-300 rounded-full z-10"></div>
                              <p className="text-[10px] font-black uppercase tracking-widest">Processing</p>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{new Date(matchedOrder.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 border border-dashed border-gray-200 bg-gray-50/50">
                  <Package className="h-16 w-16 text-muted-foreground opacity-20 mb-6" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground max-w-xs">
                    Please enter your order details to view your shipment status.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
