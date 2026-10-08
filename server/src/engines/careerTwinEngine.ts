import { prisma, safeJsonParse, safeJsonStringify } from '../db.js';

export interface TwinSkillState {
  skillName: string;
  declaredLevel: number; // 0-4
  effectiveLevel: number; // 0-4
  verificationState: 'SELF_REPORTED' | 'ASSESSED' | 'EVIDENCE_BACKED';
  evidenceType?: string;
  evidenceRefId?: string;
  verifiedAt?: string;
}

export interface TwinMetrics {
  overallReadiness: number; // 0-100
  roadmapCompletion: number;
  knowledgeScore: number;
  quizMasteryScore: number;
  practicalScore: number;
  projectsScore: number;
  interviewScore: number;
  radarDimensions: {
    technical: number;
    domain: number;
    practical: number;
    projects: number;
    communication: number;
    interview: number;
  };
  weaknesses: string[];
  strengths: string[];
}

export class CareerTwinEngine {
  public static readonly WEIGHT_SELF_REPORTED = 0.5;
  public static readonly WEIGHT_ASSESSED = 0.8;
  public static readonly WEIGHT_EVIDENCE_BACKED = 1.0;

  public computeEffectiveLevel(
    declaredLevel: number,
    state: 'SELF_REPORTED' | 'ASSESSED' | 'EVIDENCE_BACKED'
  ): number {
    let weight = CareerTwinEngine.WEIGHT_SELF_REPORTED;
    if (state === 'ASSESSED') weight = CareerTwinEngine.WEIGHT_ASSESSED;
    if (state === 'EVIDENCE_BACKED') weight = CareerTwinEngine.WEIGHT_EVIDENCE_BACKED;

    return Math.round(declaredLevel * weight * 10) / 10;
  }

  public async logEvent(userId: string, eventType: string, payload: any): Promise<void> {
    let twin = await prisma.careerTwin.findUnique({ where: { userId } });
    if (!twin) {
      twin = await prisma.careerTwin.create({
        data: {
          userId,
          radarDimensions: safeJsonStringify({
            technical: 30, domain: 20, practical: 15, projects: 10, communication: 40, interview: 20
          }),
          weaknesses: safeJsonStringify(['SQL Window Functions', 'XGBoost Tuning']),
          strengths: safeJsonStringify(['Python Syntax']),
        },
      });
    }

    await prisma.twinEvent.create({
      data: {
        twinId: twin.id,
        eventType,
        eventPayload: safeJsonStringify(payload),
      },
    });

    await this.recalculateTwin(userId);
  }

  public async recalculateTwin(userId: string): Promise<TwinMetrics> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: { studentSkills: { include: { skill: true } } },
        },
      },
    });

    const studentSkills = user?.studentProfile?.studentSkills || [];
    
    // Check quiz attempts
    const quizAttempts = await prisma.quizAttempt.findMany({ where: { userId } });
    const proofs = await prisma.proofSubmission.findMany({ where: { userId, passed: true } });
    const roadmaps = await prisma.roadmap.findMany({
      where: { userId, status: 'ACTIVE' },
      include: { nodes: true },
    });

    const activeRoadmap = roadmaps[0];
    const totalNodes = activeRoadmap?.nodes.length || 1;
    const completedNodes = activeRoadmap?.nodes.filter(n => n.status === 'COMPLETED').length || 0;
    const roadmapCompletion = Math.round((completedNodes / totalNodes) * 100);

    // Knowledge & Quiz mastery
    const totalQuizScore = quizAttempts.reduce((acc, q) => acc + q.percentage, 0);
    const quizMasteryScore = quizAttempts.length > 0 ? Math.round(totalQuizScore / quizAttempts.length) : 55;
    const knowledgeScore = Math.min(100, Math.round((quizMasteryScore * 0.6) + (roadmapCompletion * 0.4)));

    // Practical score (proofs verified)
    const practicalScore = proofs.length > 0 ? Math.min(100, proofs.length * 35 + 25) : 35;
    const projectsScore = proofs.some(p => p.templateId.includes('project') || p.templateId.includes('model')) ? 75 : 40;
    const interviewScore = 45; // base

    // Technical score from effective skills
    let techSum = 0;
    for (const ss of studentSkills) {
      techSum += ss.effectiveLevel;
    }
    const technical = Math.min(100, Math.round((techSum / 12) * 100) || 50);

    const radar = {
      technical: Math.max(25, technical),
      domain: 60,
      practical: Math.max(20, practicalScore),
      projects: Math.max(15, projectsScore),
      communication: 65,
      interview: interviewScore,
    };

    // Overall readiness weighted calculation
    // Tech: 30%, Domain: 15%, Practical: 25%, Projects: 15%, Comm: 8%, Interview: 7%
    const overall = Math.round(
      radar.technical * 0.30 +
      radar.domain * 0.15 +
      radar.practical * 0.25 +
      radar.projects * 0.15 +
      radar.communication * 0.08 +
      radar.interview * 0.07
    );

    const weaknesses = ['SQL Window Functions & CTEs', 'XGBoost Hyperparameter Tuning', 'Docker Multi-stage Builds'];
    const strengths = ['Python Core Syntax', 'Pandas Data Filtering', 'Binary Classification Foundations'];

    // Update DB
    await prisma.careerTwin.upsert({
      where: { userId },
      update: {
        overallReadiness: overall,
        roadmapCompletion,
        knowledgeScore,
        quizMasteryScore,
        practicalScore,
        projectsScore,
        interviewScore,
        radarDimensions: safeJsonStringify(radar),
        weaknesses: safeJsonStringify(weaknesses),
        strengths: safeJsonStringify(strengths),
        lastEventAt: new Date(),
      },
      create: {
        userId,
        overallReadiness: overall,
        roadmapCompletion,
        knowledgeScore,
        quizMasteryScore,
        practicalScore,
        projectsScore,
        interviewScore,
        radarDimensions: safeJsonStringify(radar),
        weaknesses: safeJsonStringify(weaknesses),
        strengths: safeJsonStringify(strengths),
      },
    });

    return {
      overallReadiness: overall,
      roadmapCompletion,
      knowledgeScore,
      quizMasteryScore,
      practicalScore,
      projectsScore,
      interviewScore,
      radarDimensions: radar,
      weaknesses,
      strengths,
    };
  }
}

export const careerTwinEngine = new CareerTwinEngine();
