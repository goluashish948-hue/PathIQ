import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Target,
  Brain,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { api } from '../services/api';

export const LearnQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [topicKey, setTopicKey] = useState('python_functions');
  const [activeTopics, setActiveTopics] = useState<any[]>([]);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Quiz state
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [isRevisionMode, setIsRevisionMode] = useState(false);

  useEffect(() => {
    loadActiveTopics();
  }, []);

  useEffect(() => {
    loadTopic();
  }, [topicKey]);

  async function loadActiveTopics() {
    try {
      const res = await api.getActiveLearningTopics();
      if (res && res.length > 0) {
        setActiveTopics(res);
      }
    } catch (err) {
      console.error('Failed to load active topics', err);
    }
  }

  async function loadTopic() {
    setLoading(true);
    try {
      const res = await api.getTopicContent(topicKey);
      setContent(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStartQuiz(difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' = 'INTERMEDIATE', revision = false) {
    setIsRevisionMode(revision);
    try {
      const res = await api.generateQuiz(topicKey, difficulty);
      setQuiz(res);
      setAnswers({});
      setQuizResult(null);
      setIsQuizOpen(true);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCompleteAndQuiz() {
    try {
      await api.completeLearningTopic(topicKey, content?.title);
      await handleStartQuiz('INTERMEDIATE', false);
    } catch (err) {
      console.error(err);
      handleStartQuiz('INTERMEDIATE', false);
    }
  }

  async function handleSubmitQuiz() {
    if (!quiz) return;
    setSubmittingQuiz(true);
    try {
      const formatted = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));

      const res = await api.submitQuiz({
        topicKey,
        difficulty: quiz.difficulty,
        answers: formatted,
        bankQuestions: quiz.questions,
      });

      setQuizResult(res);

      if (res.passed) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingQuiz(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in pb-20">
      {/* Top Banner & Topic Selector */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Personalized Learning & Adaptive Quizzing
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Tailored to Your Target Career
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
              {content?.title || 'Python Functions & Scope'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Learn the exact concepts, code patterns, and industry pitfalls. Complete the topic to generate a quiz specifically testing what you just learned.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCompleteAndQuiz}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 hover:scale-105 transition-all"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Complete Topic & Take Quiz</span>
            </button>
          </div>
        </div>

        {/* Active Topics Switcher Pills */}
        <div className="space-y-1.5 pt-3 border-t border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Select Active Curriculum Topic:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: 'python_functions', title: '🐍 Python Functions & Scope' },
              { key: 'sql_joins', title: '📊 SQL Joins (INNER, LEFT, RIGHT)' },
              { key: 'sql_advanced_analytics', title: '⚡ SQL Window Functions' },
              { key: 'pandas_data_wrangling', title: '🐼 Pandas Data Wrangling' },
              { key: 'machine_learning_basics', title: '🤖 Machine Learning & Imbalance' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTopicKey(t.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  topicKey === t.key
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Thorough Learning Objectives & Study Guide */}
      {content?.learningObjectives && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-indigo-200/80 dark:border-indigo-800/80 shadow-lg space-y-6 bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/20 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg sm:text-xl font-heading font-extrabold text-slate-900 dark:text-white">
                  Topic Learning Objectives & Study Guide
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                A clear, thorough guide explaining exactly what you need to study, key subtopics, and what you will be able to do.
              </p>
            </div>
            <span className="self-start sm:self-auto text-[11px] font-bold px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Clear & Simple Guide
            </span>
          </div>

          {/* 1. What is this topic about? (Simple, plain language explanation) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              📖 What is this topic about?
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {content.learningObjectives.summary}
            </p>
          </div>

          {/* Grid: 2. Core Concepts + 3. What You Should Focus On */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Core Concepts You Need to Learn */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                What Concepts You Need to Learn:
              </span>
              <ul className="space-y-2">
                {content.learningObjectives.coreConcepts?.map((concept: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span>{concept}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What You Should Focus On */}
            <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-3">
              <span className="font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                What You Should Focus On:
              </span>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {content.learningObjectives.focusAreas?.map((fa: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <span>{fa}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Subtopics Included (Detailed Breakdown) */}
          {content.learningObjectives.subtopics && content.learningObjectives.subtopics.length > 0 && (
            <div className="space-y-3">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                Which Subtopics Are Included in This Topic:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {content.learningObjectives.subtopics.map((sub: { title: string; description: string }, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 space-y-1.5 transition-all hover:border-indigo-300 dark:hover:border-indigo-700"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                        {sub.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What You Should Be Able to Understand or Do After Completing the Topic */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              What You Will Be Able to Understand or Do After Completing This Topic:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {content.learningObjectives.learningOutcomes?.map((out: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{out}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Concepts Covered Badge Bar */}
      {content?.conceptsCovered && (
        <div className="glass-card p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/50 via-purple-50/20 to-transparent dark:from-indigo-950/30 dark:via-purple-950/10 space-y-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Exact Concepts Tested in this Topic Quiz:
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {content.conceptsCovered.map((concept: string, idx: number) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 shadow-sm"
              >
                ✓ {concept}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Lesson Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core Lesson Body */}
        <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
            {content?.conceptsMarkdown}
          </div>

          {/* Practical Code Examples */}
          {content?.examples && (
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-500" />
                Practical Code Examples
              </h3>
              {content.examples.map((ex: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 text-slate-100 text-xs font-mono p-4 space-y-2 shadow-lg"
                >
                  <span className="text-xs text-indigo-400 font-sans font-bold block">{ex.title}</span>
                  <pre className="overflow-x-auto text-[11px] text-teal-300 leading-relaxed font-mono">
                    {ex.codeSnippet}
                  </pre>
                  <p className="mt-2 text-[11px] font-sans text-slate-400 leading-normal">{ex.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {/* Common Mistakes to Avoid */}
          {content?.commonMistakes && (
            <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 text-xs space-y-2.5">
              <span className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Common Industry Pitfalls & Traps to Avoid:
              </span>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 list-disc list-inside leading-relaxed">
                {content.commonMistakes.map((mis: string, i: number) => (
                  <li key={i}>{mis}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Complete Topic & Launch Quiz Callout */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl shadow-indigo-600/20">
            <div>
              <span className="text-base font-extrabold block">Ready to Prove Mastery?</span>
              <p className="text-xs text-indigo-200 mt-0.5">
                Take the 10-question topic quiz. Scores of 75% or higher unlock roadmap progress and qualify you for mock interview practice.
              </p>
            </div>
            <button
              onClick={handleCompleteAndQuiz}
              className="px-6 py-3 rounded-xl bg-white text-indigo-900 hover:bg-slate-100 font-extrabold text-xs shrink-0 shadow-md transition-all hover:scale-105 flex items-center gap-1.5"
            >
              <span>Launch Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sidebar: Self-check & Vetted Resources */}
        <div className="space-y-6">
          {/* Self-check questions */}
          <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Self-Check Concept Verifiers
            </h3>
            <div className="space-y-3 text-xs">
              {content?.checkQuestions?.map((cq: any, i: number) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-100 block">Q: {cq.question}</span>
                  <span className="text-slate-600 dark:text-slate-300 block text-[11px] leading-relaxed">
                    A: {cq.answer}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Vetted Resource Library */}
          <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400">
                Vetted Documentation
              </h3>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-[11px] text-slate-500">
              Only verified documentation and reference guides are shown.
            </p>
            <div className="space-y-2">
              {content?.approvedResources?.map((res: any) => (
                <a
                  key={res.url}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs transition-colors group"
                >
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {res.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{res.provider} • Verified</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TOPIC-SPECIFIC ADAPTIVE QUIZ MODAL */}
      {isQuizOpen && quiz && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-3xl w-full max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/20 uppercase tracking-wider">
                    {isRevisionMode ? 'Adaptive Revision Quiz' : 'Topic-Specific Assessment'}
                  </span>
                  <span className="text-[11px] text-indigo-200">
                    Difficulty: {quiz.difficulty}
                  </span>
                </div>
                <h3 className="font-heading font-extrabold text-lg mt-0.5">
                  {quiz.topicTitle}
                </h3>
              </div>
              <button
                onClick={() => setIsQuizOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            {/* Questions List or Results View */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {!quizResult ? (
                <>
                  {quiz.studentContextMessage && (
                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-200 text-xs font-medium flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{quiz.studentContextMessage}</span>
                    </div>
                  )}

                  {quiz.questions.map((q: any, idx: number) => (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-3.5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                          {idx + 1}. {q.questionText}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {q.conceptTag && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-semibold border border-indigo-200/50">
                              {q.conceptTag}
                            </span>
                          )}
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                            {q.type}
                          </span>
                        </div>
                      </div>

                      {/* MCQ Options */}
                      {q.options && q.options.length > 0 ? (
                        <div className="space-y-2">
                          {q.options.map((opt: string) => (
                            <label
                              key={opt}
                              className={`flex items-center gap-3 p-3 rounded-xl text-xs cursor-pointer border transition-colors ${
                                answers[q.id] === opt
                                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-800 dark:text-indigo-200 font-semibold'
                                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name={q.id}
                                value={opt}
                                checked={answers[q.id] === opt}
                                onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <textarea
                          rows={2}
                          placeholder="Type your explanation..."
                          value={answers[q.id] || ''}
                          onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                          className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      )}
                    </div>
                  ))}
                </>
              ) : (
                /* QUIZ RESULT SCREEN WITH MASTERED & WEAK CONCEPTS */
                <div className="space-y-6">
                  {/* Score Card */}
                  <div
                    className={`p-6 rounded-3xl border text-center space-y-2 ${
                      quizResult.passed
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                        : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                    }`}
                  >
                    <span className="text-4xl font-extrabold font-mono block">
                      {quizResult.percentage}%
                    </span>
                    <span className="text-sm font-bold block">
                      {quizResult.passed
                        ? '🎉 Topic Mastery Achieved!'
                        : '⚠️ Needs Revision on Specific Concepts'}
                    </span>
                    <p className="text-xs max-w-lg mx-auto opacity-90 leading-relaxed">
                      {quizResult.adaptiveFeedback}
                    </p>
                  </div>

                  {/* Mastered Concepts Pills */}
                  {quizResult.masteredConcepts?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-2">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Concepts Mastered:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {quizResult.masteredConcepts.map((c: string, i: number) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200"
                          >
                            ✓ {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Weak Concepts Pills */}
                  {quizResult.weakConcepts?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 space-y-2">
                      <span className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-500" />
                        Identified Weak Areas / Mistakes:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {quizResult.weakConcepts.map((c: string, i: number) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200"
                          >
                            • {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action CTAs */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    {!quizResult.passed ? (
                      <button
                        onClick={() => handleStartQuiz('BEGINNER', true)}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Retake Adaptive Revision Quiz</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('/interview')}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
                      >
                        <span>Practice in Mock Interview</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setIsQuizOpen(false)}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                    >
                      Close Quiz
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            {!quizResult && (
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Answered: {Object.keys(answers).length} / {quiz.questions.length}
                </span>
                <button
                  onClick={handleSubmitQuiz}
                  disabled={submittingQuiz || Object.keys(answers).length === 0}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
                >
                  {submittingQuiz ? 'Grading Answers...' : 'Submit Quiz for Grading'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
