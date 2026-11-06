'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import { useRyve } from '@/lib/store';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const { addToast } = useRyve();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (!email.trim()) {
        throw new Error('Please enter your email address.');
      }
      if (!password) {
        throw new Error('Please enter your password.');
      }

      const res = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
        rememberMe,
      });

      if (res.error) {
        let msg = res.error.message || 'Invalid email or password.';
        if (msg.includes('PostgresError') || msg.includes('authentication failed')) {
          msg = 'Database connection error. Please verify database credentials in .env.';
        }
        throw new Error(msg);
      }

      setSuccessMessage('Authenticated successfully! Entering control plane...');
      addToast({
        type: 'success',
        title: 'Signed in successfully',
        description: `Welcome back, ${email}`,
      });

      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setErrorMessage(msg);
      addToast({
        type: 'error',
        title: 'Sign In Failed',
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-zinc-200/90 rounded-2xl shadow-xl shadow-zinc-950/5 overflow-hidden flex flex-col transition-all">
      {/* Identity Brand Header */}
      <div className="p-8 pb-6 bg-gradient-to-b from-zinc-50/80 to-white border-b border-zinc-100 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold text-lg tracking-widest shadow-md shadow-zinc-950/10 mb-3 ring-4 ring-zinc-100">
          RY
        </div>

        <h1 className="text-xl font-bold tracking-tight text-zinc-950">
          Sign In to Ryve Portal
        </h1>

        <p className="text-xs text-zinc-500 mt-1.5 max-w-xs leading-relaxed">
          Access your distributed storage control plane, node gossip telemetry, and S3 gateway.
        </p>
      </div>

      {/* Form Body */}
      <div className="p-8 pt-6 space-y-5">
        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50/90 border border-rose-200/90 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">
              <span className="font-semibold block mb-0.5">Authentication Failed</span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Success Notification */}
        {successMessage && (
          <div className="p-3.5 bg-emerald-50/90 border border-emerald-200/90 rounded-xl text-xs text-emerald-800 flex items-center gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@acme.corp"
                disabled={isLoading}
                className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50/60 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-2.5 bg-zinc-50/60 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Session Persistence */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-zinc-900 border-zinc-300 focus:ring-zinc-900 accent-zinc-950 cursor-pointer"
              />
              <span className="text-xs text-zinc-600 font-medium">Keep me signed in</span>
            </label>
            <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Better Auth v1
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-zinc-950/10 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                <span>Authenticating Session...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Link to Signup */}
        <div className="pt-4 border-t border-zinc-100 text-center">
          <p className="text-xs text-zinc-600">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-semibold text-zinc-950 hover:text-emerald-700 hover:underline transition-colors"
            >
              Create an organization account &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

