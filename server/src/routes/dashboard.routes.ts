import { Router, Request, Response } from 'express';
import { prisma, safeJsonParse } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { careerTwinEngine } from '../engines/careerTwinEngine.js';

const router = Router();

router.get('/metrics', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const metrics = await careerTwinEngine.recalculateTwin(userId);

    // Timeline historical snapshots
    const timeline = [
      { month: 'Month 1', readiness: 31, event: 'Enrolled & Verified Python Fundamentals' },
      { month: 'Month 2', readiness: 45, event: 'Passed Advanced SQL Joins & Quiz Bank' },
      { month: 'Month 3', readiness: 62, event: 'Completed 15/15 SQL Sandbox Proof Queries' },
      { month: 'Month 4', readiness: 74, event: 'Engineered XGBoost Anomaly Classifier' },
      { month: 'Month 5', readiness: metrics.overallReadiness, event: 'Active Roadmap Optimization & Mock Interview' },
    ];

    // Weakness heatmap with text labels and status
    const heatmap = [
      { topic: 'Python Core & OOP', level: 'Strong', status: 'GREEN', icon: 'CheckCircle2', effectiveScore: 92, action: 'Ready for production code review' },
      { topic: 'SQL Joins & Window Functions', level: 'Moderate', status: 'YELLOW', icon: 'AlertCircle', effectiveScore: 78, action: 'Practice window LAG/LEAD queries in sandbox' },
      { topic: 'Imbalanced Machine Learning (XGBoost)', level: 'Needs Work', status: 'RED', icon: 'XCircle', effectiveScore: 48, action: 'Complete PR-AUC parameter tuning guide' },
      { topic: 'Technical Communication & Behavioral', level: 'Strong', status: 'GREEN', icon: 'CheckCircle2', effectiveScore: 85, action: 'Maintain active interview practice' },
      { topic: 'Docker & Production Deployment', level: 'Needs Work', status: 'RED', icon: 'XCircle', effectiveScore: 35, action: 'Start containerization roadmap milestone' },
      { topic: 'FinTech Anomaly System Design', level: 'Needs Work', status: 'RED', icon: 'XCircle', effectiveScore: 42, action: 'Review low-latency microservice architectures' },
    ];

    res.json({
      data: {
        metrics,
        timeline,
        heatmap,
        radarDimensions: metrics.radarDimensions,
        formulas: {
          overallReadiness: 'Weighted sum: Technical (30%) + Practical Proofs (25%) + Domain (15%) + Projects (15%) + Communication (8%) + Interview (7%)',
          effectiveSkill: 'Effective Level = Declared/Assessed Level × Verification Weight (Self-reported: 0.5, Assessed: 0.8, Evidence-Backed: 1.0)',
          masteryScore: 'Decay-weighted average of quiz attempts with difficulty multipliers (Beginner: 0.7x, Intermediate: 1.0x, Advanced: 1.3x) with 30-day half-life',
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
