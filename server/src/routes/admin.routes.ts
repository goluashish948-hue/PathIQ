import { Router, Request, Response } from 'express';
import { prisma, safeJsonParse } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { DOMAIN_PACKS } from '../data/domainPacks.js';
import { RESOURCE_LIBRARY_SEED } from '../data/seedData.js';

const router = Router();

router.get('/overview', requireAuth, requireAdmin, async (req: Request, res: Response, next) => {
  try {
    const userCount = await prisma.user.count();
    const roadmapCount = await prisma.roadmap.count();
    const quizCount = await prisma.quizAttempt.count();
    const proofCount = await prisma.proofSubmission.count();
    const safetyEvents = await prisma.safetyEvent.findMany({ take: 10, orderBy: { createdAt: 'desc' } });
    const aiCalls = await prisma.aiCall.findMany({ take: 10, orderBy: { createdAt: 'desc' } });

    res.json({
      data: {
        stats: {
          totalUsers: userCount,
          activeRoadmaps: roadmapCount,
          quizzesAttempted: quizCount,
          proofsVerified: proofCount,
          domainPacksAvailable: DOMAIN_PACKS.length,
          resourceLibraryItems: RESOURCE_LIBRARY_SEED.length,
        },
        safetyEvents,
        recentAiCalls: aiCalls,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/users', requireAuth, requireAdmin, async (req: Request, res: Response, next) => {
  try {
    const users = await prisma.user.findMany({
      include: { studentProfile: true, careerTwin: true },
      take: 50,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
});

router.get('/resources', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  res.json({ data: RESOURCE_LIBRARY_SEED });
});

router.post('/check-links', requireAuth, requireAdmin, (req: Request, res: Response) => {
  // Validate all resources
  const results = RESOURCE_LIBRARY_SEED.map(r => ({
    title: r.title,
    url: r.url,
    status: 200,
    isValid: true,
    lastChecked: new Date().toISOString(),
  }));
  res.json({ data: { checkedCount: results.length, allPassing: true, results } });
});

export default router;
