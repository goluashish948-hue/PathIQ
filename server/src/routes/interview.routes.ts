import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { interviewEngine, FINTECH_INTERVIEW_TURNS, InterviewStudentContext } from '../engines/interviewEngine.js';
import { careerTwinEngine } from '../engines/careerTwinEngine.js';

const router = Router();

router.get('/questions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let studentContext: InterviewStudentContext = {
      targetCareer: 'Fraud Detection ML Engineer in FinTech',
      completedTopics: ['Python Functions', 'SQL Joins', 'Machine Learning Basics'],
      verifiedSkills: ['Python', 'SQL', 'Scikit-Learn'],
      projects: [{ title: 'Fraud Anomaly Detection Engine', description: 'End-to-end classification pipeline for card testing attacks.' }],
      weakAreas: ['Class Imbalance & Loss Calibration'],
    };

    // If authenticated, construct hyper-personalized context from student database
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded: any = (await import('jsonwebtoken')).default.decode(token);
        if (decoded?.id) {
          const userId = decoded.id;
          studentContext.userId = userId;

          const profile = await prisma.studentProfile.findUnique({
            where: { userId },
            include: {
              studentSkills: { include: { skill: true } },
              projects: true,
            },
          });

          if (profile?.targetCareer) {
            studentContext.targetCareer = profile.targetCareer;
          }

          if (profile?.studentSkills && profile.studentSkills.length > 0) {
            studentContext.verifiedSkills = profile.studentSkills.map((s: any) => s.skill.name);
          }

          if (profile?.projects && profile.projects.length > 0) {
            studentContext.projects = profile.projects.map((p: any) => ({
              title: p.title,
              description: p.description,
            }));
          }

          // Completed topics from active roadmap
          const roadmap = await prisma.roadmap.findFirst({
            where: { userId, status: 'ACTIVE' },
            include: { nodes: true },
          });

          if (roadmap?.nodes) {
            const completed = roadmap.nodes.filter((n: any) => n.status === 'COMPLETED').map((n: any) => n.title);
            if (completed.length > 0) {
              studentContext.completedTopics = completed;
            }
            const current = roadmap.nodes.find((n: any) => n.status === 'CURRENT' || n.status === 'AVAILABLE');
            if (current) {
              studentContext.currentLearningTopic = current.title;
            }
          }

          // Weak areas from past quiz attempts
          const pastQuizzes = await prisma.quizAttempt.findMany({
            where: { userId, passed: false },
            orderBy: { attemptedAt: 'desc' },
            take: 3,
          });

          const weakList: string[] = [];
          pastQuizzes.forEach(q => {
            try {
              const parsed = JSON.parse(q.answersPayload);
              if (parsed.weakConcepts && Array.isArray(parsed.weakConcepts)) {
                weakList.push(...parsed.weakConcepts);
              }
            } catch {
              // Ignore
            }
          });

          if (weakList.length > 0) {
            studentContext.weakAreas = Array.from(new Set(weakList));
          }
        }
      } catch {
        // Fallback to default fintech context
      }
    }

    const turns = interviewEngine.generatePersonalizedInterview(studentContext);
    res.json({ data: { turns, studentContext } });
  } catch (err) {
    next(err);
  }
});

router.post('/evaluate-turn', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let userId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded: any = (await import('jsonwebtoken')).default.decode(token);
        if (decoded?.id) {
          userId = decoded.id;
        }
      } catch {
        // Fallback to guest
      }
    }

    const { turnIndex = 1, candidateResponse = '', questionText = '', studentContext } = req.body;

    const result = interviewEngine.evaluateCandidateAnswer(
      Number(turnIndex),
      candidateResponse,
      questionText,
      studentContext
    );

    // If authenticated, log interview turn in Career Twin
    if (userId) {
      await careerTwinEngine.logEvent(userId, 'INTERVIEW_TURN_EVALUATED', {
        turnIndex,
        score: result.score,
        strengths: result.strengths,
        improvements: result.improvements,
      });
    }

    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

router.get('/readiness-profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let userId: string = 'demo-guest';
    let targetCareer = 'Fraud Detection ML Engineer in FinTech';

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded: any = (await import('jsonwebtoken')).default.decode(token);
        if (decoded?.id) {
          userId = decoded.id;
          const profile = await prisma.studentProfile.findUnique({
            where: { userId },
            select: { targetCareer: true },
          });
          if (profile?.targetCareer) {
            targetCareer = profile.targetCareer;
          }
        }
      } catch {
        // Fallback to guest
      }
    }

    const readiness = interviewEngine.generateReadinessProfile(userId, targetCareer);

    // If real user, update Career Twin
    if (userId !== 'demo-guest') {
      await careerTwinEngine.logEvent(userId, 'INTERVIEW_READINESS_COMPUTED', {
        readinessScore: readiness.readinessScore,
        readinessBand: readiness.readinessBand,
        targetCareer,
      });
    }

    res.json({ data: readiness });
  } catch (err) {
    next(err);
  }
});

export default router;
