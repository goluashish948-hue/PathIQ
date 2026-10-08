import { SKILL_RELATIONS_SEED } from '../data/seedData.js';

export interface SkillGapItem {
  skill: string;
  importance: 'MUST_HAVE' | 'GOOD_TO_HAVE' | 'DIFFERENTIATOR';
  requiredLevel: number;
  studentLevel: number;
  effectiveLevel: number;
  verificationState: string;
  gapSize: number;
  status: 'COVERED' | 'PARTIAL' | 'MAJOR_GAP';
  statusLabel: string;
  partialMatchNotes?: string;
  transferFactor?: number;
}

export interface RealityCheckResult {
  fitScore: number; // 0-100
  fitBand: 'WITHIN_REACH' | 'STRETCH' | 'SIGNIFICANT_SKILL_GAP';
  bandLabel: string;
  summary: string;
  majorGapsRanked: string[];
  steppingStoneRoles: Array<{
    title: string;
    description: string;
    currentFit: number;
  }>;
  constructiveAdvice: string;
}

export class SkillGapEngine {
  public computeSkillGap(
    jobRequirements: Array<{ name: string; importance: 'MUST_HAVE' | 'GOOD_TO_HAVE' | 'DIFFERENTIATOR'; targetLevel: number }>,
    studentSkills: Array<{ name: string; declaredLevel: number; effectiveLevel: number; verificationState: string }>
  ): { gapTable: SkillGapItem[]; overallGapScore: number } {
    const studentMap = new Map(studentSkills.map(s => [s.name.toLowerCase(), s]));

    const gapTable: SkillGapItem[] = [];

    for (const req of jobRequirements) {
      const studentSkill = studentMap.get(req.name.toLowerCase());
      const effectiveLevel = studentSkill ? studentSkill.effectiveLevel : 0;
      const declaredLevel = studentSkill ? studentSkill.declaredLevel : 0;
      const verificationState = studentSkill ? studentSkill.verificationState : 'NONE';

      // Check partial match via ontology substitute / related relations
      let partialTransfer = 0;
      let partialMatchNotes: string | undefined;
      let transferFactor: number | undefined;

      if (!studentSkill || effectiveLevel < req.targetLevel) {
        // Find if student has a related or substitute skill
        for (const rel of SKILL_RELATIONS_SEED) {
          if (rel.toSkill.toLowerCase() === req.name.toLowerCase()) {
            const relatedSkill = studentMap.get(rel.fromSkill.toLowerCase());
            if (relatedSkill && relatedSkill.effectiveLevel > 0) {
              partialTransfer = Math.round(relatedSkill.effectiveLevel * rel.transferFactor * 10) / 10;
              transferFactor = rel.transferFactor;
              partialMatchNotes = `Found transferable experience from ${rel.fromSkill} (transfer factor ${(rel.transferFactor * 100).toFixed(0)}%). Conceptual foundation covered; framework-specific application missing.`;
              break;
            }
          }
        }
      }

      const totalEffective = Math.min(req.targetLevel, effectiveLevel + (partialTransfer > 0 ? partialTransfer * 0.5 : 0));
      const gap = Math.max(0, req.targetLevel - totalEffective);

      let status: 'COVERED' | 'PARTIAL' | 'MAJOR_GAP' = 'MAJOR_GAP';
      let statusLabel = 'Major Gap';

      if (gap <= 0.2) {
        status = 'COVERED';
        statusLabel = 'Covered';
      } else if (gap <= 1.5 || partialTransfer > 0) {
        status = 'PARTIAL';
        statusLabel = 'Partial Gap';
      }

      gapTable.push({
        skill: req.name,
        importance: req.importance,
        requiredLevel: req.targetLevel,
        studentLevel: declaredLevel,
        effectiveLevel: totalEffective,
        verificationState,
        gapSize: Math.round(gap * 10) / 10,
        status,
        statusLabel,
        partialMatchNotes,
        transferFactor,
      });
    }

    // Sort by priority: importance weight * gapSize
    gapTable.sort((a, b) => {
      const weightA = a.importance === 'MUST_HAVE' ? 3 : a.importance === 'GOOD_TO_HAVE' ? 2 : 1;
      const weightB = b.importance === 'MUST_HAVE' ? 3 : b.importance === 'GOOD_TO_HAVE' ? 2 : 1;
      return (weightB * b.gapSize) - (weightA * a.gapSize);
    });

    const totalPossible = jobRequirements.length * 3;
    const totalGaps = gapTable.reduce((acc, g) => acc + g.gapSize, 0);
    const overallGapScore = Math.max(0, Math.round(((totalPossible - totalGaps) / totalPossible) * 100));

    return { gapTable, overallGapScore };
  }

  public computeRealityCheck(fitScore: number, roleTitle: string): RealityCheckResult {
    let fitBand: 'WITHIN_REACH' | 'STRETCH' | 'SIGNIFICANT_SKILL_GAP' = 'SIGNIFICANT_SKILL_GAP';
    let bandLabel = 'Significant Skill Gap';
    let summary = `Your current verified profile shows meaningful foundational strengths, but there is a significant skill gap to immediately target ${roleTitle}.`;

    if (fitScore >= 75) {
      fitBand = 'WITHIN_REACH';
      bandLabel = 'Within Reach';
      summary = `Your profile strongly aligns with the core requirements for ${roleTitle}. Focused portfolio projects and mock interviews will finalize your readiness.`;
    } else if (fitScore >= 45) {
      fitBand = 'STRETCH';
      bandLabel = 'Stretch Goal';
      summary = `Targeting ${roleTitle} is a stretch goal at your current stage. With consistent study and proof tasks, this route can be systematically conquered.`;
    }

    return {
      fitScore,
      fitBand,
      bandLabel,
      summary,
      majorGapsRanked: [
        'SQL for High-Velocity Analytics & Anomaly Detection',
        'Imbalanced Classification with XGBoost',
        'Containerized Deployment with Docker',
      ],
      steppingStoneRoles: [
        {
          title: 'Junior Data Analyst / Risk Operations Specialist',
          description: 'Focuses on SQL queries, dashboarding chargeback patterns, and manual transaction review queues. Bridges foundational data familiarity.',
          currentFit: 78,
        },
        {
          title: 'Associate Machine Learning Engineer',
          description: 'Focuses on scikit-learn models, data wrangling pipelines, and baseline model deployment under senior mentorship.',
          currentFit: 64,
        },
      ],
      constructiveAdvice: 'Focus first on mastering SQL joins, aggregations, and window functions. Once confident in data querying, progress to gradient boosted trees and practical fraud project proofs.',
    };
  }
}

export const skillGapEngine = new SkillGapEngine();
