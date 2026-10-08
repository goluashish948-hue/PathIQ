export interface SkillRoiCalculation {
  skill: string;
  importanceWeight: number; // 3 for must-have, 2 for good-to-have, 1 for diff
  gapSize: number;
  unlockValue: number; // number of downstream nodes unlocked
  transferability: number; // 0.5 - 1.0
  careerImpact: number; // 1-5
  effortHours: number;
  roiScore: number;
  plainLanguageExplanation: string;
}

export interface OpportunityCostSimulation {
  skillA: string;
  skillB: string;
  allocatedHours: number;
  scenarioA: {
    skill: string;
    nodesUnlocked: string[];
    readinessDelta: number;
    projectedCompletionWeeks: number;
    criticalPathUnblocked: boolean;
  };
  scenarioB: {
    skill: string;
    nodesUnlocked: string[];
    readinessDelta: number;
    projectedCompletionWeeks: number;
    criticalPathUnblocked: boolean;
  };
  tradeOffAnalysis: string;
  recommendation: string;
}

export interface CareerBranchItem {
  title: string;
  domain: string;
  estimatedFitPercent: number;
  sharedSkills: string[];
  missingSkills: string[];
  learningEffortWeeks: number;
  whyExplore: string;
}

export class PlanningRoiEngine {
  public computeSkillRoi(params: {
    skill: string;
    importance: 'MUST_HAVE' | 'GOOD_TO_HAVE' | 'DIFFERENTIATOR';
    gapSize: number;
    effortHours: number;
    downstreamCount: number;
    targetRole: string;
  }): SkillRoiCalculation {
    const importanceWeight = params.importance === 'MUST_HAVE' ? 3 : params.importance === 'GOOD_TO_HAVE' ? 2 : 1;
    const unlockValue = Math.max(1, params.downstreamCount);
    const transferability = params.skill === 'SQL' ? 0.95 : params.skill === 'Python' ? 1.0 : 0.75;
    const careerImpact = params.importance === 'MUST_HAVE' ? 4.5 : 2.5;
    const effort = Math.max(4, params.effortHours);

    // Formula: ROI = (importanceWeight * gapSize * unlockValue * transferability * careerImpact) / effortHours
    const raw = (importanceWeight * params.gapSize * unlockValue * transferability * careerImpact) / effort;
    const roiScore = Math.round(raw * 10) / 10;

    return {
      skill: params.skill,
      importanceWeight,
      gapSize: params.gapSize,
      unlockValue,
      transferability,
      careerImpact,
      effortHours: effort,
      roiScore,
      plainLanguageExplanation: `${params.skill} yields an ROI score of ${roiScore}. With an effort of ${effort}h, it bridges a ${params.gapSize} level gap and directly unblocks ${unlockValue} critical downstream milestones for ${params.targetRole}.`,
    };
  }

  public simulateOpportunityCost(skillA: string, skillB: string, hours: number = 20): OpportunityCostSimulation {
    const isSql = skillA.toUpperCase() === 'SQL' || skillB.toUpperCase() === 'SQL';

    return {
      skillA,
      skillB,
      allocatedHours: hours,
      scenarioA: {
        skill: skillA,
        nodesUnlocked: ['Practical SQL Proof', 'Feature Engineering & Velocity Indicators', 'Fraud Detection Capstone'],
        readinessDelta: +18,
        projectedCompletionWeeks: 12,
        criticalPathUnblocked: true,
      },
      scenarioB: {
        skill: skillB,
        nodesUnlocked: ['Cloud Deployment Concepts'],
        readinessDelta: +6,
        projectedCompletionWeeks: 15,
        criticalPathUnblocked: false,
      },
      tradeOffAnalysis: `Allocating ${hours} hours to ${skillA} directly unblocks your critical path (SQL proof and capstone features), delivering a +18% readiness increase. Diverting that time to ${skillB} leaves SQL as a blocking bottleneck, pushing completion out by ~3 weeks.`,
      recommendation: `Prioritize ${skillA} first. Return to ${skillB} once your prerequisite data engineering milestones are verified.`,
    };
  }

  public getCareerBranches(studentSkills: string[]): CareerBranchItem[] {
    return [
      {
        title: 'Machine Learning Engineer',
        domain: 'Technology & IT',
        estimatedFitPercent: 78,
        sharedSkills: ['Python', 'Machine Learning', 'Pandas', 'Docker'],
        missingSkills: ['PyTorch / Deep Learning', 'CI/CD Pipelines'],
        learningEffortWeeks: 8,
        whyExplore: 'Direct lateral neighbor. Requires deeper framework mastery in PyTorch/TensorFlow.',
      },
      {
        title: 'Data Scientist',
        domain: 'Technology & IT',
        estimatedFitPercent: 82,
        sharedSkills: ['Python', 'SQL', 'Pandas', 'Statistics'],
        missingSkills: ['A/B Testing Frameworks', 'Tableau / BI Storytelling'],
        learningEffortWeeks: 6,
        whyExplore: 'Very high skill overlap with lower deployment engineering requirements.',
      },
      {
        title: 'MLOps Engineer',
        domain: 'Technology & IT',
        estimatedFitPercent: 62,
        sharedSkills: ['Python', 'Docker', 'Linux'],
        missingSkills: ['Kubernetes', 'Terraform', 'Kafka Streaming', 'Model Monitoring'],
        learningEffortWeeks: 14,
        whyExplore: 'Ideal if you lean toward infrastructure, containerization, and reliability engineering.',
      },
    ];
  }

  public compareRoutes(roleA: string, roleB: string): {
    roleA: { title: string; fit: number; totalHours: number; weeks: number; keySkills: string[] };
    roleB: { title: string; fit: number; totalHours: number; weeks: number; keySkills: string[] };
    sharedSkills: string[];
    uniqueToA: string[];
    uniqueToB: string[];
    verdict: string;
  } {
    return {
      roleA: {
        title: roleA,
        fit: 68,
        totalHours: 120,
        weeks: 12,
        keySkills: ['Python', 'SQL', 'XGBoost', 'Feature Engineering', 'FinTech Anomaly Rules'],
      },
      roleB: {
        title: roleB,
        fit: 75,
        totalHours: 90,
        weeks: 9,
        keySkills: ['Python', 'SQL', 'Statistics', 'Pandas', 'Data Visualization', 'A/B Testing'],
      },
      sharedSkills: ['Python', 'SQL', 'Pandas', 'Exploratory Data Analysis'],
      uniqueToA: ['XGBoost Imbalance Tuning', 'FinTech Velocity Features', 'Real-time Latency Serving'],
      uniqueToB: ['Statistical Hypothesis Testing', 'Business Dashboarding', 'A/B Testing Design'],
      verdict: `Transitioning from ${roleA} to ${roleB} saves ~30 hours of learning effort due to lower production system latency requirements, but requires strengthening experimental statistics.`,
    };
  }
}

export const planningRoiEngine = new PlanningRoiEngine();
