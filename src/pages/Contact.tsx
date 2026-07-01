import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Phone, AlertCircle, Check, Loader2 } from 'lucide-react';

export function Contact() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !message.trim()) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          const ok = Math.random() > 0.1;
          if (ok) resolve(true);
          else reject(new Error('Failed to send message.'));
        }, 1500);
      });
      setSuccess(true);
      setFirstName('');
      setLastName('');
      setEmail('');
      setMessage('');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-24 pb-24 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Message Sent!</h2>
          <p className="text-muted-foreground mb-8">We'll get back to you within 24 hours.</p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-primary text-primary-foreground px-8 py-4 text-sm uppercase tracking-widest hover:bg-accent transition-colors"
          >
            Send Another
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">Contact Us</h1>
        <p className="text-muted-foreground font-light leading-relaxed">
          Need help? We're here for you. Drop us a line about your order or our daily drops.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
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

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm uppercase tracking-widest text-muted-foreground">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-transparent border-b border-muted py-2 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm uppercase tracking-widest text-muted-foreground">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-transparent border-b border-muted py-2 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm uppercase tracking-widest text-muted-foreground">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-muted py-2 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm uppercase tracking-widest text-muted-foreground">Message</label>
            <textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-transparent border-b border-muted py-2 focus:outline-none focus:border-accent transition-colors resize-none"
            ></textarea>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-primary-foreground px-8 py-4 text-sm uppercase tracking-widest hover:bg-accent transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
