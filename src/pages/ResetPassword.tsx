import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useSignIn } from '@clerk/react';
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

export function ResetPassword() {
  const navigate = useNavigate();
  const { signIn } = useSignIn();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'code' | 'password'>('code');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await signIn.resetPasswordEmailCode.sendCode();
      if (result.error) {
        setError(result.error.message);
        return;
      }
      setStep('password');
    } catch (err: any) {
      setError(err.message || 'Failed to send code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!signIn) return;
    setIsLoading(true);
    setError(null);
    try {
      const verifyResult = await signIn.resetPasswordEmailCode.verifyCode({ code });
      if (verifyResult.error) {
        setError(verifyResult.error.message);
        return;
      }
      const submitResult = await signIn.resetPasswordEmailCode.submitPassword({ password });
      if (submitResult.error) {
        setError(submitResult.error.message);
        return;
      }
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="bg-muted p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-lg font-black uppercase tracking-tight mb-2">Password Updated</h2>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-4">
              Your password has been successfully reset. Redirecting to login...
            </p>
          </div>
        </motion.div>
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
          <h1 className="text-2xl font-black uppercase tracking-tight mb-3">
            {step === 'code' ? 'Check Your Email' : 'Set New Password'}
          </h1>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest leading-relaxed">
            {step === 'code' ? 'Enter the recovery code sent to your email' : 'Create a secure new password'}
          </p>
        </div>

        <form onSubmit={step === 'code' ? handleSendCode : handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest">
              {error}
            </div>
          )}
          
          {step === 'code' ? (
            <>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="RECOVERY CODE"
                  className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent transition-all"
                />
              </div>
              <button 
                type="submit"
                disabled={isLoading || !signIn}
                className="w-full bg-primary text-white py-5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>
            </>
          ) : (
            <>
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
                disabled={isLoading || !signIn}
                className="w-full bg-primary text-white py-5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all disabled:opacity-50"
              >
                {isLoading ? 'Resetting Password...' : 'Update Password'}
              </button>
            </>
          )}

          <Link 
            to="/login" 
            className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors pt-4"
          >
            <ArrowLeft className="h-3 w-3" />
            Cancel and Return
          </Link>
        </form>
      </motion.div>
    </div>
  );
}
