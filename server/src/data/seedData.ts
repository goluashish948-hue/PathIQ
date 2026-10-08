import { DOMAIN_PACKS } from './domainPacks.js';

export interface OntologySkillRelation {
  fromSkill: string;
  toSkill: string;
  relationType: 'prerequisite' | 'parent-child' | 'related' | 'substitute';
  transferFactor: number;
}

export const SKILL_RELATIONS_SEED: OntologySkillRelation[] = [
  // Prerequisites
  { fromSkill: 'Python', toSkill: 'Pandas', relationType: 'prerequisite', transferFactor: 1.0 },
  { fromSkill: 'Python', toSkill: 'Machine Learning', relationType: 'prerequisite', transferFactor: 1.0 },
  { fromSkill: 'Pandas', toSkill: 'Feature Engineering', relationType: 'prerequisite', transferFactor: 1.0 },
  { fromSkill: 'Machine Learning', toSkill: 'XGBoost', relationType: 'prerequisite', transferFactor: 1.0 },
  { fromSkill: 'Machine Learning', toSkill: 'Deep Learning', relationType: 'prerequisite', transferFactor: 1.0 },
  { fromSkill: 'Deep Learning', toSkill: 'PyTorch', relationType: 'prerequisite', transferFactor: 1.0 },
  { fromSkill: 'Deep Learning', toSkill: 'TensorFlow', relationType: 'prerequisite', transferFactor: 1.0 },
  { fromSkill: 'SQL', toSkill: 'Feature Engineering', relationType: 'related', transferFactor: 0.7 },
  { fromSkill: 'Docker', toSkill: 'Kubernetes', relationType: 'prerequisite', transferFactor: 1.0 },
  { fromSkill: 'Docker', toSkill: 'MLOps', relationType: 'prerequisite', transferFactor: 1.0 },

  // Substitutes / Transferable skills (Spec 7.2)
  { fromSkill: 'PyTorch', toSkill: 'TensorFlow', relationType: 'substitute', transferFactor: 0.85 },
  { fromSkill: 'TensorFlow', toSkill: 'PyTorch', relationType: 'substitute', transferFactor: 0.85 },
  { fromSkill: 'Scikit-Learn', toSkill: 'XGBoost', relationType: 'related', transferFactor: 0.75 },
  { fromSkill: 'SQL', toSkill: 'Pandas', relationType: 'related', transferFactor: 0.65 },
  { fromSkill: 'AWS', toSkill: 'Docker', relationType: 'related', transferFactor: 0.5 },
];

export const RESOURCE_LIBRARY_SEED = [
  {
    title: 'Python for Everybody Specialization',
    provider: 'Coursera / University of Michigan',
    url: 'https://www.coursera.org/specializations/python',
    type: 'interactive',
    cost: 'free',
    language: 'en',
    associatedSkills: ['Python'],
    level: 'BEGINNER',
    estimatedTimeMin: 120,
    isAdminApproved: true,
    isLinkValid: true,
  },
  {
    title: 'Official Python Tutorial & Data Structures Documentation',
    provider: 'Python Software Foundation',
    url: 'https://docs.python.org/3/tutorial/datastructures.html',
    type: 'documentation',
    cost: 'free',
    language: 'en',
    associatedSkills: ['Python'],
    level: 'INTERMEDIATE',
    estimatedTimeMin: 60,
    isAdminApproved: true,
    isLinkValid: true,
  },
  {
    title: 'Mode Analytics SQL Tutorial: Intermediate Joins & Window Functions',
    provider: 'Mode Analytics',
    url: 'https://mode.com/sql-tutorial/sql-joins/',
    type: 'interactive',
    cost: 'free',
    language: 'en',
    associatedSkills: ['SQL'],
    level: 'INTERMEDIATE',
    estimatedTimeMin: 90,
    isAdminApproved: true,
    isLinkValid: true,
  },
  {
    title: 'Kaggle Pandas Micro-Course',
    provider: 'Kaggle Learn',
    url: 'https://www.kaggle.com/learn/pandas',
    type: 'interactive',
    cost: 'free',
    language: 'en',
    associatedSkills: ['Pandas'],
    level: 'BEGINNER',
    estimatedTimeMin: 90,
    isAdminApproved: true,
    isLinkValid: true,
  },
  {
    title: 'Machine Learning Specialization by Andrew Ng',
    provider: 'Coursera / DeepLearning.AI',
    url: 'https://www.coursera.org/specializations/machine-learning-introduction',
    type: 'video',
    cost: 'free',
    language: 'en',
    associatedSkills: ['Machine Learning', 'Statistics'],
    level: 'INTERMEDIATE',
    estimatedTimeMin: 180,
    isAdminApproved: true,
    isLinkValid: true,
  },
  {
    title: 'XGBoost Official Parameter Tuning Guide',
    provider: 'DMLC XGBoost Docs',
    url: 'https://xgboost.readthedocs.io/en/stable/tutorials/param_tuning.html',
    type: 'documentation',
    cost: 'free',
    language: 'en',
    associatedSkills: ['XGBoost', 'Machine Learning'],
    level: 'ADVANCED',
    estimatedTimeMin: 75,
    isAdminApproved: true,
    isLinkValid: true,
  },
  {
    title: 'Feature Engineering for Machine Learning on Kaggle',
    provider: 'Kaggle Learn',
    url: 'https://www.kaggle.com/learn/feature-engineering',
    type: 'interactive',
    cost: 'free',
    language: 'en',
    associatedSkills: ['Feature Engineering'],
    level: 'INTERMEDIATE',
    estimatedTimeMin: 120,
    isAdminApproved: true,
    isLinkValid: true,
  },
  {
    title: 'Docker Get Started & Containerization Guide',
    provider: 'Docker Official Documentation',
    url: 'https://docs.docker.com/get-started/',
    type: 'documentation',
    cost: 'free',
    language: 'en',
    associatedSkills: ['Docker'],
    level: 'BEGINNER',
    estimatedTimeMin: 60,
    isAdminApproved: true,
    isLinkValid: true,
  },
  {
    title: 'AWS Fundamentals: Going Cloud-Native',
    provider: 'Coursera / AWS Training',
    url: 'https://www.coursera.org/learn/aws-fundamentals-going-cloud-native',
    type: 'video',
    cost: 'free',
    language: 'en',
    associatedSkills: ['AWS'],
    level: 'INTERMEDIATE',
    estimatedTimeMin: 150,
    isAdminApproved: true,
    isLinkValid: true,
  },
  {
    title: 'PyTorch 60-Minute Blitz & Deep Learning Tensors',
    provider: 'PyTorch.org',
    url: 'https://pytorch.org/tutorials/beginner/blitz/tensor_tutorial.html',
    type: 'interactive',
    cost: 'free',
    language: 'en',
    associatedSkills: ['PyTorch', 'Deep Learning'],
    level: 'INTERMEDIATE',
    estimatedTimeMin: 60,
    isAdminApproved: true,
    isLinkValid: true,
  }
];

