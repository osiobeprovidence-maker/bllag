import { motion } from 'motion/react';
import { Mail, MapPin, Phone } from 'lucide-react';

export function Contact() {
  return (
    <div className="pt-24 pb-24 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">Contact Us</h1>
        <p className="text-muted-foreground font-light leading-relaxed">
          Need help? We're here for you. Drop us a line about your order or our daily drops.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
        {/* Contact Info */}
        <div className="space-y-12">
          <div className="flex items-start space-x-4">
            <Mail className="h-6 w-6 mt-1 text-accent" />
            <div>
              <h3 className="text-lg font-bold uppercase mb-2">Email</h3>
              <p className="text-muted-foreground font-light mb-1">For general inquiries:</p>
              <a href="mailto:hello@bllag.com" className="hover:text-accent transition-colors font-bold">hello@bllag.com</a>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Phone className="h-6 w-6 mt-1 text-accent" />
            <div>
              <h3 className="text-lg font-bold uppercase mb-2">Phone</h3>
              <p className="text-muted-foreground font-light mb-1">Mon-Fri, 9am - 5pm EST</p>
              <a href="tel:+1234567890" className="hover:text-accent transition-colors font-bold">+1 (234) 567-890</a>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <MapPin className="h-6 w-6 mt-1 text-accent" />
            <div>
              <h3 className="text-lg font-bold uppercase mb-2">Studio</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                bllag Global HQ<br />
                Fashion District<br />
                Los Angeles, CA 90015
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm uppercase tracking-widest text-muted-foreground">First Name</label>
              <input 
                type="text" 
                id="firstName"
                className="w-full bg-transparent border-b border-muted py-2 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm uppercase tracking-widest text-muted-foreground">Last Name</label>
              <input 
                type="text" 
                id="lastName"
                className="w-full bg-transparent border-b border-muted py-2 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm uppercase tracking-widest text-muted-foreground">Email</label>
            <input 
              type="email" 
              id="email"
              className="w-full bg-transparent border-b border-muted py-2 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm uppercase tracking-widest text-muted-foreground">Message</label>
            <textarea 
              id="message"
              rows={4}
              className="w-full bg-transparent border-b border-muted py-2 focus:outline-none focus:border-accent transition-colors resize-none"
            ></textarea>
          </div>

          <button 
            type="submit"
            className="bg-primary text-primary-foreground px-8 py-4 text-sm uppercase tracking-widest hover:bg-accent transition-colors w-full sm:w-auto"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
