import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const collections = [
  {
    id: 'summer-breeze',
    name: 'Summer Breeze',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200',
    description: 'Light, airy pieces perfect for the warm weather. Featuring delicate chains and pastel accents.',
  },
  {
    id: 'bold-gold',
    name: 'Bold Gold',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=1200',
    description: 'Make a statement with our chunky gold-plated collection. Perfect for layering and standing out.',
  },
  {
    id: 'minimalist-essentials',
    name: 'Minimalist Essentials',
    image: 'https://images.unsplash.com/photo-1573408302185-9146fe634ad0?auto=format&fit=crop&q=80&w=1200',
    description: 'Everyday staples that never go out of style. Clean lines, simple shapes, maximum impact.',
  },
  {
    id: 'y2k-nostalgia',
    name: 'Y2K Nostalgia',
    image: 'https://images.unsplash.com/photo-1596484552993-37d4e33919da?auto=format&fit=crop&q=80&w=1200',
    description: 'Bring back the early 2000s with butterfly clips, colorful rhinestones, and playful charms.',
  }
];

export function Collections() {
  return (
    <div className="pt-24 pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">Collections</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our curated curations. Each collection tells a unique story through carefully selected pieces designed to elevate your personal style.
          </p>
        </div>

        <div className="space-y-24">
          {collections.map((collection, index) => (
            <motion.div 
              key={collection.id}
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
                  to={`/shop?collection=${collection.id}`} 
                  className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors group"
                >
                  Shop the collection
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
