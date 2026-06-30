import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useSignUp } from '@clerk/react';
import { useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuthStore } from '../store';

export function SignUp() {
  const [method, setMethod] = useState<'selection' | 'email'>('selection');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const { signUp, fetchStatus } = useSignUp();
  const upsertUser = useMutation(api.users.upsert);
  const setVerificationToken = useMutation(api.users.setVerificationToken);
  const sendVerificationEmail = useAction(api.emails.sendVerificationEmail);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [navigate, isAuthenticated]);

  const sendVerification = async (userEmail: string, userName: string) => {
    const token = crypto.randomUUID();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    await setVerificationToken({ token, expiresAt });
    await sendVerificationEmail({ email: userEmail, name: userName, token });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!signUp) return;
    try {
      const [firstName, ...lastParts] = name.trim().split(' ');
      const lastName = lastParts.join(' ');
      const result = await signUp.create({ emailAddress: email, password, firstName: firstName || undefined, lastName: lastName || undefined });
      if (result.error) {
        setError(result.error.message);
        return;
      }
      if (signUp.status === 'complete') {
        const role = email === 'riderezzy@gmail.com' ? 'admin' : 'customer';
        await signUp.finalize();
        await upsertUser({ name, email, role, walletBalance: 50000 });
        await sendVerification(email, name);
        navigate('/verify-email');
      } else {
        setError('Please complete all required fields.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create account';
      setError(message);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    if (!signUp) return;
    try {
      await signUp.sso({
        strategy: 'oauth_google',
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectCallbackUrl: `${window.location.origin}/sso-callback`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign-up failed';
      setError(message);
    }
  };

  if (fetchStatus === 'fetching') return null;

  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-muted p-8 border border-gray-200"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Create Account</h1>
          <p className="text-muted-foreground text-sm">
            {method === 'selection' ? 'Choose how you want to join bllag.' : 'Enter your details to create your account.'}
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
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center gap-3 bg-background border border-gray-300 py-4 text-sm font-bold uppercase tracking-widest hover:border-accent transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"/>
              </svg>
              Sign up with Google
            </button>
            <button
              onClick={() => setMethod('email')}
              className="w-full bg-primary text-primary-foreground py-4 text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors"
            >
              Sign up with Email
            </button>
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
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-background border border-gray-300 p-3 focus:outline-none focus:border-accent transition-colors"
                placeholder="John Doe"
              />
            </div>

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
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" htmlFor="password">
                Password
              </label>
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
              Create Account
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-primary font-bold hover:text-accent transition-colors"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
