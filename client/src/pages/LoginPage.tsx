import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Sparkles, ArrowRight, ShieldCheck, Lock, Mail, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, login, signup, quickLoginDemo } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isUnder18, setIsUnder18] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to dashboard automatically
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignup) {
        if (!ageConfirmed) {
          setError('You must confirm you are at least 13 years of age to register.');
          setLoading(false);
          return;
        }
        await signup({ email, password, name, ageConfirmed, isUnder18 });
        // Take newly registered students to onboarding questionnaire
        navigate('/onboarding');
      } else {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  const demoAccounts = [
    { name: 'Aarav Sharma (Fraud ML Engineer)', email: 'fraud.student@pathiq.dev' },
    { name: 'Priya Patel (Data Scientist)', email: 'data.scientist@pathiq.dev' },
    { name: 'Rohan Verma (Robotics Engineer)', email: 'robotics.engineer@pathiq.dev' },
    { name: 'Admin / Content Ops', email: 'admin@pathiq.dev' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-12">
      <div className="glass-panel max-w-md w-full p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 animate-in fade-in">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
            {isSignup ? 'Create Your Student Account' : 'Welcome to PathIQ GPS'}
          </h2>
          <p className="text-xs text-slate-500">
            {isSignup
              ? 'Start your personalized AI-guided career navigation route'
              : 'Sign in to access your roadmaps, quizzes, and mentor'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 font-medium animate-in fade-in">
            {error}
          </div>
        )}

        {/* 1-Click Instant Demo Login Shortcuts */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2.5">
          <span className="text-[11px] font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            1-Click Instant Demo Profiles (No Password Needed):
          </span>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map(demo => (
              <button
                key={demo.email}
                type="button"
                onClick={async () => {
                  setError(null);
                  setLoading(true);
                  try {
                    await quickLoginDemo(demo.email);
                    navigate('/dashboard');
                  } catch (err: any) {
                    setError('Demo login failed: ' + err.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-left border border-slate-200 dark:border-slate-700 transition-all hover:scale-[1.02]"
              >
                <span className="font-bold text-[11px] block text-slate-800 dark:text-slate-100 truncate">
                  {demo.name.split(' (')[0]}
                </span>
                <span className="text-[9px] text-slate-400 block truncate">{demo.email}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isSignup && (
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Under 18 and Age Confirmation Checkboxes */}
          {isSignup && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ageConfirmed}
                  onChange={e => setAgeConfirmed(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-600 dark:text-slate-300">
                  I confirm I am at least 13 years of age.
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUnder18}
                  onChange={e => setIsUnder18(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-600 dark:text-slate-300">
                  I am under 18 (applies privacy-safe portfolio defaults).
                </span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : isSignup ? 'Create Account & Continue' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError(null);
            }}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
};
