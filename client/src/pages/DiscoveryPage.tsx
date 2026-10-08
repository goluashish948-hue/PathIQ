import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { api } from '../services/api';

export const DiscoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  async function loadQuestions() {
    try {
      const res = await api.getDiscoveryQuestions();
      setQuestions(res.questions || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleEvaluate() {
    setEvaluating(true);
    try {
      const res = await api.evaluateDiscovery(answers);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
          Guided Career Discovery (Spec 18)
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
          "I Don't Know What Career to Choose"
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Answer 4 core orientation questions to explore high-correlation career routes. Output is labeled "worth exploring"—never false guarantees.
        </p>
      </div>

      {!result ? (
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="glass-card p-6 rounded-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Question #{idx + 1} • {q.category}
              </span>
              <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                {q.question}
              </h3>

              <div className="space-y-2 pt-2">
                {q.options.map((opt: any) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                      answers[q.id] === opt.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-100 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={opt.id}
                      checked={answers[q.id] === opt.id}
                      onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleEvaluate}
            disabled={evaluating || Object.keys(answers).length < questions.length}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            {evaluating ? 'Analyzing...' : 'Discover Career Paths Worth Exploring'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Discovery Suggestions */
        <div className="space-y-6 animate-in zoom-in-95">
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 font-medium">
            {result.driverExplanation}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.suggestions?.map((sug: any, idx: number) => (
              <div key={idx} className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                    {sug.domain}
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
                    {sug.roleTitle}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-1 text-xs">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xl">{sug.matchScore}%</span>
                    <span className="text-slate-400">alignment</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                    {sug.matchFactors?.[0]}
                  </p>
                </div>

                <button
                  onClick={() => navigate('/roadmap')}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>See Job DNA & Route</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
