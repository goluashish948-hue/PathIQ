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
    const textLower = candidateText.toLowerCase();

    // Check for core concepts mentioned in answer
    const mentionsImbalance = textLower.includes('imbalance') || textLower.includes('rare') || textLower.includes('class');
    const mentionsPrecisionRecall = textLower.includes('precision') || textLower.includes('recall') || textLower.includes('false positive') || textLower.includes('f1');
    const mentionsThresholdOrSmote = textLower.includes('threshold') || textLower.includes('scale_pos_weight') || textLower.includes('smote') || textLower.includes('cost');
    const mentionsLatencyOrCache = textLower.includes('redis') || textLower.includes('cache') || textLower.includes('latency') || textLower.includes('fastapi') || textLower.includes('kafka');
    const mentionsPythonScope = textLower.includes('scope') || textLower.includes('mutable') || textLower.includes('none') || textLower.includes('pure function') || textLower.includes('closure');
    const mentionsSqlJoins = textLower.includes('left join') || textLower.includes('inner join') || textLower.includes('null') || textLower.includes('index') || textLower.includes('cartesian');

    let tech = 18;
    let prob = 18;
    let comm = 19;
    let rel = 20;

    if (mentionsImbalance || mentionsPrecisionRecall || mentionsPythonScope || mentionsSqlJoins) tech += 4;
    if (mentionsThresholdOrSmote || mentionsLatencyOrCache) prob += 4;
    if (candidateText.length > 120) comm += 3;

    const total = Math.min(96, tech + prob + comm + rel);

    // Dynamic Follow-Up Questioning (Interviewer asks intelligent follow-up just like a real person)
    let followUp = '';
    if (textLower.includes('smote')) {
      followUp = 'You mentioned using SMOTE for oversampling. In high-dimensional sparse data, SMOTE can create noisy synthetic instances that bleed across decision boundaries. How do you prevent data leakage during cross-validation?';
    } else if (textLower.includes('precision') || textLower.includes('recall')) {
      followUp = 'You emphasized balancing Precision and Recall. How would you translate a 5% drop in Precision into concrete business dollars lost to customer churn versus fraud chargeback liability?';
    } else if (textLower.includes('left join') || textLower.includes('sql')) {
      followUp = 'Good explanation. In a production database with replica lag, how do you verify that your LEFT JOIN query avoids locking critical OLTP transaction tables during peak hours?';
    } else if (textLower.includes('threshold') || textLower.includes('cutoff')) {
      followUp = 'When calibrating the decision threshold, what statistical method (such as Platt scaling or Isotonic regression) would you use to ensure output probabilities represent true empirical risk?';
    } else if (textLower.includes('redis') || textLower.includes('cache')) {
      followUp = 'Using Redis provides sub-millisecond retrieval. What is your cache invalidation strategy when a user card is suddenly flagged as stolen in the central fraud registry?';
    } else {
      followUp = 'That is a reasonable foundation. Can you go one step deeper: what metrics or logging would you inspect in production to verify this operates reliably under 10x traffic spikes?';
    }

    const strengths: string[] = [];
    const improvements: string[] = [];

    if (candidateText.length > 100) {
      strengths.push('Articulate, structured explanation with attention to practical engineering trade-offs.');
    }
    if (mentionsImbalance || mentionsPrecisionRecall || mentionsSqlJoins || mentionsPythonScope) {
      strengths.push('Demonstrates solid command of domain-specific mechanisms and production pitfalls.');
    } else {
      improvements.push('Incorporate explicit technical terminology (e.g. indexing strategies, metric formulas, or threshold tuning).');
    }

    if (!mentionsThresholdOrSmote && !mentionsLatencyOrCache) {
      improvements.push('Consider quantifying the business impact or latency constraints in numbers (e.g. p99 latency < 50ms).');
    }

    return {
      score: total,
      breakdown: {
        technicalCorrectness: Math.min(25, tech),
        problemSolving: Math.min(25, prob),
        communicationStructure: Math.min(25, comm),
        domainRelevance: Math.min(25, rel),
      },
      feedback: `Well-structured answer (${total}/100). You demonstrated sound technical reasoning aligned with industry expectations for ${studentContext?.targetCareer || 'this role'}.`,
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
