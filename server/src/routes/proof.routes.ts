import { Router, Request, Response } from 'express';
import { prisma, safeJsonStringify } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { sandboxAdapter, FRAUD_SQL_CHALLENGES } from '../adapters/sandboxAdapter.js';
import { careerTwinEngine } from '../engines/careerTwinEngine.js';

const router = Router();

router.get('/templates', async (req: Request, res: Response) => {
  const templates = [
    {
      id: 'template_sql_fraud',
      taskKey: 'sql_fraud_queries',
      domain: 'Technology & IT',
      title: '15 High-Velocity SQL Analytics Queries in Sandbox',
      proofType: 'SQL',
      associatedSkill: 'SQL',
      description: 'Execute 15 structured SQL queries against real financial ledger tables (transactions, accounts, chargebacks, merchants) in an isolated disposable sandbox.',
      evaluationMode: 'AUTO_GRADED',
      challenges: FRAUD_SQL_CHALLENGES,
    },
    {
      id: 'template_ml_fraud',
      taskKey: 'ml_fraud_model',
      domain: 'Technology & IT',
      title: 'End-to-End Imbalanced XGBoost Classifier',
      proofType: 'ML',
      associatedSkill: 'XGBoost',
      description: 'Train and calibrate gradient boosted decision trees on 100k+ transactions. Submit evaluated PR-AUC metric artifacts and confusion matrix.',
      evaluationMode: 'AUTO_GRADED',
    },
    {
      id: 'template_design_figma',
      taskKey: 'figma_uiux_casestudy',
      domain: 'Design & Creative',
      title: 'Mobile App UI/UX Figma Prototype Case Study',
      proofType: 'DESIGN',
      associatedSkill: 'UI/UX Design',
      description: 'Submit an interactive Figma prototype complete with component variants, auto layout, and accessibility testing documentation.',
      evaluationMode: 'AI_REVIEWED',
    },
  ];

  res.json({ data: templates });
});

router.post('/submit-sql', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const { queries } = req.body;

    // Auto-grade in disposable SQLite sandbox
    const result = await sandboxAdapter.evaluateSqlTask(queries || '');

    // Persist submission
    const template = await prisma.proofTemplate.findFirst({
      where: { taskKey: 'sql_fraud_queries' },
    });

    const templateId = template?.id || 'template_sql_fraud';

    const submission = await prisma.proofSubmission.create({
      data: {
        userId,
        templateId,
        submissionPayload: typeof queries === 'string' ? queries : JSON.stringify(queries),
        evaluationMode: 'AUTO_GRADED',
        score: result.percentage,
        passed: result.passed,
        feedback: result.feedback,
      },
    });

    // If passed, upgrade SQL skill to EVIDENCE_BACKED (Part 6.4 & 11.5)
    if (result.passed) {
      const profile = await prisma.studentProfile.findUnique({ where: { userId } });
      if (profile) {
        const sqlSkill = await prisma.skill.findFirst({ where: { name: 'SQL' } });
        if (sqlSkill) {
          await prisma.studentSkill.upsert({
            where: { id: `ss-${userId}-${sqlSkill.id}` },
            update: {
              declaredLevel: 3,
              effectiveLevel: 3.0, // 3 * 1.0 (Evidence-Backed)
              verificationState: 'EVIDENCE_BACKED',
              evidenceType: 'PROOF',
              evidenceRefId: submission.id,
              verifiedAt: new Date(),
            },
            create: {
              id: `ss-${userId}-${sqlSkill.id}`,
              profileId: profile.id,
              skillId: sqlSkill.id,
              declaredLevel: 3,
              effectiveLevel: 3.0,
              verificationState: 'EVIDENCE_BACKED',
              evidenceType: 'PROOF',
              evidenceRefId: submission.id,
              verifiedAt: new Date(),
            },
          });
        }
      }

      await careerTwinEngine.logEvent(userId, 'PROOF_VERIFIED', {
        skill: 'SQL',
        score: result.percentage,
        submissionId: submission.id,
      });
    }

    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
