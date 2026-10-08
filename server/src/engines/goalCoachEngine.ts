import { aiGateway } from '../ai/aiGateway.js';
import { DOMAIN_PACKS } from '../data/domainPacks.js';

export interface GoalAnalysisResult {
  inputGoal: string;
  specificity: 'TOO_VAGUE' | 'OKAY' | 'SPECIFIC';
  detectedDomain: string;
  detectedRole: string;
  isCustomDomain: boolean;
  confidenceScore: number;
  confidenceLabel: 'LOW' | 'MEDIUM' | 'HIGH';
  feedback: string;
  suggestions: string[];
  guidingQuestions?: string[];
}

export class GoalCoachEngine {
  public async analyzeGoal(goalText: string, userId?: string): Promise<GoalAnalysisResult> {
    const trimmed = goalText.trim();
    const lower = trimmed.toLowerCase();

    // Check vague patterns
    const isVague =
      trimmed.length < 12 ||
      ['i want a good job', 'i want a job', 'get a job', 'software engineer', 'engineer', 'manager', 'developer', 'any job'].includes(lower);

    if (isVague) {
      return {
        inputGoal: goalText,
        specificity: 'TOO_VAGUE',
        detectedDomain: 'Technology & IT',
        detectedRole: 'Software Developer (General)',
        isCustomDomain: false,
        confidenceScore: 0.35,
        confidenceLabel: 'LOW',
        feedback: 'Your goal is broad. A hyper-specific target allows PathIQ to reverse-engineer exact industry requirements and build a high-precision roadmap.',
        guidingQuestions: [
          'Which industry excites you most (FinTech, Healthcare, Autonomous Systems, Defense)?',
          'Do you prefer backend logic, ML modeling, data analytics, or UI experience?',
          'What type of problems do you want to solve daily?',
        ],
        suggestions: [
          'Fraud Detection ML Engineer in FinTech',
          'Healthcare AI Engineer working on medical imaging',
          'UI/UX Designer for mobile products',
          'UPSC Civil Services Officer',
          'Sports Data Analyst',
        ],
      };
    }

    // Check specific known roles
    if (lower.includes('fraud') || (lower.includes('ml') && lower.includes('fintech'))) {
      return {
        inputGoal: goalText,
        specificity: 'SPECIFIC',
        detectedDomain: 'Technology & IT',
        detectedRole: 'Fraud Detection ML Engineer in FinTech',
        isCustomDomain: false,
        confidenceScore: 0.95,
        confidenceLabel: 'HIGH',
        feedback: 'Outstanding specificity! Fraud detection in FinTech has clearly delineated requirements: imbalanced classification (XGBoost), high-speed SQL analytics, and transaction velocity pipelines.',
        suggestions: [
          'Fraud Detection ML Engineer in FinTech',
          'Risk & Credit Scoring ML Specialist',
          'Real-Time Anomaly Detection Engineer',
        ],
      };
    }

    // Check matching against domain packs
    for (const pack of DOMAIN_PACKS) {
      for (const role of pack.roles) {
        if (lower.includes(role.title.toLowerCase()) || role.title.toLowerCase().includes(lower)) {
          return {
            inputGoal: goalText,
            specificity: 'SPECIFIC',
            detectedDomain: pack.domainName,
            detectedRole: role.title,
            isCustomDomain: false,
            confidenceScore: 0.90,
            confidenceLabel: 'HIGH',
            feedback: `Identified target role in ${pack.domainName}. Requirements and taxonomy are fully seeded.`,
            suggestions: [role.title, ...role.relatedRoles],
          };
        }
      }
    }

    // Handle custom careers e.g. "Football Data Analyst" or "Aerospace Drone Operator"
    return {
      inputGoal: goalText,
      specificity: 'SPECIFIC',
      detectedDomain: 'Other / Custom Career',
      detectedRole: goalText,
      isCustomDomain: true,
      confidenceScore: 0.55,
      confidenceLabel: 'MEDIUM',
      feedback: 'Custom domain detected. Initial data confidence is moderate. Pasting real job descriptions will immediately elevate roadmap accuracy to high confidence.',
      suggestions: [
        `${goalText} (Specialized Track)`,
        `${goalText} (Applied Systems Focus)`,
      ],
    };
  }
}

export const goalCoachEngine = new GoalCoachEngine();
