import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { auth, authPersistenceReady, getAuthErrorMessage } from '../lib/firebase';
import { useAuthStore } from '../store';

export function Login() {
  const [method, setMethod] = useState<'selection' | 'email' | 'magic-link'>('selection');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const sendWelcomeEmail = useAction(api.emails.sendWelcomeEmail);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
      return;
    }

    if (isSignInWithEmailLink(auth, window.location.href)) {
      const savedEmail = window.localStorage.getItem('emailForSignIn');
      if (savedEmail) {
        signInWithEmailLink(auth, savedEmail, window.location.href)
          .then(async (result) => {
            const role = result.user.email === 'riderezzy@gmail.com' ? 'admin' : 'customer';
            setUser({
              name: result.user.displayName || result.user.email?.split('@')[0] || 'User',
              email: result.user.email || '',
              role,
              walletBalance: 50000,
              transactions: [],
              installments: [],
              membership: { level: 'none', status: 'inactive' },
            });
            window.localStorage.removeItem('emailForSignIn');
            sendWelcomeEmail({ email: result.user.email || '', name: result.user.displayName || 'User' });
            navigate('/', { replace: true });
          })
          .catch((err) => {
            console.error('[Auth] Email link sign-in failed:', err);
            setError(getAuthErrorMessage(err, 'Failed to complete sign-in. Try again.'));
          });
      } else {
        setError('Email not found. Please request a new magic link.');
        setMethod('magic-link');
      }
    }
  }, [navigate, setUser, isAuthenticated, sendWelcomeEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await authPersistenceReady;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const role = firebaseUser.email === 'riderezzy@gmail.com' ? 'admin' : 'customer';
      setUser({
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        role: role as any,
        walletBalance: 50000,
        transactions: [],
        installments: [],
        membership: { level: 'none', status: 'inactive' },
      });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err, 'Failed to sign in. Please try again.'));
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await authPersistenceReady;
      const result = await signInWithPopup(auth, provider);
      const role = result.user.email === 'riderezzy@gmail.com' ? 'admin' : 'customer';
      setUser({
        name: result.user.displayName || 'User',
        email: result.user.email || '',
        role,
        walletBalance: 50000,
        transactions: [],
        installments: [],
        membership: { level: 'none', status: 'inactive' },
      });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      console.error('[Auth] Google sign-in failed:', err);
      setError(getAuthErrorMessage(err, 'Failed to sign in with Google. Please try again.'));
    }
  };

  const handleSendMagicLink = async () => {
    setError(null);
    if (!email) {
      setError('Enter your email address.');
      return;
    }
    try {
      await authPersistenceReady;
      const actionCodeSettings = {
        url: window.location.origin + '/login',
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setEmailSent(true);
    } catch (err: unknown) {
      console.error('[Auth] sendSignInLinkToEmail failed:', err);
      setError(getAuthErrorMessage(err, 'Failed to send magic link. Please try again.'));
    }
  };

  if (emailSent) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-muted p-8 border border-gray-200 text-center"
        >
          <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Check Your Email</h1>
          <p className="text-muted-foreground mb-4">We sent a sign-in link to <strong className="text-primary">{email}</strong></p>
          <p className="text-xs text-muted-foreground">Click the link in the email to sign in. It expires in 1 hour.</p>
          <button
            onClick={() => setEmailSent(false)}
            className="mt-8 text-xs font-bold uppercase tracking-widest text-accent hover:underline"
          >
            Send again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-muted p-8 border border-gray-200"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">
            {method === 'selection' ? 'Choose your preferred login method.' : method === 'magic-link' ? 'Enter your email to receive a sign-in link.' : 'Enter your email details to access your account.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-widest">
            {error}
          </div>
        )}

        {method === 'selection' ? (
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-background border border-gray-300 py-4 text-sm font-bold uppercase tracking-widest hover:border-accent transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button
              onClick={() => { setMethod('magic-link'); setError(null); }}
              className="w-full bg-background border border-gray-300 py-4 text-sm font-bold uppercase tracking-widest hover:border-accent transition-colors"
            >
              Send Magic Link
            </button>
            <button
              onClick={() => setMethod('email')}
              className="w-full bg-primary text-primary-foreground py-4 text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors"
            >
              Sign in with Email
            </button>
          </div>
        ) : method === 'magic-link' ? (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => setMethod('selection')}
              className="text-xs font-bold uppercase tracking-widest text-accent hover:underline mb-4"
            >
              ← Back to methods
            </button>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" htmlFor="magic-email">
                Email
              </label>
              <input
                id="magic-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-background border border-gray-300 p-3 focus:outline-none focus:border-accent transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <button
              onClick={handleSendMagicLink}
              className="w-full bg-primary text-primary-foreground py-4 text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors"
            >
              Send Magic Link
            </button>
            <p className="text-[10px] text-muted-foreground text-center">No password needed. We'll email you a sign-in link.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <button 
              type="button"
              onClick={() => setMethod('selection')}
              className="text-xs font-bold uppercase tracking-widest text-accent hover:underline mb-4"
            >
              ← Back to methods
            </button>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-background border border-gray-300 p-3 focus:outline-none focus:border-accent transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-widest" htmlFor="password">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-accent hover:underline">Forgot password?</Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-background border border-gray-300 p-3 focus:outline-none focus:border-accent transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-4 text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors"
            >
              Sign In
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            className="text-primary font-bold hover:text-accent transition-colors"
          >
            Create one
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
