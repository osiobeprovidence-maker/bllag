import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuthStore } from '../store';

type Step = 'choose' | 'magic-link' | 'magic-link-sent' | 'password' | 'forgot-password';

export function Login() {
  const [step, setStep] = useState<Step>('choose');
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

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [navigate, isAuthenticated]);

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
      setError(err instanceof Error ? err.message : 'Failed to send magic link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    handleSendMagicLink();
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    handleSendMagicLink();
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
        setError('No password set for this account. Use the magic link option instead.');
      } else if (message === 'No account found with this email.') {
        setError('No account found with this email.');
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stepTitle: Record<Step, string> = {
    choose: 'Sign In',
    'magic-link': 'Sign In',
    'magic-link-sent': 'Check your email',
    password: 'Sign In',
    'forgot-password': 'Reset your password',
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-24">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm"
      >
        <div className="bg-zinc-900 rounded-lg p-12">
          <h1 className="text-3xl font-bold text-white mb-7">
            {stepTitle[step]}
          </h1>

          {error && (
            <div className="bg-[#E87C03] bg-opacity-20 border border-[#E87C03] rounded p-3 mb-4">
              <p className="text-[#E87C03] text-sm">{error}</p>
            </div>
          )}

          {step === 'choose' && (
            <div>
              <p className="text-sm text-zinc-400 mb-8">
                Choose how you'd like to sign in.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => setStep('magic-link')}
                  className="w-full bg-[#E50914] hover:bg-[#f6121d] text-white font-semibold rounded py-3.5 text-sm transition-colors"
                >
                  Continue with Magic Link
                </button>
                <p className="text-center text-xs text-zinc-500 uppercase tracking-wider">or</p>
                <button
                  onClick={() => setStep('password')}
                  className="w-full border border-zinc-600 hover:border-zinc-500 text-white font-semibold rounded py-3.5 text-sm transition-colors"
                >
                  Sign in with Password
                </button>
              </div>
              <p className="text-xs text-zinc-500 mt-8 leading-relaxed">
                By signing in, you agree to our{' '}
                <Link to="/terms" className="text-zinc-400 hover:underline">Terms of Use</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-zinc-400 hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          )}

          {step === 'magic-link' && (
            <div>
              <p className="text-sm text-zinc-400 mb-6">
                Receive a secure sign-in link in your email.
              </p>
              <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-zinc-800 text-white border border-zinc-700 rounded px-4 py-3.5 text-sm focus:outline-none focus:border-white transition-colors placeholder:text-zinc-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#E50914] hover:bg-[#f6121d] text-white font-semibold rounded py-3 text-sm transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send Magic Link'}
                </button>
              </form>
              <div className="mt-6 text-center">
                <button
                  onClick={() => { setStep('choose'); setError(null); }}
                  className="text-zinc-400 text-sm hover:underline"
                >
                  Back to sign in options
                </button>
              </div>
            </div>
          )}

          {step === 'magic-link-sent' && (
            <div>
              <div className="bg-zinc-800 rounded p-4 mb-6">
                <p className="text-sm text-zinc-300 mb-1">
                  We've sent a secure sign-in link to <span className="text-white font-medium">{email}</span>.
                </p>
                <p className="text-xs text-zinc-500">Expires in 15 minutes.</p>
              </div>
              <div className="text-center space-y-3">
                <button
                  onClick={handleSendMagicLink}
                  disabled={isLoading}
                  className="text-zinc-400 text-sm hover:underline"
                >
                  Resend email
                </button>
                <div>
                  <button
                    onClick={() => { setStep('choose'); setEmail(''); setError(null); }}
                    className="text-zinc-400 text-sm hover:underline"
                  >
                    Back to sign in options
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-zinc-800 text-white border border-zinc-700 rounded px-4 py-3.5 text-sm focus:outline-none focus:border-white transition-colors placeholder:text-zinc-500"
                />
              </div>
              <div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-zinc-800 text-white border border-zinc-700 rounded px-4 py-3.5 text-sm focus:outline-none focus:border-white transition-colors placeholder:text-zinc-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 mt-1.5 ml-1"
                >
                  {showPassword ? 'Hide' : 'Show'} password
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#E50914] hover:bg-[#f6121d] text-white font-semibold rounded py-3 text-sm transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => { setStep('forgot-password'); setError(null); setEmail(email); }}
                  className="text-zinc-400 text-sm hover:underline"
                >
                  Forgot Password?
                </button>
                <button
                  type="button"
                  onClick={() => { setStep('choose'); setError(null); }}
                  className="text-zinc-400 text-sm hover:underline"
                >
                  Use Magic Link Instead
                </button>
              </div>
            </form>
          )}

          {step === 'forgot-password' && (
            <div>
              <p className="text-sm text-zinc-400 mb-6">
                Enter your email and we'll send you a link to create a new password.
              </p>
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-zinc-800 text-white border border-zinc-700 rounded px-4 py-3.5 text-sm focus:outline-none focus:border-white transition-colors placeholder:text-zinc-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#E50914] hover:bg-[#f6121d] text-white font-semibold rounded py-3 text-sm transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <div className="mt-6 text-center">
                <button
                  onClick={() => { setStep('password'); setError(null); }}
                  className="text-zinc-400 text-sm hover:underline"
                >
                  Back to sign in
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
