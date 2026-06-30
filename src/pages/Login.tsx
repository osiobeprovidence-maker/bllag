import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuthStore } from '../store';
import { Mail, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export function Login() {
  const [step, setStep] = useState<'email' | 'password' | 'magic-link-sent'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const sendMagicLink = useAction(api.auth.sendMagicLink);
  const loginWithPassword = useMutation(api.auth.loginWithPassword);
  const setUser = useAuthStore((s) => s.setUser);
  const setSessionId = useAuthStore((s) => s.setSessionId);
  const passwordStatus = useQuery(api.auth.checkUserPasswordStatus,
    step === 'email' && email.includes('@') ? { email } : 'skip');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [navigate, isAuthenticated]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordStatus) {
      setError('Checking account...');
      return;
    }
    if (passwordStatus.hasPassword) {
      setStep('password');
    } else {
      handleSendMagicLink();
    }
  };

  const handleSendMagicLink = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await sendMagicLink({ email });
      if (result.sent) {
        setStep('magic-link-sent');
      } else {
        setError('Failed to send magic link. Please try again.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send magic link';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const result = await loginWithPassword({ email, password });
      setSessionId(result.sessionId);
      setUser(result.user as any);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      if (message === 'no_password') {
        setStep('email');
        setError('This account uses Magic Link login.');
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-muted p-8 border border-gray-200"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2">
            {step === 'email' && 'Sign In'}
            {step === 'password' && 'Enter Password'}
            {step === 'magic-link-sent' && 'Check Your Email'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {step === 'email' && 'Enter your email to continue.'}
            {step === 'password' && `Welcome back, ${email}`}
            {step === 'magic-link-sent' && 'Magic link sent! Click it to sign in.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-widest">
            {error}
          </div>
        )}

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL ADDRESS"
                className="w-full bg-background border border-gray-300 pl-12 pr-4 py-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-5 text-xs font-bold uppercase tracking-widest hover:bg-accent transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Checking...' : 'Continue'} <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-center text-xs text-muted-foreground">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-accent hover:underline">Terms</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
            </p>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <button
              type="button"
              onClick={() => setStep('email')}
              className="text-xs font-bold uppercase tracking-widest text-accent hover:underline mb-4 block"
            >
              ← Use a different email
            </button>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PASSWORD"
                className="w-full bg-background border border-gray-300 pl-12 pr-12 py-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent text-[10px] font-bold uppercase tracking-widest"
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-5 text-xs font-bold uppercase tracking-widest hover:bg-accent transition-all disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={handleSendMagicLink}
                className="text-xs font-bold uppercase tracking-widest text-accent hover:underline"
              >
                Send magic link instead
              </button>
            </div>
          </form>
        )}

        {step === 'magic-link-sent' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Magic link sent to <strong className="text-primary">{email}</strong>
            </p>
            <p className="text-xs text-muted-foreground mb-8">
              Expires in 15 minutes.
            </p>
            <button
              onClick={() => { setStep('email'); setEmail(''); setError(null); }}
              className="text-xs font-bold uppercase tracking-widest text-accent hover:underline"
            >
              Use a different email
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
