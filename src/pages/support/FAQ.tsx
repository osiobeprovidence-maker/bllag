import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, ArrowLeft, Search } from 'lucide-react';

export function FAQ() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [activeId, setActiveId] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      category: 'orders',
      question: 'How do I modify an artifact order after placement?',
      answer: 'Orders enter the vault processing phase within 2 hours. Once processing begins, modifications are restricted. Please contact the concierge immediately if you require changes to your dispatch protocols.'
    },
    {
      id: 2,
      category: 'logistics',
      question: 'What regions do you currently dispatch to?',
      answer: 'We provide global logistics coverage. Standard regions include Nigeria, UK, US, and EU. For remote or highly secured territories, specialized courier protocols may apply.'
    },
    {
      id: 3,
      category: 'financial',
      question: 'How does the installment protocol operate?',
      answer: 'Our "Pay Small Small" protocol allows you to secure an artifact with a 25% deposit. The remaining balance is distributed over 4-12 weeks based on your selected frequency. Artifacts are dispatched once 70% of the total value is realized.'
    },
    {
      id: 4,
      category: 'security',
      question: 'How is my financial data secured?',
      answer: 'All transactions utilize 256-bit AES encryption. We never store raw credit card data on our servers; all financial handshakes are performed via PCI-DSS Level 1 compliant processors.'
    },
    {
      id: 5,
      category: 'returns',
      question: 'What is the return protocol for high-value artifacts?',
      answer: 'High-value artifacts (above ₦500k) require a security seal inspection. If the seal remains intact, you may initiate a return within 7 solar days of delivery. Returns must be dispatched via our authorized security couriers.'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Inquiries' },
    { id: 'orders', name: 'Order Artifacts' },
    { id: 'logistics', name: 'Global Logistics' },
    { id: 'financial', name: 'Financial Protocols' },
    { id: 'security', name: 'Vault Security' },
    { id: 'returns', name: 'Exchanges & Returns' }
  ];

  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all');

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(f => f.category === activeCategory);

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/help-center" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-12"
        >
          <ArrowLeft className="h-3 w-3" />
          Support Hub
        </Link>

        <header className="mb-16">
          <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">Information Repository</h1>
          <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none mb-12">Frequently Asked Questions</h2>
          
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 text-[9px] font-black uppercase tracking-widest border transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-white text-muted-foreground border-gray-200 hover:border-accent'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </header>

        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="bg-white border border-gray-200 overflow-hidden">
              <button 
                onClick={() => setActiveId(activeId === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-8 text-left hover:bg-gray-50 transition-colors group"
              >
                <span className="text-xs font-black uppercase tracking-tight group-hover:text-accent transition-colors">{faq.question}</span>
                {activeId === faq.id ? (
                  <Minus className="h-4 w-4 text-accent" />
                ) : (
                  <Plus className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              
              <AnimatePresence>
                {activeId === faq.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-8 pt-0 text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                      <div className="h-px bg-gray-100 mb-6"></div>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-muted border border-gray-200 text-center">
          <h3 className="text-xl font-black uppercase tracking-tight mb-4">Still Seeking Answers?</h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-8">
            Our concierge team is standing by to assist with complex inquiries.
          </p>
          <Link 
            to="/contact"
            className="inline-block bg-primary text-white px-12 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all"
          >
            Open Ticket
          </Link>
        </div>
      </div>
    </div>
  );
}
