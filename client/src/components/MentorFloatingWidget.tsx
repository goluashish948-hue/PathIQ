import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const MentorFloatingWidget: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && isOpen && messages.length === 0) {
      loadMessages();
    }
  }, [user, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadMessages() {
    try {
      const history = await api.getMentorMessages();
      setMessages(history);
    } catch (err) {
      console.warn('Could not load mentor messages');
    }
  }

  async function handleSend(textToSend?: string) {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg = { id: `temp-${Date.now()}`, sender: 'student', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await api.sendMentorMessage(text);
      setMessages(prev => [...prev, response]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'mentor',
          text: 'Maaf kijiye, temporary issue hai. Kripya dobara try karein.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExecuteAction(action: any) {
    if (action.type === 'RECALCULATE_ROADMAP') {
      try {
        const diff = await api.previewReplan('HOURS_CHANGED', action.preview?.newHours || 5);
        await api.adoptReplan(diff.id);
        setActionSuccessMessage(`Roadmap recalculated to ${action.preview?.newHours || 5}h/week!`);
        setTimeout(() => setActionSuccessMessage(null), 4000);
      } catch (err) {
        console.error('Replan failed', err);
      }
    } else if (action.type === 'SWITCH_GOAL') {
      try {
        await api.generateRoadmap({
          targetCareer: action.preview?.targetCareer || 'Data Scientist',
          trackType: 'STRONG',
          weeklyHours: 10,
        });
        setActionSuccessMessage(`Target career updated to ${action.preview?.targetCareer || 'Data Scientist'}!`);
        setTimeout(() => setActionSuccessMessage(null), 4000);
      } catch (err) {
        console.error('Goal switch failed', err);
      }
    } else if (action.type === 'START_QUIZ') {
      window.location.href = '/learn';
    }
  }

  const promptChips = [
    'Mujhe ab kya padhna chahiye?',
    'Mere paas ab 5 hours/week hain.',
    'What should I learn next?',
    'Probability samajh nahi aa rahi.',
  ];

  if (!user) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all group"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white animate-pulse" />
          </div>
          <span>Ask Career Mentor</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[380px] sm:w-[440px] h-[580px] max-h-[85vh] glass-panel rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm tracking-tight flex items-center gap-1.5">
                  AI Career Mentor
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-white/20 text-white">Roadmap-Aware</span>
                </h3>
                <p className="text-[11px] text-indigo-200">Hindi • English • Hinglish</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Success Toast */}
          {actionSuccessMessage && (
            <div className="bg-emerald-500 text-white text-xs px-3 py-2 flex items-center gap-2 font-medium animate-in fade-in">
              <CheckCircle className="w-4 h-4 shrink-0" />
              {actionSuccessMessage}
            </div>
          )}

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m, idx) => {
              const isUser = m.sender === 'student';
              const citations = m.citations ? (typeof m.citations === 'string' ? JSON.parse(m.citations) : m.citations) : null;
              const action = m.proposedAction ? (typeof m.proposedAction === 'string' ? JSON.parse(m.proposedAction) : m.proposedAction) : null;

              return (
                <div key={m.id || idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[88%] p-3 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                    }`}
                  >
                    {m.text}

                    {/* Citations Tag: Why + Evidence + Confidence */}
                    {!isUser && citations && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
                        <div className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Why: {citations.why}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <span>Evidence: {citations.evidence?.[0]}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[9px]">
                            Confidence: {citations.confidenceLabel} ({(citations.confidenceScore * 100).toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action proposal button */}
                    {!isUser && action && (
                      <div className="mt-3 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800">
                        <div className="font-semibold text-indigo-900 dark:text-indigo-200 text-xs mb-1">
                          {action.title}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-2">
                          {action.description}
                        </p>
                        <button
                          onClick={() => handleExecuteAction(action)}
                          className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                        >
                          <span>Confirm & Apply</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                <Bot className="w-3.5 h-3.5 animate-spin" />
                <span>Mentor analyzing roadmap and Career Twin...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Chips */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {promptChips.map(chip => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything in English or Hindi..."
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !inputText.trim()}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
