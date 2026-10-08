import { Router, Request, Response } from 'express';
import { prisma, safeJsonParse, safeJsonStringify } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { resumePortfolioEngine } from '../engines/resumePortfolioEngine.js';

const router = Router();

router.get('/generate', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const targetCareer = req.query.targetCareer as string;
    const resume = await resumePortfolioEngine.generateResumeFromTwin(userId, targetCareer);
    const atsResult = resumePortfolioEngine.testAtsCompatibility(resume);
    const strengthResult = resumePortfolioEngine.calculateResumeStrength(resume);

    res.json({
      data: {
        resume,
        atsResult,
        strengthResult,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/ats-test', (req: Request, res: Response) => {
  const { resume } = req.body;
  if (!resume) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Resume payload required.' } });
    return;
  }
  const result = resumePortfolioEngine.testAtsCompatibility(resume);
  res.json({ data: result });
});

router.post('/save-version', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const { versionName = 'Primary FinTech Resume', resumePayload } = req.body;

    const saved = await prisma.resume.create({
      data: {
        userId,
        versionName,
        targetCareer: resumePayload?.targetCareer || 'Fraud Detection ML Engineer in FinTech',
        atsScore: 92,
        strengthScore: safeJsonStringify({ match: 84, skills: 90, projects: 85, experience: 65, keywords: 88 }),
        summary: resumePayload?.summary,
        contentPayload: safeJsonStringify(resumePayload),
      },
    });

    res.json({ data: saved });
  } catch (err) {
    next(err);
  }
});

router.get('/versions', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const versions = await prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ data: versions });
  } catch (err) {
    next(err);
  }
});

export default router;
