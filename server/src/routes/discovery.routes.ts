import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { discoveryEngine, DISCOVERY_QUESTIONS } from '../engines/discoveryEngine.js';

const router = Router();

router.get('/questions', (req: Request, res: Response) => {
  res.json({ data: { questions: DISCOVERY_QUESTIONS } });
});

router.post('/evaluate', (req: Request, res: Response, next) => {
  try {
    const answers = req.body.answers || {};
    const result = discoveryEngine.evaluateResponses(answers);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
