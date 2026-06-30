import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuthStore } from '../store';

export function AuthVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setSessionId = useAuthStore((s) => s.setSessionId);
  const verifyMagicLink = useMutation(api.auth.verifyMagicLink);
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');
  const redirectParam = searchParams.get('redirect');

  useEffect(() => {
    if (!token || !emailParam) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    verifyMagicLink({ token, email: decodeURIComponent(emailParam) })
      .then((result) => {
        setSessionId(result.sessionId);
        setUser(result.user as any);
        setStatus('success');
        setMessage('Signed in successfully!');
        const target = redirectParam ? `/${redirectParam}` : '/';
        setTimeout(() => navigate(target, { replace: true }), 1500);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Verification failed');
      });
  }, [token, emailParam, redirectParam, verifyMagicLink, navigate, setUser, setSessionId]);

  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-muted p-8 border border-gray-200 text-center"
      >
        {status === 'verifying' && (
          <>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Signing you in...</h1>
            <p className="text-muted-foreground">Please wait while we verify your link.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-4xl mb-4">✓</div>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Signed In</h1>
            <p className="text-muted-foreground">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-4xl mb-4">✕</div>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Link Invalid</h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="w-full bg-primary text-primary-foreground py-4 text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors"
            >
              Request New Link
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
