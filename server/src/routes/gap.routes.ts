import { Router, Request, Response } from 'express';
import { skillGapEngine } from '../engines/skillGapEngine.js';
import { jobDnaEngine } from '../engines/jobDnaEngine.js';

const router = Router();

router.post('/calculate', async (req: Request, res: Response, next) => {
  try {
    const role = (req.body.targetRole as string) || 'Fraud Detection ML Engineer in FinTech';
    const dna = await jobDnaEngine.getJobDna(role);

    const studentSkills = req.body.studentSkills || [
      { name: 'Python', declaredLevel: 3, effectiveLevel: 2.4, verificationState: 'ASSESSED' },
      { name: 'SQL', declaredLevel: 1, effectiveLevel: 0.8, verificationState: 'ASSESSED' },
    ];

    const requirements = [
      ...dna.mustHaveSkills.map(s => ({ name: s.name, importance: 'MUST_HAVE' as const, targetLevel: s.targetLevel })),
      ...dna.goodToHaveSkills.map(s => ({ name: s.name, importance: 'GOOD_TO_HAVE' as const, targetLevel: s.targetLevel })),
      ...dna.differentiators.map(s => ({ name: s.name, importance: 'DIFFERENTIATOR' as const, targetLevel: s.targetLevel })),
    ];

    const { gapTable, overallGapScore } = skillGapEngine.computeSkillGap(requirements, studentSkills);
    const realityCheck = skillGapEngine.computeRealityCheck(overallGapScore, role);

    res.json({
      data: {
        gapTable,
        overallGapScore,
        realityCheck,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
