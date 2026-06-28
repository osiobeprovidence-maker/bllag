import { motion } from 'motion/react';
import { Bell, CheckCircle, Info, Package, X } from 'lucide-react';
import { useCustomerData } from '../hooks/useCustomerData';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export function Notifications() {
  const { notifications, loading, markNotificationAsRead } = useCustomerData();

  const getIcon = (type: string) => {
    switch (type) {
      case 'order_update': return <Package className="h-4 w-4" />;
      case 'promotion': return <CheckCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-6 py-24">
        <div className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Notifications</h1>
          <p className="text-muted-foreground text-xs font-black uppercase tracking-widest">Stay updated with your orders and special offers</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 border-2 border-dashed border-gray-200">
            <Bell className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No notifications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <motion.div 
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-6 border ${notification.read ? 'bg-white border-gray-100 opacity-60' : 'bg-gray-50 border-gray-200'} relative group transition-all`}
              >
                {!notification.read && (
                  <button 
                    onClick={() => markNotificationAsRead(notification.id)}
                    className="absolute top-4 right-4 text-accent hover:text-primary transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                )}
                
                <div className="flex gap-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.read ? 'bg-gray-100 text-gray-400' : 'bg-accent/10 text-accent'}`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">{notification.title}</h4>
                    <p className="text-xs font-bold leading-relaxed mb-2">{notification.message}</p>
                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">{new Date(notification.createdAt).toLocaleString()}</p>
                  </div>
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
