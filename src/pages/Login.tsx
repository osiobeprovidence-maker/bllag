import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Mail, CheckCircle2 } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const sendMagicLink = useAction(api.auth.sendMagicLink);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const result = await sendMagicLink({ email });
      if (result.sent) {
        setSent(true);
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
            {sent ? 'Check Your Email' : 'Sign In'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {sent
              ? 'We sent you a magic link. Click it to sign in instantly.'
              : 'Enter your email to receive a magic sign-in link.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-widest">
            {error}
          </div>
        )}

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Magic link sent to <strong className="text-primary">{email}</strong>
            </p>
            <p className="text-xs text-muted-foreground mb-8">
              Expires in 15 minutes. No password needed.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(''); }}
              className="text-xs font-bold uppercase tracking-widest text-accent hover:underline"
            >
              Send to a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full bg-primary text-primary-foreground py-5 text-xs font-bold uppercase tracking-widest hover:bg-accent transition-all disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-accent hover:underline">Terms</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
