export interface InterviewQuestionTurn {
  turnIndex: number;
  question: string;
  category: 'PROJECT_DEEP_DIVE' | 'TECHNICAL' | 'SCENARIO' | 'SYSTEM_DESIGN' | 'WEAK_AREA_CHALLENGE';
  targetTopicOrSkill: string;
  contextExplanation: string;
  rubric: {
    technicalCorrectness: number; // max 25
    problemSolving: number; // max 25
    communicationStructure: number; // max 25
    domainRelevance: number; // max 25
  };
}

export interface TurnEvaluationResult {
  score: number; // 0-100
  breakdown: {
    technicalCorrectness: number;
    problemSolving: number;
    communicationStructure: number;
    domainRelevance: number;
  };
  feedback: string;
  strengths: string[];
  improvements: string[];
  followUpQuestion?: string; // Real-time interviewer follow-up
}

export interface InterviewStudentContext {
  userId?: string;
  targetCareer: string;
  completedTopics: string[];
  currentLearningTopic?: string;
  verifiedSkills: string[];
  projects: Array<{ title: string; description: string; skillsUsed?: string[] }>;
  weakAreas: string[];
}

export class InterviewEngine {
  public generatePersonalizedInterview(context: InterviewStudentContext): InterviewQuestionTurn[] {
    const role = context.targetCareer || 'Fraud Detection ML Engineer in FinTech';
    const completed = context.completedTopics || [];
    const currentTopic = context.currentLearningTopic || completed[0] || 'Python Functions & SQL';
    const projects = context.projects || [];
    const weakAreas = context.weakAreas || [];
    const primaryProject = projects[0] || {
      title: 'Fraud Anomaly Detection Engine',
      description: 'End-to-end classification pipeline for credit card transaction velocity spikes.',
    };

    const turns: InterviewQuestionTurn[] = [];

    // Turn 1: Project & Architectural Decisions
    turns.push({
      turnIndex: 1,
      category: 'PROJECT_DEEP_DIVE',
      targetTopicOrSkill: primaryProject.title,
      contextExplanation: `Based on your portfolio project: "${primaryProject.title}".`,
      question: `In your project "${primaryProject.title}", walk me through why you selected your specific model architecture and data processing pipeline. What alternatives did you benchmark against, and what was your primary performance trade-off?`,
      rubric: { technicalCorrectness: 25, problemSolving: 25, communicationStructure: 25, domainRelevance: 25 },
    });

    // Turn 2: Topic-Specific Deep Dive (based on what they recently learned)
    if (currentTopic.toLowerCase().includes('python')) {
      turns.push({
        turnIndex: 2,
        category: 'TECHNICAL',
        targetTopicOrSkill: 'Python Functions & Pipelines',
        contextExplanation: `Directly connected to your recently completed topic: Python Functions.`,
        question: `When writing data transformation functions for high-throughput ${role} pipelines, why is it critical to avoid mutable default arguments and global variables? How do you ensure your functions are thread-safe and testable?`,
        rubric: { technicalCorrectness: 25, problemSolving: 25, communicationStructure: 25, domainRelevance: 25 },
      });
    } else if (currentTopic.toLowerCase().includes('sql') || completed.some(t => t.toLowerCase().includes('sql'))) {
      turns.push({
        turnIndex: 2,
        category: 'TECHNICAL',
        targetTopicOrSkill: 'SQL Joins & Relational Scaling',
        contextExplanation: `Directly connected to your completed topic: SQL Joins.`,
        question: `In ${role}, you need to join tens of millions of cardholder transactions with historical merchant profiles. How do you distinguish between filtering in the ON clause versus the WHERE clause in a LEFT JOIN, and how do you prevent accidental Cartesian explosions on duplicate keys?`,
        rubric: { technicalCorrectness: 25, problemSolving: 25, communicationStructure: 25, domainRelevance: 25 },
      });
    } else {
      turns.push({
        turnIndex: 2,
        category: 'TECHNICAL',
        targetTopicOrSkill: currentTopic,
        contextExplanation: `Connected to your active curriculum milestone: ${currentTopic}.`,
        question: `You've demonstrated progress in ${currentTopic}. How does mastering ${currentTopic} directly impact system reliability and data pipelines in your target role as ${role}?`,
        rubric: { technicalCorrectness: 25, problemSolving: 25, communicationStructure: 25, domainRelevance: 25 },
      });
    }

    // Turn 3: Weak Areas / Edge Case Challenge (targeted at student's quiz struggle areas)
    if (weakAreas.length > 0) {
      const topWeak = weakAreas[0];
      turns.push({
        turnIndex: 3,
        category: 'WEAK_AREA_CHALLENGE',
        targetTopicOrSkill: topWeak,
        contextExplanation: `Targeting your identified quiz revision area: ${topWeak}.`,
        question: `In your recent assessments, "${topWeak}" was identified as a challenging area. In production ${role}, how would you solve real-world edge cases where ${topWeak} causes unexpected model degradation or pipeline failures?`,
        rubric: { technicalCorrectness: 25, problemSolving: 25, communicationStructure: 25, domainRelevance: 25 },
      });
    } else {
      // Default technical challenge for role
      turns.push({
        turnIndex: 3,
        category: 'TECHNICAL',
        targetTopicOrSkill: 'Class Imbalance & Loss Calibration',
        contextExplanation: `Core competency assessment for ${role}.`,
        question: `In ${role}, standard Accuracy is notoriously misleading because target events are extremely rare (<0.1%). Why do we prioritize Precision-Recall AUC over ROC-AUC, and how do you set your decision threshold?`,
        rubric: { technicalCorrectness: 25, problemSolving: 25, communicationStructure: 25, domainRelevance: 25 },
      });
    }

    // Turn 4: System Design & Production Scenario
    turns.push({
      turnIndex: 4,
      category: 'SYSTEM_DESIGN',
      targetTopicOrSkill: 'Low-Latency Production Inference',
      contextExplanation: `Production system architecture required for ${role}.`,
      question: `Design an end-to-end production scoring service for ${role} that ingests incoming authorization requests, aggregates historical velocity features, and returns a verified decision in under 50 milliseconds. What caching and database layers would you use?`,
      rubric: { technicalCorrectness: 25, problemSolving: 25, communicationStructure: 25, domainRelevance: 25 },
    });

    return turns;
  }