// Generate 320 Synthetic Job Postings for Corpus (Part 25)
export function generateSyntheticCorpus(): Array<{
  title: string;
  company: string;
  source: string;
  rawText: string;
  seniority: string;
  domain: string;
  extractedSkills: any[];
  isSynthetic: boolean;
  postedAt: Date;
}> {
  const corpus: any[] = [];
  const companies = [
    'Stripe Risk Labs', 'PayPal Fraud Intelligence', 'Square Capital', 'Revolut Compliance AI',
    'Adyen Risk Engine', 'Robinhood Security', 'Coinbase Security ML', 'Affirm Risk Analytics',
    'Klarna Decisioning', 'Brex Fraud Defense'
  ];

  for (let i = 1; i <= 320; i++) {
    const comp = companies[i % companies.length];
    const isPyTorchTrending = i > 250; // Newer postings emphasize PyTorch (Part 13.3)
    const isXGBoostMust = i % 4 !== 0;

    const rawText = `[SYNTHETIC CORPUS DATA #${i} - LICENSE: CC0-ANONYMIZED-TESTING]
Role: Fraud Detection Machine Learning Engineer at ${comp}.
We are seeking an experienced ML engineer to scale our real-time fraud mitigation pipeline.
Requirements:
- Strong proficiency in Python for high-performance service logic and machine learning modeling.
- Advanced SQL experience querying transactional event logs and merchant chargebacks.
- Hands-on expertise with Pandas and feature engineering over imbalanced financial transaction data.
- ${isXGBoostMust ? 'Must-have production experience with XGBoost gradient boosted trees for credit and transaction fraud detection.' : 'Experience with ensemble tree models.'}
- Familiarity with containerized deployment using Docker and AWS cloud services (S3, SageMaker, ECS).
${isPyTorchTrending ? '- Increasing emphasis on PyTorch for deep graph neural networks and sequence-based fraud embeddings.' : '- Optional knowledge of deep learning frameworks.'}
- Understanding of chargeback ratios, payment velocity, and AML compliance is a strong plus.`;

    const extractedSkills = [
      { skill: 'Python', importance: 'MUST_HAVE', spanStart: 180, spanEnd: 186, exactQuote: 'Python' },
      { skill: 'SQL', importance: 'MUST_HAVE', spanStart: 250, spanEnd: 253, exactQuote: 'SQL' },
      { skill: 'Pandas', importance: 'MUST_HAVE', spanStart: 320, spanEnd: 326, exactQuote: 'Pandas' },
      { skill: 'Machine Learning', importance: 'MUST_HAVE', spanStart: 100, spanEnd: 116, exactQuote: 'Machine Learning' },
      { skill: 'Feature Engineering', importance: 'MUST_HAVE', spanStart: 331, spanEnd: 350, exactQuote: 'feature engineering' },
      { skill: 'XGBoost', importance: isXGBoostMust ? 'MUST_HAVE' : 'GOOD_TO_HAVE', spanStart: 410, spanEnd: 417, exactQuote: 'XGBoost' },
      { skill: 'Docker', importance: 'GOOD_TO_HAVE', spanStart: 510, spanEnd: 516, exactQuote: 'Docker' },
      { skill: 'AWS', importance: 'GOOD_TO_HAVE', spanStart: 521, spanEnd: 524, exactQuote: 'AWS' },
      ...(isPyTorchTrending ? [{ skill: 'PyTorch', importance: 'DIFFERENTIATOR', spanStart: 620, spanEnd: 627, exactQuote: 'PyTorch' }] : []),
    ];

    corpus.push({
      title: 'Fraud Detection ML Engineer',
      company: comp,
      source: 'corpus',
      rawText,
      seniority: i % 3 === 0 ? 'Senior' : 'Mid-Level',
      domain: 'Technology & IT',
      extractedSkills,
      isSynthetic: true,
      postedAt: new Date(Date.now() - (320 - i) * 86400000 * 0.5), // distributed over past 160 days
    });
  }

  return corpus;
}

