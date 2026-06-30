import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuthStore } from '../store';
import { Shield, Lock, Eye, EyeOff, Save, CheckCircle2, ArrowLeft } from 'lucide-react';

export function Security() {
  const { isAuthenticated, user, sessionId } = useAuthStore();
  const setPassword = useMutation(api.auth.setPassword);
  const changePassword = useMutation(api.auth.changePassword);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const hasPassword = user.hasPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError('Password must contain an uppercase letter.');
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      setError('Password must contain a lowercase letter.');
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setError('Password must contain a number.');
      return;
    }

    setIsLoading(true);
    try {
      if (hasPassword) {
        await changePassword({ sessionId: sessionId!, currentPassword, newPassword });
      } else {
        await setPassword({ sessionId: sessionId!, password: newPassword });
      }
      setSuccess(hasPassword ? 'Password updated successfully.' : 'Password created successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save password.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/settings"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-12"
        >
          <ArrowLeft className="h-3 w-3" />
          System Settings
        </Link>

        <header className="mb-16">
          <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">Encryption Protocols</h1>
          <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none">Vault Security</h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white border border-gray-200 p-8 lg:p-12">
              <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                <Lock className="h-4 w-4 text-accent" />
                {hasPassword ? 'Change Password' : 'Create Password'}
              </h3>

              {!hasPassword && (
                <div className="mb-8 p-4 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                  You are using Magic Link login. Creating a password lets you sign in with email + password as well.
                </div>
              )}

              {success && (
                <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold uppercase tracking-widest">
                    {error}
                  </div>
                )}

                {hasPassword && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="w-full bg-gray-50 border border-gray-200 px-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent"
                      >
                        {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {hasPassword ? 'New Password' : 'Password'}
                    </label>
                    <div className="relative">
                      <input
                        type={showNew ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={8}
                        className="w-full bg-gray-50 border border-gray-200 px-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent"
                      >
                        {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed space-y-1">
                  <p className={newPassword.length >= 8 ? 'text-green-600' : ''}>• At least 8 characters</p>
                  <p className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>• One uppercase letter</p>
                  <p className={/[a-z]/.test(newPassword) ? 'text-green-600' : ''}>• One lowercase letter</p>
                  <p className={/[0-9]/.test(newPassword) ? 'text-green-600' : ''}>• One number</p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary text-white px-8 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? 'Saving...' : hasPassword ? 'Update Password' : 'Create Password'}
                </button>
              </form>
            </section>

            <section className="bg-white border border-gray-200 p-8 lg:p-12">
              <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                <Shield className="h-4 w-4 text-accent" />
                Login Methods
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-gray-50 border border-gray-100">
                  <div>
                    <h4 className="text-[10px] font-black tracking-tight mb-1">Magic Link</h4>
                    <p className="text-[9px] font-bold text-muted-foreground tracking-widest">Always available</p>
                  </div>
                  <span className="text-[9px] font-black bg-green-100 text-green-700 px-3 py-1">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between p-6 bg-gray-50 border border-gray-100">
                  <div>
                    <h4 className="text-[10px] font-black tracking-tight mb-1">Email + Password</h4>
                    <p className="text-[9px] font-bold text-muted-foreground tracking-widest">
                      {hasPassword ? 'Enabled' : 'Not set up'}
                    </p>
                  </div>
                  <span className={`text-[9px] font-black px-3 py-1 ${hasPassword ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                    {hasPassword ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-muted p-8 border border-gray-200">
              <h3 className="text-xs font-black uppercase tracking-widest mb-4">Security Level</h3>
              <div className="flex items-center gap-2 mb-6">
                <div className={`h-1.5 flex-1 rounded-full ${hasPassword ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                <div className={`h-1.5 flex-1 rounded-full ${hasPassword ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                <div className="h-1.5 flex-1 bg-gray-200 rounded-full"></div>
                <div className="h-1.5 flex-1 bg-gray-200 rounded-full"></div>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                Your vault security is <span className="text-primary">{hasPassword ? 'Standard' : 'Basic'}</span>.
                {!hasPassword && ' Set a password to increase protection.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
