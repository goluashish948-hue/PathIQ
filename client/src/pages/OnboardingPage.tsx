import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  GraduationCap,
  Code,
  BookOpen,
  Briefcase,
  Clock,
  CheckCircle2,
  Plus,
  Trash2,
  Lightbulb,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Academic Foundations
  const [courseDegree, setCourseDegree] = useState('B.Tech Computer Science');
  const [yearSemester, setYearSemester] = useState('2nd Year / 4th Semester');
  const [educationLevel, setEducationLevel] = useState('Undergraduate');
  const [institution, setInstitution] = useState('Delhi Technological University');

  // Step 2: Current Skills & What You're Learning
  const [skillsList, setSkillsList] = useState<Array<{ name: string; level: number }>>([
    { name: 'Python', level: 3 },
    { name: 'SQL', level: 2 },
  ]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(2);
  const [currentlyLearning, setCurrentlyLearning] = useState('Data Structures, Relational Database Queries');
  const [enjoyedSubjects, setEnjoyedSubjects] = useState('Machine Learning, Probability & Statistics, Data Structures');

  // Step 3: Strengths, Weak Areas & Projects
  const [strengths, setStrengths] = useState('Python OOP, Logical problem-solving, Mathematics');
  const [weaknesses, setWeaknesses] = useState('Complex SQL window functions, System architecture, Model deployment');
  const [projectsList, setProjectsList] = useState<Array<{ title: string; description: string; skills: string[] }>>([
    {
      title: 'Credit Card Anomaly Predictor',
      description: 'Built a logistic regression model on credit card transactions dataset.',
      skills: ['Python', 'Scikit-learn', 'Pandas'],
    },
  ]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  // Step 4: Career Goals & Work Preferences
  const [targetCareer, setTargetCareer] = useState('Fraud Detection ML Engineer in FinTech');
  const [workInterests, setWorkInterests] = useState('Building ML risk models, low-latency financial streaming, anomaly detection');
  const [shortTermGoal, setShortTermGoal] = useState('Secure a FinTech ML Engineering summer internship in 6 months');
  const [longTermGoal, setLongTermGoal] = useState('Become a Lead ML Engineer architecting fraud defense platforms');

  // Step 5: Time Commitment & Learning Format
  const [availableWeeklyHours, setAvailableWeeklyHours] = useState(10);
  const [learningPreference, setLearningPreference] = useState('mixed');

  function handleAddSkill() {
    if (!newSkillName.trim()) return;
    setSkillsList([...skillsList, { name: newSkillName.trim(), level: newSkillLevel }]);
    setNewSkillName('');
    setNewSkillLevel(2);
  }

  function handleRemoveSkill(index: number) {
    setSkillsList(skillsList.filter((_, i) => i !== index));
  }

  function handleAddProject() {
    if (!newProjectTitle.trim()) return;
    setProjectsList([
      ...projectsList,
      {
        title: newProjectTitle.trim(),
        description: newProjectDesc.trim() || 'Student academic project',
        skills: ['Python', 'SQL'],
      },
    ]);
    setNewProjectTitle('');
    setNewProjectDesc('');
  }

  function handleRemoveProject(index: number) {
    setProjectsList(projectsList.filter((_, i) => i !== index));
  }

  async function handleSubmitOnboarding() {
    setSubmitting(true);
    try {
      const payload = {
        courseDegree,
        yearSemester,
        educationLevel,
        institution,
        currentSkills: skillsList,
        currentlyLearning,
        enjoyedSubjects,
        strengths,
        weaknesses,
        projects: projectsList,
        targetCareer,
        targetDomain: 'Technology & IT',
        workInterests,
        shortTermGoal,
        longTermGoal,
        availableWeeklyHours,
        learningPreference,
      };

      await api.submitOnboarding(payload);
      navigate('/roadmap');
    } catch (err) {
      console.error('Onboarding submission failed', err);
    } finally {
      setSubmitting(false);
    }
  }

  const levelNames = ['None', 'Basic', 'Working', 'Strong', 'Expert'];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-8">
      <div className="glass-panel max-w-2xl w-full p-6 sm:p-10 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-8 animate-in fade-in">
        {/* Progress Header */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span className="uppercase tracking-wider">Student Profile Calibration</span>
            <span>Step {step} of 5</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-400 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Current Studies */}
        {step === 1 && (
          <div className="space-y-5 animate-in slide-in-from-right duration-200">
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">
                What are you currently studying?
              </h2>
              <p className="text-xs text-slate-500">
                Help PathIQ calibrate prerequisites based on your academic stage.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Degree or Course
                </label>
                <input
                  type="text"
                  value={courseDegree}
                  onChange={e => setCourseDegree(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science, BCA, B.Sc Data Science"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Year & Semester
                  </label>
                  <input
                    type="text"
                    value={yearSemester}
                    onChange={e => setYearSemester(e.target.value)}
                    placeholder="e.g. 2nd Year / 4th Sem"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Education Level
                  </label>
                  <select
                    value={educationLevel}
                    onChange={e => setEducationLevel(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Undergraduate">Undergraduate (Bachelors)</option>
                    <option value="Graduate">Graduate (Masters)</option>
                    <option value="High School">High School (11th/12th)</option>
                    <option value="Self-Taught">Self-Taught / Career Changer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  College or Institution Name
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={e => setInstitution(e.target.value)}
                  placeholder="e.g. Delhi Technological University, IIT Bombay, State University"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Current Skills & What You're Learning */}
        {step === 2 && (
          <div className="space-y-5 animate-in slide-in-from-right duration-200">
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                <Code className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">
                What skills do you currently have?
              </h2>
              <p className="text-xs text-slate-500">
                Mention your current tools and what you are actively studying right now.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Existing Skills List */}
              <div className="space-y-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Current Skills & Ratings:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {skillsList.map((sk, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{sk.name}</span>
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400">
                          Level {sk.level}/4 ({levelNames[sk.level]})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Skill Inline Form */}
              <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 flex flex-col sm:flex-row gap-2 items-center">
                <input
                  type="text"
                  placeholder="Add skill (e.g. Python, SQL, C++)"
                  value={newSkillName}
                  onChange={e => setNewSkillName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs w-full sm:w-auto"
                />
                <select
                  value={newSkillLevel}
                  onChange={e => setNewSkillLevel(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs w-full sm:w-auto"
                >
                  <option value={1}>1: Basic</option>
                  <option value={2}>2: Working</option>
                  <option value={3}>3: Strong</option>
                  <option value={4}>4: Expert</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs flex items-center gap-1 w-full sm:w-auto justify-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  What are you currently learning or studying?
                </label>
                <input
                  type="text"
                  value={currentlyLearning}
                  onChange={e => setCurrentlyLearning(e.target.value)}
                  placeholder="e.g. Object Oriented Programming, Data Structures, Basic SQL"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Which subjects or topics do you enjoy the most?
                </label>
                <input
                  type="text"
                  value={enjoyedSubjects}
                  onChange={e => setEnjoyedSubjects(e.target.value)}
                  placeholder="e.g. Machine Learning, Probability, Algorithms, Systems"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Strengths, Weak Areas & Projects */}
        {step === 3 && (
          <div className="space-y-5 animate-in slide-in-from-right duration-200">
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">
                Strengths, Weak Areas & Projects
              </h2>
              <p className="text-xs text-slate-500">
                Honesty helps the AI design a roadmap that strengthens your weak spots.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  What are your key strengths?
                </label>
                <input
                  type="text"
                  value={strengths}
                  onChange={e => setStrengths(e.target.value)}
                  placeholder="e.g. Quick logical thinking, Python syntax, Math fundamentals"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  What are your weak areas or topics you struggle with?
                </label>
                <input
                  type="text"
                  value={weaknesses}
                  onChange={e => setWeaknesses(e.target.value)}
                  placeholder="e.g. Complex SQL joins, deployment, hyperparameter tuning"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Projects completed so far:
                </label>
                <div className="space-y-2">
                  {projectsList.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{p.title}</span>
                        <span className="text-[11px] text-slate-500">{p.description}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add project inline */}
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 space-y-2">
                  <input
                    type="text"
                    placeholder="Project Title (e.g. Spam SMS Classifier)"
                    value={newProjectTitle}
                    onChange={e => setNewProjectTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Short description of what it does"
                    value={newProjectDesc}
                    onChange={e => setNewProjectDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Career Ambition & Goals */}
        {step === 4 && (
          <div className="space-y-5 animate-in slide-in-from-right duration-200">
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">
                What career do you want to pursue?
              </h2>
              <p className="text-xs text-slate-500">
                Be as specific as possible so the AI can reverse-engineer real job requirements.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Career / Specific Job in Mind:
                </label>
                <input
                  type="text"
                  value={targetCareer}
                  onChange={e => setTargetCareer(e.target.value)}
                  placeholder="e.g. Fraud Detection ML Engineer in FinTech, Data Scientist"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  What type of work excites you?
                </label>
                <input
                  type="text"
                  value={workInterests}
                  onChange={e => setWorkInterests(e.target.value)}
                  placeholder="e.g. Building ML models, high-volume streaming, risk intelligence"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Short-Term Career Goal (Next 6-12 Months)
                  </label>
                  <input
                    type="text"
                    value={shortTermGoal}
                    onChange={e => setShortTermGoal(e.target.value)}
                    placeholder="e.g. Summer ML Internship"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Long-Term Career Goal (3-5 Years)
                  </label>
                  <input
                    type="text"
                    value={longTermGoal}
                    onChange={e => setLongTermGoal(e.target.value)}
                    placeholder="e.g. Senior Machine Learning Engineer"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Time Commitment & Learning Preferences */}
        {step === 5 && (
          <div className="space-y-5 animate-in slide-in-from-right duration-200">
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">
                How much time can you study each week?
              </h2>
              <p className="text-xs text-slate-500">
                The scheduler assigns topics across weeks based on your exact bandwidth.
              </p>
            </div>

            <div className="space-y-5 text-xs">
              <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-900 dark:text-indigo-200">Available Study Time:</span>
                  <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                    {availableWeeklyHours} Hours / Week
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="40"
                  step="1"
                  value={availableWeeklyHours}
                  onChange={e => setAvailableWeeklyHours(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>3h (Light)</span>
                  <span>10h (Balanced ~1.5h/day)</span>
                  <span>25h+ (Full-time)</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Preferred Learning Format:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'practice-first', title: 'Practice-First', desc: 'Code exercises and quizzes right after concept' },
                    { id: 'project-first', title: 'Project-First', desc: 'Build concrete portfolio milestones directly' },
                    { id: 'video', title: 'Video & Visuals', desc: 'Step-by-step visual lessons and diagrams' },
                    { id: 'mixed', title: 'Mixed (Recommended)', desc: 'Balanced combination of theory, practice, and code' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setLearningPreference(opt.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        learningPreference === opt.id
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="font-bold block text-xs mb-0.5">{opt.title}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Ready to Synthesize Your Career Roadmap
                </span>
                <p className="text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-300">
                  PathIQ will now compare your current abilities with verified job descriptions for <strong>{targetCareer}</strong>, identify your exact skill gap, and build a dependency-based roadmap.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmitOnboarding}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{submitting ? 'Generating AI Roadmap...' : 'Generate My Career Roadmap'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
