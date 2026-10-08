import { Router, Request, Response } from 'express';
import { planningRoiEngine } from '../engines/planningRoiEngine.js';

const router = Router();

router.get('/roi', (req: Request, res: Response) => {
  const skill = (req.query.skill as string) || 'SQL';
  const role = (req.query.role as string) || 'Fraud Detection ML Engineer in FinTech';
  const effort = Number(req.query.effort) || 16;
  const gap = Number(req.query.gap) || 2.2;

  const result = planningRoiEngine.computeSkillRoi({
    skill,
    importance: 'MUST_HAVE',
    gapSize: gap,
    effortHours: effort,
    downstreamCount: 4,
    targetRole: role,
  });

  res.json({ data: result });
});

router.post('/opportunity-cost', (req: Request, res: Response) => {
  const { skillA = 'SQL', skillB = 'AWS', hours = 20 } = req.body;
  const result = planningRoiEngine.simulateOpportunityCost(skillA, skillB, Number(hours));
  res.json({ data: result });
});

router.get('/branching', (req: Request, res: Response) => {
  const branches = planningRoiEngine.getCareerBranches(['Python', 'SQL', 'Pandas']);
  res.json({ data: { branches } });
});

router.post('/compare-routes', (req: Request, res: Response) => {
  const { roleA = 'Fraud Detection ML Engineer in FinTech', roleB = 'Data Scientist' } = req.body;
  const result = planningRoiEngine.compareRoutes(roleA, roleB);
  res.json({ data: result });
});

export default router;
