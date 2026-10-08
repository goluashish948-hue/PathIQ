import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { jobDnaEngine } from '../engines/jobDnaEngine.js';

const router = Router();

router.get('/profile', async (req: Request, res: Response, next) => {
  try {
    const role = (req.query.role as string) || 'Fraud Detection ML Engineer in FinTech';
    const profile = await jobDnaEngine.getJobDna(role);
    res.json({ data: profile });
  } catch (err) {
    next(err);
  }
});

const AnalyzeJdSchema = z.object({
  rawText: z.string().min(20),
  roleTitle: z.string().optional(),
});

router.post('/analyze-jd', async (req: Request, res: Response, next) => {
  try {
    const { rawText, roleTitle } = AnalyzeJdSchema.parse(req.body);
    const result = await jobDnaEngine.analyzeUserJd(rawText, roleTitle);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
