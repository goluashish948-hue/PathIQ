import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  Map,
  BookOpen,
  User as UserIcon,
  FileText,
  UserCheck,
  Calendar,
  ShieldCheck,
  Sun,
  Moon,
  Globe,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout, theme, toggleTheme, lang, setLanguage, quickLoginDemo } = useAuth();
  const location = useLocation();
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const demoAccounts = [
    { name: 'Aarav (Fraud ML Engineer)', email: 'fraud.student@pathiq.dev' },
    { name: 'Priya (Data Scientist)', email: 'data.scientist@pathiq.dev' },
    { name: 'Rohan (Robotics Engineer)', email: 'robotics.engineer@pathiq.dev' },
    { name: 'Sneha (UI/UX Designer)', email: 'uiux.designer@pathiq.dev' },
    { name: 'System Admin', email: 'admin@pathiq.dev' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={user ? "/dashboard" : "/login"} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-400 dark:to-teal-300 bg-clip-text text-transparent">
                PathIQ
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                GPS
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block -mt-1 font-medium">
              AI Career Navigation Platform
            </p>
          </div>
        </Link>

        {/* Navigation Items */}
        {user ? (
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/dashboard"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                isActive('/dashboard')
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              {lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
            </Link>

            <Link
              to="/roadmap"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                isActive('/roadmap')
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <Map className="w-4 h-4" />
              {lang === 'hi' ? 'रोडमैप' : 'Roadmap'}
            </Link>

            <Link
              to="/learn"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                isActive('/learn')
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              {lang === 'hi' ? 'सिखें व क्विज' : 'Learn & Quiz'}
            </Link>

            <Link
              to="/profile"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                isActive('/profile')
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              {lang === 'hi' ? 'प्रोफाइल' : 'Profile'}
            </Link>

            <Link
              to="/interview"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                isActive('/interview')
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              {lang === 'hi' ? 'इंटरव्यू' : 'Interview'}
            </Link>

            <Link
              to="/resume"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                isActive('/resume')
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <FileText className="w-4 h-4" />
              {lang === 'hi' ? 'रिज्यूमे' : 'Resume & Portfolio'}
            </Link>

            <Link
              to="/planner"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                isActive('/planner')
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <Calendar className="w-4 h-4" />
              {lang === 'hi' ? 'डेली प्लानर' : 'Daily Planner'}
            </Link>

            {user.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  isActive('/admin')
                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-semibold'
                    : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>
        ) : (
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link to="/discovery" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Career Discovery
            </Link>
            <Link to="/domains" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              20 Domain Packs
            </Link>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Demo Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700"
              title="Switch between demo profiles"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Demo Switcher</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 mt-2 w-64 glass-panel rounded-xl shadow-xl py-2 z-50 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Select Demo Persona
                </div>
                {demoAccounts.map(demo => (
                  <button
                    key={demo.email}
                    onClick={() => {
                      quickLoginDemo(demo.email);
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex flex-col transition-colors"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{demo.name}</span>
                    <span className="text-[10px] text-slate-400">{demo.email}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Toggle (EN / HI) */}
          <button
            onClick={() => setLanguage(lang === 'en' ? 'hi' : 'en')}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle English / Hindi"
          >
            <Globe className="w-4 h-4" />
            <span className="sr-only">Switch Language</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Dark/Light Mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Auth State Button */}
          {user ? (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
              <Link
                to="/profile"
                className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                title="View & Edit Student Profile"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-teal-400 text-white font-bold text-xs flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden md:inline">
                  {user.name.split(' ')[0]}
                </span>
              </Link>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
