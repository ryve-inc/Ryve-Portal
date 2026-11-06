'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import { useRyve } from '@/context/store';
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
    <div className="w-full max-w-md bg-[#111111] border border-[#242424] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col font-sans text-[#ebebeb]">
      {/* Identity Brand Header */}
      <div className="p-8 pb-6 bg-[#161616] border-b border-[#222222] flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center font-extrabold text-xl shadow-lg mb-3">
          R.
        </div>

        <h1 className="text-2xl font-black tracking-tight text-white">
          Sign In to Ryve
        </h1>

        <p className="text-xs text-[#888888] mt-1.5 max-w-xs leading-relaxed font-mono">
          Access your sovereign storage control plane and node gossip telemetry.
        </p>
      </div>

      {/* Form Body */}
      <div className="p-8 pt-6 space-y-5">
        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-950/40 border border-rose-800/50 rounded-xl text-xs text-rose-300 flex items-start gap-2.5 font-mono">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">
              <span className="font-bold block mb-0.5">Authentication Failed</span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Success Notification */}
        {successMessage && (
          <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2.5 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Address */}
          <div>
            <label className="block text-[11px] font-bold text-[#888888] uppercase tracking-wider mb-2 font-mono">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@acme.corp"
                disabled={isLoading}
                className="w-full pl-10 pr-3.5 py-3 bg-[#161616] border border-[#2a2a2a] rounded-xl text-sm font-mono text-white placeholder:text-[#555555] focus:outline-none focus:border-[#FF6B50] focus:ring-1 focus:ring-[#FF6B50] transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[11px] font-bold text-[#888888] uppercase tracking-wider font-mono">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-3 bg-[#161616] border border-[#2a2a2a] rounded-xl text-sm font-mono text-white placeholder:text-[#555555] focus:outline-none focus:border-[#FF6B50] focus:ring-1 focus:ring-[#FF6B50] transition-all disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#666666] hover:text-white transition-colors"
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
                className="w-4 h-4 rounded bg-[#161616] border-[#333333] accent-[#FF6B50] cursor-pointer"
              />
              <span className="text-xs text-[#888888] font-mono">Remember session</span>
            </label>
            <span className="text-[10px] text-[#666666] font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF6B50]" />
              Better Auth
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 bg-[#FF6B50] hover:bg-[#E55A40] text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-[#FF6B50]/15 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Authenticating Session...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Link to Signup */}
        <div className="pt-4 border-t border-[#1f1f1f] text-center">
          <p className="text-xs text-[#777777] font-mono">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-bold text-white hover:text-[#FF6B50] transition-colors"
            >
              Create an organization &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
