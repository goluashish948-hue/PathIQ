import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Lock,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Award,
  ArrowRight,
  X,
  AlertTriangle,
  Layers,
  MapPin,
  Calendar,
  Clock,
  ListFilter,
  Network,
  ChevronRight,
  TrendingUp,
  Target,
  Lightbulb,
} from 'lucide-react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Dagre graph auto-layout helper
function getLayoutedElements(nodes: any[], edges: any[], direction = 'TB') {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 70 });

  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: 230, height: 95 });
  });

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map(node => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition ? nodeWithPosition.x - 115 : 0,
        y: nodeWithPosition ? nodeWithPosition.y - 47 : 0,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

// Custom Graph Node Component
const CustomRoadmapNode: React.FC<{ data: any }> = ({ data }) => {
  const isCompleted = data.status === 'COMPLETED';
  const isCurrent = data.status === 'CURRENT';
  const isLocked = data.status === 'LOCKED';
  const isAvailable = data.status === 'AVAILABLE';

  return (
    <div
      onClick={data.onClick}
      className={`w-[230px] p-3.5 rounded-2xl border cursor-pointer transition-all shadow-sm hover:shadow-md hover:scale-[1.02] ${
        isCompleted
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600'
          : isCurrent
          ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 shadow-indigo-500/20 ring-2 ring-indigo-500/40'
          : isLocked
          ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-60'
          : 'bg-white dark:bg-slate-800 border-amber-300 dark:border-amber-600'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Week {data.scheduledWeek || 1} • {data.estimatedHours}h
        </span>
        {isCompleted && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Done
          </span>
        )}
        {isCurrent && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 animate-pulse">
            <Play className="w-3 h-3 fill-indigo-600" /> Active
          </span>
        )}
        {isAvailable && (
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
            Up Next
          </span>
        )}
        {isLocked && <Lock className="w-3.5 h-3.5 text-slate-400" />}
      </div>

      <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 mb-1.5">
        {data.title}
      </div>

      <div className="flex items-center justify-between text-[10px]">
        <span
          className={`px-1.5 py-0.2 rounded font-semibold ${
            data.importance === 'MUST_HAVE'
              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
          }`}
        >
          {data.importance === 'MUST_HAVE' ? 'Must Have' : 'Good To Have'}
        </span>
        <span className="text-slate-400 font-mono text-[9px]">{data.clusterGroup || 'Core'}</span>
      </div>
    </div>
  );
};

interface DetailedLearningObjectives {
  summary: string;
  coreConcepts: string[];
  subtopics: Array<{ title: string; description: string }>;
  focusAreas: string[];
  learningOutcomes: string[];
}

function getEnrichedLearningObjectives(node: any): DetailedLearningObjectives {
  const key = ((node?.nodeKey || '') + ' ' + (node?.title || '')).toLowerCase();

  // Python Functions / Python Basics
  if (key.includes('python') || key.includes('func')) {
    return {
      summary:
        'In this topic, you will learn how to write clean, reusable, and modular Python code using functions. Instead of repeating lines of code, functions allow you to package logic into named blocks that you can call anytime with different inputs. You will master passing data into functions, returning calculated results, understanding where variables live in memory (variable scope), and writing concise lambda functions.',
      coreConcepts: [
        'How to define and call reusable functions using the def keyword with clear parameters',
        'Passing data via positional arguments (by order) vs. keyword arguments (by name)',
        'Why return sends calculated results back into your program, while print() only outputs text to the screen',
        'How Python finds variables using the LEGB scope hierarchy (Local, Enclosing, Global, Built-in)',
        'Handling dynamic or unknown counts of inputs with *args (tuples) and **kwargs (dictionaries)',
        'Writing compact inline anonymous helper functions with the lambda keyword',
      ],
      subtopics: [
        {
          title: 'Function Syntax & Execution Flow',
          description:
            'Writing function signatures, choosing descriptive names, adding docstrings for documentation, and tracing execution step-by-step.',
        },
        {
          title: 'Arguments, Parameters & Default Values',
          description:
            'Passing inputs by order vs. by parameter name, plus avoiding the dangerous mutable default argument trap (e.g. def add(val, items=[])).',
        },
        {
          title: 'Return Values vs. Console Output',
          description:
            'Understanding that print() only displays info in the terminal, whereas return passes data back so it can be saved in variables and used in further calculations.',
        },
        {
          title: 'Variable Scope & The LEGB Rule',
          description:
            'Where variables are born and where they can be accessed: Local (inside function), Enclosing (nested functions), Global (module level), and Built-in.',
        },
        {
          title: 'Variable-Length Arguments (*args & **kwargs)',
          description:
            'Building flexible functions that accept any number of positional arguments as a tuple or named keyword options as a dictionary.',
        },
        {
          title: 'Lambda Functions (Anonymous Functions)',
          description:
            'Writing short, single-line functions without formal names, commonly used inside map(), filter(), and sorted() keys.',
        },
      ],
      focusAreas: [
        'Pay special attention to the difference between return and print — a function without an explicit return statement always returns None implicitly.',
        'Never use mutable default arguments like def add_item(x, items=[]). Always use items=None and initialize items = [] inside the function body.',
        'Master variable scope to prevent accidental global variable dependencies and UnboundLocalError exceptions.',
      ],
      learningOutcomes: [
        'Break down complex coding tasks into modular, easily testable functions.',
        'Design clean API signatures with intuitive default parameters and type hints.',
        'Write bulletproof functions without accidental global state bugs or side effects.',
        'Confidently answer technical interview questions on variable scoping and argument unpacking.',
      ],
    };
  }

  // SQL Joins & Relational Merging
  if (key.includes('sql') || key.includes('join') || key.includes('database')) {
    return {
      summary:
        'In this topic, you will learn how to combine information across different database tables using SQL JOINs. Real databases store data in separate tables (such as users, orders, and products) to avoid duplicate records. You will study how to merge these tables accurately without dropping critical records or creating accidental duplicate rows.',
      coreConcepts: [
        'How relational tables connect using Primary Keys (unique IDs) and Foreign Keys',
        'The four fundamental join types: INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN',
        'The critical difference between matching conditions in ON versus filtering in the WHERE clause',
        'Joining a table to itself (Self-Join) to compare sequential events or hierarchical relationships',
        'Safely replacing missing NULL values from unmatched outer joins using COALESCE()',
        'Avoiding accidental Cartesian Products (massive row multiplications) when join keys are omitted',
      ],
      subtopics: [
        {
          title: 'Primary Keys, Foreign Keys & Join Foundations',
          description:
            'Connecting tables using primary-foreign key pairs and understanding relational entity mapping.',
        },
        {
          title: 'INNER JOIN (Matching Rows in Both Tables)',
          description:
            'Extracting only those records that have matching keys present in both tables simultaneously.',
        },
        {
          title: 'LEFT (OUTER) JOIN (Preserving Main Table Records)',
          description:
            'Keeping all records from your primary left table, even if there is no corresponding data in the right table (filling empty fields with NULL).',
        },
        {
          title: 'FULL OUTER JOIN & Cross Joins',
          description:
            'Combining all records from both sides, and how missing join conditions cause runaway Cartesian row explosions.',
        },
        {
          title: 'Filtering: ON Clause vs WHERE Clause',
          description:
            'Understanding why placing right-table conditions in WHERE accidentally turns a LEFT JOIN into an INNER JOIN by rejecting NULL rows.',
        },
        {
          title: 'Self-Joins & Sequence Analysis',
          description:
            'Joining a table with itself to detect repeat transactions, sequential user steps, or manager-employee trees.',
        },
        {
          title: 'Handling Missing Values with COALESCE()',
          description:
            'Converting SQL NULL values from unmatched outer joins into clean default values like 0 or "N/A" so calculations remain accurate.',
        },
      ],
      focusAreas: [
        'Always verify whether you need an INNER JOIN or a LEFT JOIN: if you need all customers even if they have 0 purchases, you MUST use a LEFT JOIN.',
        'Never place filters on the right table in the WHERE clause when using a LEFT JOIN; always put them in the ON clause to keep non-matching left records.',
        'Always join on indexed unique keys to prevent accidental Cartesian products and query timeouts.',
      ],
      learningOutcomes: [
        'Write clean multi-table queries that accurately extract and merge relational data.',
        'Identify customers or entities with zero transactions by checking WHERE right_table.id IS NULL.',
        'Use COALESCE() to guarantee aggregate totals (like SUM or COUNT) return valid numbers rather than NULLs.',
        'Confidently explain join execution mechanics and index utilization in technical interviews.',
      ],
    };
  }

  // Pandas & Data Wrangling
  if (key.includes('pandas') || key.includes('wrangling') || key.includes('dataframe')) {
    return {
      summary:
        'In this topic, you will learn how to clean, manipulate, and analyze tabular data using Python\'s Pandas library. Real-world data is almost always messy, incomplete, and formatted incorrectly. You will study how to inspect dataframes, handle missing values, filter rows, aggregate statistics, and combine datasets to prepare them for analysis or machine learning.',
      coreConcepts: [
        'Understanding Series (1D) and DataFrame (2D) data structures and index alignment',
        'Selecting and filtering data safely using .loc[] (label-based) and .iloc[] (integer position-based)',
        'Detecting and resolving missing data with .isna(), .fillna(), and .dropna()',
        'Grouping data by categories and calculating summaries using .groupby() and .agg()',
        'Merging and concatenating multiple datasets together using .merge() and pd.concat()',
        'Writing vectorized operations instead of slow for-loops to process millions of rows in seconds',
      ],
      subtopics: [
        {
          title: 'DataFrame Creation & Data Inspection',
          description:
            'Loading CSV/JSON files, checking column data types (df.dtypes), summarizing statistics (df.describe()), and checking memory usage.',
        },
        {
          title: 'Filtering, Slicing & The SettingWithCopy Warning',
          description:
            'Filtering rows using boolean conditions and modifying slices correctly using .loc to avoid silent bugs.',
        },
        {
          title: 'Handling Missing & Null Values',
          description:
            'Finding null values across columns and choosing whether to drop rows or impute missing values with means, medians, or placeholders.',
        },
        {
          title: 'Category Grouping & Custom Aggregations',
          description:
            'Splitting data into groups (like departments or customer types) and computing multiple metrics (mean, sum, count) at once.',
        },
        {
          title: 'Merging, Joining & Reshaping Data',
          description:
            'Combining disparate datasets using relational keys (inner/left joins in pandas) and pivoting long tables into wide formats.',
        },
      ],
      focusAreas: [
        'Always use .loc[row_condition, \'column_name\'] when assigning values to prevent the dreaded SettingWithCopyWarning.',
        'Never iterate over DataFrame rows using a Python for loop or .iterrows() for calculations — always use built-in vectorized methods.',
        'Always verify data types after loading files, especially dates (pd.to_datetime) and numeric fields parsed as strings.',
      ],
      learningOutcomes: [
        'Take messy raw CSV files and transform them into clean, structured data ready for dashboards and machine learning.',
        'Filter, slice, and mutate large tables without memory bloat or performance bottlenecks.',
        'Aggregate complex business metrics across multiple dimensions in just 2-3 lines of code.',
        'Confidently build data cleaning pipelines during coding assessments and technical interviews.',
      ],
    };
  }

  // Machine Learning & Classification
  if (key.includes('machine_learning') || key.includes('ml') || key.includes('classification')) {
    return {
      summary:
        'In this topic, you will learn the core foundations of supervised classification and how to handle severe class imbalance. You will study why raw Accuracy fails when the target event is rare (such as fraud detection, cancer diagnosis, or cyber intrusion), how to evaluate models using Precision, Recall, and PR-AUC, and how to calibrate decision thresholds for real-world impact.',
      coreConcepts: [
        'How binary classification algorithms create decision boundaries between classes',
        'Why high accuracy is misleading when the positive class represents less than 1% of the dataset',
        'The trade-off between Precision (reducing false alarms) and Recall (catching true positive events)',
        'How to interpret the Confusion Matrix: True Positives, False Positives, True Negatives, and False Negatives',
        'Algorithmic methods for imbalanced data: scale_pos_weight in XGBoost, class_weight in Scikit-Learn, and SMOTE resampling',
        'How to prevent data leakage during train/test splits and cross-validation pipelines',
      ],
      subtopics: [
        {
          title: 'The Accuracy Fallacy in Rare Classes',
          description:
            'Understanding why predicting 100% negative gives 99.9% accuracy while detecting zero target instances, and why alternate metrics are essential.',
        },
        {
          title: 'Precision, Recall & Harmonic F1 Score',
          description:
            'Calculating Precision (how many predicted alerts were real) and Recall (how many real events were caught), and using F1/F-beta scores.',
        },
        {
          title: 'PR-AUC vs. ROC-AUC Curves',
          description:
            'Why ROC curves are overly optimistic on imbalanced data, and why Precision-Recall curves give a true reflection of model performance.',
        },
        {
          title: 'Handling Class Imbalance (Cost-Sensitive & SMOTE)',
          description:
            'Using loss function penalties like scale_pos_weight versus generating synthetic samples with SMOTE.',
        },
        {
          title: 'Cross-Validation & Data Leakage Prevention',
          description:
            'Using Stratified K-Fold to maintain class ratios and ensuring all feature scaling and oversampling happen strictly inside the training fold.',
        },
        {
          title: 'Decision Threshold Calibration',
          description:
            'Shifting the probability threshold from 0.5 to a business-optimal value based on the financial cost of false positives vs. false negatives.',
        },
      ],
      focusAreas: [
        'Never evaluate an imbalanced classification model on raw Accuracy alone; always check Precision, Recall, and PR-AUC.',
        'Never apply SMOTE or fit scalers before splitting data into train and test folds, as this causes catastrophic data leakage.',
        'Always calibrate your decision threshold based on business costs rather than leaving it at default 0.5.',
      ],
      learningOutcomes: [
        'Build and evaluate classification models on severely imbalanced real-world datasets.',
        'Interpret and explain confusion matrices and trade-offs to technical and business stakeholders.',
        'Implement Stratified K-Fold cross-validation pipelines without leaking test data.',
        'Tune probability thresholds to optimize business objectives.',
      ],
    };
  }

  // Applied Mathematics, Probability & Financial Risk Statistics
  if (key.includes('math') || key.includes('prob') || key.includes('stats') || key.includes('bayes')) {
    return {
      summary:
        'In this topic, you will learn the mathematical and statistical foundations required for FinTech risk engineering. Under severe class rarity (<0.1% fraud), standard assumptions fail. You will master Bayes\' Theorem to conquer the base-rate fallacy, model fat-tailed financial dollar amounts using Pareto distributions, and conduct hypothesis tests to validate risk rule rollouts without causing revenue loss.',
      coreConcepts: [
        'Bayes\' Theorem and the Base-Rate Fallacy in rare-event detection',
        'Modeling heavy-tailed and Pareto transaction amount distributions',
        'Prior vs Posterior probability updates when combining multiple independent risk signals',
        'Hypothesis testing (A/B testing risk rules) and Statistical Power calculation',
        'Log-odds and logistic transformations for scoring engines',
      ],
      subtopics: [
        {
          title: 'The Base-Rate Fallacy & Bayes Theorem',
          description:
            'Why a 99% accurate model creates overwhelming false alerts when the prior probability of fraud is 0.1%, and how to compute exact posterior odds.',
        },
        {
          title: 'Heavy-Tailed & Extreme Value Distributions',
          description:
            'Understanding why transaction amounts follow log-normal and Pareto power-law distributions rather than standard Gaussian bell curves.',
        },
        {
          title: 'Statistical Testing for Risk Rules',
          description:
            'Conducting two-sample hypothesis tests to measure whether a new decline rule genuinely reduces chargeback rates without harming checkout conversion.',
        },
        {
          title: 'Log-Odds & Calibration Scoring',
          description:
            'Transforming probabilities into credit/risk scorecards using log-odds scaling used across credit bureaus and payment networks.',
        },
      ],
      focusAreas: [
        'Always calculate the posterior probability using the true base rate; never rely on raw model confidence scores alone.',
        'Beware of assuming normal distributions for dollar amounts — 80% of fraud losses often come from the top 1% of transaction amounts.',
        'Ensure sample sizes in risk A/B tests have sufficient statistical power before rolling out aggressive blocking rules.',
      ],
      learningOutcomes: [
        'Compute Bayesian posterior risk probabilities accurately under extreme class imbalance.',
        'Fit power-law distributions to financial transaction losses and determine optimal cutoff points.',
        'Design and evaluate risk rule experiments using rigorous statistical hypothesis tests.',
        'Ace technical screening questions on probability and statistics at top FinTech firms.',
      ],
    };
  }

  // Feature Engineering & Velocity Windows
  if (key.includes('velocity') || key.includes('feature_engineering')) {
    return {
      summary:
        'In this topic, you will learn how to engineer domain-specific velocity counters and behavioral discrepancy signals. In FinTech, raw transaction attributes (like $45 at 2:00 PM) carry minimal signal on their own. The true predictive power comes from historical context: how many cards this device used in the past 10 minutes, geographical distance between consecutive swipes, and sudden spikes over historical baselines.',
      coreConcepts: [
        'Rolling sliding-window counters (transaction count, sum, max over 5m, 1h, 24h, 7d)',
        'Geographical velocity using the Haversine distance formula to catch physically impossible travel (speed > 500 mph)',
        'Entity linkage and ratio features (distinct cards per IP, distinct emails per device fingerprint)',
        'Categorical encoding for high-cardinality values (Merchant Category Codes - MCC, ZIP codes)',
        'Preventing future data leakage when constructing time-series feature pipelines',
      ],
      subtopics: [
        {
          title: 'Sliding-Window Velocity Counters',
          description:
            'Computing rolling aggregates per user, card, and device to detect high-frequency card testing and bot attacks.',
        },
        {
          title: 'Geographical Haversine Velocity',
          description:
            'Calculating distance and speed between consecutive swipes to detect cloned cards used across cities or continents simultaneously.',
        },
        {
          title: 'Device & IP Fingerprint Ratios',
          description:
            'Tracking many-to-one and one-to-many relationships (e.g. 50 different cards attempted from one IP address within an hour).',
        },
        {
          title: 'Out-of-Fold Target Encoding',
          description:
            'Encoding high-cardinality merchant categories without overfitting or leaking target label information into validation sets.',
        },
      ],
      focusAreas: [
        'Never use global aggregations that peek into future rows; all velocity windows must be strictly backward-looking from the transaction timestamp.',
        'Cache rolling counters in memory (Redis) rather than computing expensive multi-table scans on every live transaction.',
        'Handle edge cases for new users with zero transaction history using population fallback priors.',
      ],
      learningOutcomes: [
        'Extract high-signal velocity features that boost model PR-AUC by 40%+ over raw columns.',
        'Implement Haversine geodistance velocity detectors in Python.',
        'Build Scikit-learn feature engineering transformers with zero lookahead leakage.',
        'Articulate how Stripe Radar and PayPal engineer behavioral features to interviewers.',
      ],
    };
  }

  // Unsupervised Anomaly Detection & Novelty Filtering
  if (key.includes('anomaly') || key.includes('novelty') || key.includes('isolation')) {
    return {
      summary:
        'In this topic, you will learn how to detect zero-day fraud attacks and syndicated crime rings without labeled data. Confirmed fraud chargebacks take 60 to 90 days to settle with Visa/Mastercard. During that lag, supervised models are blind. You will master Isolation Forests, Local Outlier Factor, and graph entity clustering to catch novel attack patterns before labels exist.',
      coreConcepts: [
        'Why supervised models fail during the 60-90 day chargeback settlement lag',
        'Isolation Forest mechanics: recursive random partitioning isolating anomalies near the root',
        'Local Outlier Factor (LOF) for density-based local anomaly scoring',
        'Graph-based entity resolution and DBSCAN clustering to uncover organized fraud rings',
        'Tuning contamination rate hyperparameters without ground-truth labels',
      ],
      subtopics: [
        {
          title: 'The Chargeback Lag Problem',
          description:
            'Understanding the 2-3 month feedback delay in financial fraud and why unsupervised novelty detection is mandatory.',
        },
        {
          title: 'Isolation Forest Algorithm',
          description:
            'How random trees isolate anomalous feature points with significantly shorter path lengths than normal inliers.',
        },
        {
          title: 'Density & Distance-Based Detectors (LOF)',
          description:
            'Detecting transactions that fall into low-density sparse regions compared to their nearest neighbors.',
        },
        {
          title: 'Syndicated Ring Clustering with DBSCAN',
          description:
            'Grouping transactions sharing subtle fingerprint tokens (identical browser headers, sequential card numbers) into fraud rings.',
        },
      ],
      focusAreas: [
        'Remember that anomaly detection flags statistical rarities — some will be legitimate high-value VIP customers, requiring soft challenges (3D Secure) rather than hard declines.',
        'Contamination parameter must be set conservatively (typically 0.005 to 0.01) to avoid overwhelming manual review queues.',
        'Normalize and scale numeric dimensions before running distance-based algorithms.',
      ],
      learningOutcomes: [
        'Implement and tune Isolation Forests on streaming transaction datasets.',
        'Cluster and detect syndicated fraud rings using DBSCAN and entity graphs.',
        'Defend the dual-layer strategy (supervised + unsupervised) during FinTech architecture interviews.',
      ],
    };
  }

  // XGBoost & Imbalanced Modeling
  if (key.includes('xgboost') || key.includes('lightgbm') || key.includes('boosting')) {
    return {
      summary:
        'In this topic, you will master Gradient Boosted Decision Trees (GBDT) on extreme class imbalance. XGBoost and LightGBM are the undisputed industry standard across Stripe, Adyen, and PayPal for tabular risk modeling. You will learn to tune scale_pos_weight, implement focal loss, optimize hyperparameters with Optuna, and calibrate raw scores using Isotonic Regression.',
      coreConcepts: [
        'Gradient boosting mechanics: sequentially fitting regression trees to pseudo-residuals',
        'Handling severe class imbalance with scale_pos_weight, focal loss, and max_delta_step',
        'Hyperparameter optimization (learning_rate, max_depth, colsample_bytree) with Optuna',
        'Early stopping on validation PR-AUC to prevent overfitting',
        'Probability calibration with Isotonic Regression and Platt scaling for true risk scores',
      ],
      subtopics: [
        {
          title: 'GBDT Mechanics & Loss Gradients',
          description:
            'Understanding second-order Taylor expansion gradients in XGBoost and why trees excel on tabular data.',
        },
        {
          title: 'Cost-Sensitive Tree Boosting',
          description:
            'Penalizing false negatives using scale_pos_weight to force trees to focus on rare fraud instances.',
        },
        {
          title: 'Systematic Optuna Tuning',
          description:
            'Automating Bayesian hyperparameter search to maximize PR-AUC while controlling model complexity.',
        },
        {
          title: 'Probability Calibration',
          description:
            'Transforming raw GBDT logits into true empirical risk probabilities that accurately reflect financial default odds.',
        },
      ],
      focusAreas: [
        'Never evaluate tree models on training data or random splits — always use time-series splits to reflect live deployment conditions.',
        'Uncalibrated model scores cannot be used directly for risk cutoff rules — always calibrate with Isotonic Regression.',
        'Control tree depth (max_depth 4-6) to prevent trees from memorizing individual fraudster accounts.',
      ],
      learningOutcomes: [
        'Train state-of-the-art XGBoost and LightGBM models on heavily skewed datasets.',
        'Tune hyperparameters systematically with Optuna maximizing PR-AUC.',
        'Calibrate predicted probabilities into empirical risk scores.',
        'Explain gradient boosting trade-offs with confidence in technical interviews.',
      ],
    };
  }

  // Real-Time Serving, FastAPI & Redis Feature Store
  if (key.includes('realtime') || key.includes('fastapi') || key.includes('redis') || key.includes('serving')) {
    return {
      summary:
        'In this topic, you will learn how to build low-latency real-time inference microservices. Payment card networks enforce strict SLAs: the entire risk decision must execute in under 50ms roundtrip. You will build asynchronous FastAPI services, integrate Redis as an in-memory feature store for 5ms velocity lookups, serialize models with ONNX/Treelite, and build fallback circuit breakers.',
      coreConcepts: [
        'Card authorization network SLAs and latency budgets (p99 < 50ms)',
        'Asynchronous Python microservices with FastAPI, Uvicorn, and Pydantic validation',
        'In-memory feature stores using Redis pipelines for sub-5ms rolling aggregate lookups',
        'Model acceleration: serializing tree models with Treelite or ONNX Runtime for 10x faster inference',
        'Graceful degradation: fallback heuristic rule engines and circuit breakers under load',
      ],
      subtopics: [
        {
          title: 'Latency Budgeting & Payment SLAs',
          description:
            'Deconstructing the 100ms authorization window: network transport, feature lookup, model scoring, and decision response.',
        },
        {
          title: 'FastAPI Microservice Architecture',
          description:
            'Building async POST /v1/evaluate-transaction endpoints with strict schema validation and error boundaries.',
        },
        {
          title: 'Redis In-Memory Feature Store',
          description:
            'Using Redis hashes and sorted sets with TTL expiration to query rolling 10m velocity in under 3 milliseconds.',
        },
        {
          title: 'Circuit Breakers & Graceful Degradation',
          description:
            'Deploying fallback heuristic rules when Redis or the ML service experiences timeouts to prevent checkout blocking.',
        },
      ],
      focusAreas: [
        'Never perform blocking disk I/O or unindexed database queries inside the request lifecycle.',
        'Benchmark p99 latency (the slowest 1% of transactions) rather than mean latency, as payment gateways timeout on the tail.',
        'Serialize models into compiled C-libraries (Treelite) to eliminate Python GIL overhead.',
      ],
      learningOutcomes: [
        'Build a production-grade FastAPI risk scoring service achieving p99 latency < 35ms.',
        'Integrate Redis pipelines for instantaneous velocity feature retrieval.',
        'Implement resilient fallback mechanisms that protect revenue during upstream outages.',
        'Defend low-latency architecture choices in FinTech system design interviews.',
      ],
    };
  }

  // Docker Containerization & Microservices
  if (key.includes('docker') || key.includes('container')) {
    return {
      summary:
        'In this topic, you will learn how to package machine learning and web services into minimal, secure, and reproducible Docker containers. You will master multi-stage builds, non-root user permissions, layer caching optimization, and Docker Compose orchestration for multi-service environments.',
      coreConcepts: [
        'Containerization vs Virtualization: cgroups, namespaces, and lightweight isolation',
        'Multi-stage Dockerfile architecture separating build dependencies from minimal production runtimes',
        'Container security: running as non-root users and vulnerability scanning',
        'Docker Compose orchestration for multi-container stacks (API + Redis + Database)',
        'Health checks, graceful shutdown signals (SIGTERM), and resource constraints',
      ],
      subtopics: [
        {
          title: 'Multi-Stage Dockerfile Optimization',
          description:
            'Using builder stages to compile C-dependencies and producing slim final production images under 200MB.',
        },
        {
          title: 'Container Security & Hardening',
          description:
            'Switching to unprivileged non-root users and scanning images for known CVE vulnerabilities.',
        },
        {
          title: 'Docker Compose Local Orchestration',
          description:
            'Spinning up the complete microservice ecosystem (FastAPI, Redis, PostgreSQL) with a single command.',
        },
        {
          title: 'Production Signals & Health Checks',
          description:
            'Handling graceful termination signals to finish in-flight risk evaluations before pod shutdown.',
        },
      ],
      focusAreas: [
        'Never store API keys or database passwords directly inside Docker images or Dockerfiles.',
        'Order Dockerfile instructions from least-frequently changed to most-frequently changed to maximize build cache reuse.',
        'Always specify explicit base image tags rather than using :latest.',
      ],
      learningOutcomes: [
        'Write production multi-stage Dockerfiles with minimal attack surfaces.',
        'Orchestrate multi-service environments with Docker Compose.',
        'Deploy reproducible containerized services to cloud container runtimes.',
      ],
    };
  }

  // FinTech Regulations, Explainability & Anti-Bias Ethics
  if (key.includes('compliance') || key.includes('shap') || key.includes('adverse') || key.includes('security')) {
    return {
      summary:
        'In this topic, you will learn regulatory compliance, model explainability, and algorithmic fairness. FinTech companies are legally required by federal law (FCRA, ECOA) to provide Adverse Action reason codes when a transaction or loan is declined. You will master TreeSHAP to calculate exact local feature attributions, anonymize PII data under PCI-DSS, and audit models for demographic parity.',
      coreConcepts: [
        'FCRA and ECOA regulatory requirements for Adverse Action notices and reason codes',
        'Shapley values and TreeSHAP algorithm for exact, axiomatic feature attribution',
        'PCI-DSS compliance: data tokenization, encryption at rest, and PII masking',
        'Model Governance and Risk Management (OCC 2011-12 standards)',
        'Auditing algorithmic fairness: disparate impact ratio and demographic parity',
      ],
      subtopics: [
        {
          title: 'FCRA Adverse Action & Regulatory Reason Codes',
          description:
            'Why declining transactions without compliant human-readable reason codes triggers severe federal penalties.',
        },
        {
          title: 'TreeSHAP Local Explainability',
          description:
            'Computing game-theoretic Shapley contributions to identify the top 3 specific reasons a transaction was rejected.',
        },
        {
          title: 'PCI-DSS Data Protection & Tokenization',
          description:
            'Masking Primary Account Numbers (PAN) and encrypting cardholder data across all training pipelines.',
        },
        {
          title: 'Algorithmic Fairness & Bias Auditing',
          description:
            'Evaluating false rejection rates across different demographic cohorts to ensure fair and equitable model behavior.',
        },
      ],
      focusAreas: [
        'Never train models directly on raw Primary Account Numbers (PAN) or sensitive cardholder identifiers.',
        'Reason codes generated by SHAP must be mapped to clear, plain-language business explanations approved by compliance teams.',
        'Routinely audit model outputs for disparate impact across geographic and demographic groups.',
      ],
      learningOutcomes: [
        'Generate compliant Adverse Action reason codes using TreeSHAP waterfall charts.',
        'Implement PCI-DSS compliant data masking in feature engineering pipelines.',
        'Perform disparate impact and fairness audits on machine learning decision engines.',
        'Impress hiring managers with deep regulatory awareness in FinTech interviews.',
      ],
    };
  }

  // Capstone Project: Real-Time Fraud Detection Pipeline
  if (key.includes('capstone') || key.includes('project') || key.includes('pipeline')) {
    return {
      summary:
        'In this capstone project, you will build and deploy a complete, production-grade Real-Time Fraud Detection Engine. This is your flagship proof-of-work asset. You will assemble the entire stack: SQL ledger queries, custom velocity feature transformers, calibrated XGBoost models, an asynchronous FastAPI microservice with Redis in-memory velocity counters, all containerized with Docker Compose with automated tests and latency benchmarks.',
      coreConcepts: [
        'Architecting an end-to-end production ML system solving real business problems',
        'Integrating Redis feature store, calibrated tree models, and sub-50ms FastAPI serving',
        'Containerizing the full stack with Docker Compose and automated testing',
        'Measuring and documenting business impact: PR-AUC curves, cost matrices, and latency reports',
        'Authoring an executive technical README with architecture diagrams and reproducible benchmarks',
      ],
      subtopics: [
        {
          title: 'System Architecture & Data Contract',
          description:
            'Designing the modular microservice blueprint and Pydantic request/response schemas.',
        },
        {
          title: 'Feature Store & Model Integration',
          description:
            'Wiring Redis sliding-window counters into the calibrated XGBoost inference engine.',
        },
        {
          title: 'Latency Benchmarking & Load Testing',
          description:
            'Running load tests simulating 500 requests/second and validating p99 response times under 40ms.',
        },
        {
          title: 'Documentation & Portfolio Presentation',
          description:
            'Creating an industry-standard GitHub repository with architecture diagrams, setup scripts, and video walkthrough.',
        },
      ],
      focusAreas: [
        'The repository must be reproducible with a single docker-compose up command.',
        'Include clear evaluation charts (PR-AUC, ROC, Confusion Matrix) and a financial cost-savings estimate.',
        'Write automated pytest tests verifying both approving legitimate transactions and declining fraudulent spikes.',
      ],
      learningOutcomes: [
        'Deliver a complete, production-ready fraud mitigation engine.',
        'Prove your real-world capability with verifiable latency benchmarks and clean code.',
        'Stand out to hiring managers with an indisputable portfolio piece that passes senior technical reviews.',
      ],
    };
  }

  // FinTech Scenario & Technical Mock Interview
  if (key.includes('interview') || key.includes('readiness') || key.includes('milestone')) {
    return {
      summary:
        'In this milestone, you will simulate high-stakes technical and behavioral interview loops for FinTech risk engineering roles. You will practice defending architectural decisions, explaining trade-offs between false declines and fraud losses to VP-level stakeholders, answering diagnostic questions on payment SLAs, and solving live coding system design challenges.',
      coreConcepts: [
        'Communicating precision vs recall trade-offs in terms of dollar revenue and customer lifetime value',
        'FinTech system design: architecting low-latency, high-availability risk engines under payment SLAs',
        'Handling edge cases: network timeouts, cold starts, and emerging bot carding attacks',
        'Defending model validation strategies and preventing data leakage under cross-examination',
        'Structuring behavioral answers using the STAR method for senior engineering competencies',
      ],
      subtopics: [
        {
          title: 'Business Loss & Risk Trade-Off Scenarios',
          description:
            'Explaining how you balance false positive decline friction against chargeback losses to non-technical risk executives.',
        },
        {
          title: 'System Design for Low-Latency Risk',
          description:
            'Whiteboarding the complete architecture: Redis caching, model export, fallback rule engines, and Kafka event streaming.',
        },
        {
          title: 'Live Diagnostic Problem Solving',
          description:
            'Diagnosing sudden drops in precision or spikes in chargebacks during interactive interview prompts.',
        },
      ],
      focusAreas: [
        'Never speak purely about technical metrics like loss or accuracy — always connect metrics to financial business outcomes.',
        'Structure your answers clearly: problem formulation, constraints, architecture options, trade-offs, and final decision.',
        'Show intellectual humility and explain how you monitor and iterate on systems after deployment.',
      ],
      learningOutcomes: [
        'Communicate technical and business trade-offs with senior executive polish.',
        'Ace FinTech ML system design and behavioral interview rounds.',
        'Secure job offers at leading FinTech and technology companies with confidence.',
      ],
    };
  }

  // Dynamic / Thoughtful fallback for any other topic
  const cleanTitle = (node?.title || 'Core Topic')
    .replace(/[_-]/g, ' ')
    .trim();

  return {
    summary: `In this topic, you will learn the core foundations, practical implementation patterns, and industry best practices of ${cleanTitle}. You will understand how it fits into modern software architectures, which subtopics and components you need to build with it, and what you should focus on to achieve true professional mastery.`,
    coreConcepts: [
      `Foundational architecture, terminology, and operational mechanics of ${cleanTitle}`,
      `How ${cleanTitle} interfaces with upstream data sources and downstream services`,
      `Defensive programming, input validation, and reliable error handling patterns`,
      `Performance profiling, debugging workflows, and optimization techniques`,
    ],
    subtopics: [
      {
        title: `${cleanTitle} Foundations & Environment Setup`,
        description: `Core primitives, data structures, and configuration essentials required to build with ${cleanTitle}.`,
      },
      {
        title: `Design Patterns & Practical Implementation`,
        description: `Step-by-step techniques and design patterns used by senior engineers to implement ${cleanTitle} in production.`,
      },
      {
        title: `Error Handling, Edge Cases & Resilience`,
        description: `How to build defensive mechanisms that gracefully recover from network drops, invalid inputs, or unexpected states.`,
      },
      {
        title: `Performance Benchmarks & Optimization`,
        description: `Measuring execution speed, memory footprint, and bottlenecks to meet high-scale industry standards.`,
      },
    ],
    focusAreas: [
      `Focus on truly understanding the underlying concepts and data flow rather than memorizing syntax.`,
      `Pay close attention to error boundaries and edge-case exceptions.`,
      `Test your code with boundary cases and unexpected inputs.`,
    ],
    learningOutcomes: [
      `Explain and demonstrate core ${cleanTitle} concepts with confidence.`,
      `Write clean, production-ready code following industry best practices.`,
      `Diagnose and remediate bottlenecks and edge-case exceptions quickly.`,
      `Answer conceptual and coding interview questions related to ${cleanTitle}.`,
    ],
  };
}

export const RoadmapPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [replanDiff, setReplanDiff] = useState<any>(null);
  const [trackType, setTrackType] = useState<'FAST' | 'STRONG'>('STRONG');
  const [viewMode, setViewMode] = useState<'TRACK' | 'GRAPH'>('TRACK');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'CURRENT' | 'AVAILABLE' | 'COMPLETED' | 'LOCKED'>('ALL');

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const nodeTypes = useMemo(() => ({ customNode: CustomRoadmapNode }), []);

  useEffect(() => {
    loadActiveRoadmap();
  }, []);

  async function loadActiveRoadmap() {
    setLoading(true);
    try {
      const res = await api.getActiveRoadmap();
      setRoadmap(res);

      if (res?.nodes) {
        const flowNodes = res.nodes.map((n: any) => ({
          id: n.nodeKey,
          type: 'customNode',
          data: {
            ...n,
            onClick: () => setSelectedNode(n),
          },
          position: { x: 0, y: 0 },
        }));

        const flowEdges = (res.edges || []).map((e: any) => ({
          id: `e-${e.sourceNodeKey}-${e.targetNodeKey}`,
          source: e.sourceNodeKey,
          target: e.targetNodeKey,
          type: 'smoothstep',
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
          style: { stroke: '#6366f1', strokeWidth: 1.5 },
        }));

        const layouted = getLayoutedElements(flowNodes, flowEdges);
        setNodes(layouted.nodes);
        setEdges(layouted.edges);
      }
    } catch (err) {
      console.error('Failed to load active roadmap', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleTrack(newTrack: 'FAST' | 'STRONG') {
    setTrackType(newTrack);
    await api.generateRoadmap({
      targetCareer: roadmap?.targetCareer || 'Fraud Detection ML Engineer in FinTech',
      trackType: newTrack,
      weeklyHours: roadmap?.weeklyHours || 10,
    });
    loadActiveRoadmap();
  }

  async function handleTriggerReplan() {
    try {
      const diff = await api.previewReplan('MISSED_2_WEEKS');
      setReplanDiff(diff);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAdoptDiff() {
    if (!replanDiff) return;
    await api.adoptReplan(replanDiff.id);
    setReplanDiff(null);
    loadActiveRoadmap();
  }

  async function handleCompleteNode(nodeKey: string) {
    await api.updateNodeStatus(nodeKey, 'COMPLETED');
    await loadActiveRoadmap();
    if (selectedNode) {
      setSelectedNode({ ...selectedNode, status: 'COMPLETED' });
    }
  }

  const rawNodes = roadmap?.nodes || [];

  // Group nodes by status
  const completedNodes = rawNodes.filter((n: any) => n.status === 'COMPLETED');
  const currentNodes = rawNodes.filter((n: any) => n.status === 'CURRENT');
  const availableNodes = rawNodes.filter((n: any) => n.status === 'AVAILABLE');
  const lockedNodes = rawNodes.filter((n: any) => n.status === 'LOCKED');

  const filteredNodes = rawNodes.filter((n: any) => {
    if (filterStatus === 'ALL') return true;
    return n.status === filterStatus;
  });

  const progressPercent = rawNodes.length > 0 ? Math.round((completedNodes.length / rawNodes.length) * 100) : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-slate-50 dark:bg-slate-950 animate-in fade-in">
      {/* Top Header & Overview Bar */}
      <div className="glass-panel border-b border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Career Roadmap v{roadmap?.versionNumber || 1}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {roadmap?.weeklyHours || 10}h / week • {roadmap?.totalEstimatedHours || 120}h total effort
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
              {roadmap?.targetCareer || 'Fraud Detection ML Engineer in FinTech'}
            </h1>
          </div>

          {/* Action Controls & Track Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Toggle: Pathway Track vs Graph */}
            <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                onClick={() => setViewMode('TRACK')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  viewMode === 'TRACK'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Simple Pathway</span>
              </button>
              <button
                onClick={() => setViewMode('GRAPH')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  viewMode === 'GRAPH'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>Graph DAG</span>
              </button>
            </div>

            {/* Fast Track vs Strong Track Switcher */}
            <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                onClick={() => handleToggleTrack('FAST')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                  trackType === 'FAST'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Fast Track (85h)
              </button>
              <button
                onClick={() => handleToggleTrack('STRONG')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                  trackType === 'STRONG'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Strong Track (125h)
              </button>
            </div>

            {/* Replan Demo Button */}
            <button
              onClick={handleTriggerReplan}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white shadow-sm transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Simulate Replan</span>
            </button>
          </div>
        </div>

        {/* 4 Status KPI Counters */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* 1. Completed */}
          <button
            onClick={() => setFilterStatus(filterStatus === 'COMPLETED' ? 'ALL' : 'COMPLETED')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              filterStatus === 'COMPLETED'
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {completedNodes.length} Topics
            </div>
            <span className="text-[10px] text-slate-400">Verified & mastered</span>
          </button>

          {/* 2. Currently Learning */}
          <button
            onClick={() => setFilterStatus(filterStatus === 'CURRENT' ? 'ALL' : 'CURRENT')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              filterStatus === 'CURRENT'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Currently Learning</span>
              <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
            </div>
            <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {currentNodes.length} Topics
            </div>
            <span className="text-[10px] text-slate-400">In-progress right now</span>
          </button>

          {/* 3. Up Next */}
          <button
            onClick={() => setFilterStatus(filterStatus === 'AVAILABLE' ? 'ALL' : 'AVAILABLE')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              filterStatus === 'AVAILABLE'
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 ring-2 ring-amber-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Up Next</span>
              <ArrowRight className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
              {availableNodes.length} Topics
            </div>
            <span className="text-[10px] text-slate-400">Prerequisites cleared</span>
          </button>

          {/* 4. Locked / Pending */}
          <button
            onClick={() => setFilterStatus(filterStatus === 'LOCKED' ? 'ALL' : 'LOCKED')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              filterStatus === 'LOCKED'
                ? 'border-slate-500 bg-slate-100 dark:bg-slate-800 ring-2 ring-slate-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Locked / Pending</span>
              <Lock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-xl font-extrabold text-slate-600 dark:text-slate-300">
              {lockedNodes.length} Topics
            </div>
            <span className="text-[10px] text-slate-400">Requires prior milestones</span>
          </button>
        </div>

        {/* Overall Progress Bar */}
        <div className="max-w-7xl mx-auto space-y-1">
          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Overall Roadmap Completion: {progressPercent}%</span>
            <span>{completedNodes.length} of {rawNodes.length} Milestones Finished</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Replan Alert Banner */}
      {replanDiff && (
        <div className="bg-amber-50 dark:bg-amber-950/80 border-b border-amber-300 dark:border-amber-800 p-4 text-xs z-20 animate-in slide-in-from-top">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900 dark:text-amber-200 block">
                  Automatic Replan Proposal (Student Confirmation Required)
                </span>
                <p className="text-amber-700 dark:text-amber-300 text-[11px]">
                  {replanDiff.explanation} (New projected completion: {replanDiff.newProjectedEndDate})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleAdoptDiff}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm transition-colors"
              >
                Confirm & Adopt New Schedule
              </button>
              <button
                onClick={() => setReplanDiff(null)}
                className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 relative">
        {/* VIEW 1: Simple Clean Pathway View (Default) */}
        {viewMode === 'TRACK' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Showing: {filterStatus === 'ALL' ? 'All Milestones' : filterStatus} ({filteredNodes.length})
                </span>
                {filterStatus !== 'ALL' && (
                  <button
                    onClick={() => setFilterStatus('ALL')}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {filteredNodes.map((node: any, idx: number) => {
                const isCompleted = node.status === 'COMPLETED';
                const isCurrent = node.status === 'CURRENT';
                const isAvailable = node.status === 'AVAILABLE';
                const isLocked = node.status === 'LOCKED';

                return (
                  <div
                    key={node.nodeKey}
                    onClick={() => setSelectedNode(node)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                      isCompleted
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                        : isCurrent
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/30'
                        : isAvailable
                        ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700 hover:border-indigo-400'
                        : 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {/* Status Pill */}
                          {isCompleted && (
                            <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed
                            </span>
                          )}
                          {isCurrent && (
                            <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-indigo-600 text-white flex items-center gap-1 animate-pulse">
                              <Play className="w-3 h-3 fill-white" /> Currently Learning
                            </span>
                          )}
                          {isAvailable && (
                            <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                              <ArrowRight className="w-3 h-3" /> Up Next
                            </span>
                          )}
                          {isLocked && (
                            <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Locked
                            </span>
                          )}

                          <span className="text-slate-400 font-mono text-[11px]">
                            Week {node.scheduledWeek || 1} • {node.estimatedHours} Hours
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                              node.importance === 'MUST_HAVE'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {node.importance === 'MUST_HAVE' ? 'Must Have' : 'Good To Have'}
                          </span>
                        </div>

                        <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
                          {node.title}
                        </h3>

                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                          {typeof node.whyNeeded === 'string'
                            ? JSON.parse(node.whyNeeded).why
                            : node.whyNeeded?.why || 'Core career competency.'}
                        </p>
                      </div>

                      {/* Right CTA Button */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isCurrent && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/learn');
                            }}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Continue Learning</span>
                          </button>
                        )}
                        {isAvailable && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/learn');
                            }}
                            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Start Topic</span>
                          </button>
                        )}
                        {isCompleted && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/learn');
                            }}
                            className="px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold text-xs hover:bg-emerald-100/50"
                          >
                            Review Concepts
                          </button>
                        )}
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: Interactive React Flow DAG */}
        {viewMode === 'GRAPH' && (
          <div className="h-[600px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 glass-panel relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.2}
              maxZoom={1.5}
            >
              <Background color="#94a3b8" gap={20} size={1} />
              <Controls />
              <MiniMap
                nodeColor={n => {
                  if (n.data?.status === 'COMPLETED') return '#10b981';
                  if (n.data?.status === 'CURRENT') return '#6366f1';
                  if (n.data?.status === 'AVAILABLE') return '#f59e0b';
                  return '#cbd5e1';
                }}
              />
            </ReactFlow>
          </div>
        )}
      </div>

      {/* Node Detail Side Drawer */}
      {selectedNode && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[440px] glass-panel border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-y-auto z-50 animate-in slide-in-from-right duration-200 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                Week {selectedNode.scheduledWeek || 1} • {selectedNode.estimatedHours} Hours
              </span>
              <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white">
                {selectedNode.title}
              </h3>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status badge and complete button */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                selectedNode.status === 'COMPLETED'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : selectedNode.status === 'CURRENT'
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                  : selectedNode.status === 'AVAILABLE'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              Status: {selectedNode.status}
            </span>

            {selectedNode.status !== 'COMPLETED' && (
              <button
                onClick={() => handleCompleteNode(selectedNode.nodeKey)}
                className="text-xs px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-sm transition-all"
              >
                Mark as Completed
              </button>
            )}
          </div>

          {/* Why Needed Panel - Industry Grounding & Market Evidence */}
          {(() => {
            const parsedWhy = typeof selectedNode.whyNeeded === 'string'
              ? JSON.parse(selectedNode.whyNeeded)
              : selectedNode.whyNeeded || {};
            const evidence = parsedWhy.evidence || [];
            const scorePercent = parsedWhy.confidenceScore ? Math.round(parsedWhy.confidenceScore * 100) : 96;

            return (
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-200">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Why am I learning this?</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {parsedWhy.confidenceLabel || 'HIGH'} Relevance ({scorePercent}%)
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {parsedWhy.why || 'Direct prerequisite required for target career mastery.'}
                </p>
                {evidence.length > 0 && (
                  <div className="pt-2 border-t border-indigo-100 dark:border-indigo-900/60 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                      Real Industry Evidence & Demand:
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                      {evidence.map((ev: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-indigo-500 font-bold">•</span>
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Industry Proof Requirement (if project or proof) */}
          {selectedNode.proofRequirement && (
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Verifiable Proof Requirement</span>
              </div>
              <p className="text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
                {selectedNode.proofRequirement}
              </p>
            </div>
          )}

          {/* Learning Objectives Detailed Study Guide */}
          {(() => {
            const enriched = getEnrichedLearningObjectives(selectedNode);
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-indigo-500" />
                    Learning Objectives & Study Guide
                  </h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                    Detailed Curriculum
                  </span>
                </div>

                {/* Plain-Language Topic Summary */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-100 block">
                    📖 What is this topic about?
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {enriched.summary}
                  </p>
                </div>

                {/* Core Concepts You Need to Learn */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    🎯 Core Concepts You Need to Learn:
                  </span>
                  <div className="space-y-1.5">
                    {enriched.coreConcepts.map((concept: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300">{concept}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtopics Included */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    📚 Subtopics Included:
                  </span>
                  <div className="space-y-2">
                    {enriched.subtopics.map((sub: { title: string; description: string }, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-1 text-xs"
                      >
                        <span className="font-bold text-indigo-700 dark:text-indigo-300 block">
                          {i + 1}. {sub.title}
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                          {sub.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What to Focus On (Key Focus Areas & Common Pitfalls) */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs space-y-1.5">
                  <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    What You Should Focus On:
                  </span>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside text-[11px] leading-relaxed">
                    {enriched.focusAreas.map((fa: string, i: number) => (
                      <li key={i}>{fa}</li>
                    ))}
                  </ul>
                </div>

                {/* What You Will Be Able to Understand or Do */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-800/80 text-xs space-y-1.5">
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    What You Will Be Able to Do After Completing This:
                  </span>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside text-[11px] leading-relaxed">
                    {enriched.learningOutcomes.map((out: string, i: number) => (
                      <li key={i}>{out}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}

          {/* Practice Tasks */}
          {selectedNode.practiceTasks && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recommended Practice Tasks
              </h4>
              <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300 list-disc list-inside">
                {(typeof selectedNode.practiceTasks === 'string'
                  ? JSON.parse(selectedNode.practiceTasks)
                  : selectedNode.practiceTasks || []
                ).map((task: string, i: number) => (
                  <li key={i}>{task}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
            <button
              onClick={() => navigate('/learn')}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              <BookOpen className="w-4 h-4" />
              <span>Study Concepts & Take Topic Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
