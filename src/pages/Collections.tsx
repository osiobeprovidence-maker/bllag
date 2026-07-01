import { useQuery } from 'convex/react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../../convex/_generated/api';

export function Collections() {
  const collections = useQuery(api.collections.list);

  return (
    <div className="pt-24 pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">Collections</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our curated curations. Each collection tells a unique story through carefully selected pieces designed to elevate your personal style.
          </p>
        </div>

        {collections === undefined ? (
          <div className="text-center py-20">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Loading collections...</p>
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-200">
            <p className="text-muted-foreground text-lg mb-4">No collections available yet.</p>
            <p className="text-sm text-muted-foreground">Check back soon for new drops.</p>
          </div>
        ) : (
          <div className="space-y-24">
            {collections.map((collection: any, index: number) => (
              <motion.div 
                key={collection._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="w-full md:w-1/2 aspect-[4/5] md:aspect-square relative overflow-hidden bg-muted group">
                  <img 
                    referrerPolicy="no-referrer"
                    src={collection.image} 
                    alt={collection.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <h2 className="text-3xl font-black uppercase tracking-tight mb-6">{collection.name}</h2>
                  <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                    {collection.description}
                  </p>
                  <Link 
                    to={`/shop?collection=${collection._id}`} 
                    className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors group"
                  >
                    Shop the collection
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
