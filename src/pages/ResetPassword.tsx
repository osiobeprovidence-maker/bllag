import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get('oobCode');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode) {
      setError('Invalid or expired reset link');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!oobCode) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-black uppercase tracking-tight mb-4">Invalid Link</h1>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-8">This password reset link is invalid or has expired.</p>
          <Link to="/forgot-password" className="bg-primary text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-block text-3xl font-black uppercase tracking-tighter mb-8">
            bllag<span className="text-accent italic">.</span>
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-tight mb-3">Set New Password</h1>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest leading-relaxed">
            Create a secure new password for your account
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-muted p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-lg font-black uppercase tracking-tight mb-2">Password Updated</h2>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-4">
              Your password has been successfully reset. Redirecting to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="NEW PASSWORD"
                  className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent transition-all"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="CONFIRM NEW PASSWORD"
                  className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all disabled:opacity-50"
            >
              {isLoading ? 'Resetting Password...' : 'Update Password'}
            </button>

            <Link 
              to="/login" 
              className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors pt-4"
            >
              <ArrowLeft className="h-3 w-3" />
              Cancel and Return
            </Link>
          </form>
        )}
      </motion.div>
    </div>
  );
}
