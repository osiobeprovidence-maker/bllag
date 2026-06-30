import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuthStore } from '../store';
import { auth } from '../lib/firebase';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const verifyEmail = useMutation(api.users.verifyEmail);
  const setVerificationToken = useMutation(api.users.setVerificationToken);
  const sendVerificationEmail = useAction(api.emails.sendVerificationEmail);
  const [status, setStatus] = useState<'pending' | 'verifying' | 'verified' | 'error'>('pending');
  const [message, setMessage] = useState('');

  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');

  useEffect(() => {
    if (token && emailParam) {
      setStatus('verifying');
      verifyEmail({ token, email: decodeURIComponent(emailParam) })
        .then((result) => {
          if (result.verified) {
            setStatus('verified');
            setMessage('Your email has been verified!');
            if (user) {
              setUser({ ...user, emailVerified: true });
            }
            setTimeout(() => navigate('/', { replace: true }), 3000);
          }
        })
        .catch((err) => {
          setStatus('error');
          setMessage(err.message || 'Verification failed');
        });
    } else {
      setStatus('pending');
      setMessage('Check your inbox for the verification email.');
    }
  }, [token, emailParam, verifyEmail, navigate, user, setUser]);

  const handleResend = async () => {
    if (!auth.currentUser || !user) {
      setMessage('You must be logged in to resend verification.');
      return;
    }
    try {
      const newToken = crypto.randomUUID();
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
      await setVerificationToken({ firebaseUid: auth.currentUser.uid, token: newToken, expiresAt });
      await sendVerificationEmail({ email: user.email, name: user.name, token: newToken });
      setMessage('Verification email sent! Check your inbox.');
    } catch (err: any) {
      setMessage(err.message || 'Failed to resend verification.');
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-muted p-8 border border-gray-200 text-center"
      >
        {status === 'verifying' && (
          <>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Verifying...</h1>
            <p className="text-muted-foreground">Please wait while we verify your email.</p>
          </>
        )}

        {status === 'verified' && (
          <>
            <div className="text-4xl mb-4">✓</div>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Email Verified</h1>
            <p className="text-muted-foreground mb-4">{message}</p>
            <p className="text-xs text-muted-foreground">Redirecting to home...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-4xl mb-4">✕</div>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Verification Failed</h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={handleResend}
                className="w-full bg-primary text-primary-foreground py-4 text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors"
              >
                Resend Verification Email
              </button>
              <button
                onClick={() => navigate('/', { replace: true })}
                className="w-full bg-background border border-gray-300 py-4 text-sm font-bold uppercase tracking-widest hover:border-accent transition-colors"
              >
                Go Home
              </button>
            </div>
          </>
        )}

        {status === 'pending' && !token && (
          <>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Check Your Email</h1>
            <p className="text-muted-foreground mb-4">{message}</p>
            <button
              onClick={handleResend}
              className="w-full bg-primary text-primary-foreground py-4 text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors"
            >
              Resend Verification Email
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
