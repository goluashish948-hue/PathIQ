import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Send,
  Sparkles,
  Bot,
  Award,
  CheckCircle2,
  HelpCircle,
  FileText,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  AlertCircle,
  Briefcase,
  Layers,
  Target,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';

export const InterviewPage: React.FC = () => {
  const [turns, setTurns] = useState<any[]>([]);
  const [studentContext, setStudentContext] = useState<any>(null);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(1);
  const [candidateResponse, setCandidateResponse] = useState('');
  const [followUpResponse, setFollowUpResponse] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<any>(null);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [readinessProfile, setReadinessProfile] = useState<any>(null);
  const [answeringFollowUp, setAnsweringFollowUp] = useState(false);
  const [evalError, setEvalError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  async function loadQuestions() {
    try {
      setEvalError(null);
      const res = await api.getInterviewQuestions();
      setTurns(res.turns || []);
      if (res.studentContext) {
        setStudentContext(res.studentContext);
      }
    } catch (err: any) {
      console.error(err);
      setEvalError(err?.message || 'Could not load interview questions. Please refresh the page.');
    }
  }

  async function handleEvaluateTurn() {
    if (!candidateResponse.trim() || evaluating) return;
    setEvaluating(true);
    setEvalError(null);
    try {
      const currentTurn = turns.find(t => t.turnIndex === currentTurnIndex);
      const res = await api.evaluateInterviewTurn(
        currentTurnIndex,
        candidateResponse,
        currentTurn?.question || '',
        studentContext
      );

      setCurrentEvaluation({
        ...res,
        turnIndex: currentTurnIndex,
        candidateResponse,
      });

      setEvaluations(prev => [
        ...prev,
        { turnIndex: currentTurnIndex, ...res, candidateResponse },
      ]);
    } catch (err: any) {
      console.error(err);
      setEvalError(err?.message || 'Evaluation request failed. Please check your network and try again.');
    } finally {
      setEvaluating(false);
    }
  }

  async function handleProceedToNext() {
    setCurrentEvaluation(null);
    setCandidateResponse('');
    setFollowUpResponse('');
    setAnsweringFollowUp(false);
    setEvalError(null);

    try {
      if (currentTurnIndex < turns.length) {
        setCurrentTurnIndex(prev => prev + 1);
      } else {
        // Final interview turn completed: load readiness profile
        const prof = await api.getReadinessProfile();
        setReadinessProfile(prof);
      }
    } catch (err: any) {
      console.error(err);
      setEvalError(err?.message || 'Could not generate final readiness profile.');
    }
  }

  const currentTurn = turns.find(t => t.turnIndex === currentTurnIndex);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in pb-20">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Personalized AI Technical Interviewer
            </span>
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
              Target: {studentContext?.targetCareer || 'ML Engineer'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            Career Readiness Mock Interview
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Questions tailored directly to your completed topics, project architecture, verified skills, and identified quiz weak areas.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs text-slate-400 block">Interview Progress</span>
          <span className="text-xl sm:text-2xl font-extrabold font-heading text-indigo-600 dark:text-indigo-400">
            {evaluations.length} / {turns.length || 4} Questions
          </span>
        </div>
      </div>

      {/* Personalized Context Banner */}
      {studentContext && (
        <div className="glass-card p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/50 via-purple-50/20 to-transparent dark:from-indigo-950/30 dark:via-purple-950/10 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Interview Profile Context:
          </span>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 font-semibold flex items-center gap-1">
              <Target className="w-3 h-3" />
              Role: {studentContext.targetCareer}
            </span>

            {studentContext.projects?.length > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 font-semibold flex items-center gap-1">
                <Layers className="w-3 h-3" />
                Project: {studentContext.projects[0].title}
              </span>
            )}

            {studentContext.completedTopics?.length > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                Topics: {studentContext.completedTopics.slice(0, 3).join(', ')}
              </span>
            )}

            {studentContext.weakAreas?.length > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Probing Focus: {studentContext.weakAreas[0]}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Turn Card */}
      {!readinessProfile ? (
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          {evalError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{evalError}</span>
              </div>
              <button
                onClick={() => setEvalError(null)}
                className="text-[11px] font-bold text-rose-600 hover:underline shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {currentTurn ? (
            <>
              {/* Question from Interviewer */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-slate-50 dark:from-indigo-950/50 dark:via-purple-950/30 dark:to-slate-900/40 border border-indigo-200 dark:border-indigo-800 space-y-2.5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
                      Interviewer Question #{currentTurn.turnIndex} ({currentTurn.category.replace(/_/g, ' ')})
                    </span>
                  </div>
                  {currentTurn.contextExplanation && (
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold">
                      {currentTurn.contextExplanation}
                    </span>
                  )}
                </div>

                <p className="text-base font-bold text-slate-900 dark:text-slate-100 leading-relaxed pt-1">
                  "{currentTurn.question}"
                </p>
              </div>

              {/* If answer has not yet been evaluated for this turn */}
              {!currentEvaluation ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Your Technical Answer:
                    </label>
                    <textarea
                      value={candidateResponse}
                      onChange={e => setCandidateResponse(e.target.value)}
                      placeholder="Explain your technical rationale, architecture, metrics, and trade-offs here..."
                      className="w-full h-36 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
                    />
                  </div>

                  {/* Pre-fill suggestion button */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>Need inspiration?</span>
                    <button
                      onClick={() => {
                        if (currentTurn.turnIndex === 1) {
                          setCandidateResponse(
                            'For my fraud detection pipeline, I chose XGBoost combined with velocity feature aggregation. I evaluated Precision-Recall AUC rather than accuracy, calibrated the decision threshold using a business cost matrix to penalize false negatives, and designed a fallback queue for borderline anomalies.'
                          );
                        } else if (currentTurn.category === 'TECHNICAL') {
                          setCandidateResponse(
                            'I structure pure data transformation functions with explicit type hints, avoiding mutable default arguments. In SQL joins, I ensure join predicates stay in the ON clause to avoid converting LEFT JOINs into unintended INNER JOINs, and always index join keys.'
                          );
                        } else {
                          setCandidateResponse(
                            'To handle extreme class imbalance, I use scale_pos_weight in gradient boosting and calibrate probability thresholds. In low-latency architectures, I deploy Redis for pre-computed user velocity features with p99 response times under 20ms.'
                          );
                        }
                      }}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                    >
                      Insert tailored candidate response
                    </button>
                  </div>

                  <button
                    onClick={handleEvaluateTurn}
                    disabled={evaluating || !candidateResponse.trim()}
                    className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.01]"
                  >
                    {evaluating ? 'AI Rubric Scorer Evaluating...' : 'Submit Answer for Rubric Evaluation'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* EVALUATION RESULT & REAL-TIME FOLLOW-UP QUESTION VIEW */
                <div className="space-y-5 animate-in fade-in">
                  {/* Score & Rubric Breakdown */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-sm block">
                          Rubric Evaluation Score:
                        </span>
                        <span className="text-xs text-slate-500">
                          Evaluated against senior engineering rubrics
                        </span>
                      </div>
                      <span className="text-3xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
                        {currentEvaluation.score} / 100
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Technical</span>
                        <strong className="text-slate-800 dark:text-slate-200">
                          {currentEvaluation.breakdown.technicalCorrectness} / 25
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Problem Solving</span>
                        <strong className="text-slate-800 dark:text-slate-200">
                          {currentEvaluation.breakdown.problemSolving} / 25
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Communication</span>
                        <strong className="text-slate-800 dark:text-slate-200">
                          {currentEvaluation.breakdown.communicationStructure} / 25
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Domain Fit</span>
                        <strong className="text-slate-800 dark:text-slate-200">
                          {currentEvaluation.breakdown.domainRelevance} / 25
                        </strong>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 pt-2 leading-relaxed">
                      {currentEvaluation.feedback}
                    </p>
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-1.5">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                        Demonstrated Strengths:
                      </span>
                      <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                        {currentEvaluation.strengths.map((s: string, idx: number) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-1.5">
                      <span className="font-bold text-amber-800 dark:text-amber-300 block">
                        Areas for Next Round:
                      </span>
                      <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                        {currentEvaluation.improvements.map((imp: string, idx: number) => (
                          <li key={idx}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* REAL-TIME INTERVIEWER FOLLOW-UP QUESTION */}
                  {currentEvaluation.followUpQuestion && (
                    <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border-2 border-indigo-500/40 space-y-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
                          Interviewer Follow-Up Question:
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 italic">
                        "{currentEvaluation.followUpQuestion}"
                      </p>

                      {answeringFollowUp ? (
                        <div className="space-y-2 pt-2">
                          <textarea
                            rows={3}
                            value={followUpResponse}
                            onChange={e => setFollowUpResponse(e.target.value)}
                            placeholder="Address the follow-up question directly..."
                            className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                          />
                          <button
                            onClick={() => {
                              handleProceedToNext();
                            }}
                            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                          >
                            Submit Follow-Up & Next
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => setAnsweringFollowUp(true)}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                          >
                            <span>Respond to Follow-Up</span>
                          </button>
                          <button
                            onClick={handleProceedToNext}
                            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs"
                          >
                            Proceed to Next Question →
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {!currentEvaluation.followUpQuestion && (
                    <button
                      onClick={handleProceedToNext}
                      className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                    >
                      <span>Proceed to Next Question</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-xs text-slate-500">Loading personalized interview...</p>
          )}

          {/* Past turns evaluation history */}
          {evaluations.length > 0 && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400">
                Completed Interview Questions Summary
              </h4>
              <div className="space-y-2">
                {evaluations.map((ev, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        Question #{ev.turnIndex}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate max-w-md block">
                        {ev.feedback}
                      </span>
                    </div>
                    <span className="font-mono font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">
                      {ev.score} / 100
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* CAREER READINESS PROFILE FINAL CERTIFICATE VIEW */
        <div className="glass-card p-8 rounded-3xl border border-emerald-300 dark:border-emerald-800 space-y-6 animate-in zoom-in-95 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
                  Career Readiness Profile Certified
                </h2>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                  {readinessProfile.readinessBand} • Confirmed High Fit
                </span>
              </div>
            </div>
            <span className="text-3xl sm:text-4xl font-extrabold font-heading text-indigo-600 dark:text-indigo-400 font-mono">
              {readinessProfile.readinessScore}% Fit
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-3">
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm block">
              Verified Capabilities Added to Career Twin:
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
              {readinessProfile.verifiedSkills?.map((s: string, idx: number) => (
                <li key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-semibold">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-xs space-y-1.5 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
            <span className="font-bold text-indigo-900 dark:text-indigo-200 block text-sm">
              AI Career Mentor Next Milestones:
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {readinessProfile.gapSummary}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                setReadinessProfile(null);
                setEvaluations([]);
                setCurrentTurnIndex(1);
                loadQuestions();
              }}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retake Mock Interview with New Questions</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
