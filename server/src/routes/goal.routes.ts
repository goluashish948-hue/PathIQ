import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { goalCoachEngine } from '../engines/goalCoachEngine.js';

const router = Router();

const GoalAnalyzeSchema = z.object({
  goalText: z.string().min(1),
});

router.post('/analyze', async (req: Request, res: Response, next) => {
  try {
    const { goalText } = GoalAnalyzeSchema.parse(req.body);
    const result = await goalCoachEngine.analyzeGoal(goalText);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
