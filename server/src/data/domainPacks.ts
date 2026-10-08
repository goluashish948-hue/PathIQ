export interface DomainPackDefinition {
  domainCode: string;
  domainName: string;
  description: string;
  icon: string;
  skills: Array<{
    name: string;
    type: 'technical' | 'domain' | 'tool' | 'certification' | 'soft' | 'practical';
    description: string;
    level0Desc: string;
    level1Desc: string;
    level2Desc: string;
    level3Desc: string;
    level4Desc: string;
    aliases?: string[];
  }>;
  roles: Array<{
    title: string;
    description: string;
    seniorityLevels: string[];
    relatedRoles: string[];
    mustHaveSkills: string[];
    goodToHaveSkills: string[];
  }>;
  milestones: string[];
  assessmentStyles: string[];
  proofTaskTemplates: Array<{
    taskKey: string;
    title: string;
    proofType: string;
    description: string;
    associatedSkill: string;
  }>;
  radarWeights: {
    technical: number;
    domain: number;
    practical: number;
    projects: number;
    communication: number;
    interview: number;
  };
  safetyNotes: string;
}

// Generate the 20 Domain Packs
export const DOMAIN_PACKS: DomainPackDefinition[] = [
  {
    domainCode: 'tech',
    domainName: 'Technology & IT',
    description: 'Software development, AI, ML, Data Science, DevOps, Cybersecurity, Cloud, and Systems Architecture.',
    icon: 'Cpu',
    radarWeights: { technical: 0.30, domain: 0.15, practical: 0.25, projects: 0.15, communication: 0.08, interview: 0.07 },
    safetyNotes: 'Standard technical engineering workflows. No medical/legal advice liabilities.',
    milestones: ['Syntax & Logic Foundation', 'Algorithmic Problem Solving', 'Full-Stack Integration', 'Production Deployment & Scalability'],
    assessmentStyles: ['Auto-graded Code Sandboxes', 'Interactive Multiple Choice & Scenarios', 'Repo Code Reviews'],
    proofTaskTemplates: [
      { taskKey: 'sql_fraud_queries', title: '15 High-Velocity SQL Analytics Queries', proofType: 'SQL', description: 'Query transactional databases to flag anomaly patterns', associatedSkill: 'SQL' },
      { taskKey: 'ml_fraud_model', title: 'End-to-End Fraud Detection Model in XGBoost', proofType: 'ML', description: 'Train, evaluate, and calibrate classifier on imbalanced transactions', associatedSkill: 'XGBoost' },
    ],
    roles: [
      {
        title: 'Fraud Detection ML Engineer in FinTech',
        description: 'Designs and builds machine learning systems to detect anomalies and fraudulent financial transactions in real-time.',
        seniorityLevels: ['Junior ML Engineer', 'Fraud ML Engineer', 'Senior Risk ML Specialist', 'Staff ML Architect'],
        relatedRoles: ['Machine Learning Engineer', 'Data Scientist', 'AI Engineer', 'MLOps Engineer'],
        mustHaveSkills: ['Python', 'SQL', 'Pandas', 'Machine Learning', 'XGBoost', 'Feature Engineering'],
        goodToHaveSkills: ['Docker', 'AWS', 'PyTorch', 'FastAPI', 'Kafka'],
      },
      {
        title: 'Machine Learning Engineer',
        description: 'Builds and deploys scalable ML models to production environments.',
        seniorityLevels: ['Junior', 'Mid', 'Senior', 'Staff'],
        relatedRoles: ['Fraud Detection ML Engineer in FinTech', 'Data Scientist', 'AI Engineer'],
        mustHaveSkills: ['Python', 'SQL', 'Machine Learning', 'Docker', 'PyTorch'],
        goodToHaveSkills: ['MLflow', 'Kubernetes', 'AWS', 'TensorFlow'],
      },
      {
        title: 'Data Scientist',
        description: 'Analyzes complex datasets to extract business insights and statistical evidence.',
        seniorityLevels: ['Junior', 'Mid', 'Senior', 'Lead'],
        relatedRoles: ['Machine Learning Engineer', 'Data Analyst'],
        mustHaveSkills: ['Python', 'SQL', 'Statistics', 'Pandas', 'Data Visualization'],
        goodToHaveSkills: ['Scikit-Learn', 'Tableau', 'A/B Testing'],
      },
    ],
    skills: [
      { name: 'Python', type: 'technical', description: 'High-level programming language for software, automation, and data science.', level0Desc: 'No experience', level1Desc: 'Basic syntax, loops, functions', level2Desc: 'OOP, modules, list comprehensions', level3Desc: 'Decorators, generators, profiling, concurrency', level4Desc: 'Internal bytecode, memory optimization, C-extensions' },
      { name: 'SQL', type: 'technical', description: 'Standard language for querying and managing relational databases.', level0Desc: 'No experience', level1Desc: 'Basic SELECT, WHERE, ORDER BY', level2Desc: 'INNER/LEFT JOIN, GROUP BY, aggregations', level3Desc: 'Window functions, CTEs, subqueries, indexing', level4Desc: 'Query planner optimization, partitioning, locking' },
      { name: 'Pandas', type: 'tool', description: 'Python data manipulation and tabular analysis library.', level0Desc: 'None', level1Desc: 'Series and DataFrames basics', level2Desc: 'Filtering, grouping, merging DataFrames', level3Desc: 'Vectorized operations, multi-indexing, handling missing data', level4Desc: 'Memory efficiency with categorical dtypes, Cython integration' },
      { name: 'Machine Learning', type: 'technical', description: 'Supervised and unsupervised statistical learning algorithms.', level0Desc: 'None', level1Desc: 'Supervised vs unsupervised concept', level2Desc: 'Linear/logistic regression, decision trees, train/test split', level3Desc: 'Cross-validation, ensemble methods, precision/recall tradeoff', level4Desc: 'Custom loss functions, calibration, online learning' },
      { name: 'XGBoost', type: 'tool', description: 'Gradient boosted decision trees library for tabular data.', level0Desc: 'None', level1Desc: 'Concept of boosting vs bagging', level2Desc: 'Fitting XGBClassifier with default parameters', level3Desc: 'Hyperparameter tuning, scale_pos_weight for imbalance', level4Desc: 'Custom objective functions, tree pruning math' },
      { name: 'Feature Engineering', type: 'technical', description: 'Creating domain-specific indicators to improve ML models.', level0Desc: 'None', level1Desc: 'Basic one-hot encoding, normalization', level2Desc: 'Interaction features, target encoding, binning', level3Desc: 'Lag features, rolling windows, aggregation over entity IDs', level4Desc: 'Feature stores, leakage prevention in time series' },
      { name: 'Docker', type: 'tool', description: 'Containerization tool for reproducible application environments.', level0Desc: 'None', level1Desc: 'Running prebuilt docker images', level2Desc: 'Writing basic Dockerfile and building images', level3Desc: 'Multi-stage builds, docker-compose, layer caching', level4Desc: 'Rootless containers, network namespaces, vulnerability scanning' },
      { name: 'AWS', type: 'tool', description: 'Amazon Web Services cloud computing infrastructure.', level0Desc: 'None', level1Desc: 'Console navigation, S3 concepts', level2Desc: 'EC2 provisioning, IAM policies, RDS basics', level3Desc: 'Lambda, ECS, CloudWatch, SageMaker pipelines', level4Desc: 'Multi-region architectures, cost governance, Terraform IAC' },
      { name: 'PyTorch', type: 'technical', description: 'Deep learning framework with dynamic computation graphs.', level0Desc: 'None', level1Desc: 'Tensors and autograd basics', level2Desc: 'Building nn.Module, Dataset/DataLoader loaders', level3Desc: 'Custom training loops, GPU acceleration, transfer learning', level4Desc: 'DistributedDataParallel, TorchScript, custom CUDA kernels' },
      { name: 'TensorFlow', type: 'technical', description: 'End-to-end open source platform for machine learning.', level0Desc: 'None', level1Desc: 'Keras Sequential API', level2Desc: 'Functional API, callbacks, model evaluation', level3Desc: 'tf.data pipelines, custom layers', level4Desc: 'TF Serving, quantization, graph optimizations' },
      { name: 'FastAPI', type: 'tool', description: 'Modern, fast web framework for building APIs with Python.', level0Desc: 'None', level1Desc: 'Basic GET endpoint', level2Desc: 'Pydantic schemas, path/query parameters', level3Desc: 'Dependency injection, background tasks, async routes', level4Desc: 'Custom middleware, WebSocket streaming, OpenAPI customization' },
      { name: 'Git', type: 'tool', description: 'Distributed version control system.', level0Desc: 'None', level1Desc: 'git clone, add, commit, push', level2Desc: 'Branching, merging, pull requests', level3Desc: 'Rebasing, resolving conflicts, cherry-pick', level4Desc: 'Interactive rebase, hooks, submodule management' },
      { name: 'Linux', type: 'technical', description: 'Unix-based operating system commands and administration.', level0Desc: 'None', level1Desc: 'Basic navigation ls, cd, cat', level2Desc: 'File permissions, grep, piping commands', level3Desc: 'Shell scripting, process management, cron', level4Desc: 'Systemd services, kernel tuning, networking routing' },
      { name: 'Data Visualization', type: 'technical', description: 'Visual communication of data through plots and dashboards.', level0Desc: 'None', level1Desc: 'Basic bar and line charts', level2Desc: 'Matplotlib and Seaborn customized plots', level3Desc: 'Interactive charts with Plotly/D3', level4Desc: 'Custom chart engines, visual perception design' },
      { name: 'Statistics', type: 'technical', description: 'Probability distributions, hypothesis testing, and inference.', level0Desc: 'None', level1Desc: 'Mean, median, standard deviation', level2Desc: 'Normal distribution, p-values, correlation', level3Desc: 'Hypothesis testing, ANOVA, Bayes theorem', level4Desc: 'Non-parametric tests, Bayesian estimation, Markov chains' },
      { name: 'Data Structures & Algorithms', type: 'technical', description: 'Core computer science algorithms and problem solving.', level0Desc: 'None', level1Desc: 'Arrays, strings, linear search', level2Desc: 'Linked lists, stacks, queues, hash maps', level3Desc: 'Trees, graphs, DFS/BFS, dynamic programming', level4Desc: 'Tries, segment trees, NP-hard approximations' },
      { name: 'System Design', type: 'technical', description: 'Architecting scalable, fault-tolerant distributed systems.', level0Desc: 'None', level1Desc: 'Client-server basics', level2Desc: 'Load balancers, relational vs NoSQL databases', level3Desc: 'Caching, message queues, database replication', level4Desc: 'Eventual consistency, Raft/Paxos, CAP theorem trade-offs' },
      { name: 'Kafka', type: 'tool', description: 'Distributed event streaming platform.', level0Desc: 'None', level1Desc: 'Producer-consumer model concept', level2Desc: 'Writing basic consumer and producer in Python/Java', level3Desc: 'Topic partitioning, consumer groups, offset commits', level4Desc: 'Exact-once semantics, Kafka Streams, cluster tuning' },
      { name: 'MLOps', type: 'technical', description: 'DevOps practices applied to machine learning workflows.', level0Desc: 'None', level1Desc: 'Concept of model lifecycle', level2Desc: 'Tracking experiments with MLflow or W&B', level3Desc: 'Model registry, CI/CD automated test runs', level4Desc: 'Drift detection, automated retraining pipelines' },
      { name: 'CI/CD', type: 'tool', description: 'Continuous integration and continuous deployment pipelines.', level0Desc: 'None', level1Desc: 'GitHub Actions basic workflow', level2Desc: 'Running automated linter and tests on PR', level3Desc: 'Artifact building, secrets management, deployment steps', level4Desc: 'Matrix testing, self-hosted runners, blue-green deployment' },
      { name: 'Kubernetes', type: 'tool', description: 'Container orchestration platform.', level0Desc: 'None', level1Desc: 'Pods and deployments concept', level2Desc: 'kubectl commands, writing Deployment YAML', level3Desc: 'Services, Ingress, ConfigMaps, Secrets', level4Desc: 'Custom Resource Definitions, operators, autoscaling' },
      { name: 'Cybersecurity Basics', type: 'domain', description: 'Principles of confidentiality, integrity, and availability.', level0Desc: 'None', level1Desc: 'Strong password and 2FA awareness', level2Desc: 'OWASP Top 10 vulnerabilities, HTTPS/TLS', level3Desc: 'JWT security, SQL injection prevention, CORS', level4Desc: 'Threat modeling, zero-trust architectures' },
      { name: 'FinTech Domain Knowledge', type: 'domain', description: 'Banking protocols, payment gateways, risk models, AML, and chargebacks.', level0Desc: 'None', level1Desc: 'Card payment transaction cycle basics', level2Desc: 'Chargeback terminology, interchange fees', level3Desc: 'AML rules, transaction velocity thresholds, 3D Secure', level4Desc: 'Regulatory compliance (PCI-DSS), real-time fraud engines' },
      { name: 'Scikit-Learn', type: 'tool', description: 'Machine learning library in Python.', level0Desc: 'None', level1Desc: 'Importing models and fit/predict', level2Desc: 'Pipeline, StandardScaler, train_test_split', level3Desc: 'GridSearchCV, ColumnTransformer, custom metrics', level4Desc: 'Custom estimators conforming to scikit API' },
      { name: 'Redis', type: 'tool', description: 'In-memory data structure store used as a database and cache.', level0Desc: 'None', level1Desc: 'Key-value get/set', level2Desc: 'Data types: lists, sets, hashes', level3Desc: 'TTL expiration, pub/sub, caching patterns', level4Desc: 'Redis clusters, Lua scripts, persistence configuration' },
      { name: 'REST API Design', type: 'technical', description: 'Designing clean HTTP-based application interfaces.', level0Desc: 'None', level1Desc: 'HTTP methods GET/POST', level2Desc: 'Status codes, JSON formatting, URL routing', level3Desc: 'Pagination, error response standardization, versioning', level4Desc: 'HATEOAS, idempotent request tokens, rate limit headers' },
      { name: 'Unit Testing', type: 'technical', description: 'Writing automated test suites for software reliability.', level0Desc: 'None', level1Desc: 'Assert statements', level2Desc: 'Pytest/Jest test functions and assertions', level3Desc: 'Fixtures, mocking external APIs, coverage analysis', level4Desc: 'Property-based testing, integration test harnesses' },
      { name: 'Problem Solving', type: 'soft', description: 'Analytical reasoning and structured issue resolution.', level0Desc: 'None', level1Desc: 'Identifying symptom vs root cause', level2Desc: 'Breaking down multi-step tasks', level3Desc: 'Hypothesis generation and systematic debugging', level4Desc: 'Synthesizing complex cross-functional architectural solutions' },
      { name: 'Technical Communication', type: 'soft', description: 'Conveying technical ideas clearly to technical and business stakeholders.', level0Desc: 'None', level1Desc: 'Writing basic bug reports', level2Desc: 'Clear code comments and documentation', level3Desc: 'Technical design documents and post-mortems', level4Desc: 'Executive summaries, architecture reviews, mentorship' },
      { name: 'Deep Learning', type: 'technical', description: 'Neural networks with multiple hidden layers for complex representations.', level0Desc: 'None', level1Desc: 'Perceptron and activation functions', level2Desc: 'MLP, CNN, RNN conceptual understanding', level3Desc: 'Transformers, attention mechanisms, embeddings', level4Desc: 'Novel architecture research, quantization, distillation' }
    ]
  },
  {
    domainCode: 'engineering',
    domainName: 'Engineering',
    description: 'Mechanical, Electrical, Civil, Robotics, and Chemical Engineering.',
    icon: 'Wrench',
    radarWeights: { technical: 0.35, domain: 0.20, practical: 0.20, projects: 0.15, communication: 0.05, interview: 0.05 },
    safetyNotes: 'Engineering design workflows. Regulatory safety standards apply in physical builds.',
    milestones: ['Fundamental Physics & Mathematics', 'Computer-Aided Design (CAD)', 'Finite Element Analysis', 'Prototyping & Field Testing'],
    assessmentStyles: ['CAD Modeling Submission', 'Stress Analysis Computations', 'Engineering Formula Exams'],
    proofTaskTemplates: [
      { taskKey: 'cad_stress_analysis', title: 'Finite Element Analysis Case Study', proofType: 'CASE_STUDY', description: 'Simulate structural strain on a mechanical bracket', associatedSkill: 'CAD' }
    ],
    roles: [
      {
        title: 'Robotics Control Systems Engineer',
        description: 'Designs control algorithms and sensor integration for autonomous robotic manipulators.',
        seniorityLevels: ['Junior Engineer', 'Robotics Engineer', 'Senior Controls Specialist'],
        relatedRoles: ['Embedded Systems Engineer', 'Mechanical Engineer'],
        mustHaveSkills: ['C++', 'Control Systems', 'ROS (Robot Operating System)', 'MATLAB', 'Kinematics'],
        goodToHaveSkills: ['Python', 'Computer Vision', 'Embedded C', 'SolidWorks'],
      }
    ],
    skills: [
      { name: 'C++', type: 'technical', description: 'High-performance systems programming language.', level0Desc: 'None', level1Desc: 'Syntax and loops', level2Desc: 'Pointers, classes, templates', level3Desc: 'Smart pointers, memory management, STL', level4Desc: 'Template metaprogramming, real-time concurrency' },
      { name: 'Control Systems', type: 'technical', description: 'Feedback systems, PID controllers, and stability criteria.', level0Desc: 'None', level1Desc: 'Open vs closed loop', level2Desc: 'PID controller tuning', level3Desc: 'State-space representation, Bode plots', level4Desc: 'Non-linear adaptive control, Kalman filtering' },
      { name: 'ROS (Robot Operating System)', type: 'tool', description: 'Middleware framework for robot software development.', level0Desc: 'None', level1Desc: 'Nodes and topics basics', level2Desc: 'Publishers, subscribers, services', level3Desc: 'URDF robot description, TF transformations', level4Desc: 'Custom action servers, navigation stack configuration' },
      { name: 'MATLAB', type: 'tool', description: 'Numerical computing environment and programming language.', level0Desc: 'None', level1Desc: 'Matrix operations', level2Desc: 'Plotting, scripts, functions', level3Desc: 'Simulink modeling, control toolbox', level4Desc: 'Automated code generation to C' },
      { name: 'Kinematics', type: 'domain', description: 'Study of motion without considering forces causing it.', level0Desc: 'None', level1Desc: 'Position and velocity vectors', level2Desc: 'Forward kinematics, rotation matrices', level3Desc: 'Inverse kinematics, DH parameters', level4Desc: 'Singularity analysis, Jacobian computation' },
      { name: 'SolidWorks', type: 'tool', description: '3D CAD software for mechanical product design.', level0Desc: 'None', level1Desc: '2D sketching', level2Desc: '3D extrusions, fillets, assemblies', level3Desc: 'Mates, sheet metal, drawing drafting', level4Desc: 'Motion simulation, surface modeling' },
      { name: 'Embedded C', type: 'technical', description: 'C programming for microcontrollers and hardware.', level0Desc: 'None', level1Desc: 'Bitwise operations', level2Desc: 'GPIO configuration, timers, interrupts', level3Desc: 'I2C, SPI, UART protocols', level4Desc: 'Bare-metal register programming, RTOS' }
    ]
  },
  {
    domainCode: 'healthcare',
    domainName: 'Healthcare & Medical',
    description: 'Clinical Medicine, Medical Informatics, Healthcare Analytics, Nursing, and Public Health.',
    icon: 'Activity',
    radarWeights: { technical: 0.20, domain: 0.35, practical: 0.20, projects: 0.10, communication: 0.10, interview: 0.05 },
    safetyNotes: 'DISCLAIMER: Content provided is strictly educational career guidance and exam-preparation planning. It does NOT constitute medical advice, clinical diagnosis, or medical treatment recommendations.',
    milestones: ['Anatomy & Physiology Foundations', 'Pathology & Pharmacology', 'Clinical Protocol Mastery', 'Board Exam Preparation'],
    assessmentStyles: ['Clinical Case Scenario Analyses', 'Medical Terminology Quizzes', 'Diagnostic Protocol Rubrics'],
    proofTaskTemplates: [
      { taskKey: 'clinical_case_audit', title: 'Clinical Decision Case Study', proofType: 'CASE_STUDY', description: 'Structured clinical case study evaluating differential diagnosis', associatedSkill: 'Clinical Pharmacology' }
    ],
    roles: [
      {
        title: 'Healthcare Data Analyst',
        description: 'Analyzes patient outcomes, clinical trial metrics, and hospital operational data.',
        seniorityLevels: ['Junior Analyst', 'Health Informatics Specialist', 'Senior Epidemiologist'],
        relatedRoles: ['Clinical Research Associate', 'Biostatistician'],
        mustHaveSkills: ['Health Informatics', 'SQL', 'Biostatistics', 'HIPAA Compliance', 'R Programming'],
        goodToHaveSkills: ['Python', 'EHR Systems', 'Data Visualization'],
      }
    ],
    skills: [
      { name: 'Health Informatics', type: 'domain', description: 'Management of healthcare information systems and patient data.', level0Desc: 'None', level1Desc: 'Basic terminology and EHR awareness', level2Desc: 'ICD-10 and CPT coding frameworks', level3Desc: 'HL7 / FHIR data interchange standards', level4Desc: 'Enterprise clinical data warehousing' },
      { name: 'Biostatistics', type: 'technical', description: 'Statistical methods applied to biological and medical data.', level0Desc: 'None', level1Desc: 'Survival curves, risk ratios', level2Desc: 'Cohort analysis, odds ratio calculations', level3Desc: 'Kaplan-Meier estimates, Cox proportional hazards', level4Desc: 'Clinical trial power analysis and sample sizing' },
      { name: 'HIPAA Compliance', type: 'domain', description: 'Healthcare privacy regulations and patient data safeguarding.', level0Desc: 'None', level1Desc: 'Awareness of PHI (Protected Health Information)', level2Desc: 'Safe handling of patient identifiers', level3Desc: 'Audit logging, de-identification techniques', level4Desc: 'Security officer compliance governance' },
      { name: 'R Programming', type: 'technical', description: 'Statistical programming language used heavily in clinical research.', level0Desc: 'None', level1Desc: 'Data loading, basic vectors', level2Desc: 'Dplyr data wrangling, ggplot2 plots', level3Desc: 'Statistical models lm, glm, survival package', level4Desc: 'CRAN package development, Bioconductor' },
      { name: 'EHR Systems', type: 'tool', description: 'Electronic Health Record software platforms (Epic, Cerner).', level0Desc: 'None', level1Desc: 'Patient chart lookup', level2Desc: 'Order entry, note documentation', level3Desc: 'Extracting reporting registries', level4Desc: 'Custom clinical decision support triggers' },
      { name: 'Clinical Pharmacology', type: 'domain', description: 'Drug classifications, mechanisms of action, and interactions.', level0Desc: 'None', level1Desc: 'Drug classes overview', level2Desc: 'Pharmacokinetics vs pharmacodynamics', level3Desc: 'Adverse interactions, contraindications', level4Desc: 'Precision dosing, pharmacogenomics' }
    ]
  },
  {
    domainCode: 'law',
    domainName: 'Law',
    description: 'Corporate Law, Intellectual Property, Constitutional Law, Litigation, and Legal Compliance.',
    icon: 'Scale',
    radarWeights: { technical: 0.15, domain: 0.40, practical: 0.20, projects: 0.10, communication: 0.10, interview: 0.05 },
    safetyNotes: 'DISCLAIMER: Content provided is career guidance and legal studies preparation only. It does NOT constitute legal advice or formal representation.',
    milestones: ['Jurisprudence & Legal Reasoning', 'Statutory Interpretation', 'Case Briefing & Drafting', 'Bar Examination Readiness'],
    assessmentStyles: ['IRAC Case Briefing Evaluations', 'Statutory Analysis Written Tasks', 'Contract Clause Drafting Rubrics'],
    proofTaskTemplates: [
      { taskKey: 'legal_irac_brief', title: 'Constitutional / Corporate IRAC Brief', proofType: 'LAW', description: 'Draft a comprehensive legal memo applying Issue, Rule, Application, Conclusion', associatedSkill: 'Legal Research' }
    ],
    roles: [
      {
        title: 'Corporate Legal Counsel',
        description: 'Advises commercial enterprises on contracts, M&A governance, and regulatory compliance.',
        seniorityLevels: ['Associate', 'Senior Associate', 'Partner / General Counsel'],
        relatedRoles: ['Compliance Officer', 'IP Attorney', 'Legal Operations Specialist'],
        mustHaveSkills: ['Contract Drafting', 'Legal Research', 'Corporate Governance', 'Regulatory Compliance', 'Due Diligence'],
        goodToHaveSkills: ['Negotiation', 'Intellectual Property', 'Legal Tech'],
      }
    ],
    skills: [
      { name: 'Legal Research', type: 'technical', description: 'Investigating precedents using Westlaw, LexisNexis, and court dockets.', level0Desc: 'None', level1Desc: 'Boolean search basics', level2Desc: 'Finding relevant case precedents', level3Desc: 'Shepardizing cases, secondary sources synthesis', level4Desc: 'Complex multi-jurisdictional statutory harmonization' },
      { name: 'Contract Drafting', type: 'practical', description: 'Drafting enforceable terms, representations, and warranties.', level0Desc: 'None', level1Desc: 'Standard boilerplate review', level2Desc: 'Drafting NDAs and service agreements', level3Desc: 'Structuring indemnity, liability caps, and covenants', level4Desc: 'Multi-party cross-border acquisition agreements' },
      { name: 'Corporate Governance', type: 'domain', description: 'Board responsibilities, shareholder rights, and regulatory disclosures.', level0Desc: 'None', level1Desc: 'Articles of incorporation overview', level2Desc: 'Fiduciary duties (care and loyalty)', level3Desc: 'Board resolutions, proxy statements', level4Desc: 'Hostile takeover defenses, activist investor response' },
      { name: 'Regulatory Compliance', type: 'domain', description: 'Ensuring operations align with federal and industry mandates.', level0Desc: 'None', level1Desc: 'Basic compliance checklists', level2Desc: 'Internal controls and reporting audits', level3Desc: 'Interpreting administrative rulemaking (SEC, FTC)', level4Desc: 'Global compliance frameworks (GDPR, FCPA)' },
      { name: 'Due Diligence', type: 'practical', description: 'Systematic legal audit of companies prior to transactions.', level0Desc: 'None', level1Desc: 'Data room navigation', level2Desc: 'Reviewing capitalization tables and licenses', level3Desc: 'Identifying material liabilities and litigation risks', level4Desc: 'Drafting comprehensive executive disclosure schedules' }
    ]
  },
  {
    domainCode: 'finance',
    domainName: 'Finance & Banking',
    description: 'Investment Banking, Quantitative Finance, Risk Management, Corporate FP&A, and Wealth Management.',
    icon: 'TrendingUp',
    radarWeights: { technical: 0.25, domain: 0.30, practical: 0.25, projects: 0.10, communication: 0.05, interview: 0.05 },
    safetyNotes: 'Financial modeling and career guidance only. Does not constitute registered investment advice.',
    milestones: ['Accounting & Financial Statements', 'Discounted Cash Flow (DCF) Modeling', 'Valuation & LBO Analysis', 'CFA / Financial Modeling Certification'],
    assessmentStyles: ['Three-Statement Financial Model Builds', 'DCF Valuation Spreadsheets', 'Financial Ratio Case Analyses'],
    proofTaskTemplates: [
      { taskKey: 'dcf_valuation_model', title: 'Complete DCF & Sensitivity Financial Model', proofType: 'FINANCE', description: 'Build a dynamic 3-statement model forecasting cash flows with WACC sensitivity table', associatedSkill: 'Financial Modeling' }
    ],
    roles: [
      {
        title: 'Investment Banking Analyst',
        description: 'Performs corporate valuations, financial modeling, and prepares pitchbooks for capital raises and M&A.',
        seniorityLevels: ['Analyst', 'Associate', 'VP', 'Managing Director'],
        relatedRoles: ['Financial Analyst', 'Private Equity Associate', 'Risk Analyst'],
        mustHaveSkills: ['Financial Modeling', 'Corporate Valuation', 'Excel Mastery', 'Accounting Principles', 'DCF Analysis'],
        goodToHaveSkills: ['Python for Finance', 'Bloomberg Terminal', 'PowerPoint Presentation'],
      }
    ],
    skills: [
      { name: 'Financial Modeling', type: 'technical', description: 'Building dynamic forecasts of company performance in spreadsheets.', level0Desc: 'None', level1Desc: 'Basic formula calculations', level2Desc: 'Dynamic revenue and expense projections', level3Desc: 'Three-statement integrated modeling (IS, BS, CFS)', level4Desc: 'Complex LBO / M&A accretion-dilution models' },
      { name: 'Corporate Valuation', type: 'technical', description: 'Determining the fair economic worth of an enterprise.', level0Desc: 'None', level1Desc: 'Price-to-Earnings (P/E) ratios', level2Desc: 'Comparable company analysis (trading multiples)', level3Desc: 'Precedent transactions and DCF valuation', level4Desc: 'Sum-of-the-parts, real options valuation' },
      { name: 'Excel Mastery', type: 'tool', description: 'Advanced spreadsheet formulas, shortcuts, and modeling.', level0Desc: 'None', level1Desc: 'SUM, AVERAGE, formatting', level2Desc: 'VLOOKUP, INDEX/MATCH, XLOOKUP, Pivot tables', level3Desc: 'Dynamic arrays, OFFSET, Goal Seek, Data Tables', level4Desc: 'VBA macros, Power Query data transformation' },
      { name: 'Accounting Principles', type: 'domain', description: 'GAAP and IFRS rules governing revenue recognition and balance sheets.', level0Desc: 'None', level1Desc: 'Debits and credits concept', level2Desc: 'Revenue recognition, accrual accounting', level3Desc: 'Working capital nuances, depreciation schedules', level4Desc: 'Deferred taxes, lease accounting (IFRS 16)' },
      { name: 'DCF Analysis', type: 'technical', description: 'Discounted Cash Flow valuation using WACC.', level0Desc: 'None', level1Desc: 'Time value of money concept', level2Desc: 'Calculating Free Cash Flow to Firm (FCFF)', level3Desc: 'CAPM, calculating Beta and WACC, terminal value', level4Desc: 'Monte Carlo simulations on growth and margin inputs' }
    ]
  },
  {
    domainCode: 'business',
    domainName: 'Business & Management',
    description: 'Management Consulting, Product Management, Strategy, Operations, and Business Analysis.',
    icon: 'Briefcase',
    radarWeights: { technical: 0.15, domain: 0.25, practical: 0.25, projects: 0.15, communication: 0.15, interview: 0.05 },
    safetyNotes: 'Standard business strategy workflows.',
    milestones: ['Market Sizing & Case Frameworks', 'Process Optimization', 'Product Strategy & Roadmapping', 'Executive Stakeholder Presentations'],
    assessmentStyles: ['Consulting Case Study Interviews', 'Product Requirements Document (PRD) Submissions', 'Root Cause Analyses'],
    proofTaskTemplates: [
      { taskKey: 'prd_product_spec', title: 'Comprehensive Product Requirements Document (PRD)', proofType: 'CASE_STUDY', description: 'Author a complete PRD with user personas, user stories, acceptance criteria, and metrics', associatedSkill: 'Product Management' }
    ],
    roles: [
      {
        title: 'Product Manager',
        description: 'Guides the vision, execution, and metric outcomes for software products across cross-functional teams.',
        seniorityLevels: ['Associate PM', 'Product Manager', 'Senior PM', 'VP of Product'],
        relatedRoles: ['Business Analyst', 'Strategy Consultant', 'Agile Scrum Master'],
        mustHaveSkills: ['Product Management', 'User Research', 'Data-Driven Decision Making', 'Roadmapping', 'Agile / Scrum'],
        goodToHaveSkills: ['SQL for PMs', 'Wireframing', 'A/B Testing'],
      }
    ],
    skills: [
      { name: 'Product Management', type: 'technical', description: 'Defining the what and why of software products.', level0Desc: 'None', level1Desc: 'Feature request backlog management', level2Desc: 'Writing user stories with acceptance criteria', level3Desc: 'Prioritization frameworks (RICE, MoSCoW), PRDs', level4Desc: 'Zero-to-one product strategy, north-star metrics' },
      { name: 'User Research', type: 'practical', description: 'Qualitative and quantitative methods to discover customer needs.', level0Desc: 'None', level1Desc: 'Survey questionnaires creation', level2Desc: 'Conducting user interview discovery sessions', level3Desc: 'Affinity diagramming, persona development', level4Desc: 'Continuous discovery loops and usability labs' },
      { name: 'Roadmapping', type: 'practical', description: 'Aligning team milestones and feature timelines to business strategy.', level0Desc: 'None', level1Desc: 'Gantt chart timelines', level2Desc: 'Outcome-driven vs feature-driven roadmaps', level3Desc: 'Now-Next-Later prioritization frameworks', level4Desc: 'Portfolio roadmap alignment with executive board' },
      { name: 'Agile / Scrum', type: 'technical', description: 'Iterative sprint delivery methodology.', level0Desc: 'None', level1Desc: 'Standup and sprint basics', level2Desc: 'Sprint planning, estimating story points', level3Desc: 'Retrospectives, burn-down analysis, velocity tuning', level4Desc: 'Scaled Agile Framework (SAFe), Kanban transformation' }
    ]
  },
  {
    domainCode: 'civil_services',
    domainName: 'Government / Civil Services',
    description: 'Public Policy, Civil Services (e.g. UPSC / State PSC), Governance, Administrative Reform, and Diplomatic Services.',
    icon: 'Shield',
    radarWeights: { technical: 0.10, domain: 0.40, practical: 0.20, projects: 0.10, communication: 0.15, interview: 0.05 },
    safetyNotes: 'Public administration exam preparation and policy analysis planning only.',
    milestones: ['Constitutional Law & Polity Foundation', 'Economic & Social Development', 'Ethics & Integrity Case Studies', 'Answer-Writing & Mock Interviews'],
    assessmentStyles: ['Mains-Style Answer Writing with Structured Rubric', 'Policy Case Study Evaluations', 'General Studies Mock Exams'],
    proofTaskTemplates: [
      { taskKey: 'upsc_mains_answer', title: 'GS Mains Policy Answer Writing', proofType: 'CIVIL_SERVICES', description: 'Write a 250-word policy evaluation with introduction, body arguments, constitutional provisions, and forward-looking conclusion', associatedSkill: 'Public Policy' }
    ],
    roles: [
      {
        title: 'Civil Services Officer / Policy Analyst',
        description: 'Implements government programs, formulates public policy, and administers public services.',
        seniorityLevels: ['Probationer', 'Sub-Divisional Magistrate', 'District Collector / Director', 'Secretary to Government'],
        relatedRoles: ['Public Policy Analyst', 'Legislative Assistant', 'Governance Consultant'],
        mustHaveSkills: ['Public Policy', 'Constitutional Framework', 'Administrative Law', 'Indian Economy', 'Ethics & Governance'],
        goodToHaveSkills: ['Data-Driven Governance', 'Crisis Management', 'Public Finance'],
      }
    ],
    skills: [
      { name: 'Public Policy', type: 'domain', description: 'Formulation, implementation, and evaluation of government policy.', level0Desc: 'None', level1Desc: 'Awareness of key flagship schemes', level2Desc: 'Policy cycle: formulation, implementation, evaluation', level3Desc: 'Cost-benefit analysis of socio-economic interventions', level4Desc: 'Evidence-based policy design and legislative drafting' },
      { name: 'Constitutional Framework', type: 'domain', description: 'Constitutional provisions, fundamental rights, and separation of powers.', level0Desc: 'None', level1Desc: 'Preamble and basic structure concept', level2Desc: 'Fundamental Rights, Directive Principles', level3Desc: 'Federal relations, emergency provisions, judiciary review', level4Desc: 'Constitutional jurisprudence and comparative governance' },
      { name: 'Ethics & Governance', type: 'domain', description: 'Ethical decision making in civil administration.', level0Desc: 'None', level1Desc: 'Basic public service values', level2Desc: 'Code of conduct, resolving conflict of interest', level3Desc: 'Case study analysis: empathy, probity, integrity', level4Desc: 'Whistleblower protection, institutional integrity systems' }
    ]
  },
  {
    domainCode: 'design',
    domainName: 'Design & Creative',
    description: 'UI/UX Design, Product Design, Graphic Design, Brand Identity, and Motion Design.',
    icon: 'Palette',
    radarWeights: { technical: 0.20, domain: 0.20, practical: 0.35, projects: 0.15, communication: 0.05, interview: 0.05 },
    safetyNotes: 'Creative workflows. Originality and copyright respect required.',
    milestones: ['Typography & Visual Hierarchy', 'User Research & Wireframing', 'Design Systems in Figma', 'Interactive Prototyping & Usability Testing'],
    assessmentStyles: ['Figma Prototype Case Study Reviews', 'Visual Polish & Accessibility Critiques', 'Design System Architecture Audits'],
    proofTaskTemplates: [
      { taskKey: 'figma_uiux_casestudy', title: 'End-to-End Mobile App UI/UX Case Study', proofType: 'DESIGN', description: 'Submit interactive Figma prototype with problem definition, wireframes, user testing, and component design system', associatedSkill: 'UI/UX Design' }
    ],
    roles: [
      {
        title: 'UI/UX Product Designer',
        description: 'Creates intuitive, accessible, and aesthetically engaging user interfaces for web and mobile products.',
        seniorityLevels: ['Junior Designer', 'Product Designer', 'Senior UI/UX Specialist', 'Design Lead'],
        relatedRoles: ['Visual Designer', 'Design System Engineer', 'Interaction Designer'],
        mustHaveSkills: ['Figma', 'UI/UX Design', 'Design Systems', 'Wireframing', 'Prototyping'],
        goodToHaveSkills: ['Micro-interactions', 'User Testing', 'HTML/CSS Basics'],
      }
    ],
    skills: [
      { name: 'Figma', type: 'tool', description: 'Collaborative interface design tool.', level0Desc: 'None', level1Desc: 'Basic vector shapes, text', level2Desc: 'Auto Layout, component creation', level3Desc: 'Component variants, interactive prototyping, variables', level4Desc: 'Token architecture, plugin scripting, advanced auto layout' },
      { name: 'UI/UX Design', type: 'technical', description: 'User-centered interface and interaction design.', level0Desc: 'None', level1Desc: 'Color theory, typography basics', level2Desc: 'Information architecture, wireframing', level3Desc: 'Affordance, accessibility (WCAG AA), usability heuristics', level4Desc: 'Design strategy, behavioral economics, micro-copy' },
      { name: 'Design Systems', type: 'practical', description: 'Reusable components, design tokens, and style guidelines.', level0Desc: 'None', level1Desc: 'Consistent color palette', level2Desc: 'Atomic design concepts (atoms, molecules)', level3Desc: 'Semantic token naming, documentation, component library', level4Desc: 'Multi-brand token governance, cross-platform alignment' }
    ]
  },
  {
    domainCode: 'science',
    domainName: 'Science & Research',
    description: 'Physics, Chemistry, Environmental Science, Astronomy, and Academic Research.',
    icon: 'Atom',
    radarWeights: { technical: 0.35, domain: 0.30, practical: 0.20, projects: 0.10, communication: 0.03, interview: 0.02 },
    safetyNotes: 'Scientific inquiry guidelines. Laboratory safety protocols required in physical settings.',
    milestones: ['Scientific Methodology & Literature Review', 'Experimental Setup & Data Acquisition', 'Computational Simulation', 'Peer-Reviewed Manuscript Preparation'],
    assessmentStyles: ['Literature Review Synthesis', 'Simulation Code Notebook Submissions', 'Research Proposal Evaluations'],
    proofTaskTemplates: [
      { taskKey: 'research_literature_review', title: 'Comprehensive Scientific Literature Review', proofType: 'CASE_STUDY', description: 'Synthesize 15 peer-reviewed papers with methodology comparison and research gap identification', associatedSkill: 'Scientific Method' }
    ],
    roles: [
      {
        title: 'Research Scientist',
        description: 'Conducts original scientific experiments, computational models, and publishes academic papers.',
        seniorityLevels: ['Research Assistant', 'Postdoctoral Researcher', 'Principal Investigator'],
        relatedRoles: ['Computational Scientist', 'Data Scientist'],
        mustHaveSkills: ['Scientific Method', 'Python for Science', 'Data Analysis', 'LaTeX Drafting', 'Experimental Design'],
        goodToHaveSkills: ['High-Performance Computing', 'Grant Writing', 'Peer Review'],
      }
    ],
    skills: [
      { name: 'Scientific Method', type: 'technical', description: 'Formulating hypotheses, designing controls, and testing reproducibility.', level0Desc: 'None', level1Desc: 'Observation and hypothesis concept', level2Desc: 'Independent vs dependent variables, control groups', level3Desc: 'Blinded studies, systematic bias prevention', level4Desc: 'Meta-analysis, reproducibility frameworks' },
      { name: 'LaTeX Drafting', type: 'tool', description: 'Document preparation system for scientific papers.', level0Desc: 'None', level1Desc: 'Basic document structure', level2Desc: 'Math equations formatting, tables, figures', level3Desc: 'BibTeX citations management, Overleaf collaboration', level4Desc: 'Custom class files, Beamer presentations' }
    ]
  },
  {
    domainCode: 'education',
    domainName: 'Teaching & Education',
    description: 'Instructional Design, K-12 & Higher Ed Pedagogy, EdTech, and Curriculum Development.',
    icon: 'BookOpen',
    radarWeights: { technical: 0.15, domain: 0.30, practical: 0.25, projects: 0.10, communication: 0.15, interview: 0.05 },
    safetyNotes: 'Pedagogical guidelines and child protection best practices.',
    milestones: ['Learning Theory & Pedagogy', 'Curriculum & Lesson Planning', 'Formative & Summative Assessment', 'Classroom & Online Instruction'],
    assessmentStyles: ['Lesson Plan Rubric Evaluations', 'Instructional Video Critiques', 'Bloom Taxonomy Assessments'],
    proofTaskTemplates: [
      { taskKey: 'lesson_plan_bloom', title: 'Structured Lesson Plan with Bloom Taxonomy', proofType: 'CASE_STUDY', description: 'Create a 45-minute lesson plan with objectives, active learning activities, and rubric', associatedSkill: 'Curriculum Design' }
    ],
    roles: [
      {
        title: 'Instructional Designer / Educator',
        description: 'Designs effective learning curricula, multimedia courses, and assesses learner performance.',
        seniorityLevels: ['Educator', 'Senior Instructional Designer', 'Curriculum Director'],
        relatedRoles: ['EdTech Content Developer', 'Corporate Trainer'],
        mustHaveSkills: ['Curriculum Design', 'Pedagogy', 'Formative Assessment', 'LMS Platforms', 'Instructional Psychology'],
        goodToHaveSkills: ['Video Editing', 'Gamification in Education'],
      }
    ],
    skills: [
      { name: 'Curriculum Design', type: 'practical', description: 'Developing course roadmaps, learning outcomes, and assessment rubrics.', level0Desc: 'None', level1Desc: 'Topic outlining', level2Desc: 'Writing measurable learning objectives (Bloom)', level3Desc: 'Backward design (Wiggins & McTighe), scaffolded units', level4Desc: 'Accreditation standard alignment (ABET/NAAC)' },
      { name: 'Pedagogy', type: 'domain', description: 'The theory and practice of how students learn and retain knowledge.', level0Desc: 'None', level1Desc: 'Lecture delivery basics', level2Desc: 'Active learning vs passive learning', level3Desc: 'Inquiry-based learning, differentiated instruction', level4Desc: 'Cognitive load theory, constructive alignment' }
    ]
  },
  {
    domainCode: 'marketing',
    domainName: 'Marketing & Sales',
    description: 'Performance Marketing, Growth Hacking, Content Strategy, Brand Marketing, and B2B Sales.',
    icon: 'Megaphone',
    radarWeights: { technical: 0.15, domain: 0.25, practical: 0.30, projects: 0.15, communication: 0.10, interview: 0.05 },
    safetyNotes: 'Marketing ethics. Truth-in-advertising and privacy rules (GDPR/CAN-SPAM).',
    milestones: ['Customer Persona & Value Proposition', 'Paid Acquisition & CAC/LTV Funnels', 'Content & SEO Strategy', 'Attribution & Retention Analytics'],
    assessmentStyles: ['Campaign Case Study Rubric', 'Ad Spend Optimization Simulation', 'SEO Audit Report'],
    proofTaskTemplates: [
      { taskKey: 'marketing_campaign_study', title: 'Multichannel Acquisition Campaign Case Study', proofType: 'MARKETING', description: 'Draft a full growth marketing campaign: target audience, CAC budget, ad creatives, landing page copy, and conversion metrics', associatedSkill: 'Growth Marketing' }
    ],
    roles: [
      {
        title: 'Growth Marketing Manager',
        description: 'Scales user acquisition, optimizes conversion funnels, and runs experiments across paid and organic channels.',
        seniorityLevels: ['Growth Specialist', 'Marketing Manager', 'Head of Growth'],
        relatedRoles: ['Performance Marketer', 'Content Strategist', 'SEO Specialist'],
        mustHaveSkills: ['Growth Marketing', 'SEO', 'Google Ads / Meta Ads', 'Google Analytics 4', 'Conversion Rate Optimization (CRO)'],
        goodToHaveSkills: ['Copywriting', 'Email Marketing', 'SQL for Marketers'],
      }
    ],
    skills: [
      { name: 'Growth Marketing', type: 'practical', description: 'Rapid experimentation across marketing channels to drive revenue.', level0Desc: 'None', level1Desc: 'Funnel stages (AARRR) concept', level2Desc: 'Setting up campaign experiments and UTM tags', level3Desc: 'CAC to LTV modeling, viral loops, churn reduction', level4Desc: 'North-star growth modeling and retention cohort analysis' },
      { name: 'SEO', type: 'technical', description: 'Search Engine Optimization for organic visibility.', level0Desc: 'None', level1Desc: 'Keyword research basics', level2Desc: 'On-page SEO (meta tags, H1s, internal links)', level3Desc: 'Technical SEO (core web vitals, crawl budgets, schema)', level4Desc: 'Programmatic SEO, international hreflang architecture' },
      { name: 'Conversion Rate Optimization (CRO)', type: 'technical', description: 'Improving website elements to convert visitors to customers.', level0Desc: 'None', level1Desc: 'Call to action button placement', level2Desc: 'A/B testing basics, heatmaps (Hotjar)', level3Desc: 'Statistical significance in A/B tests, form optimization', level4Desc: 'Psychological persuasion design, dynamic personalization' }
    ]
  },
  {
    domainCode: 'media',
    domainName: 'Media & Journalism',
    description: 'Investigative Journalism, Digital Media, Podcasting, Broadcast, and Fact-Checking.',
    icon: 'Radio',
    radarWeights: { technical: 0.10, domain: 0.30, practical: 0.30, projects: 0.15, communication: 0.12, interview: 0.03 },
    safetyNotes: 'Journalistic integrity, libel prevention, source protection, and fact-checking standards.',
    milestones: ['Source Verification & Interviewing', 'News Writing & Story Arcs', 'Investigative Data Journalism', 'Editorial Ethics & Publication'],
    assessmentStyles: ['Investigative Article Submissions', 'Fact-Checking Rubrics', 'Audio/Video Package Critiques'],
    proofTaskTemplates: [
      { taskKey: 'investigative_journalism_piece', title: 'Data-Driven Investigative Article', proofType: 'CASE_STUDY', description: 'Author a 1,200-word investigative article citing verifiable public data and multiple corroborating sources', associatedSkill: 'Investigative Reporting' }
    ],
    roles: [
      {
        title: 'Investigative Journalist / Media Producer',
        description: 'Researches, investigates, and reports news stories adhering to strict verification standards.',
        seniorityLevels: ['Reporter', 'Staff Writer', 'Senior Investigative Editor'],
        relatedRoles: ['Data Journalist', 'Podcast Producer'],
        mustHaveSkills: ['Investigative Reporting', 'Fact-Checking', 'Media Law & Ethics', 'Data Journalism', 'Storytelling'],
        goodToHaveSkills: ['Audio Production', 'Freedom of Information Requests'],
      }
    ],
    skills: [
      { name: 'Investigative Reporting', type: 'practical', description: 'Uncovering public interest stories through deep research and interviews.', level0Desc: 'None', level1Desc: 'News release summaries', level2Desc: 'Conducting structured interviews, verifying tips', level3Desc: 'Following money trails, analyzing public filings', level4Desc: 'Complex multi-month investigations and cross-border collaborations' },
      { name: 'Fact-Checking', type: 'domain', description: 'Rigorous verification of claims, statistics, and assertions.', level0Desc: 'None', level1Desc: 'Reverse image search basics', level2Desc: 'Primary vs secondary source verification', level3Desc: 'Geolocation, corroborating public records', level4Desc: 'OSINT (Open Source Intelligence) forensics' }
    ]
  },
  {
    domainCode: 'aviation',
    domainName: 'Aviation',
    description: 'Commercial Piloting, Air Traffic Control, Aviation Safety, and Aeronautical Operations.',
    icon: 'Plane',
    radarWeights: { technical: 0.30, domain: 0.35, practical: 0.20, projects: 0.05, communication: 0.08, interview: 0.02 },
    safetyNotes: 'FAA / ICAO regulatory training preparation. Actual flight operations require certified flight hours.',
    milestones: ['Aerodynamics & Weather Theory', 'Navigation & Instrument Rules (IFR)', 'Aircraft Systems & Checklists', 'Emergency Protocol Drills'],
    assessmentStyles: ['Flight Simulator Scenario Checks', 'Aviation Meteorology Quizzes', 'Standard Operating Procedure (SOP) Exams'],
    proofTaskTemplates: [
      { taskKey: 'flight_navigation_plan', title: 'Cross-Country Flight & Fuel Plan', proofType: 'CASE_STUDY', description: 'Calculate cross-country flight route with weight/balance, wind correction, and fuel reserves', associatedSkill: 'Aeronautical Navigation' }
    ],
    roles: [
      {
        title: 'Aviation Safety & Flight Operations Specialist',
        description: 'Ensures flight compliance, navigation planning, and airspace regulatory adherence.',
        seniorityLevels: ['Flight Dispatcher', 'Aviation Safety Inspector', 'Chief of Flight Ops'],
        relatedRoles: ['Commercial Pilot (Ground School)', 'Air Traffic Controller'],
        mustHaveSkills: ['Aeronautical Navigation', 'Meteorology', 'FAA / ICAO Regulations', 'Aircraft Systems', 'Crew Resource Management'],
        goodToHaveSkills: ['Flight Planning Software', 'Accident Investigation Basics'],
      }
    ],
    skills: [
      { name: 'Aeronautical Navigation', type: 'technical', description: 'Dead reckoning, VOR, GPS, and airway navigation.', level0Desc: 'None', level1Desc: 'Reading sectional charts', level2Desc: 'Calculating true heading and wind correction', level3Desc: 'Instrument approach plates (ILS, RNAV)', level4Desc: 'High-altitude oceanic navigation and contingency routes' }
    ]
  },
  {
    domainCode: 'hospitality',
    domainName: 'Hospitality',
    description: 'Hotel Operations, Tourism Management, Food & Beverage Leadership, and Guest Experience.',
    icon: 'Coffee',
    radarWeights: { technical: 0.10, domain: 0.30, practical: 0.30, projects: 0.10, communication: 0.15, interview: 0.05 },
    safetyNotes: 'Food safety (HACCP) and guest privacy compliance.',
    milestones: ['Front Office & Guest Services', 'Revenue Management & RevPAR', 'Food Safety & Hygiene (HACCP)', 'Crisis & Escalation Handling'],
    assessmentStyles: ['Guest De-escalation Scenarios', 'Revenue Management Simulations', 'HACCP Audit Checklists'],
    proofTaskTemplates: [
      { taskKey: 'revpar_optimization_plan', title: 'Hotel Revenue Management & Pricing Strategy', proofType: 'CASE_STUDY', description: 'Formulate dynamic seasonal pricing strategy optimizing RevPAR and ADR', associatedSkill: 'Revenue Management' }
    ],
    roles: [
      {
        title: 'Hospitality Operations Manager',
        description: 'Directs hotel operations, optimizes guest satisfaction, and manages operational budgets.',
        seniorityLevels: ['Duty Manager', 'Operations Manager', 'General Manager'],
        relatedRoles: ['Guest Experience Director', 'Event Coordinator'],
        mustHaveSkills: ['Revenue Management', 'Guest Experience Leadership', 'HACCP Standards', 'Property Management Systems (PMS)', 'Staff Scheduling'],
        goodToHaveSkills: ['Event Planning', 'Vendor Negotiations'],
      }
    ],
    skills: [
      { name: 'Revenue Management', type: 'technical', description: 'Optimizing room pricing based on demand forecasts.', level0Desc: 'None', level1Desc: 'Occupancy rate formula', level2Desc: 'Calculating ADR and RevPAR', level3Desc: 'Dynamic pricing curves by seasonal elasticity', level4Desc: 'Multi-property distribution channel optimization' }
    ]
  },
  {
    domainCode: 'sports',
    domainName: 'Sports',
    description: 'Sports Analytics, Athletic Performance, Sports Management, and Coaching.',
    icon: 'Trophy',
    radarWeights: { technical: 0.25, domain: 0.25, practical: 0.30, projects: 0.12, communication: 0.05, interview: 0.03 },
    safetyNotes: 'Sports performance modeling and analytics.',
    milestones: ['Biometrics & Tracking Data Basics', 'Expected Goals / Win Probability Modeling', 'Player Scouting & Valuation', 'Tactical Video & Data Synthesis'],
    assessmentStyles: ['Sports Analytics Jupyter Notebooks', 'Scouting Report Submissions', 'Injury Risk Statistical Models'],
    proofTaskTemplates: [
      { taskKey: 'football_expected_goals_notebook', title: 'Football / Sports Analytics Notebook on Public Dataset', proofType: 'CASE_STUDY', description: 'Analyze spatial tracking data to build an expected goals (xG) or win probability model on a public sports dataset', associatedSkill: 'Sports Analytics' }
    ],
    roles: [
      {
        title: 'Football / Sports Data Analyst',
        description: 'Analyzes tracking and event data to optimize team tactical decisions, player recruitment, and injury prevention.',
        seniorityLevels: ['Junior Analyst', 'First Team Data Analyst', 'Head of Performance Analytics'],
        relatedRoles: ['Sports Scientist', 'Scout', 'Performance Coach'],
        mustHaveSkills: ['Sports Analytics', 'Python', 'SQL', 'Spatial Data Tracking', 'Data Storytelling'],
        goodToHaveSkills: ['Tableau', 'Computer Vision for Sports', 'R for Sports'],
      }
    ],
    skills: [
      { name: 'Sports Analytics', type: 'technical', description: 'Applying predictive models to athletic event data.', level0Desc: 'None', level1Desc: 'Basic box score metrics', level2Desc: 'Expected goals (xG), pitch control models', level3Desc: 'Tracking data coordinate transformations', level4Desc: 'Reinforcement learning for tactical movement simulations' }
    ]
  },
  {
    domainCode: 'film',
    domainName: 'Film & Entertainment',
    description: 'Screenwriting, Cinematography, Film Editing, Sound Design, and Production Management.',
    icon: 'Film',
    radarWeights: { technical: 0.25, domain: 0.20, practical: 0.35, projects: 0.15, communication: 0.03, interview: 0.02 },
    safetyNotes: 'Creative entertainment workflows.',
    milestones: ['Three-Act Screenplay Structure', 'Lighting & Camera Operation', 'Non-Linear Editing (NLE)', 'Color Grading & Audio Mastering'],
    assessmentStyles: ['Short Film Reel Critique', 'Screenplay Treatment Evaluations', 'Color Grading Breakdown Submissions'],
    proofTaskTemplates: [
      { taskKey: 'film_edit_reel', title: 'Narrative Film Scene Edit & Sound Design', proofType: 'DESIGN', description: 'Cut and grade a 3-minute narrative sequence showcasing pacing, rhythm, and color grade', associatedSkill: 'Video Editing' }
    ],
    roles: [
      {
        title: 'Film Editor & Post-Production Specialist',
        description: 'Assembles raw footage, synchronizes dialogue, and crafts emotional narrative pacing in post-production.',
        seniorityLevels: ['Assistant Editor', 'Lead Editor', 'Post-Production Supervisor'],
        relatedRoles: ['Colorist', 'Cinematographer', 'Director'],
        mustHaveSkills: ['Video Editing', 'Color Grading', 'Sound Design', 'Premiere Pro / DaVinci Resolve', 'Story Pacing'],
        goodToHaveSkills: ['Motion Graphics', 'VFX Compositing'],
      }
    ],
    skills: [
      { name: 'Video Editing', type: 'practical', description: 'Narrative cutting and pacing using non-linear editing suites.', level0Desc: 'None', level1Desc: 'Trimming clips on timeline', level2Desc: 'J-cuts, L-cuts, continuity editing', level3Desc: 'Rhythm matching, multi-cam editing', level4Desc: 'Feature-length assembly, offline-to-online conform' }
    ]
  },
  {
    domainCode: 'agriculture',
    domainName: 'Agriculture',
    description: 'Agronomy, Precision Farming, Agricultural Biotechnology, and Supply Chain Management.',
    icon: 'Sprout',
    radarWeights: { technical: 0.20, domain: 0.35, practical: 0.25, projects: 0.12, communication: 0.05, interview: 0.03 },
    safetyNotes: 'Sustainable agricultural and pesticide management guidelines.',
    milestones: ['Soil Science & Crop Physiology', 'Irrigation & Nutrient Management', 'IoT & Drone Precision Agriculture', 'Post-Harvest Logistics'],
    assessmentStyles: ['Precision Farm Yield Forecasts', 'Soil Nutrition Prescription Plans', 'Pest Management Audits'],
    proofTaskTemplates: [
      { taskKey: 'precision_yield_plan', title: 'Precision Agriculture Farm Management Plan', proofType: 'CASE_STUDY', description: 'Design a precision farming plan utilizing NDVI satellite imagery and sensor-driven irrigation', associatedSkill: 'Precision Agriculture' }
    ],
    roles: [
      {
        title: 'Precision Agriculture Specialist',
        description: 'Integrates drone sensing, soil telemetry, and predictive models to maximize sustainable crop yields.',
        seniorityLevels: ['Field Agronomist', 'Precision Ag Specialist', 'Agricultural Director'],
        relatedRoles: ['Farm Operations Manager', 'Crop Consultant'],
        mustHaveSkills: ['Precision Agriculture', 'Soil Science', 'GIS & Satellite Telemetry', 'Crop Protection', 'Data Analysis'],
        goodToHaveSkills: ['Drone Piloting', 'Hydrology'],
      }
    ],
    skills: [
      { name: 'Precision Agriculture', type: 'technical', description: 'Using satellite and sensor data to optimize crop inputs.', level0Desc: 'None', level1Desc: 'Basic soil moisture awareness', level2Desc: 'Interpreting NDVI vegetation index maps', level3Desc: 'Variable rate fertilizer prescriptions', level4Desc: 'Autonomous machinery telemetry integration' }
    ]
  },
  {
    domainCode: 'biotech',
    domainName: 'Biotechnology',
    description: 'Bioinformatics, Genetic Engineering, Computational Biology, and Fermentation Science.',
    icon: 'Dna',
    radarWeights: { technical: 0.30, domain: 0.35, practical: 0.20, projects: 0.10, communication: 0.03, interview: 0.02 },
    safetyNotes: 'Biosafety level (BSL) compliance and bioethics guidelines.',
    milestones: ['Molecular Biology & Genetics', 'DNA/RNA Sequence Analysis', 'Protein Structure Modeling', 'CRISPR & Synthetic Biology'],
    assessmentStyles: ['Bioinformatics Pipeline Code Submissions', 'Protein Docking Simulations', 'Genomics Data Analysis'],
    proofTaskTemplates: [
      { taskKey: 'bioinformatics_variant_pipeline', title: 'Genomic Sequence Alignment & Variant Calling Pipeline', proofType: 'ML', description: 'Process FASTQ files using Biopython/BLAST to identify genetic mutations and gene expression levels', associatedSkill: 'Bioinformatics' }
    ],
    roles: [
      {
        title: 'Bioinformatics Scientist',
        description: 'Analyzes high-throughput genomics data, RNA sequencing, and protein structures using computational models.',
        seniorityLevels: ['Bioinformatician I', 'Senior Scientist', 'Computational Biology Lead'],
        relatedRoles: ['Genomics Analyst', 'Biostatistician'],
        mustHaveSkills: ['Bioinformatics', 'Python', 'Genomics', 'Biopython', 'Next-Gen Sequencing (NGS)'],
        goodToHaveSkills: ['R', 'Machine Learning for Biology', 'Structural Biology'],
      }
    ],
    skills: [
      { name: 'Bioinformatics', type: 'technical', description: 'Computational analysis of biological sequence data.', level0Desc: 'None', level1Desc: 'DNA sequence string basics', level2Desc: 'BLAST searches, FASTA parsing with Biopython', level3Desc: 'NGS variant calling (GATK), RNA-seq differential expression', level4Desc: 'AlphaFold protein structure prediction pipelines' }
    ]
  },
  {
    domainCode: 'entrepreneurship',
    domainName: 'Entrepreneurship',
    description: 'Venture Creation, Lean Startup, Pitching & Fundraising, Unit Economics, and Go-to-Market Strategy.',
    icon: 'Rocket',
    radarWeights: { technical: 0.15, domain: 0.25, practical: 0.30, projects: 0.15, communication: 0.10, interview: 0.05 },
    safetyNotes: 'Venture planning and business creation guidelines.',
    milestones: ['Problem Validation & Customer Interviews', 'Minimum Viable Product (MVP) Build', 'Unit Economics & Financial Projections', 'Investor Pitch Deck & Term Sheets'],
    assessmentStyles: ['Pitch Deck Reviews', 'Customer Discovery Interview Transcripts', 'Unit Economics Break-Even Calculators'],
    proofTaskTemplates: [
      { taskKey: 'startup_pitch_deck', title: '12-Slide Venture Pitch Deck & Financial Model', proofType: 'CASE_STUDY', description: 'Author an investor-ready 12-slide pitch deck complete with TAM/SAM/SOM, CAC/LTV, and traction roadmap', associatedSkill: 'Venture Capital & Pitching' }
    ],
    roles: [
      {
        title: 'Startup Founder / Venture Builder',
        description: 'Identifies high-value market inefficiencies, constructs scalable products, and executes go-to-market strategies.',
        seniorityLevels: ['Founder', 'Serial Entrepreneur', 'Managing Partner'],
        relatedRoles: ['Chief of Staff', 'Venture Operator'],
        mustHaveSkills: ['Lean Startup Methodology', 'Unit Economics', 'Venture Capital & Pitching', 'Go-To-Market Execution', 'Product Development'],
        goodToHaveSkills: ['Growth Hacking', 'Cap Table Management'],
      }
    ],
    skills: [
      { name: 'Lean Startup Methodology', type: 'practical', description: 'Rapid hypothesis validation through Build-Measure-Learn cycles.', level0Desc: 'None', level1Desc: 'Concept of MVP', level2Desc: 'Creating smoke tests and landing page signups', level3Desc: 'Cohort retention analysis, pivoting vs persevering', level4Desc: 'Systematic business model canvas iteration' }
    ]
  },
  {
    domainCode: 'custom',
    domainName: 'Other / Custom Career',
    description: 'For unique, interdisciplinary, or emerging careers not covered above. Flags lower initial data confidence and requests real JDs to build high-confidence profiles.',
    icon: 'Compass',
    radarWeights: { technical: 0.25, domain: 0.25, practical: 0.25, projects: 0.15, communication: 0.05, interview: 0.05 },
    safetyNotes: 'Custom domain: lower initial data confidence until real job descriptions are uploaded.',
    milestones: ['Foundational Domain Knowledge', 'Core Practical Tooling', 'Applied Portfolio Case Studies', 'Market-Aligned Capstone'],
    assessmentStyles: ['Custom Written Task', 'Self-Directed Practical Artifact', 'Scenario Reflection'],
    proofTaskTemplates: [
      { taskKey: 'custom_capstone_artifact', title: 'Custom Career Applied Portfolio Project', proofType: 'CASE_STUDY', description: 'Develop a documented practical deliverable addressing a concrete industry problem in your chosen career', associatedSkill: 'Problem Solving' }
    ],
    roles: [
      {
        title: 'Custom Interdisciplinary Specialist',
        description: 'Bespoke role configured by student goals.',
        seniorityLevels: ['Apprentice', 'Practitioner', 'Expert'],
        relatedRoles: ['General Specialist'],
        mustHaveSkills: ['Problem Solving', 'Technical Communication'],
        goodToHaveSkills: ['Continuous Learning'],
      }
    ],
    skills: [
      { name: 'Continuous Learning', type: 'soft', description: 'Ability to independently assimilate emerging domain knowledge.', level0Desc: 'None', level1Desc: 'Following tutorials', level2Desc: 'Synthesizing technical documentation', level3Desc: 'Applying new tools to unsolved problems', level4Desc: 'Pioneering domain workflows' }
    ]
  }
];