// 8 Demo Students (Part 25)
export const DEMO_STUDENTS_SEED = [
  {
    email: 'fraud.student@pathiq.dev',
    name: 'Aarav Sharma (Demo: Fraud ML Engineer)',
    role: 'STUDENT',
    targetCareer: 'Fraud Detection ML Engineer in FinTech',
    targetDomain: 'Technology & IT',
    educationLevel: 'Undergraduate',
    courseDegree: 'B.Tech Computer Science & Engineering',
    yearSemester: '2nd Year / 4th Sem',
    availableWeeklyHours: 10,
    learningPreference: 'mixed',
    skills: [
      { name: 'Python', declaredLevel: 3, verificationState: 'ASSESSED', effectiveLevel: 2.4 }, // strong
      { name: 'SQL', declaredLevel: 1, verificationState: 'ASSESSED', effectiveLevel: 0.8 }, // basic
    ],
    weaknesses: ['SQL Window Functions', 'Statistics for Imbalanced Data', 'Docker Containerization'],
    strengths: ['Python Syntax', 'Object-Oriented Programming', 'Basic Pandas Filtering'],
    hoursMissed: 0,
  },
  {
    email: 'data.scientist@pathiq.dev',
    name: 'Priya Patel (Demo: Data Scientist)',
    role: 'STUDENT',
    targetCareer: 'Data Scientist',
    targetDomain: 'Technology & IT',
    educationLevel: 'Undergraduate',
    courseDegree: 'B.Sc Statistics & Data Analytics',
    yearSemester: '3rd Year',
    availableWeeklyHours: 15,
    learningPreference: 'project-first',
    skills: [
      { name: 'Python', declaredLevel: 2, verificationState: 'SELF_REPORTED', effectiveLevel: 1.0 },
      { name: 'Statistics', declaredLevel: 3, verificationState: 'ASSESSED', effectiveLevel: 2.4 },
      { name: 'Data Visualization', declaredLevel: 2, verificationState: 'ASSESSED', effectiveLevel: 1.6 },
    ],
    weaknesses: ['Machine Learning Deployment', 'SQL Joins'],
    strengths: ['Hypothesis Testing', 'Statistical Distributions', 'Matplotlib'],
    hoursMissed: 0,
  },
  {
    email: 'robotics.engineer@pathiq.dev',
    name: 'Rohan Verma (Demo: Robotics)',
    role: 'STUDENT',
    targetCareer: 'Robotics Control Systems Engineer',
    targetDomain: 'Engineering',
    educationLevel: 'Undergraduate',
    courseDegree: 'B.Tech Mechanical & Mechatronics',
    yearSemester: '4th Year',
    availableWeeklyHours: 20,
    learningPreference: 'practice-first',
    skills: [
      { name: 'C++', declaredLevel: 2, verificationState: 'ASSESSED', effectiveLevel: 1.6 },
      { name: 'Control Systems', declaredLevel: 2, verificationState: 'ASSESSED', effectiveLevel: 1.6 },
    ],
    weaknesses: ['ROS TF Transformations', 'Kinematics Inversion'],
    strengths: ['PID Tuning', 'C++ Syntax'],
    hoursMissed: 0,
  },
  {
    email: 'health.analyst@pathiq.dev',
    name: 'Dr. Ananya Sen (Demo: Health Analytics)',
    role: 'STUDENT',
    targetCareer: 'Healthcare Data Analyst',
    targetDomain: 'Healthcare & Medical',
    educationLevel: 'Graduate',
    courseDegree: 'Master of Public Health (MPH)',
    yearSemester: 'Final Year',
    availableWeeklyHours: 12,
    learningPreference: 'reading',
    skills: [
      { name: 'Health Informatics', declaredLevel: 3, verificationState: 'ASSESSED', effectiveLevel: 2.4 },
      { name: 'Biostatistics', declaredLevel: 2, verificationState: 'SELF_REPORTED', effectiveLevel: 1.0 },
    ],
    weaknesses: ['SQL Subqueries', 'R Dplyr Pipelines'],
    strengths: ['Epidemiological Study Design', 'HIPAA Regulations'],
    hoursMissed: 0,
  },
  {
    email: 'corp.counsel@pathiq.dev',
    name: 'Aditya Malhotra (Demo: Corporate Law)',
    role: 'STUDENT',
    targetCareer: 'Corporate Legal Counsel',
    targetDomain: 'Law',
    educationLevel: 'Undergraduate',
    courseDegree: 'B.A. LL.B (Hons)',
    yearSemester: '4th Year',
    availableWeeklyHours: 8,
    learningPreference: 'reading',
    skills: [
      { name: 'Legal Research', declaredLevel: 3, verificationState: 'ASSESSED', effectiveLevel: 2.4 },
      { name: 'Contract Drafting', declaredLevel: 2, verificationState: 'SELF_REPORTED', effectiveLevel: 1.0 },
    ],
    weaknesses: ['M&A Due Diligence Disclosures', 'Cross-Border Arbitration'],
    strengths: ['IRAC Case Briefing', 'Statutory Interpretation'],
    hoursMissed: 0,
  },
  {
    email: 'ib.analyst@pathiq.dev',
    name: 'Karan Mehra (Demo: Investment Banking)',
    role: 'STUDENT',
    targetCareer: 'Investment Banking Analyst',
    targetDomain: 'Finance & Banking',
    educationLevel: 'Undergraduate',
    courseDegree: 'B.Com (Hons) / Finance',
    yearSemester: '3rd Year',
    availableWeeklyHours: 15,
    learningPreference: 'practice-first',
    skills: [
      { name: 'Financial Modeling', declaredLevel: 2, verificationState: 'SELF_REPORTED', effectiveLevel: 1.0 },
      { name: 'Accounting Principles', declaredLevel: 3, verificationState: 'ASSESSED', effectiveLevel: 2.4 },
      { name: 'Excel Mastery', declaredLevel: 3, verificationState: 'ASSESSED', effectiveLevel: 2.4 },
    ],
    weaknesses: ['DCF Terminal Value Sensitivities', 'LBO Debt Schedules'],
    strengths: ['Three-Statement Integration', 'Financial Ratios'],
    hoursMissed: 0,
  },
  {
    email: 'uiux.designer@pathiq.dev',
    name: 'Sneha Rao (Demo: UI/UX Designer)',
    role: 'STUDENT',
    targetCareer: 'UI/UX Product Designer',
    targetDomain: 'Design & Creative',
    educationLevel: 'Undergraduate',
    courseDegree: 'Bachelor of Design (B.Des)',
    yearSemester: '3rd Year',
    availableWeeklyHours: 10,
    learningPreference: 'project-first',
    skills: [
      { name: 'Figma', declaredLevel: 3, verificationState: 'EVIDENCE_BACKED', effectiveLevel: 3.0 },
      { name: 'UI/UX Design', declaredLevel: 2, verificationState: 'ASSESSED', effectiveLevel: 1.6 },
    ],
    weaknesses: ['Design Token Architecture', 'Quantitative Usability Metrics'],
    strengths: ['Figma Auto Layout', 'Wireframing', 'Color Harmony'],
    hoursMissed: 0,
  },
  {
    email: 'sports.analyst@pathiq.dev',
    name: 'Vikram Joshi (Demo: Football Data Analyst)',
    role: 'STUDENT',
    targetCareer: 'Football / Sports Data Analyst',
    targetDomain: 'Sports',
    educationLevel: 'Undergraduate',
    courseDegree: 'B.Tech Information Technology',
    yearSemester: '4th Year',
    availableWeeklyHours: 10,
    learningPreference: 'practice-first',
    skills: [
      { name: 'Python', declaredLevel: 2, verificationState: 'ASSESSED', effectiveLevel: 1.6 },
      { name: 'Sports Analytics', declaredLevel: 2, verificationState: 'SELF_REPORTED', effectiveLevel: 1.0 },
    ],
    weaknesses: ['Spatial Event Tracking Coordinate Math', 'Expected Threat (xT) Modeling'],
    strengths: ['Matplotlib Shot Maps', 'Pandas Data Cleaning'],
    hoursMissed: 0,
  }
];
