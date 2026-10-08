import { Router, Request, Response, NextFunction } from 'express';
import { prisma, safeJsonStringify } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { quizMasteryEngine } from '../engines/quizMasteryEngine.js';
import { careerTwinEngine } from '../engines/careerTwinEngine.js';

const router = Router();

router.get('/generate', async (req: Request, res: Response) => {
  const topicKey = (req.query.topicKey as string) || 'sql_window_functions';
  const difficulty = (req.query.difficulty as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') || 'INTERMEDIATE';

  let studentContext: any = { targetRole: 'Software & ML Engineer', previousMistakes: [] };

  // Check if authorization token was passed to personalize according to student history
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded: any = (await import('jsonwebtoken')).default.decode(token);
      if (decoded?.id) {
        const userId = decoded.id;
        const profile = await prisma.studentProfile.findUnique({
          where: { userId },
          select: { targetCareer: true },
        });
        if (profile?.targetCareer) {
          studentContext.targetRole = profile.targetCareer;
        }

        // Fetch past attempts on this topic to detect previous mistakes / weak concepts
        const pastAttempts = await prisma.quizAttempt.findMany({
          where: { userId, topicKey },
          orderBy: { attemptedAt: 'desc' },
          take: 3,
        });

        const mistakes: string[] = [];
        pastAttempts.forEach(att => {
          try {
            const parsed = JSON.parse(att.answersPayload);
            if (parsed.weakConcepts && Array.isArray(parsed.weakConcepts)) {
              mistakes.push(...parsed.weakConcepts);
            }
          } catch {
            // Ignored
          }
        });

        if (mistakes.length > 0) {
          studentContext.previousMistakes = Array.from(new Set(mistakes));
        }
      }
    } catch {
      // Fallback gracefully
    }
  }

  const quiz = quizMasteryEngine.generateTopicQuiz(topicKey, difficulty, studentContext);
  res.json({ data: quiz });
});

router.post('/submit', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { topicKey, difficulty, answers, bankQuestions } = req.body;

    // Fetch prior attempt scores for adaptive stepping
    const priorAttempts = await prisma.quizAttempt.findMany({
      where: { userId, topicKey: topicKey || 'sql_window_functions' },
      select: { percentage: true },
    });
    const priorScores = priorAttempts.map(a => a.percentage);

    const grading = quizMasteryEngine.gradeQuiz(answers || [], bankQuestions || [], priorScores);

    // Persist attempt with full concept mastery and weak concepts analysis
    await prisma.quizAttempt.create({
      data: {
        userId,
        nodeKey: topicKey || 'sql_advanced_analytics',
        topicKey: topicKey || 'sql_window_functions',
        difficulty: difficulty || 'INTERMEDIATE',
        score: grading.score,
        totalQuestions: grading.totalQuestions,
        percentage: grading.percentage,
        passed: grading.passed,
        answersPayload: safeJsonStringify({
          detailedAnswers: grading.detailedAnswers,
          weakConcepts: grading.weakConcepts,
          masteredConcepts: grading.masteredConcepts,
          adaptiveFeedback: grading.adaptiveFeedback,
          nextRecommendedAction: grading.nextRecommendedAction,
        }),
      },
    });

    // Update Career Twin with quiz attempt and weak/mastered concepts
    await careerTwinEngine.logEvent(userId, 'QUIZ_ATTEMPTED', {
      topicKey,
      percentage: grading.percentage,
      passed: grading.passed,
      weakConcepts: grading.weakConcepts,
      masteredConcepts: grading.masteredConcepts,
    });

    // If passed >= 75%, update corresponding roadmap node and student skill
    if (grading.passed) {
      // 1. Update active roadmap node if matching
      const activeRoadmap = await prisma.roadmap.findFirst({
        where: { userId, status: 'ACTIVE' },
        include: { nodes: true },
      });

      if (activeRoadmap) {
        const matchingNode = activeRoadmap.nodes.find(
          (n: any) => n.nodeKey.toLowerCase() === (topicKey || '').toLowerCase() ||
               (topicKey || '').toLowerCase().includes(n.nodeKey.toLowerCase())
        );

        if (matchingNode && matchingNode.status !== 'COMPLETED') {
          await prisma.roadmapNode.update({
            where: { id: matchingNode.id },
            data: { status: 'COMPLETED' },
          });

          // Unlock downstream nodes whose prerequisites are satisfied
          const allNodes = await prisma.roadmapNode.findMany({ where: { roadmapId: activeRoadmap.id } });
          const edges = await prisma.roadmapEdge.findMany({ where: { roadmapId: activeRoadmap.id } });
          const completedKeys = new Set(allNodes.filter((n: any) => n.status === 'COMPLETED').map((n: any) => n.nodeKey));
          completedKeys.add(matchingNode.nodeKey);

          for (const node of allNodes) {
            if (node.status === 'LOCKED') {
              const prereqs = edges.filter((e: any) => e.targetNodeKey === node.nodeKey).map((e: any) => e.sourceNodeKey);
              const allSatisfied = prereqs.length === 0 || prereqs.every(p => completedKeys.has(p));
              if (allSatisfied) {
                await prisma.roadmapNode.update({
                  where: { id: node.id },
                  data: { status: 'AVAILABLE' },
                });
              }
            }
          }
        }
      }

      // 2. Update StudentSkill to ASSESSED
      const profile = await prisma.studentProfile.findUnique({ where: { userId } });
      if (profile) {
        const skillName = topicKey.toLowerCase().includes('sql')
          ? 'SQL'
          : topicKey.toLowerCase().includes('python')
          ? 'Python'
          : 'Machine Learning';

        const skill = await prisma.skill.findFirst({ where: { name: skillName } });
        if (skill) {
          await prisma.studentSkill.upsert({
            where: { id: `ss-${userId}-${skill.id}` },
            update: {
              declaredLevel: 2,
              effectiveLevel: 1.6, // 2 * 0.8
              verificationState: 'ASSESSED',
              verifiedAt: new Date(),
            },
            create: {
              id: `ss-${userId}-${skill.id}`,
              profileId: profile.id,
              skillId: skill.id,
              declaredLevel: 2,
              effectiveLevel: 1.6,
              verificationState: 'ASSESSED',
              verifiedAt: new Date(),
            },
          });
        }
      }
    }

    res.json({ data: grading });
  } catch (err) {
    next(err);
  }
});

router.get('/mastery', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { attemptedAt: 'desc' },
    });

    const scores = attempts.map((a, i) => ({
      score: a.percentage,
      difficulty: a.difficulty,
      daysAgo: i * 2,
    }));

    const mastery = quizMasteryEngine.computeMastery(scores);
    res.json({ data: mastery });
  } catch (err) {
    next(err);
  }
});

export default router;
