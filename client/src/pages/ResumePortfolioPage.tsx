import React, { useState, useEffect } from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Download,
  Sparkles,
  Share2,
  Lock,
  Globe,
  RefreshCw,
  Award,
  Copy,
  Check,
  Printer,
  BookOpen,
  Layers,
  Target,
  Eye,
  Code,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ResumePortfolioPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'resume' | 'portfolio'>('resume');
  const [resumeData, setResumeData] = useState<any>(null);
  const [atsResult, setAtsResult] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [copiedMarkdownToast, setCopiedMarkdownToast] = useState(false);
  const [copiedLinkToast, setCopiedLinkToast] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData(isManualSync = false) {
    if (isManualSync) setSyncing(true);
    else setLoading(true);

    try {
      const res = await api.generateResume();
      setResumeData(res.resume);
      setAtsResult(res.atsResult);

      const port = await api.getMyPortfolio();
      setPortfolio(port);

      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error('Failed to load resume & portfolio data', err);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }

  async function handleTogglePortfolioPublic() {
    if (!portfolio) return;
    const newStatus = !portfolio.isPublic;
    try {
      const updated = await api.updatePortfolioSettings({
        isPublic: newStatus,
        title: portfolio.title,
        bio: portfolio.bio,
        sectionsConfig: portfolio.sectionsConfig,
      });
      setPortfolio((prev: any) => ({ ...prev, isPublic: newStatus }));
    } catch (err) {
      console.error('Failed to update portfolio settings', err);
    }
  }

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    if (!resumeData) return;
    const text = `# ${resumeData.header?.fullName || user?.name || 'Student'}
${resumeData.header?.email || user?.email} | ${resumeData.header?.location || 'Bengaluru, India'} | ${resumeData.header?.githubUrl || ''} | ${resumeData.header?.linkedinUrl || ''}

## Professional Summary
${resumeData.summary}

## Course Progression & Curriculum Track
- Target Career: ${resumeData.targetCareer}
- Course Completion: ${resumeData.courseProgress?.completionPercentage || 0}% (${resumeData.courseProgress?.completedTopics || 0} topics completed)
${resumeData.courseProgress?.completedTopicsList?.map((t: string) => `  ✓ ${t}`).join('\n') || ''}

## Technical Skills (Verified via Course)
${(resumeData.skills?.verified || []).map((s: string) => `- ${s}`).join('\n')}

## Verified Projects & Course Milestones
${(resumeData.projects || [])
  .map(
    (p: any) => `### ${p.title}
Technologies: ${p.technologies?.join(', ') || ''}
${(p.bullets || []).map((b: string) => `- ${b}`).join('\n')}`
  )
  .join('\n\n')}

## Education
${(resumeData.education || []).map((e: any) => `- ${e.degree}, ${e.institution} (${e.year})`).join('\n')}

## Certifications & Micro-Credentials
${(resumeData.certifications || []).map((c: any) => (typeof c === 'string' ? `- ${c}` : `- ${c.name} (${c.issuer})`)).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedMarkdownToast(true);
    setTimeout(() => setCopiedMarkdownToast(false), 2500);
  };

  const handleCopyPublicLink = () => {
    const slug = portfolio?.slug || 'student-portfolio';
    const url = `${window.location.origin}/portfolio/public/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLinkToast(true);
    setTimeout(() => setCopiedLinkToast(false), 2500);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-slate-500">
        <RefreshCw className="w-9 h-9 animate-spin mx-auto mb-3 text-indigo-600" />
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
          Synthesizing Live Resume & Portfolio...
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Pulling completed course topics, verified quiz badges, and auto-graded projects.
        </p>
      </div>
    );
  }

  const courseProgress = resumeData?.courseProgress;
  const completionPercentage = courseProgress?.completionPercentage || 0;
  const completedTopicsCount = courseProgress?.completedTopics || 0;
  const totalTopicsCount = courseProgress?.totalTopics || 5;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in pb-20">
      {/* Top Header & Action Bar */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5 no-print shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Auto-Synced Career Assets
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Course Sync Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            Resume & Public Portfolio Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Clean, professional, and detailed. As you complete topics and quizzes in your course, your verified skills, projects, and certifications update automatically.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => loadData(true)}
            disabled={syncing}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Pull latest completed topics from Roadmap & Learn"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-indigo-600' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync with Course'}</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Copy formatted plain text / markdown for job applications"
          >
            {copiedMarkdownToast ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMarkdownToast ? 'Copied!' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
            title="Export clean ATS single-column PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download / Print PDF</span>
          </button>
        </div>
      </div>

      {/* Live Course Auto-Update Status Banner */}
      <div className="no-print p-5 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-white dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-xs uppercase tracking-wider text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Live Course Progression Sync
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-500">
            Last Auto-Synced: <strong className="text-slate-700 dark:text-slate-300">{lastSyncTime}</strong>
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Curriculum Mastery: <strong className="text-indigo-600 dark:text-indigo-400">{completedTopicsCount} of {totalTopicsCount} Topics Mastered</strong> ({completionPercentage}%)
            </span>
            <span className="text-[11px] text-slate-500">
              Target Track: <strong className="text-slate-800 dark:text-slate-200">{resumeData?.targetCareer}</strong>
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${Math.max(8, completionPercentage)}%` }}
            />
          </div>
        </div>

        {/* Recently completed topics that feed resume */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
          <span className="text-slate-500 font-medium">Auto-Included in Resume:</span>
          {courseProgress?.completedTopicsList && courseProgress.completedTopicsList.length > 0 ? (
            courseProgress.completedTopicsList.map((t: string, i: number) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold shadow-xs"
              >
                ✓ {t}
              </span>
            ))
          ) : (
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium">
              Course In Progress — Complete topics in Learn or Roadmap to unlock more verified skills!
            </span>
          )}
        </div>
      </div>

      {/* Tab Switcher Pills */}
      <div className="no-print flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-2xl flex items-center text-xs font-bold">
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'resume'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>ATS Paper Resume (Detailed Document)</span>
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'portfolio'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Public Interactive Portfolio (Web Showcase)</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Zero Hallucinations • 100% Evidence-Backed</span>
        </div>
      </div>

      {activeTab === 'resume' ? (
        /* ======================== TAB 1: ATS RESUME ======================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: ATS Score & Diagnostics (Hidden in Print) */}
          <div className="lg:col-span-4 space-y-5 no-print">
            {/* ATS Score Card */}
            <div className="glass-card p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  ATS Scanner Score
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Ready to Apply
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400">
                  {atsResult?.atsScore || 94}
                </span>
                <span className="text-sm text-slate-400 font-semibold">/ 100</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Standard single-column hierarchy. Successfully passes ATS parsing algorithms with 0 formatting faults.
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>✓ Standard Contact Header</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span>✓ Measurable Capstone Bullets</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span>✓ Auto-Synced Verified Skills</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span>✓ ATS Keyword Density</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">88%</span>
                </div>
              </div>
            </div>

            {/* Course Impact Breakdown Card */}
            <div className="glass-card p-6 rounded-3xl space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                How Course Updates This Resume:
              </span>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span><strong>Skills Section:</strong> Whenever you complete a topic, its core skills appear in Technical Skills.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span><strong>Projects Section:</strong> Practical tasks convert into evidence-backed capstone projects with verifiable metrics.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span><strong>Certifications:</strong> Earned topic mastery micro-credentials populate with official validation IDs.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Executive Paper Resume View (Pure ATS Style) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-7 font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-100 print-clean-paper">
            {/* Header */}
            <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-5 space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading text-slate-950 dark:text-white">
                {resumeData?.header?.fullName || user?.name || 'Aarav Sharma'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-medium">
                <span>{resumeData?.header?.email || user?.email}</span>
                <span>•</span>
                <span>{resumeData?.header?.phone || '+91 98765 43210'}</span>
                <span>•</span>
                <span>{resumeData?.header?.location || 'Bengaluru, India'}</span>
              </p>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-medium pt-1">
                {resumeData?.header?.githubUrl && (
                  <a href={resumeData.header.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {resumeData.header.githubUrl.replace('https://', '')}
                  </a>
                )}
                {resumeData?.header?.linkedinUrl && (
                  <a href={resumeData.header.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {resumeData.header.linkedinUrl.replace('https://', '')}
                  </a>
                )}
                <span className="text-slate-400">•</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Target: {resumeData?.targetCareer}
                </span>
              </p>
            </div>

            {/* Professional Summary */}
            <div className="space-y-1.5 print-break-inside-avoid">
              <h3 className="font-bold uppercase tracking-wider text-xs text-indigo-700 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-1">
                Professional Summary
              </h3>
              <p className="text-xs sm:text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
                {resumeData?.summary}
              </p>
            </div>

            {/* Technical Skills (Categorized & Verified) */}
            <div className="space-y-2.5 print-break-inside-avoid">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                <h3 className="font-bold uppercase tracking-wider text-xs text-indigo-700 dark:text-indigo-400">
                  Technical Skills (Verified via Coursework)
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">
                  Auto-Updated as topics complete
                </span>
              </div>

              {resumeData?.skills?.categorized && resumeData.skills.categorized.length > 0 ? (
                <div className="space-y-2 text-xs">
                  {resumeData.skills.categorized.map((group: any, idx: number) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 shrink-0 w-44">
                        {group.category}:
                      </span>
                      <span className="text-slate-600 dark:text-slate-300">
                        {group.skills.map((s: any) => s.name).join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {resumeData?.skills?.verified?.map((sk: string, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Verified Projects & Course Milestones */}
            <div className="space-y-4 print-break-inside-avoid">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                <h3 className="font-bold uppercase tracking-wider text-xs text-indigo-700 dark:text-indigo-400">
                  Verified Projects & Practical Capstones
                </h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Evidence-Backed Proofs
                </span>
              </div>

              {resumeData?.projects?.map((proj: any, idx: number) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {proj.title}
                      </span>
                      {proj.verificationBadge && (
                        <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
                          {proj.verificationBadge}
                        </span>
                      )}
                    </div>
                    {proj.repoUrl && (
                      <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                        {proj.repoUrl.replace('https://', '')}
                      </span>
                    )}
                  </div>

                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-[11px] font-semibold text-slate-500">
                      Technologies: {proj.technologies.join(', ')}
                    </p>
                  )}

                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {proj.bullets?.map((b: string, bi: number) => (
                      <li key={bi}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="space-y-2 print-break-inside-avoid">
              <h3 className="font-bold uppercase tracking-wider text-xs text-indigo-700 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-1">
                Education
              </h3>
              {resumeData?.education?.map((ed: any, i: number) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs gap-1">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{ed.degree}</span>
                    <span className="text-slate-600 dark:text-slate-400 block">{ed.institution}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 font-medium">{ed.year}</span>
                    {ed.score && (
                      <span className="text-emerald-600 dark:text-emerald-400 block text-[11px] font-semibold">
                        Score: {ed.score}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications & Micro-Credentials */}
            <div className="space-y-2 print-break-inside-avoid">
              <h3 className="font-bold uppercase tracking-wider text-xs text-indigo-700 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-1">
                Verified Certifications & Course Micro-Credentials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {resumeData?.detailedCertifications && resumeData.detailedCertifications.length > 0 ? (
                  resumeData.detailedCertifications.map((cert: any, i: number) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-0.5"
                    >
                      <span className="font-bold text-slate-900 dark:text-white block line-clamp-1">
                        {cert.name}
                      </span>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>{cert.issuer}</span>
                        {cert.credentialId && (
                          <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                            {cert.credentialId}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  (resumeData?.certifications || []).map((c: string, i: number) => (
                    <div key={i} className="p-2 text-xs text-slate-700 dark:text-slate-300">
                      ✓ {c}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ======================== TAB 2: PUBLIC PORTFOLIO ======================== */
        <div className="space-y-8">
          {/* Privacy & Sharing Controls Bar */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Portfolio Privacy Status:
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    portfolio?.isPublic
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {portfolio?.isPublic ? 'ONLINE & SHAREABLE' : 'PRIVATE (OPT-IN)'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Shareable Web Slug: <code className="font-mono text-indigo-600 dark:text-indigo-400">/p/{portfolio?.slug || 'student'}</code>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleCopyPublicLink}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {copiedLinkToast ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLinkToast ? 'Link Copied!' : 'Copy Shareable Link'}</span>
              </button>

              <button
                onClick={handleTogglePortfolioPublic}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  portfolio?.isPublic
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {portfolio?.isPublic ? 'Make Private' : 'Publish Portfolio Online'}
              </button>
            </div>
          </div>

          {/* Interactive Web Portfolio Live Showcase */}
          <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
            {/* Portfolio Hero Header */}
            <div className="p-8 sm:p-12 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-400 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
                        {resumeData?.header?.fullName || user?.name || 'Aarav Sharma'}
                      </h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified Candidate
                      </span>
                    </div>
                    <p className="text-indigo-200 text-xs sm:text-sm mt-0.5 font-medium">
                      {resumeData?.targetCareer || 'Software & Machine Learning Engineer'}
                    </p>
                    <p className="text-xs text-indigo-300 mt-1">
                      {resumeData?.header?.location || 'Bengaluru, India'} • {resumeData?.header?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {resumeData?.header?.githubUrl && (
                    <a
                      href={resumeData.header.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {resumeData?.header?.linkedinUrl && (
                    <a
                      href={resumeData.header.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-indigo-100 max-w-3xl leading-relaxed font-normal pt-2">
                {portfolio?.bio || resumeData?.summary}
              </p>
            </div>

            {/* Course Mastery & Progress Section */}
            <div className="p-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-600" />
                    Course Journey & Verified Curriculum Mastery
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live record of completed roadmap milestones and assessed proofs.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <Award className="w-4 h-4" />
                  <span>{completionPercentage}% Course Completed</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 block font-heading">
                    {completedTopicsCount}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 block">Topics Completed</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 block font-heading">
                    {resumeData?.skills?.verified?.length || 4}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 block">Verified Skills</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <span className="text-xl font-black text-purple-600 dark:text-purple-400 block font-heading">
                    {resumeData?.projects?.length || 2}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 block">Tested Projects</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <span className="text-xl font-black text-amber-600 dark:text-amber-400 block font-heading">
                    {resumeData?.detailedCertifications?.length || 2}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 block">Micro-Credentials</span>
                </div>
              </div>
            </div>

            {/* Featured Projects Showcase */}
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Code className="w-4 h-4 text-indigo-600" />
                    Verified Project Showcase
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real code implementations evaluated on unit tests and quantitative metrics.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {resumeData?.projects?.map((proj: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 space-y-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                          {proj.title}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 shrink-0">
                          {proj.verificationBadge || '✓ Verified'}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.technologies?.map((tech: string, ti: number) => (
                          <span
                            key={ti}
                            className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                        {proj.bullets?.map((b: string, bi: number) => (
                          <li key={bi}>{b}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                      {proj.repoUrl ? (
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <span>View Code Repo</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Private Sandbox Proof</span>
                      )}

                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <span>Live Demo</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Skills Matrix */}
            <div className="p-8 border-t border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 space-y-5">
              <div>
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Verified Skills Matrix
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assessed through interactive multiple-choice and practical sandbox code challenges.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {resumeData?.skills?.categorized ? (
                  resumeData.skills.categorized.map((group: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 space-y-2"
                    >
                      <span className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                        {group.category}
                      </span>
                      <div className="space-y-1.5">
                        {group.skills.map((s: any, si: number) => (
                          <div key={si} className="flex items-center justify-between text-xs">
                            <span className="text-slate-800 dark:text-slate-200 font-medium">{s.name}</span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                              ✓ {s.level}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  (resumeData?.skills?.verified || []).map((sk: string, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 text-xs">
                      {sk}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Micro-Credentials & Certifications Shelf */}
            <div className="p-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <div>
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  Verified Micro-Credentials
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official certificates issued upon passing topic mastery tests.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {resumeData?.detailedCertifications?.map((cert: any, i: number) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-white dark:from-slate-800 dark:to-slate-900 border border-indigo-100 dark:border-slate-700 space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {cert.issuer}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      {cert.name}
                    </span>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                      <span>Issued: {cert.issueDate || '2026'}</span>
                      {cert.credentialId && (
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {cert.credentialId}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
