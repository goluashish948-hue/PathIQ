import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Flame,
  Award,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { user, lang } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const res = await api.getDashboardMetrics();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin mb-3 text-indigo-500" />
        <p className="text-sm">Calculating Career Twin readiness metrics...</p>
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const radar = metrics.radarDimensions || {};

  const radarData = [
    { subject: 'Technical Skills', score: radar.technical || 65, fullMark: 100 },
    { subject: 'Domain Knowledge', score: radar.domain || 60, fullMark: 100 },
    { subject: 'Practical Skills', score: radar.practical || 75, fullMark: 100 },
    { subject: 'Applied Projects', score: radar.projects || 60, fullMark: 100 },
    { subject: 'Communication', score: radar.communication || 70, fullMark: 100 },
    { subject: 'Interview Readiness', score: radar.interview || 55, fullMark: 100 },
  ];

  const timelineData = data?.timeline || [];
  const heatmap = data?.heatmap || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Top Header & What Would Raise This Most Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Active Target
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">10 hours/week</span>
            <Link
              to="/profile"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold ml-2"
            >
              Edit Profile
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              to="/onboarding"
              className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-semibold"
            >
              Intake Questions
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            {user?.studentProfile?.targetCareer || 'Fraud Detection ML Engineer in FinTech'}
          </h1>
        </div>

        {/* What would raise this most card */}
        <div className="glass-panel p-3.5 rounded-2xl border border-indigo-200 dark:border-indigo-900 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-900 dark:text-white block">
              What Would Raise Your Readiness Most:
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              Complete SQL Analytics & Topic Quiz (+15% readiness boost)
            </span>
          </div>
          <Link
            to="/learn"
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 ml-auto transition-colors shadow-sm"
          >
            Study & Quiz
          </Link>
        </div>
      </div>

      {/* Primary KPI Readiness Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Main Overall Readiness Card */}
        <div className="col-span-2 sm:col-span-1 glass-card p-4 rounded-2xl border-l-4 border-l-indigo-600 relative">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Career Readiness</span>
            <button
              onClick={() => setShowFormulaModal(true)}
              className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              title="How is this calculated?"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
              {metrics.overallReadiness || 64}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.overallReadiness || 64}%` }}
            />
          </div>
        </div>

        {/* Roadmap Completion */}
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">Roadmap Progress</span>
          <div className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
            {metrics.roadmapCompletion || 28}%
          </div>
          <span className="text-[11px] text-indigo-500 font-medium">3 / 9 nodes verified</span>
        </div>

        {/* Knowledge Score */}
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">Knowledge Score</span>
          <div className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
            {metrics.knowledgeScore || 72}%
          </div>
          <span className="text-[11px] text-teal-500 font-medium">Strong fundamentals</span>
        </div>

        {/* Quiz Mastery */}
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">Quiz Mastery</span>
          <div className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
            {metrics.quizMasteryScore || 80}%
          </div>
          <span className="text-[11px] text-emerald-500 font-medium">Recent 8/10 attempt</span>
        </div>

        {/* Practical Skills */}
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">Practical Proofs</span>
          <div className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
            {metrics.practicalScore || 55}%
          </div>
          <span className="text-[11px] text-amber-500 font-medium">Auto-graded pending</span>
        </div>

        {/* Interview Readiness */}
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">Interview Score</span>
          <div className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
            {metrics.interviewScore || 45}%
          </div>
          <span className="text-[11px] text-rose-500 font-medium">Practice needed</span>
        </div>
      </div>

      {/* Middle Row: Radar Chart + Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-5 glass-card p-6 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Career Readiness Radar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Balanced across 6 target domain dimensions
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              Domain Weighted
            </span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#94a3b8" strokeDasharray="3 3" opacity={0.3} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" opacity={0.2} />
                <Radar
                  name="Student Fit"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Weakest Dimension: <strong>Interview Readiness (45)</strong></span>
            <Link to="/interview" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Start Mock →
            </Link>
          </div>
        </div>

        {/* Weakness Heatmap with Text + Icons */}
        <div className="lg:col-span-7 glass-card p-6 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Skill & Weakness Heatmap
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Colored with explicit status labels and actionable next steps
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
            {heatmap.map((item: any) => {
              const isGreen = item.status === 'GREEN';
              const isYellow = item.status === 'YELLOW';
              const isRed = item.status === 'RED';

              return (
                <div
                  key={item.topic}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isGreen
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                      : isYellow
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                      : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-100 line-clamp-1">
                      {item.topic}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isGreen
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                          : isYellow
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                      }`}
                    >
                      {isGreen && <CheckCircle2 className="w-3 h-3" />}
                      {isYellow && <AlertCircle className="w-3 h-3" />}
                      {isRed && <XCircle className="w-3 h-3" />}
                      {item.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    {item.action}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Long-Term Progress Timeline */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Long-Term Career GPS Growth Timeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monthly snapshots of Career Readiness and milestone completions
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
            +33% Growth over 5 Months
          </span>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="readiness"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 5, fill: '#6366f1' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Milestone callouts */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
          {timelineData.map((t: any) => (
            <div key={t.month} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 block">{t.month}: {t.readiness}%</span>
              <span className="text-slate-500 dark:text-slate-400 line-clamp-2">{t.event}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Formula Transparency Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Formula Transparency (Part 12.1 & 19.3)
            </h3>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div>
                <strong className="text-slate-900 dark:text-white block mb-0.5">Career Readiness Formula:</strong>
                <code>0.30 × Technical + 0.25 × Practical + 0.15 × Domain + 0.15 × Projects + 0.08 × Communication + 0.07 × Interview</code>
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white block mb-0.5">Effective Skill Level:</strong>
                <p>Level × Verification Weight: Self-Reported (0.5), Assessed (0.8), Evidence-Backed (1.0).</p>
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white block mb-0.5">Decay & Mastery:</strong>
                <p>Difficulty-weighted quiz scores with 30-day half-life recency. Mastery threshold is 75%.</p>
              </div>
            </div>
            <button
              onClick={() => setShowFormulaModal(false)}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
