import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Search,
  Layers,
  Cpu,
  BookOpen,
  FileText,
  UserCheck,
  RotateCw,
  Award,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang, quickLoginDemo } = useAuth();
  const [goalInput, setGoalInput] = useState('');
  const [analyzingGoal, setAnalyzingGoal] = useState(false);
  const [goalResult, setGoalResult] = useState<any>(null);

  async function handleAnalyzeGoal() {
    if (!goalInput.trim()) return;
    setAnalyzingGoal(true);
    try {
      const res = await api.analyzeGoal(goalInput);
      setGoalResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingGoal(false);
    }
  }

  const flowSteps = [
    { title: 'Career Goal', icon: Compass, color: 'text-indigo-500' },
    { title: 'Real Job Requirements', icon: Search, color: 'text-teal-500' },
    { title: 'Student Career Twin', icon: Layers, color: 'text-amber-500' },
    { title: 'Skill Gap', icon: ShieldCheck, color: 'text-rose-500' },
    { title: 'Dependency Graph', icon: Layers, color: 'text-indigo-400' },
    { title: 'Personalized Roadmap', icon: Compass, color: 'text-blue-500' },
    { title: 'Learn', icon: BookOpen, color: 'text-emerald-500' },
    { title: 'Quiz', icon: Award, color: 'text-violet-500' },
    { title: 'Mastery', icon: CheckCircle2, color: 'text-teal-400' },
    { title: 'Applied Practice', icon: Award, color: 'text-emerald-400' },
    { title: 'Capstone Project', icon: Layers, color: 'text-indigo-600' },
    { title: 'Evidence Resume', icon: FileText, color: 'text-blue-600' },
    { title: 'Interview Readiness', icon: UserCheck, color: 'text-amber-600' },
    { title: 'Continuous Replan Loop', icon: RotateCw, color: 'text-rose-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>The World's First True AI Career GPS</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-heading text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
          Tell us where you want to go.{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-400 bg-clip-text text-transparent">
            We'll navigate every step of your route.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          We reverse-engineer real job requirements, calculate your exact skill gap, build a dependency-based roadmap, test your mastery through adaptive quizzes & verified portfolio projects, and continuously recalculate as you grow.
        </p>

        <p className="mt-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">
          One platform • Any student • Any career
        </p>

        {/* Hyper-Specific Goal Coach Hero Interactive Widget */}
        <div className="mt-10 max-w-2xl mx-auto glass-panel p-4 sm:p-6 rounded-2xl text-left border border-indigo-100 dark:border-slate-800 shadow-xl">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Try the Hyper-Specific Goal Coach
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={goalInput}
              onChange={e => setGoalInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAnalyzeGoal()}
              placeholder="e.g. Fraud Detection ML Engineer in FinTech (or 'I want a good job')"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleAnalyzeGoal}
              disabled={analyzingGoal || !goalInput.trim()}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
            >
              {analyzingGoal ? 'Analyzing...' : 'Analyze'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick example pill suggestions */}
          <div className="mt-3 flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] text-slate-400">Try clicking:</span>
            {['I want a good job', 'Fraud Detection ML Engineer in FinTech', 'Football Data Analyst'].map(ex => (
              <button
                key={ex}
                onClick={() => {
                  setGoalInput(ex);
                  api.analyzeGoal(ex).then(setGoalResult);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>

          {/* Goal Analysis Live Result Feedback */}
          {goalResult && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Specificity Rating:
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    goalResult.specificity === 'SPECIFIC'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {goalResult.specificity}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">{goalResult.feedback}</p>

              {goalResult.suggestions && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Clickable Role Refinements:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {goalResult.suggestions.map((sug: string) => (
                      <button
                        key={sug}
                        onClick={() => {
                          setGoalInput(sug);
                          api.analyzeGoal(sug).then(setGoalResult);
                        }}
                        className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-medium text-[11px] transition-colors"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA Launch Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => quickLoginDemo('fraud.student@pathiq.dev')}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            <span>Launch Demo Student GPS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <Link
            to="/discovery"
            className="px-6 py-3.5 rounded-xl glass-card font-semibold text-sm text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            I don't know what career to choose
          </Link>
        </div>
      </section>

      {/* Central Flow Diagram Section (Part 23) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            The Continuous AI Career GPS Engine
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            A real-time feedback loop recalculating your route as skills, time, and job market requirements evolve.
          </p>
        </div>

        {/* Grid of central loop stages */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {flowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="glass-card p-4 rounded-xl flex flex-col items-center text-center relative group hover:-translate-y-1 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 flex items-center justify-center mb-2">
                  {idx + 1}
                </div>
                <Icon className={`w-6 h-6 mb-2 ${step.color}`} />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Non-Negotiable Principles Showcase (P1-P7) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            Engineered for Evidence & Absolute Trust
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            No hallucinations, no fake placement guarantees, and no unvalidated shortcuts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-2">
              No Fabrication Enforcement (P2)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Enforced by validators in code, not just prompt wording. The system never invents job guarantees, salary claims, fake student achievements, or broken course links.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-2">
              Verified Skill Progression (P5)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Skills transition from Self-Reported to Assessed (via adaptive quizzes) to Evidence-Backed through evaluated portfolio projects and GitHub repository analysis.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <RotateCw className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-2">
              Student Control & Replan Diff (P6)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              The AI proposes, the student confirms. When you miss study weeks or change weekly hours, the engine computes a visual preview diff requiring your approval.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
