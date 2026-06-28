import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setIsSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-block text-3xl font-black uppercase tracking-tighter mb-8">
            BLAG<span className="text-accent italic">.</span>
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-tight mb-3">Recover Access</h1>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest leading-relaxed">
            Enter your email to receive a recovery link
          </p>
        </div>

        {isSent ? (
          <div className="bg-muted p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-lg font-black uppercase tracking-tight mb-2">Check your inbox</h2>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8">
              We've sent recovery instructions to <strong>{email}</strong>
            </p>
            <Link 
              to="/login"
              className="block w-full bg-primary text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest">
                {error}
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL ADDRESS"
                className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent transition-all"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all disabled:opacity-50"
            >
              {isLoading ? 'Processing Access...' : 'Send Recovery Link'}
            </button>

            <Link 
              to="/login" 
              className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors pt-4"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Login
            </Link>
          </form>
        )}
      </motion.div>
    </div>
  );
}
