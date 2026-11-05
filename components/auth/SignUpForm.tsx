'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth-client';
import { useRyve } from '@/lib/store';
import { 
  User, 
  Lock, 
  Mail, 
  Building, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Check
} from 'lucide-react';

export function SignUpForm() {
  const router = useRouter();
  const { addToast } = useRyve();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password validation indicators
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (!name.trim()) {
        throw new Error('Please enter your full name.');
      }
      if (!email.trim()) {
        throw new Error('Please enter a valid work email.');
      }
      if (!isPasswordValid) {
        throw new Error('Password must be at least 8 characters and include numbers.');
      }

      const res = await signUp.email({
        email: email.trim().toLowerCase(),
        password,
        name: name.trim(),
      });

      if (res.error) {
        let msg = res.error.message || 'Failed to create account.';
        if (msg.includes('PostgresError') || msg.includes('authentication failed')) {
          msg = 'Database connection error. Please verify database credentials in .env.';
        } else if (msg.includes('relation') && msg.includes('does not exist')) {
          msg = 'Database tables are missing. Please run "npx drizzle-kit push" to apply the schema.';
        }
        throw new Error(msg);
      }

      setSuccessMessage('Account registered successfully! Entering Ryve control plane...');
      addToast({
        type: 'success',
        title: 'Account Created',
        description: `Welcome to Ryve, ${name.trim()}! Initializing storage workspace...`,
      });

      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setErrorMessage(msg);
      addToast({
        type: 'error',
        title: 'Sign Up Failed',
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
          Create Ryve Organization
        </h1>

        <p className="text-xs text-zinc-500 mt-1.5 max-w-xs leading-relaxed">
          Deploy zero-knowledge distributed storage, register NVMe pods, and manage node clusters.
        </p>
      </div>

      {/* Form Body */}
      <div className="p-8 pt-6 space-y-5">
        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50/90 border border-rose-200/90 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">
              <span className="font-semibold block mb-0.5">Registration Failed</span>
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

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Elena Rostova"
                disabled={isLoading}
                className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50/60 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Work Email */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
              Work Email
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
                placeholder="elena@company.com"
                disabled={isLoading}
                className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50/60 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Organization Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
              Organization Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Building className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Acme Infrastructure (optional)"
                disabled={isLoading}
                className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50/60 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Master Password */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
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

            {/* Password Requirement Chips */}
            {password.length > 0 && (
              <div className="mt-2 flex items-center gap-3 text-[11px] font-mono">
                <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-700 font-semibold' : 'text-zinc-400'}`}>
                  <Check className={`w-3 h-3 ${hasMinLength ? 'opacity-100' : 'opacity-40'}`} />
                  8+ chars
                </span>
                <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-700 font-semibold' : 'text-zinc-400'}`}>
                  <Check className={`w-3 h-3 ${hasNumber ? 'opacity-100' : 'opacity-40'}`} />
                  1+ number
                </span>
              </div>
            )}
          </div>

          {/* Privacy & Zero-Knowledge notice */}
          <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl text-[11px] text-zinc-500 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              All cluster encryption keys and S3 credentials are generated with client-side zero-knowledge isolation.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 py-2.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-zinc-950/10 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                <span>Creating Organization...</span>
              </>
            ) : (
              <>
                <span>Register & Access Control Plane</span>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Link to Login */}
        <div className="pt-4 border-t border-zinc-100 text-center">
          <p className="text-xs text-zinc-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-zinc-950 hover:text-emerald-700 hover:underline transition-colors"
            >
              Sign in to your organization &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

