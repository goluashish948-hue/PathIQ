import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Terminal,
  Play,
  CheckCircle2,
  XCircle,
  Database,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Code,
} from 'lucide-react';
import { api } from '../services/api';

export const SandboxProofPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'schema'>('editor');
  const [sqlInput, setSqlInput] = useState(`-- PathIQ Practical SQL Proof Sandbox
-- Complete 15 queries to achieve Evidence-Backed verification
SELECT id, amount, user_id FROM transactions WHERE amount > 1000 ORDER BY amount DESC;
SELECT category, COUNT(*) as tx_count, AVG(amount) as avg_amt FROM transactions GROUP BY category;
SELECT user_id, COUNT(*) as hourly_count FROM transactions GROUP BY user_id, timestamp HAVING COUNT(*) >= 2;
SELECT m.name, COUNT(c.id) as chargeback_count FROM merchants m LEFT JOIN chargebacks c ON m.id = c.merchant_id GROUP BY m.id;
SELECT id, user_id, amount FROM transactions WHERE card_country != merchant_country AND amount > 500;
SELECT a.id, a.balance, SUM(t.amount) as total_spent FROM accounts a JOIN transactions t ON a.user_id = t.user_id GROUP BY a.id;
SELECT id, user_id, amount FROM (SELECT id, user_id, amount, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY timestamp ASC) as rn FROM transactions) WHERE rn = 1;
SELECT (COUNT(CASE WHEN status = 'DECLINED' THEN 1 END) * 1.0 / COUNT(*)) as decline_rate FROM transactions;
SELECT user_id, COUNT(DISTINCT card_id) as card_count FROM transactions GROUP BY user_id HAVING COUNT(DISTINCT card_id) >= 2;
SELECT user_id, COUNT(*) as micro_tx_count FROM transactions WHERE amount < 10 GROUP BY user_id HAVING COUNT(*) >= 2;
SELECT id, user_id, amount, SUM(amount) OVER (PARTITION BY user_id ORDER BY timestamp) as running_total FROM transactions;
SELECT id, name, CASE WHEN chargeback_count > 2 THEN 'HIGH' WHEN chargeback_count > 0 THEN 'MEDIUM' ELSE 'LOW' END as risk_tier FROM merchants;
SELECT id, user_id, amount FROM (SELECT id, user_id, amount, LAG(timestamp, 1) OVER (PARTITION BY user_id ORDER BY timestamp) as prev_time FROM transactions) WHERE prev_time IS NOT NULL;
SELECT id, user_id, ip_country, billing_country FROM transactions WHERE ip_country != billing_country;
SELECT user_id, SUM(amount) as flagged_volume FROM transactions WHERE is_flagged = 1 GROUP BY user_id ORDER BY flagged_volume DESC LIMIT 5;`);

  const [executing, setExecuting] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  async function handleExecuteSql() {
    setExecuting(true);
    try {
      const res = await api.submitSqlProof(sqlInput);
      setEvaluation(res);
      if (res.passed) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExecuting(false);
    }
  }

  const sampleSchema = [
    { name: 'transactions', cols: ['id TEXT', 'user_id TEXT', 'amount REAL', 'merchant_id TEXT', 'card_id TEXT', 'status TEXT', 'card_country TEXT', 'merchant_country TEXT', 'timestamp TEXT'] },
    { name: 'merchants', cols: ['id TEXT', 'name TEXT', 'category TEXT', 'chargeback_count INT'] },
    { name: 'chargebacks', cols: ['id TEXT', 'merchant_id TEXT', 'amount REAL', 'reason TEXT'] },
    { name: 'accounts', cols: ['id TEXT', 'user_id TEXT', 'balance REAL', 'created_at TEXT'] },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Disposable SQL Sandbox
            </span>
            <span className="text-xs text-slate-400 font-mono">Isolated SQLite/Postgres</span>
          </div>
          <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
            Practical Proof: 15 Real Fraud Analytics Queries
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Passing 80%+ of queries upgrades your SQL skill to <strong className="text-emerald-600">Evidence-Backed</strong> with a 1.0x verification multiplier in your Career Twin.
          </p>
        </div>

        <button
          onClick={handleExecuteSql}
          disabled={executing}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 shrink-0 hover:scale-105 transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{executing ? 'Executing Sandbox...' : 'Run & Grade 15 Queries'}</span>
        </button>
      </div>

      {/* Main Grid: Code Editor & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: SQL Editor & Schema Toggle */}
        <div className="lg:col-span-7 glass-card rounded-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                  activeTab === 'editor'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                SQL Query Editor
              </button>
              <button
                onClick={() => setActiveTab('schema')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                  activeTab === 'schema'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                Sample Database Schema (4 Tables)
              </button>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">15 Queries</span>
          </div>

          {activeTab === 'editor' ? (
            <div className="p-4 flex-1 bg-slate-950 font-mono text-xs text-teal-300">
              <textarea
                value={sqlInput}
                onChange={e => setSqlInput(e.target.value)}
                className="w-full h-[440px] bg-transparent text-teal-300 font-mono text-xs resize-none focus:outline-none leading-relaxed"
                spellCheck={false}
              />
            </div>
          ) : (
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Transactional Database Schema (Pre-Seeded)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {sampleSchema.map(tbl => (
                  <div key={tbl.name} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-1">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 block">{tbl.name}</span>
                    <ul className="text-[11px] text-slate-500 font-mono space-y-0.5">
                      {tbl.cols.map(c => <li key={c}>{c}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Real-time Evaluation Results */}
        <div className="lg:col-span-5 glass-card p-6 rounded-2xl flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
              Auto-Grading Sandbox Output
            </h3>
            <span className="text-xs text-slate-400 font-mono">Part 11.5 / 27 H</span>
          </div>

          {!evaluation ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
              <Terminal className="w-10 h-10 text-slate-300 dark:text-slate-700" />
              <p className="text-xs">
                Click "Run & Grade 15 Queries" to execute your SQL against the isolated database.
              </p>
            </div>
          ) : (
            <div className="flex-1 space-y-4 overflow-y-auto">
              {/* Score card */}
              <div className={`p-4 rounded-xl border text-center ${
                evaluation.passed
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                  : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
              }`}>
                <span className="text-3xl font-extrabold font-heading block mb-1">
                  {evaluation.passedCount} / {evaluation.totalQueries} Passed ({evaluation.percentage}%)
                </span>
                <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-white dark:bg-slate-900 inline-block">
                  {evaluation.passed ? 'VERIFIED: EVIDENCE-BACKED (1.0x MULTIPLIER)' : 'RE-TRY CHALLENGE'}
                </span>
                <p className="mt-2 text-xs opacity-90">{evaluation.feedback}</p>
              </div>

              {/* Individual Queries Results */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {evaluation.queryResults?.map((qr: any) => (
                  <div
                    key={qr.queryIndex}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {qr.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                      <div>
                        <span className="font-semibold block text-slate-800 dark:text-slate-200">
                          Query #{qr.queryIndex}
                        </span>
                        <span className="text-[10px] text-slate-400 line-clamp-1">{qr.expectedDescription}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono font-bold ${qr.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {qr.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
