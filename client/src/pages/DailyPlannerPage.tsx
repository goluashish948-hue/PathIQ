import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Download,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Square,
  Edit3,
  Plus,
  Trash2,
  TrendingUp,
  Award,
  AlertCircle,
  Flame,
  Volume2,
  Save,
  Check,
  ChevronRight,
  History,
  BarChart3,
  Lightbulb,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Synthesize pleasant completion chime via Web Audio API
function playCompletionChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';

    const now = ctx.currentTime;
    // Two-tone bell chime: D5 (587Hz) then A5 (880Hz)
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.setValueAtTime(880.0, now + 0.18);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    osc.start(now);
    osc.stop(now + 0.9);
  } catch (err) {
    console.warn('Audio chime playback notice:', err);
  }
}

// Format seconds into MM:SS
function formatSeconds(secs: number): string {
  const safeSecs = Math.max(0, Math.floor(secs));
  const m = Math.floor(safeSecs / 60);
  const s = safeSecs % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Format remaining seconds into friendly readable text (Hindi + English)
function formatRemainingHuman(secs: number): string {
  const safeSecs = Math.max(0, Math.floor(secs));
  const m = Math.floor(safeSecs / 60);
  const s = safeSecs % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

interface BlockTimerState {
  secondsLeft: number;
  totalSeconds: number;
  elapsedSeconds: number;
  isRunning: boolean;
  hasStarted: boolean;
}

export const DailyPlannerPage: React.FC = () => {
  const { user } = useAuth();
  const [minutes, setMinutes] = useState(120);
  const [todayData, setTodayData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Per-block timer states so each task retains its exact countdown & progress
  const [blockTimers, setBlockTimers] = useState<Record<string, BlockTimerState>>({});
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  // Modals & form states
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editDuration, setEditDuration] = useState<number>(45);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState(45);
  const [newTaskCategory, setNewTaskCategory] = useState('learn');

  // End of Day Performance Save state
  const [performanceNotes, setPerformanceNotes] = useState('');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);
  const [completionAlert, setCompletionAlert] = useState<{ title: string; minutes: number } | null>(null);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    try {
      const [todayRes, historyRes, recoRes] = await Promise.all([
        api.getTodayPlan(minutes),
        api.getDailyHistory(),
        api.getDailyRecommendations(),
      ]);
      setTodayData(todayRes);
      setHistoryData(historyRes);
      setRecommendations(recoRes);
      if (todayRes?.notes) {
        setPerformanceNotes(todayRes.notes);
      }

      // Initialize block timers for today's tasks
      if (todayRes?.blocks) {
        setBlockTimers(prev => {
          const next = { ...prev };
          todayRes.blocks.forEach((b: any) => {
            const durSecs = (b.durationMinutes || 45) * 60;
            const actualSecs = (b.actualMinutes || 0) * 60;
            const remSecs = b.isCompleted ? 0 : Math.max(0, durSecs - actualSecs);
            if (!next[b.id]) {
              next[b.id] = {
                secondsLeft: remSecs > 0 ? remSecs : durSecs,
                totalSeconds: durSecs,
                elapsedSeconds: actualSecs,
                isRunning: false,
                hasStarted: actualSecs > 0 && !b.isCompleted,
              };
            }
          });
          return next;
        });
      }
    } catch (err) {
      console.error('Failed to load daily planner data', err);
    } finally {
      setLoading(false);
    }
  }

  // Active Timer Tick Loop: Decrement active block's countdown every single second
  useEffect(() => {
    if (!activeBlockId) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const currentTimer = blockTimers[activeBlockId];
    if (!currentTimer?.isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setBlockTimers(prev => {
        const current = prev[activeBlockId];
        if (!current || !current.isRunning) return prev;

        if (current.secondsLeft <= 1) {
          clearInterval(timerRef.current);
          handleTimerComplete(activeBlockId);
          return {
            ...prev,
            [activeBlockId]: {
              ...current,
              secondsLeft: 0,
              elapsedSeconds: current.elapsedSeconds + 1,
              isRunning: false,
              hasStarted: true,
            },
          };
        }

        return {
          ...prev,
          [activeBlockId]: {
            ...current,
            secondsLeft: current.secondsLeft - 1,
            elapsedSeconds: current.elapsedSeconds + 1,
          },
        };
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeBlockId, blockTimers[activeBlockId || '']?.isRunning]);

  // When timer finishes (reaches 00:00)
  async function handleTimerComplete(blockId: string) {
    playCompletionChime();
    confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });

    const block = todayData?.blocks?.find((b: any) => b.id === blockId);
    const timer = blockTimers[blockId];
    const studiedMins = timer ? Math.max(1, Math.round(timer.totalSeconds / 60)) : (block?.durationMinutes || 45);

    setCompletionAlert({
      title: block?.title || 'Study Session',
      minutes: studiedMins,
    });

    try {
      await api.updateDailyBlock({
        blockId,
        actualMinutes: studiedMins,
        isCompleted: true,
        status: 'COMPLETED',
      });

      const freshToday = await api.getTodayPlan(minutes);
      const freshHistory = await api.getDailyHistory();
      setTodayData(freshToday);
      setHistoryData(freshHistory);
    } catch (err) {
      console.error('Failed to sync completed timer block', err);
    }
  }

  // Timer controls per block
  function startTimer(blockId: string) {
    setBlockTimers(prev => {
      const updated = { ...prev };
      // Pause any other block
      Object.keys(updated).forEach(id => {
        if (id !== blockId && updated[id].isRunning) {
          updated[id] = { ...updated[id], isRunning: false };
        }
      });

      const block = todayData?.blocks?.find((b: any) => b.id === blockId);
      const durSecs = (block?.durationMinutes || 45) * 60;
      const existing = updated[blockId] || {
        secondsLeft: durSecs,
        totalSeconds: durSecs,
        elapsedSeconds: 0,
        isRunning: false,
        hasStarted: false,
      };

      updated[blockId] = {
        ...existing,
        isRunning: true,
        hasStarted: true,
        secondsLeft: existing.secondsLeft > 0 ? existing.secondsLeft : durSecs,
      };
      return updated;
    });
    setActiveBlockId(blockId);
  }

  function pauseTimer(blockId: string) {
    setBlockTimers(prev => {
      if (!prev[blockId]) return prev;
      return {
        ...prev,
        [blockId]: {
          ...prev[blockId],
          isRunning: false,
        },
      };
    });
  }

  function resumeTimer(blockId: string) {
    setBlockTimers(prev => {
      const updated = { ...prev };
      // Pause any other running timer
      Object.keys(updated).forEach(id => {
        if (id !== blockId && updated[id].isRunning) {
          updated[id] = { ...updated[id], isRunning: false };
        }
      });

      if (updated[blockId]) {
        updated[blockId] = {
          ...updated[blockId],
          isRunning: true,
          hasStarted: true,
        };
      }
      return updated;
    });
    setActiveBlockId(blockId);
  }

  function resetTimer(blockId: string) {
    setBlockTimers(prev => {
      if (!prev[blockId]) return prev;
      return {
        ...prev,
        [blockId]: {
          ...prev[blockId],
          secondsLeft: prev[blockId].totalSeconds,
          elapsedSeconds: 0,
          isRunning: false,
          hasStarted: false,
        },
      };
    });
  }

  async function stopAndSaveTimer(blockId: string) {
    const timer = blockTimers[blockId];
    if (!timer) return;

    const studiedMins = Math.max(1, Math.round(timer.elapsedSeconds / 60));
    const isCompleted = timer.secondsLeft <= 30;

    setBlockTimers(prev => ({
      ...prev,
      [blockId]: {
        ...prev[blockId],
        isRunning: false,
      },
    }));

    try {
      await api.updateDailyBlock({
        blockId,
        actualMinutes: studiedMins,
        isCompleted,
        status: isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
      });

      const freshToday = await api.getTodayPlan(minutes);
      const freshHistory = await api.getDailyHistory();
      setTodayData(freshToday);
      setHistoryData(freshHistory);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSaveCustomDuration(blockId: string) {
    const newDur = Number(editDuration);
    await api.updateDailyBlock({
      blockId,
      durationMinutes: newDur,
    });

    setBlockTimers(prev => {
      if (!prev[blockId]) return prev;
      const totalSecs = newDur * 60;
      const spent = prev[blockId].elapsedSeconds;
      return {
        ...prev,
        [blockId]: {
          ...prev[blockId],
          totalSeconds: totalSecs,
          secondsLeft: Math.max(0, totalSecs - spent),
        },
      };
    });

    setEditingBlockId(null);
    const freshToday = await api.getTodayPlan(minutes);
    setTodayData(freshToday);
  }

  async function handleToggleManualCompletion(block: any) {
    const newStatus = !block.isCompleted;
    if (newStatus && activeBlockId === block.id) {
      pauseTimer(block.id);
    }

    await api.updateDailyBlock({
      blockId: block.id,
      isCompleted: newStatus,
      actualMinutes: newStatus ? (block.actualMinutes || block.durationMinutes) : 0,
      status: newStatus ? 'COMPLETED' : 'PENDING',
    });

    const freshToday = await api.getTodayPlan(minutes);
    const freshHistory = await api.getDailyHistory();
    setTodayData(freshToday);
    setHistoryData(freshHistory);
  }

  async function handleAddNewTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await api.addDailyTask({
      title: newTaskTitle.trim(),
      durationMinutes: newTaskDuration,
      category: newTaskCategory,
      whyLearningThis: 'Student customized daily priority.',
    });

    setShowAddTask(false);
    setNewTaskTitle('');
    setNewTaskDuration(45);
    const freshToday = await api.getTodayPlan(minutes);
    setTodayData(freshToday);

    if (freshToday?.blocks) {
      const added = freshToday.blocks.find((b: any) => b.title === newTaskTitle.trim());
      if (added) {
        setBlockTimers(prev => ({
          ...prev,
          [added.id]: {
            secondsLeft: newTaskDuration * 60,
            totalSeconds: newTaskDuration * 60,
            elapsedSeconds: 0,
            isRunning: false,
            hasStarted: false,
          },
        }));
      }
    }
  }

  async function handleDeleteBlock(blockId: string) {
    await api.deleteDailyBlock(blockId);
    if (activeBlockId === blockId) {
      setActiveBlockId(null);
    }
    const freshToday = await api.getTodayPlan(minutes);
    setTodayData(freshToday);
  }

  async function handleSaveDailyPerformance() {
    try {
      await api.saveDailyPerformance({
        totalActualMinutes: todayData?.totalActualMinutes || 0,
        notes: performanceNotes,
        quizScore: todayData?.quizScore || 85,
      });
      setSavedSuccessMsg('Daily study performance saved successfully to your Career Twin!');
      setTimeout(() => setSavedSuccessMsg(null), 4000);
      const freshHistory = await api.getDailyHistory();
      setHistoryData(freshHistory);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-slate-500">
        <Sparkles className="w-8 h-8 animate-spin mb-3 text-indigo-500" />
        <p className="text-sm font-medium">Loading your personalized daily study schedule...</p>
      </div>
    );
  }

  const blocks = todayData?.blocks || [];
  const chartData = (historyData?.dailyHistory || []).map((d: any) => ({
    day: d.dayName.substring(0, 3),
    fullName: d.dayName,
    Actual: Math.round((d.actualMinutes / 60) * 10) / 10,
    Planned: Math.round((d.plannedMinutes / 60) * 10) / 10,
    actualMins: d.actualMinutes,
    plannedMins: d.plannedMinutes,
  }));

  const activeBlock = blocks.find((b: any) => b.id === activeBlockId);
  const activeTimer = activeBlockId ? blockTimers[activeBlockId] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in pb-28">
      {/* Top Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Live Study Tracker & Stopwatch
            </span>
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {todayData?.date || new Date().toISOString().split('T')[0]}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            Schedule & Study Timer for Today
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Live ticking countdown timer with real-time remaining time display. Resume anytime to see exact time left to completion.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowAddTask(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
          <a
            href="/api/v1/daily-plan/export-ics"
            download="pathiq-daily-plan.ics"
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Export calendar event"
          >
            <Download className="w-4 h-4" />
            <span>iCal</span>
          </a>
        </div>
      </div>

      {/* Timer Finished Alert Banner */}
      {completionAlert && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl flex items-center justify-between gap-3 animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="font-extrabold text-sm block">
                Study Time Completed! Great Focus!
              </span>
              <p className="text-xs text-emerald-100">
                You successfully finished {completionAlert.minutes} minutes on <strong>{completionAlert.title}</strong>. Roadmap progress updated!
              </p>
            </div>
          </div>
          <button
            onClick={() => setCompletionAlert(null)}
            className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Cards: Planned vs Actual & Daily Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Planned Time */}
        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-indigo-500">
          <span className="text-slate-500 text-xs block mb-1">Planned Study Time</span>
          <div className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
            {todayData?.totalPlannedFormatted || '2h 00m'}
          </div>
          <span className="text-[10px] text-slate-400">{todayData?.totalPlannedMinutes} Total Minutes</span>
        </div>

        {/* Actual Time Studied */}
        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-teal-500">
          <span className="text-slate-500 text-xs block mb-1">Actual Time Studied</span>
          <div className="text-xl sm:text-2xl font-extrabold font-heading text-teal-600 dark:text-teal-400">
            {todayData?.totalActualFormatted || '0m'}
          </div>
          <span className="text-[10px] text-slate-400">
            {todayData?.totalActualMinutes >= todayData?.totalPlannedMinutes
              ? '🎯 Target Met!'
              : `${todayData?.totalPlannedMinutes - todayData?.totalActualMinutes}m remaining`}
          </span>
        </div>

        {/* Topics Finished */}
        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-emerald-500">
          <span className="text-slate-500 text-xs block mb-1">Topics Completed</span>
          <div className="text-xl sm:text-2xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400">
            {todayData?.completedCount} / {blocks.length}
          </div>
          <span className="text-[10px] text-slate-400">{todayData?.completionPercentage}% Finished</span>
        </div>

        {/* Consistency & Streak */}
        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-amber-500">
          <span className="text-slate-500 text-xs block mb-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Study Streak
          </span>
          <div className="text-xl sm:text-2xl font-extrabold font-heading text-amber-600 dark:text-amber-400">
            {historyData?.weeklyStats?.currentStreak || 5} Days
          </div>
          <span className="text-[10px] text-slate-400">94% Consistency</span>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT: Schedule for Today (Left) & Performance History & Visuals (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT 2 COLUMNS: Schedule for Today */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  Schedule for Today
                </h2>
                <p className="text-xs text-slate-500">
                  Topic ke timer ko start ya resume karein. Time live count down hoga aur bacha hua time saaf dikhega.
                </p>
              </div>

              {/* Time Selector pills */}
              <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                {[60, 90, 120, 180].map(mins => (
                  <button
                    key={mins}
                    onClick={() => {
                      setMinutes(mins);
                      api.getTodayPlan(mins).then(setTodayData);
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      todayData?.totalPlannedMinutes === mins
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-500'
                    }`}
                  >
                    {mins / 60}h
                  </button>
                ))}
              </div>
            </div>

            {/* List of Tasks for Today */}
            <div className="space-y-4 pt-2">
              {blocks.map((block: any) => {
                const timer: BlockTimerState = blockTimers[block.id] || {
                  secondsLeft: (block.durationMinutes || 45) * 60,
                  totalSeconds: (block.durationMinutes || 45) * 60,
                  elapsedSeconds: (block.actualMinutes || 0) * 60,
                  isRunning: false,
                  hasStarted: (block.actualMinutes || 0) > 0,
                };

                const isEditingThis = editingBlockId === block.id;
                const percentDone = Math.min(
                  100,
                  Math.round(((timer.totalSeconds - timer.secondsLeft) / timer.totalSeconds) * 100)
                );

                return (
                  <div
                    key={block.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      block.isCompleted
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80'
                        : timer.isRunning
                        ? 'bg-indigo-50/90 dark:bg-indigo-950/50 border-indigo-500 shadow-lg ring-2 ring-indigo-500/30'
                        : timer.hasStarted
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/60'
                        : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Row: Checkbox, Title, Category Pill, Status Badge & Delete */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <button
                            type="button"
                            onClick={() => handleToggleManualCompletion(block)}
                            className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors shrink-0"
                            title="Toggle completion status"
                          >
                            <CheckCircle2
                              className={`w-5 h-5 ${
                                block.isCompleted
                                  ? 'text-emerald-500 fill-emerald-100 dark:fill-emerald-950'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          </button>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span
                                className={`font-bold text-sm sm:text-base ${
                                  block.isCompleted ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                                }`}
                              >
                                {block.title}
                              </span>

                              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                {block.category || 'learn'}
                              </span>

                              {/* Live Status Indicators */}
                              {timer.isRunning && (
                                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 animate-pulse">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                  ● TIMER CHAL RAHA HAI
                                </span>
                              )}

                              {timer.hasStarted && !timer.isRunning && !block.isCompleted && (
                                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                                  <Pause className="w-2.5 h-2.5" />
                                  PAUSED
                                </span>
                              )}

                              {block.isCompleted && (
                                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                                  <Check className="w-2.5 h-2.5" />
                                  COMPLETED
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {block.whyLearningThis || 'Direct milestone in your career roadmap.'}
                            </p>
                          </div>
                        </div>

                        {/* Delete Task Button */}
                        <button
                          onClick={() => handleDeleteBlock(block.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0"
                          title="Remove task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Middle: Planned Duration and Custom Time Setting */}
                      <div className="flex flex-wrap items-center gap-3 text-xs pt-0.5">
                        {isEditingThis ? (
                          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                            <input
                              type="number"
                              min="5"
                              max="240"
                              step="5"
                              value={editDuration}
                              onChange={e => setEditDuration(Number(e.target.value))}
                              className="w-16 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold"
                            />
                            <span className="text-xs text-slate-500">min</span>
                            <button
                              onClick={() => handleSaveCustomDuration(block.id)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[11px] hover:bg-indigo-500"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingBlockId(null)}
                              className="px-2 py-1 text-slate-400 hover:text-slate-200 text-[11px]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 font-semibold text-[11px] text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                              Planned: {block.durationMinutes} min
                            </span>
                            {!block.isCompleted && (
                              <button
                                onClick={() => {
                                  setEditingBlockId(block.id);
                                  setEditDuration(block.durationMinutes);
                                }}
                                className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                                title="Change planned time (e.g. 45 min -> 60 min)"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {block.actualMinutes > 0 && (
                              <span className="px-2.5 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 font-semibold text-[11px] text-teal-700 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/50">
                                Actual: {block.actualMinutes} min
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* PROMINENT LIVE DIGITAL COUNTDOWN & TIME REMAINING CALLOUT */}
                      {timer.hasStarted && !block.isCompleted && (
                        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-purple-50/40 to-slate-50/50 dark:from-indigo-950/50 dark:via-purple-950/30 dark:to-slate-900/40 border border-indigo-200 dark:border-indigo-800/80 shadow-sm space-y-2.5 animate-in fade-in">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            {/* Live Digital Display */}
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                  timer.isRunning
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 animate-pulse'
                                    : 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                                }`}
                              >
                                <Clock className={`w-4 h-4 ${timer.isRunning ? 'animate-spin' : ''}`} />
                              </div>

                              <div>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-2xl sm:text-3xl font-mono font-extrabold tracking-wider text-indigo-700 dark:text-indigo-300">
                                    {formatSeconds(timer.secondsLeft)}
                                  </span>
                                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                    {timer.isRunning ? 'countdown chal raha hai' : 'timer paused hai'}
                                  </span>
                                </div>

                                {/* Exact remaining time prompt in Hindi/English */}
                                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                                  <span>⏳ Pura hone mai bacha hai:</span>
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 font-mono text-emerald-800 dark:text-emerald-300">
                                    {formatRemainingHuman(timer.secondsLeft)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Completed vs Planned info */}
                            <div className="text-right text-xs">
                              <span className="text-slate-500 block">
                                Padh chuke hain:{' '}
                                <strong className="text-slate-800 dark:text-slate-200">
                                  {Math.floor(timer.elapsedSeconds / 60)}m {timer.elapsedSeconds % 60}s
                                </strong>
                              </span>
                              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                                {percentDone}% complete
                              </span>
                            </div>
                          </div>

                          {/* Live Progress Bar on the Card */}
                          <div className="w-full bg-slate-200 dark:bg-slate-700/60 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                timer.isRunning
                                  ? 'bg-gradient-to-r from-indigo-500 to-teal-400'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${percentDone}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Bottom Row: Control Buttons (Start / Pause / Resume / Reset / Done) */}
                      <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/80">
                        {!block.isCompleted ? (
                          <div className="flex flex-wrap items-center gap-2">
                            {timer.isRunning ? (
                              /* Active Pause Button */
                              <button
                                onClick={() => pauseTimer(block.id)}
                                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-105"
                                title="Pause timer"
                              >
                                <Pause className="w-3.5 h-3.5" />
                                <span>Pause</span>
                              </button>
                            ) : timer.hasStarted ? (
                              /* RESUME BUTTON: Prominently shows remaining time bacha hai */
                              <button
                                onClick={() => resumeTimer(block.id)}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
                                title="Resume timer"
                              >
                                <Play className="w-3.5 h-3.5 fill-white" />
                                <span>
                                  Resume ({formatRemainingHuman(timer.secondsLeft)} bacha hai)
                                </span>
                              </button>
                            ) : (
                              /* Initial Start Button */
                              <button
                                onClick={() => startTimer(block.id)}
                                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
                                title="Start study timer"
                              >
                                <Play className="w-3.5 h-3.5 fill-white" />
                                <span>Start Timer ({block.durationMinutes} min)</span>
                              </button>
                            )}

                            {/* Reset Button (visible when timer has started) */}
                            {timer.hasStarted && (
                              <button
                                onClick={() => resetTimer(block.id)}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                                title="Reset timer to beginning"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Finish & Save Button */}
                            {timer.hasStarted && (
                              <button
                                onClick={() => stopAndSaveTimer(block.id)}
                                className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1 transition-colors"
                                title="Save current progress"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Save Progress</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5" />
                              {block.actualMinutes || block.durationMinutes} minutes Completed
                            </span>
                          </div>
                        )}

                        <span className="text-[11px] text-slate-400">
                          {block.isCompleted ? 'Roadmap Updated' : 'Auto-syncs with Roadmap'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* End of Day Save Performance Section */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Save className="w-5 h-5 text-indigo-500" />
                End of Day Performance Review
              </h3>
              {savedSuccessMsg && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Save your daily study reflection. This permanently logs your hours in your Career Twin and updates your weekly study consistency score.
            </p>

            <textarea
              rows={2}
              value={performanceNotes}
              onChange={e => setPerformanceNotes(e.target.value)}
              placeholder="e.g. Completed SQL window functions. Found LAG() very intuitive. Next, need to practice multi-table joins."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={handleSaveDailyPerformance}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
            >
              <Save className="w-4 h-4" />
              <span>Save Today's Performance Snapshot</span>
            </button>
          </div>
        </div>

        {/* RIGHT 1 COLUMN: Study History, Charts & AI Recommendations */}
        <div className="space-y-6">
          {/* Study History Chart (Weekly Visualization) */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-500" />
                Weekly Study History
              </h3>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                {historyData?.weeklyStats?.totalFormatted || '14h 25m'} Total
              </span>
            </div>

            {/* Recharts Bar Chart */}
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} unit="h" />
                  <Tooltip
                    formatter={(val: any) => [`${val} hours`, 'Studied']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="Actual" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Daily History Breakdown Cards */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider block">
                Daily Study Log Breakdown:
              </span>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {historyData?.dailyHistory?.map((d: any) => (
                  <div
                    key={d.date}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-100 block">
                        {d.dayName} ({d.date.substring(5)})
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {d.topicsCompleted} topics finished
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-indigo-600 dark:text-indigo-400 block font-mono">
                        {d.actualFormatted}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Planned: {d.plannedFormatted}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI-Based Daily Recommendations */}
          <div className="glass-card p-6 rounded-3xl border border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/70 via-purple-50/30 to-transparent dark:from-indigo-950/40 dark:via-purple-950/20 space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-indigo-900 dark:text-indigo-200">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Study Recommendations</span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {recommendations?.message ||
                'Based on your previous performance, tomorrow I recommend 45 minutes of SQL practice, 30 minutes of revision, and a 20-minute adaptive quiz.'}
            </p>

            <div className="space-y-2 pt-1 border-t border-indigo-100 dark:border-indigo-900/60">
              <span className="font-bold text-[10px] uppercase tracking-wider text-slate-500 block">
                Suggested Tomorrow Schedule:
              </span>
              {recommendations?.recommendedTasks?.map((task: any, idx: number) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-indigo-100 dark:border-indigo-800/60 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {task.title}
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-bold">
                    {task.durationMinutes}m
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PERSISTENT FLOATING BOTTOM DOCK: Always visible when any timer is running or paused */}
      {activeBlock && activeTimer && !activeBlock.isCompleted && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xl z-50 bg-slate-900/95 backdrop-blur-xl text-white p-4 rounded-3xl border border-indigo-500/50 shadow-2xl shadow-indigo-950/90 animate-in slide-in-from-bottom-5">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    activeTimer.isRunning
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 animate-pulse'
                      : 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                  }`}
                >
                  <Clock className={`w-5 h-5 ${activeTimer.isRunning ? 'animate-spin' : ''}`} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        activeTimer.isRunning
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {activeTimer.isRunning ? '● RUNNING' : '⏸ PAUSED'}
                    </span>
                    <span className="text-xs text-slate-300 font-semibold truncate max-w-[180px] sm:max-w-[240px]">
                      {activeBlock.title}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-mono font-extrabold tracking-wider text-white">
                      {formatSeconds(activeTimer.secondsLeft)}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">
                      bacha hai ({formatRemainingHuman(activeTimer.secondsLeft)})
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons in dock */}
              <div className="flex items-center gap-2 shrink-0">
                {activeTimer.isRunning ? (
                  <button
                    onClick={() => pauseTimer(activeBlock.id)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs flex items-center gap-1 shadow-md transition-all hover:scale-105"
                    title="Pause timer"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button
                    onClick={() => resumeTimer(activeBlock.id)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs flex items-center gap-1 shadow-md transition-all hover:scale-105"
                    title="Resume timer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Resume ({formatRemainingHuman(activeTimer.secondsLeft)})</span>
                  </button>
                )}

                <button
                  onClick={() => resetTimer(activeBlock.id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Reset timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => stopAndSaveTimer(activeBlock.id)}
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                  title="Finish & Save Time"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Live Progress Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-teal-400 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round(
                      ((activeTimer.totalSeconds - activeTimer.secondsLeft) / activeTimer.totalSeconds) * 100
                    )
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Custom Task */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-sm w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Add Custom Topic / Task
            </h3>

            <form onSubmit={handleAddNewTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Topic Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Python Functions & Scope"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Planned Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="240"
                  step="5"
                  required
                  value={newTaskDuration}
                  onChange={e => setNewTaskDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select
                  value={newTaskCategory}
                  onChange={e => setNewTaskCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="learn">Learn & Theory</option>
                  <option value="practice">Practice Exercises</option>
                  <option value="quiz_revision">Quiz Revision</option>
                  <option value="project">Project Work</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
                >
                  Add to Schedule
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