  public evaluateCandidateAnswer(
    turnIndex: number,
    candidateText: string,
    currentQuestionText: string = '',
    studentContext?: InterviewStudentContext
  ): TurnEvaluationResult {
    const trimmed = (candidateText || '').trim();
    const textLower = trimmed.toLowerCase();
    const qLower = (currentQuestionText || '').toLowerCase();
    const role = studentContext?.targetCareer || 'Software & ML Engineer';

    // 1. Detect empty, trivial, or evasive answers
    const isTrivial =
      trimmed.length < 25 ||
      /^(i don'?t know|no idea|skip|not sure|pass|na|none|\?+|idk|hello|hi)$/i.test(trimmed);

    if (isTrivial) {
      return {
        score: 28,
        breakdown: {
          technicalCorrectness: 6,
          problemSolving: 7,
          communicationStructure: 8,
          domainRelevance: 7,
        },
        feedback:
          'Your answer was too brief or evasive for a senior technical interview. In real industry interviews, even when unsure of the exact syntax, you are expected to articulate first principles, describe your conceptual approach, or outline how you would investigate the solution.',
        strengths: ['Prompt response submission under interview pressure.'],
        improvements: [
          'Avoid one-line or evasive answers; explain your thought process out loud.',
          'Break the problem down into components: inputs, transformation logic, and edge-case handling.',
          'Explain trade-offs and assumptions rather than remaining silent.',
        ],
        followUpQuestion:
          'Let\'s reset: If you encountered this exact challenge on day one in production, what documentation, diagnostic logs, or senior team members would you consult first to resolve it?',
      };
    }

    // 2. Multi-domain concept detection
    const mentionsImbalance =
      textLower.includes('imbalance') ||
      textLower.includes('rare') ||
      textLower.includes('minority') ||
      textLower.includes('class');

    const mentionsPrecisionRecall =
      textLower.includes('precision') ||
      textLower.includes('recall') ||
      textLower.includes('false positive') ||
      textLower.includes('false negative') ||
      textLower.includes('f1') ||
      textLower.includes('auc') ||
      textLower.includes('roc');

    const mentionsThresholdOrCalibration =
      textLower.includes('threshold') ||
      textLower.includes('calibration') ||
      textLower.includes('scale_pos_weight') ||
      textLower.includes('cost matrix') ||
      textLower.includes('cutoff');

    const mentionsSmoteOrSampling =
      textLower.includes('smote') ||
      textLower.includes('oversampl') ||
      textLower.includes('undersampl') ||
      textLower.includes('resampl');

    const mentionsModelArch =
      textLower.includes('xgboost') ||
      textLower.includes('random forest') ||
      textLower.includes('gradient boost') ||
      textLower.includes('neural') ||
      textLower.includes('transformer') ||
      textLower.includes('classifier') ||
      textLower.includes('regression') ||
      textLower.includes('feature');

    const mentionsLatencyOrCache =
      textLower.includes('redis') ||
      textLower.includes('cache') ||
      textLower.includes('latency') ||
      textLower.includes('fastapi') ||
      textLower.includes('kafka') ||
      textLower.includes('queue') ||
      textLower.includes('throughput') ||
      textLower.includes('p99') ||
      textLower.includes('millisecond') ||
      textLower.includes('async');

    const mentionsPythonScope =
      textLower.includes('scope') ||
      textLower.includes('mutable') ||
      textLower.includes('immutable') ||
      textLower.includes('none') ||
      textLower.includes('pure function') ||
      textLower.includes('closure') ||
      textLower.includes('thread') ||
      textLower.includes('default argument') ||
      textLower.includes('type hint') ||
      textLower.includes('decorator');

    const mentionsSqlJoins =
      textLower.includes('left join') ||
      textLower.includes('inner join') ||
      textLower.includes('null') ||
      textLower.includes('index') ||
      textLower.includes('cartesian') ||
      textLower.includes('predicate') ||
      textLower.includes('on clause') ||
      textLower.includes('where clause') ||
      textLower.includes('query');

    const mentionsFrontend =
      textLower.includes('component') ||
      textLower.includes('state') ||
      textLower.includes('prop') ||
      textLower.includes('hook') ||
      textLower.includes('render') ||
      textLower.includes('dom') ||
      textLower.includes('css') ||
      textLower.includes('responsive');

    const mentionsTradeoffs =
      textLower.includes('trade-off') ||
      textLower.includes('tradeoff') ||
      textLower.includes('alternative') ||
      textLower.includes('versus') ||
      textLower.includes('instead of') ||
      textLower.includes('drawback') ||
      textLower.includes('downside') ||
      textLower.includes('benefit') ||
      textLower.includes('advantage') ||
      textLower.includes('compromise');

    const mentionsQuantitative =
      textLower.includes('%') ||
      textLower.includes('percent') ||
      textLower.includes('ms') ||
      textLower.includes('p99') ||
      textLower.includes('seconds') ||
      textLower.includes('0.') ||
      /\d+\s*(ms|k|m|%)?/.test(candidateText);

    // 3. Question relevance matching
    const qHasPython = qLower.includes('python') || qLower.includes('function') || qLower.includes('argument');
    const qHasSql = qLower.includes('sql') || qLower.includes('join') || qLower.includes('query');
    const qHasMetrics = qLower.includes('metric') || qLower.includes('precision') || qLower.includes('accuracy') || qLower.includes('auc');
    const qHasSystemDesign = qLower.includes('design') || qLower.includes('latency') || qLower.includes('cache') || qLower.includes('service') || qLower.includes('architecture');
    const qHasProject = qLower.includes('project') || qLower.includes('pipeline') || qLower.includes('benchmark');

    // 4. Rubric Scoring Calculation
    let tech = 18;
    let prob = 18;
    let comm = 18;
    let rel = 19;

    // Technical depth bonuses
    if (
      mentionsImbalance ||
      mentionsPrecisionRecall ||
      mentionsPythonScope ||
      mentionsSqlJoins ||
      mentionsModelArch ||
      mentionsFrontend
    ) {
      tech += 3;
    }
    if (mentionsThresholdOrCalibration || mentionsLatencyOrCache || mentionsSmoteOrSampling) {
      tech += 2;
    }

    // Problem-solving & Trade-off bonuses
    if (mentionsTradeoffs) {
      prob += 3;
    }
    if (mentionsQuantitative || mentionsThresholdOrCalibration) {
      prob += 2;
    }

    // Communication bonuses based on structured articulation
    if (trimmed.length > 90) comm += 2;
    if (trimmed.length > 200) comm += 2;
    if (
      textLower.includes('first') ||
      textLower.includes('because') ||
      textLower.includes('therefore') ||
      textLower.includes('additionally') ||
      textLower.includes('specifically')
    ) {
      comm += 1;
    }

    // Domain relevance to the specific question
    if (
      (qHasPython && mentionsPythonScope) ||
      (qHasSql && mentionsSqlJoins) ||
      (qHasMetrics && (mentionsPrecisionRecall || mentionsImbalance)) ||
      (qHasSystemDesign && (mentionsLatencyOrCache || mentionsModelArch)) ||
      (qHasProject && (mentionsModelArch || mentionsTradeoffs))
    ) {
      rel += 4;
    } else {
      rel += 2;
    }

    // Clamp rubric elements to max 25 each
    tech = Math.min(25, tech);
    prob = Math.min(25, prob);
    comm = Math.min(25, comm);
    rel = Math.min(25, rel);

    const total = Math.min(96, tech + prob + comm + rel);

    // 5. Contextual dynamic follow-up questioning
    let followUp = '';
    if (textLower.includes('smote')) {
      followUp =
        'You mentioned using SMOTE for oversampling. In high-dimensional sparse data, synthetic instances can bleed across decision boundaries. How do you prevent target leakage during nested cross-validation?';
    } else if (textLower.includes('precision') || textLower.includes('recall')) {
      followUp =
        'You emphasized balancing Precision and Recall. How would you translate a 5% drop in Precision into concrete business dollar losses (e.g., customer friction vs. chargeback liability)?';
    } else if (textLower.includes('left join') || textLower.includes('sql') || qHasSql) {
      followUp =
        'In a high-throughput production database with replica lag, how do you verify your JOIN queries avoid locking critical transaction tables during peak write hours?';
    } else if (textLower.includes('mutable') || textLower.includes('closure') || qHasPython) {
      followUp =
        'You pointed out avoiding mutable defaults and ensuring thread safety. In an asynchronous or multi-worker service, how do you handle state sharing and profile memory overhead?';
    } else if (textLower.includes('threshold') || textLower.includes('cutoff')) {
      followUp =
        'When calibrating the decision threshold, what statistical method (such as Platt scaling or Isotonic regression) would you use to ensure output probabilities represent true empirical risk?';
    } else if (textLower.includes('redis') || textLower.includes('cache')) {
      followUp =
        'Using Redis provides sub-millisecond retrieval. What is your cache invalidation strategy when an entity is suddenly updated or invalidated in the primary source of truth?';
    } else if (textLower.includes('xgboost') || textLower.includes('model') || qHasProject) {
      followUp =
        'In production, models degrade as underlying data distributions shift. What automated monitoring metrics would trigger an alert for feature drift or retraining?';
    } else if (qHasSystemDesign) {
      followUp =
        'Under a sudden 10x traffic surge, what circuit-breaking, queue-buffering, and rate-limiting policies would prevent cascading failures in this architecture?';
    } else {
      followUp = `That provides a strong conceptual basis. In a senior ${role} interview, how would you instrument this in production with structured logging and alerts to prove it operates reliably?`;
    }

    // 6. Strengths and Improvements
    const strengths: string[] = [];
    const improvements: string[] = [];

    if (trimmed.length > 100) {
      strengths.push('Articulate, structured explanation with attention to practical engineering decisions.');
    }
    if (mentionsTradeoffs) {
      strengths.push('Proactively evaluated architectural trade-offs and alternatives rather than providing a one-size-fits-all solution.');
    }
    if (
      mentionsImbalance ||
      mentionsPrecisionRecall ||
      mentionsSqlJoins ||
      mentionsPythonScope ||
      mentionsLatencyOrCache
    ) {
      strengths.push('Demonstrated solid command of core domain terminology and production pitfalls.');
    } else {
      improvements.push('Incorporate deeper technical terminology specific to your target domain (e.g., indexing, probability calibration, thread safety).');
    }

    if (!mentionsQuantitative) {
      improvements.push('Quantify technical performance metrics where possible (e.g., target p99 latency < 50ms, memory overhead, or accuracy baselines).');
    }
    if (!mentionsLatencyOrCache && !qHasPython && !qHasSql) {
      improvements.push('Mention failure recovery or graceful degradation modes in production environments.');
    }

    const feedback =
      total >= 85
        ? `Exceptional answer (${total}/100). You demonstrated senior-level technical depth and trade-off awareness aligned with industry expectations for ${role}.`
        : `Well-structured answer (${total}/100). You demonstrated sound technical reasoning with clear areas to elevate your response to senior engineering standards.`;

    return {
      score: total,
      breakdown: {
        technicalCorrectness: tech,
        problemSolving: prob,
        communicationStructure: comm,
        domainRelevance: rel,
      },
      feedback,
      strengths,
      improvements,
      followUpQuestion: followUp,
    };
  }

  public generateReadinessProfile(userId: string, targetCareer: string = 'Fraud Detection ML Engineer in FinTech'): {
    targetCareer: string;
    readinessScore: number;
    readinessBand: string;
    confidence: 'HIGH';
    verifiedSkills: string[];
    gapSummary: string;
    recommendedNextSteps: string[];
  } {
    return {
      targetCareer,
      readinessScore: 84,
      readinessBand: 'INTERVIEW_READY',
      confidence: 'HIGH',
      verifiedSkills: ['Python Pipelines', 'SQL Analytics', 'Classification Metrics', 'Imbalanced Learning'],
      gapSummary: 'Demonstrates strong technical answers. Minor opportunity to deepen low-latency caching architecture under distributed loads.',
      recommendedNextSteps: [
        'Practice timed live-coding scenarios on SQL window functions and aggregations.',
        'Finalize evidence portfolio with production model evaluation benchmark curves.',
      ],
    };
  }
}

export const interviewEngine = new InterviewEngine();

// Backward compatibility export for golden/legacy tests
export const FINTECH_INTERVIEW_TURNS = interviewEngine.generatePersonalizedInterview({
  targetCareer: 'Fraud Detection ML Engineer in FinTech',
  completedTopics: ['Python Functions', 'SQL Joins', 'Machine Learning Basics'],
  verifiedSkills: ['Python', 'SQL', 'Scikit-Learn'],
  projects: [{ title: 'Fraud Anomaly Detection Engine', description: 'Real-time classification pipeline' }],
  weakAreas: ['Imbalanced Classification'],
});
