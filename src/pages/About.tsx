import { motion } from 'motion/react';

export function About() {
  return (
    <div className="pt-24 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-8"
        >
          Our Story
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="aspect-[2/1] bg-muted mb-16 overflow-hidden"
        >
          <img 
            referrerPolicy="no-referrer"
            src="https://images.unsplash.com/photo-1598560917805-e2042217c458?auto=format&fit=crop&q=80&w=2000" 
            alt="Studio" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="space-y-12 text-left max-w-2xl mx-auto font-light leading-relaxed text-muted-foreground text-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold uppercase tracking-tight text-primary mb-4">Fast & Trendy</h2>
            <p>
              Founded in 2024, bllag is your one-stop destination for the hottest jewelry trends. 
              We believe looking amazing shouldn't cost a fortune. That's why we drop new styles daily, straight from the runway to your cart.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold uppercase tracking-tight text-primary mb-4">Unbeatable Prices</h2>
            <p>
              By cutting out the middlemen and working directly with manufacturers, we bring you the latest aesthetic without the insane markups.
              Our mission is to make style accessible to everyone.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold uppercase tracking-tight text-primary mb-4">Our Vibe</h2>
            <p>
              We embrace bold, fast, and unapologetic fashion. Whether you need an accessory for a festival, a night out, or just daily wear, bllag has you covered. Stack it, layer it, own it.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
