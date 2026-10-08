import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  Code,
  FolderGit2,
  Clock,
  Compass,
  Edit3,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Camera,
  X,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user: authUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Modals state
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddCert, setShowAddCert] = useState(false);
  const [showAddExperience, setShowAddExperience] = useState(false);

  // Edit personal info state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [courseDegree, setCourseDegree] = useState('');
  const [yearSemester, setYearSemester] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [targetCareer, setTargetCareer] = useState('');
  const [targetDomain, setTargetDomain] = useState('');
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [learningPreference, setLearningPreference] = useState('mixed');
  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);

  // Form states for adding items
  const [eduForm, setEduForm] = useState({ institution: '', degree: '', fieldOfStudy: '', startYear: 2022, endYear: 2026, gradeGpa: '' });
  const [skillForm, setSkillForm] = useState({ skillName: '', declaredLevel: 2 });
  const [projectForm, setProjectForm] = useState({ title: '', description: '', skillsUsed: '', repoUrl: '', liveUrl: '' });
  const [certForm, setCertForm] = useState({ name: '', issuer: '', credentialUrl: '' });
  const [expForm, setExpForm] = useState({ title: '', company: '', location: '', description: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    try {
      const res = await api.getProfile();
      setData(res);
      if (res?.user) {
        setName(res.user.name || '');
        setAvatarUrl(res.user.avatarUrl || '');
      }
      if (res?.profile) {
        setBio(res.profile.bio || '');
        setCourseDegree(res.profile.courseDegree || '');
        setYearSemester(res.profile.yearSemester || '');
        setEducationLevel(res.profile.educationLevel || 'Undergraduate');
        setTargetCareer(res.profile.targetCareer || 'Fraud Detection ML Engineer in FinTech');
        setTargetDomain(res.profile.targetDomain || 'Technology & IT');
        setWeeklyHours(res.profile.availableWeeklyHours || 10);
        setLearningPreference(res.profile.learningPreference || 'mixed');
      }
      if (res?.careerTwin) {
        setStrengths(res.careerTwin.strengths || []);
        setWeaknesses(res.careerTwin.weaknesses || []);
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveGeneralInfo() {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await api.updateProfile({
        name,
        avatarUrl,
        bio,
        courseDegree,
        yearSemester,
        educationLevel,
        targetCareer,
        targetDomain,
        availableWeeklyHours: weeklyHours,
        learningPreference,
        strengths,
        weaknesses,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      await loadProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddEducation(e: React.FormEvent) {
    e.preventDefault();
    await api.addEducation(eduForm);
    setShowAddEducation(false);
    setEduForm({ institution: '', degree: '', fieldOfStudy: '', startYear: 2022, endYear: 2026, gradeGpa: '' });
    loadProfile();
  }

  async function handleDeleteEducation(id: string) {
    await api.deleteEducation(id);
    loadProfile();
  }

  async function handleAddSkill(e: React.FormEvent) {
    e.preventDefault();
    if (!skillForm.skillName.trim()) return;
    await api.addSkill({
      skillName: skillForm.skillName.trim(),
      declaredLevel: skillForm.declaredLevel,
    });
    setShowAddSkill(false);
    setSkillForm({ skillName: '', declaredLevel: 2 });
    loadProfile();
  }

  async function handleDeleteSkill(id: string) {
    await api.deleteSkill(id);
    loadProfile();
  }

  async function handleAddProject(e: React.FormEvent) {
    e.preventDefault();
    await api.addProject(projectForm);
    setShowAddProject(false);
    setProjectForm({ title: '', description: '', skillsUsed: '', repoUrl: '', liveUrl: '' });
    loadProfile();
  }

  async function handleDeleteProject(id: string) {
    await api.deleteProject(id);
    loadProfile();
  }

  async function handleAddCert(e: React.FormEvent) {
    e.preventDefault();
    await api.addCertification(certForm);
    setShowAddCert(false);
    setCertForm({ name: '', issuer: '', credentialUrl: '' });
    loadProfile();
  }

  async function handleDeleteCert(id: string) {
    await api.deleteCertification(id);
    loadProfile();
  }

  async function handleAddExperience(e: React.FormEvent) {
    e.preventDefault();
    await api.addExperience(expForm);
    setShowAddExperience(false);
    setExpForm({ title: '', company: '', location: '', description: '' });
    loadProfile();
  }

  async function handleDeleteExperience(id: string) {
    await api.deleteExperience(id);
    loadProfile();
  }

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  ];

  const levelNames = ['None', 'Basic', 'Working', 'Strong', 'Expert'];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-slate-500">
        <Sparkles className="w-8 h-8 animate-spin mb-3 text-indigo-500" />
        <p className="text-sm font-medium">Loading your student career profile...</p>
      </div>
    );
  }

  const profile = data?.profile || {};
  const studentSkills = profile?.studentSkills || [];
  const educations = profile?.educations || [];
  const projects = profile?.projects || [];
  const certifications = profile?.certifications || [];
  const experiences = profile?.experiences || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Profile Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with Camera Overlay */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-400 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-indigo-500/20">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span>{name ? name.charAt(0).toUpperCase() : 'S'}</span>
              )}
            </div>
            <button
              onClick={() => setShowAvatarPicker(true)}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all group-hover:scale-110"
              title="Change Profile Picture"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Student Info Summary */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                {name || 'Student Name'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                STUDENT
              </span>
              {data?.user?.isUnder18 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Under 18 (Safe Profile)
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {bio || 'No bio provided yet. Add a short summary of your background, goals, and passions.'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                <GraduationCap className="w-4 h-4 text-indigo-500" />
                <span>{courseDegree || 'B.Tech CSE'} • {yearSemester || '2nd Year'}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                <Compass className="w-4 h-4 text-amber-500" />
                <span>Goal: {targetCareer}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                <Clock className="w-4 h-4 text-teal-500" />
                <span>{weeklyHours} Hours/Week Available</span>
              </div>
            </div>
          </div>

          {/* Save Status & CTA */}
          <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
            <button
              onClick={handleSaveGeneralInfo}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all hover:scale-105 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
            {saveSuccess && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved successfully!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Form Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Personal & Academic Info) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Personal Info Card */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500" />
              Personal Information
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Email (Registered)</label>
                <input
                  type="email"
                  disabled
                  value={data?.user?.email || ''}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Short Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Share what you are passionate about..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Academic Profile Card */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-teal-500" />
              Academic Status
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Course / Degree Pursuing</label>
                <input
                  type="text"
                  value={courseDegree}
                  onChange={e => setCourseDegree(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science, BCA, B.Sc"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Year / Semester</label>
                <input
                  type="text"
                  value={yearSemester}
                  onChange={e => setYearSemester(e.target.value)}
                  placeholder="e.g. 2nd Year / 4th Semester"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Education Level</label>
                <select
                  value={educationLevel}
                  onChange={e => setEducationLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="High School">High School / 12th</option>
                  <option value="Undergraduate">Undergraduate (Bachelors)</option>
                  <option value="Graduate">Graduate (Masters)</option>
                  <option value="Self-Taught">Self-Taught / Professional</option>
                </select>
              </div>
            </div>
          </div>

          {/* Time Commitment & Learning Preferences */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Time Commitment & Learning
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-600 dark:text-slate-400 font-semibold">Available Weekly Study Time</label>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{weeklyHours} Hours / Week</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  step="1"
                  value={weeklyHours}
                  onChange={e => setWeeklyHours(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>2h (Relaxed)</span>
                  <span>10h (Balanced)</span>
                  <span>25h+ (Intense)</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Learning Style</label>
                <select
                  value={learningPreference}
                  onChange={e => setLearningPreference(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="practice-first">Practice-First (Solve questions & code)</option>
                  <option value="project-first">Project-First (Build portfolio applications)</option>
                  <option value="video">Video & Visuals</option>
                  <option value="reading">Deep Reading & Documentation</option>
                  <option value="mixed">Mixed (Balanced across all)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Target Career Role</label>
                <input
                  type="text"
                  value={targetCareer}
                  onChange={e => setTargetCareer(e.target.value)}
                  placeholder="e.g. Fraud Detection ML Engineer"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Two Columns: Skills, Educations, Projects, Certs, Experience */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills Section with Skill Levels */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-indigo-500" />
                  Your Skills & Proficiency Levels
                </h3>
                <p className="text-xs text-slate-500">
                  Rate your current skill mastery from Basic (1) to Expert (4).
                </p>
              </div>
              <button
                onClick={() => setShowAddSkill(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1.5 transition-colors border border-indigo-200 dark:border-indigo-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>

            {studentSkills.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Code className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No skills added yet. Add your current skills to calibrate your roadmap!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {studentSkills.map((sk: any) => (
                  <div
                    key={sk.id}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {sk.skill?.name || 'Skill'}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                            sk.verificationState === 'EVIDENCE_BACKED'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : sk.verificationState === 'ASSESSED'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {sk.verificationState === 'EVIDENCE_BACKED' ? 'Evidence-Backed' : sk.verificationState === 'ASSESSED' ? 'Assessed' : 'Self-Reported'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                          Level {sk.declaredLevel}/4: {levelNames[sk.declaredLevel] || 'Working'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          (Effective: {sk.effectiveLevel.toFixed(1)})
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteSkill(sk.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Remove skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Education History Card */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-teal-500" />
                  Education Details
                </h3>
                <p className="text-xs text-slate-500">Your colleges, degrees, and academic records.</p>
              </div>
              <button
                onClick={() => setShowAddEducation(true)}
                className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-600 dark:text-teal-400 font-bold text-xs flex items-center gap-1.5 transition-colors border border-teal-200 dark:border-teal-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Education</span>
              </button>
            </div>

            {educations.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-500">
                No formal education entries added. Click "Add Education" to add your college.
              </div>
            ) : (
              <div className="space-y-3">
                {educations.map((edu: any) => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start justify-between shadow-sm"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{edu.institution}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span>{edu.startYear} - {edu.endYear || 'Present'}</span>
                        {edu.gradeGpa && <span>Grade: {edu.gradeGpa}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteEducation(edu.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete education"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Projects Portfolio Section */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-indigo-500" />
                  Projects Completed
                </h3>
                <p className="text-xs text-slate-500">Projects you've built, open source work, or coursework.</p>
              </div>
              <button
                onClick={() => setShowAddProject(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1.5 transition-colors border border-indigo-200 dark:border-indigo-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-500">
                No projects recorded. Add your projects to strengthen your resume and career twin!
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((prj: any) => (
                  <div
                    key={prj.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start justify-between shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">{prj.title}</h4>
                        {prj.analysisScore && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                            Quality: {prj.analysisScore}/100
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{prj.description}</p>
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                        {prj.repoUrl && (
                          <a
                            href={prj.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                          >
                            <span>Code Repo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {prj.liveUrl && (
                          <a
                            href={prj.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:underline"
                          >
                            <span>Live Demo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteProject(prj.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Certifications & Work Experience Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Certifications */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Certifications
                </h3>
                <button
                  onClick={() => setShowAddCert(true)}
                  className="p-1.5 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950"
                  title="Add certification"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {certifications.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No certifications added yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {certifications.map((c: any) => (
                    <div key={c.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{c.name}</span>
                        <span className="text-[11px] text-slate-400">{c.issuer}</span>
                      </div>
                      <button onClick={() => handleDeleteCert(c.id)} className="text-slate-400 hover:text-rose-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Experience / Internships */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-500" />
                  Experience / Internships
                </h3>
                <button
                  onClick={() => setShowAddExperience(true)}
                  className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                  title="Add experience"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {experiences.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No work experience or internships added yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {experiences.map((exp: any) => (
                    <div key={exp.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{exp.title}</span>
                        <span className="text-[11px] text-slate-400">{exp.company} • {exp.location || 'Remote'}</span>
                      </div>
                      <button onClick={() => handleDeleteExperience(exp.id)} className="text-slate-400 hover:text-rose-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Change Profile Picture */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">Choose Profile Picture</h3>
              <button onClick={() => setShowAvatarPicker(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">Pick an Avatar:</span>
              <div className="grid grid-cols-3 gap-3">
                {avatarPresets.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => { setAvatarUrl(url); setShowAvatarPicker(false); }}
                    className="w-full aspect-square rounded-2xl overflow-hidden border-2 hover:border-indigo-500 transition-all hover:scale-105"
                  >
                    <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Or paste custom image URL:</label>
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <button
              onClick={() => setShowAvatarPicker(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Add Skill */}
      {showAddSkill && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-sm w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">Add New Skill</h3>
              <button onClick={() => setShowAddSkill(false)} className="text-slate-400 hover:text-slate-200"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Python, SQL, React, Machine Learning"
                  value={skillForm.skillName}
                  onChange={e => setSkillForm({ ...skillForm, skillName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Current Skill Level: Level {skillForm.declaredLevel} ({levelNames[skillForm.declaredLevel]})</label>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={skillForm.declaredLevel}
                  onChange={e => setSkillForm({ ...skillForm, declaredLevel: Number(e.target.value) })}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1: Basic</span>
                  <span>2: Working</span>
                  <span>3: Strong</span>
                  <span>4: Expert</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
              >
                Save Skill
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Education */}
      {showAddEducation && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">Add Education</h3>
              <button onClick={() => setShowAddEducation(false)} className="text-slate-400"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddEducation} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Institution / University</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delhi Technological University"
                  value={eduForm.institution}
                  onChange={e => setEduForm({ ...eduForm, institution: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Degree</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bachelor of Technology"
                  value={eduForm.degree}
                  onChange={e => setEduForm({ ...eduForm, degree: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Field of Study</label>
                  <input
                    type="text"
                    placeholder="Computer Science"
                    value={eduForm.fieldOfStudy}
                    onChange={e => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Grade / CGPA</label>
                  <input
                    type="text"
                    placeholder="e.g. 8.6 CGPA"
                    value={eduForm.gradeGpa}
                    onChange={e => setEduForm({ ...eduForm, gradeGpa: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md"
              >
                Save Education
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Project */}
      {showAddProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">Add Project</h3>
              <button onClick={() => setShowAddProject(false)} className="text-slate-400"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Credit Card Fraud Detection Classifier"
                  value={projectForm.title}
                  onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="What does the project do and what was your role?"
                  value={projectForm.description}
                  onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={projectForm.repoUrl}
                    onChange={e => setProjectForm({ ...projectForm, repoUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={projectForm.liveUrl}
                    onChange={e => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
              >
                Save Project
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Certification */}
      {showAddCert && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-sm w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">Add Certification</h3>
              <button onClick={() => setShowAddCert(false)} className="text-slate-400"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddCert} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Certificate Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Machine Learning Specialty"
                  value={certForm.name}
                  onChange={e => setCertForm({ ...certForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Issuing Organization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amazon Web Services, Coursera"
                  value={certForm.issuer}
                  onChange={e => setCertForm({ ...certForm, issuer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Credential URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={certForm.credentialUrl}
                  onChange={e => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-md"
              >
                Save Certificate
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Experience */}
      {showAddExperience && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-sm w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">Add Experience / Internship</h3>
              <button onClick={() => setShowAddExperience(false)} className="text-slate-400"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddExperience} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Role / Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Science Intern"
                  value={expForm.title}
                  onChange={e => setExpForm({ ...expForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Company / Organization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FinTech Solutions Ltd"
                  value={expForm.company}
                  onChange={e => setExpForm({ ...expForm, company: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Remote / Bangalore"
                  value={expForm.location}
                  onChange={e => setExpForm({ ...expForm, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
              >
                Save Experience
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
