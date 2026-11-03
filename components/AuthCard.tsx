'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/auth-client';
import { useRyve } from '@/lib/store';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Building, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Layers,
  KeyRound,
  Check
} from 'lucide-react';

interface AuthCardProps {
  initialMode?: 'login' | 'signup';
}

export function AuthCard({ initialMode = 'login' }: AuthCardProps) {
  const router = useRouter();
  const { addToast, updateOrganization } = useRyve();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('enterprise');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters long.');
        }

        const res = await signUp.email({
          email: email.trim().toLowerCase(),
          password,
          name: name.trim(),
        });

        if (res.error) {
          throw new Error(res.error.message || 'Failed to create account.');
        }

        // Update organization with chosen name
        if (orgName.trim()) {
          updateOrganization({
            name: orgName.trim(),
            slug: orgName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          });
        }

        setSuccessMessage('Account and Organization created successfully! Redirecting...');
        addToast({
          type: 'success',
          title: 'Welcome to Ryve',
          description: `Account created for ${email}. Accessing control plane...`,
        });

        setTimeout(() => {
          router.push('/');
        }, 800);
      } else {
        // Login mode
        const res = await signIn.email({
          email: email.trim().toLowerCase(),
          password,
          rememberMe,
        });

        if (res.error) {
          throw new Error(res.error.message || 'Invalid email or password.');
        }

        setSuccessMessage('Authenticated successfully! Entering control plane...');
        addToast({
          type: 'success',
          title: 'Signed in successfully',
          description: `Welcome back, ${email}`,
        });

        setTimeout(() => {
          router.push('/');
        }, 600);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setErrorMessage(msg);
      addToast({
        type: 'error',
        title: 'Authentication Error',
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'github' | 'google') => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await signIn.social({
        provider,
        callbackURL: '/',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `Failed to sign in with ${provider}`;
      setErrorMessage(msg);
      addToast({ type: 'error', title: 'OAuth Error', description: msg });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-zinc-200/90 rounded-2xl shadow-xl shadow-zinc-950/5 overflow-hidden flex flex-col transition-all">
      {/* Top Identity Header */}
      <div className="p-6 pb-4 bg-zinc-50/70 border-b border-zinc-200/80 flex flex-col items-center text-center">
        <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold text-base tracking-widest shadow-sm mb-3">
          RY
        </div>

        <h1 className="text-xl font-bold tracking-tight text-zinc-950">
          {mode === 'login' ? 'Sign in to Ryve Portal' : 'Create Ryve Organization'}
        </h1>

        <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-relaxed">
          {mode === 'login'
            ? 'Access your distributed storage networks, node registry, and zero-knowledge mesh.'
            : 'Register your organization and begin orchestrating self-hosted & datacenter storage nodes.'}
        </p>

        {/* Tab Switcher */}
        <div className="w-full grid grid-cols-2 p-1 bg-zinc-200/60 rounded-lg mt-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`py-1.5 rounded-md transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
            className={`py-1.5 rounded-md transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Create Account
          </button>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 text-xs">
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 animate-in fade-in-50">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-2.5 animate-in fade-in-50">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{successMessage}</div>
          </div>
        )}

        {/* Signup Specific Fields */}
        {mode === 'signup' && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-zinc-800 flex items-center justify-between">
                <span>Full Name</span>
                <span className="text-[10px] text-zinc-400 font-normal">Organization Owner</span>
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Thomas Kurian"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-md bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 text-xs text-zinc-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-zinc-800">Organization Name</label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Storage Corp"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-md bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 text-xs text-zinc-900"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-zinc-800">Org Type</label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-md bg-zinc-50/50 focus:bg-white text-xs text-zinc-800"
                >
                  <option value="academic">Academic / Lab</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="team">Startup / Team</option>
                  <option value="individual">Individual</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-800">Email Address</label>
          <div className="relative">
            <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              placeholder="you@organization.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-md bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 text-xs text-zinc-900"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-800">Password</label>
          <div className="relative">
            <Lock className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder={mode === 'signup' ? 'At least 8 characters' : 'Enter your password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-9 py-2 border border-zinc-200 rounded-md bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 text-xs text-zinc-900 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me / Terms */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-600">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-zinc-300 text-zinc-900 focus:ring-0 accent-zinc-900 cursor-pointer"
            />
            <span>{mode === 'login' ? 'Keep me signed in for 30 days' : 'I accept the Zero-Knowledge Storage terms'}</span>
          </label>
        </div>

        {/* Submit Primary Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-2.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>{mode === 'login' ? 'Sign In to Portal' : 'Create Organization & Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        {/* OAuth Social Divider */}
        <div className="relative my-2 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200"></div>
          </div>
          <span className="relative px-3 bg-white text-[10px] uppercase tracking-wider font-mono text-zinc-400">
            Or continue with
          </span>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleSocialSignIn('github')}
            className="py-2 px-3 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 rounded-lg font-medium text-zinc-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignIn('google')}
            className="py-2 px-3 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 rounded-lg font-medium text-zinc-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Google</span>
          </button>
        </div>
      </form>

      {/* Security Footer Notice */}
      <div className="p-4 bg-zinc-50 border-t border-zinc-200/80 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero-Knowledge Secure</span>
        </div>
        <span className="text-zinc-400">Better Auth Powered</span>
      </div>
    </div>
  );
}

