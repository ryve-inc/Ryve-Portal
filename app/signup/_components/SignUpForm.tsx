'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth-client';
import { useRyve } from '@/context/store';
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
    <div className="w-full max-w-md bg-[#111111] border border-[#242424] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col font-sans text-[#ebebeb]">
      {/* Identity Brand Header */}
      <div className="p-8 pb-6 bg-[#161616] border-b border-[#222222] flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center font-extrabold text-xl shadow-lg mb-3">
          R.
        </div>

        <h1 className="text-2xl font-black tracking-tight text-white">
          Create Organization
        </h1>

        <p className="text-xs text-[#888888] mt-1.5 max-w-xs leading-relaxed font-mono">
          Deploy zero-knowledge distributed storage, register NVMe pods, and manage node clusters.
        </p>
      </div>

      {/* Form Body */}
      <div className="p-8 pt-6 space-y-4">
        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-950/40 border border-rose-800/50 rounded-xl text-xs text-rose-300 flex items-start gap-2.5 font-mono">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">
              <span className="font-bold block mb-0.5">Registration Failed</span>
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
          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-bold text-[#888888] uppercase tracking-wider mb-2 font-mono">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Elena Rostova"
                disabled={isLoading}
                className="w-full pl-10 pr-3.5 py-3 bg-[#161616] border border-[#2a2a2a] rounded-xl text-sm font-mono text-white placeholder:text-[#555555] focus:outline-none focus:border-[#FF6B50] focus:ring-1 focus:ring-[#FF6B50] transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Work Email */}
          <div>
            <label className="block text-[11px] font-bold text-[#888888] uppercase tracking-wider mb-2 font-mono">
              Work Email
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
                placeholder="elena@company.com"
                disabled={isLoading}
                className="w-full pl-10 pr-3.5 py-3 bg-[#161616] border border-[#2a2a2a] rounded-xl text-sm font-mono text-white placeholder:text-[#555555] focus:outline-none focus:border-[#FF6B50] focus:ring-1 focus:ring-[#FF6B50] transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Organization Name */}
          <div>
            <label className="block text-[11px] font-bold text-[#888888] uppercase tracking-wider mb-2 font-mono">
              Organization Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
                <Building className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Acme Infrastructure (optional)"
                disabled={isLoading}
                className="w-full pl-10 pr-3.5 py-3 bg-[#161616] border border-[#2a2a2a] rounded-xl text-sm font-mono text-white placeholder:text-[#555555] focus:outline-none focus:border-[#FF6B50] focus:ring-1 focus:ring-[#FF6B50] transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Master Password */}
          <div>
            <label className="block text-[11px] font-bold text-[#888888] uppercase tracking-wider mb-2 font-mono">
              Master Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
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

            {/* Password Requirement Chips */}
            {password.length > 0 && (
              <div className="mt-2.5 flex items-center gap-3 text-[11px] font-mono">
                <span className={`flex items-center gap-1 ${hasMinLength ? 'text-[#FF6B50] font-bold' : 'text-[#666666]'}`}>
                  <Check className={`w-3 h-3 ${hasMinLength ? 'opacity-100' : 'opacity-40'}`} />
                  8+ chars
                </span>
                <span className={`flex items-center gap-1 ${hasNumber ? 'text-[#FF6B50] font-bold' : 'text-[#666666]'}`}>
                  <Check className={`w-3 h-3 ${hasNumber ? 'opacity-100' : 'opacity-40'}`} />
                  1+ number
                </span>
              </div>
            )}
          </div>

          {/* Privacy & Zero-Knowledge notice */}
          <div className="p-3 bg-[#161616] border border-[#242424] rounded-xl text-[11px] text-[#888888] font-mono leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#FF6B50] shrink-0 mt-0.5" />
            <span>
              All cluster encryption keys and S3 credentials are generated with client-side zero-knowledge isolation.
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
                <span>Creating Organization...</span>
              </>
            ) : (
              <>
                <span>Register & Access Control Plane</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Link to Login */}
        <div className="pt-4 border-t border-[#1f1f1f] text-center">
          <p className="text-xs text-[#777777] font-mono">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-bold text-white hover:text-[#FF6B50] transition-colors"
            >
              Sign in to your organization &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
