import { Router, Request, Response } from 'express';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { replanWhatIfEngine } from '../engines/replanWhatIfEngine.js';

const router = Router();

router.post('/preview', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const { triggerReason = 'MISSED_2_WEEKS', newWeeklyHours, newTargetCareer } = req.body;

    const roadmap = await prisma.roadmap.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    if (!roadmap) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'No active roadmap found to replan.' } });
      return;
    }

    const diff = await replanWhatIfEngine.generateReplanDiff({
      roadmapId: roadmap.id,
      triggerReason,
      newWeeklyHours,
      newTargetCareer,
    });

    res.json({ data: diff });
  } catch (err) {
    next(err);
  }
});

router.post('/adopt', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { diffId } = req.body;
    const success = await replanWhatIfEngine.adoptReplanDiff(diffId);
    res.json({ data: { success } });
  } catch (err) {
    next(err);
  }
});

router.post('/what-if', (req: Request, res: Response) => {
  const { type = 'CHANGE_HOURS', paramValue = 5, currentHours = 10, currentReadiness = 64 } = req.body;
  const result = replanWhatIfEngine.simulateWhatIf({
    type,
    paramValue,
    currentHours,
    currentReadiness,
  });
  res.json({ data: result });
});

router.get('/market-alerts', async (req: Request, res: Response, next) => {
  try {
    const alerts = await replanWhatIfEngine.detectMarketChanges();
    res.json({ data: { alerts } });
  } catch (err) {
    next(err);
  }
});

export default router;
