import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { topicContentEngine } from '../engines/topicContentEngine.js';
import { careerTwinEngine } from '../engines/careerTwinEngine.js';

const router = Router();

// 1. Get Topic Learning Content (Personalized by topic and target career)
router.get('/topic/:topicKey', async (req: Request, res: Response) => {
  const { topicKey } = req.params;

  let targetRole = 'Software & ML Engineer';
  // Check if authorization token was passed
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded: any = (await import('jsonwebtoken')).default.decode(token);
      if (decoded?.id) {
        const profile = await prisma.studentProfile.findUnique({
          where: { userId: decoded.id },
          select: { targetCareer: true },
        });
        if (profile?.targetCareer) {
          targetRole = profile.targetCareer;
        }
      }
    } catch {
      // Graceful fallback to default
    }
  }

  const content = topicContentEngine.getTopicContent(topicKey, targetRole);
  res.json({ data: content });
});

// 2. Get Student's Active Learning Topics (from roadmap & core curricula)
router.get('/active-topics', async (req: Request, res: Response) => {
  let activeTopics = [
    {
      topicKey: 'python_functions',
      title: 'Python Functions, Scope & Lambdas',
      category: 'programming',
      estimatedMinutes: 40,
      status: 'AVAILABLE',
      order: 1,
    },
    {
      topicKey: 'sql_joins',
      title: 'SQL Joins & Relational Merging',
      category: 'database',
      estimatedMinutes: 45,
      status: 'AVAILABLE',
      order: 2,
    },
    {
      topicKey: 'sql_advanced_analytics',
      title: 'SQL Window Functions & High-Velocity Aggregations',
      category: 'database',
      estimatedMinutes: 45,
      status: 'CURRENT',
      order: 3,
    },
    {
      topicKey: 'machine_learning_basics',
      title: 'Machine Learning Classification & Imbalance',
      category: 'machine_learning',
      estimatedMinutes: 50,
      status: 'AVAILABLE',
      order: 4,
    },
  ];

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded: any = (await import('jsonwebtoken')).default.decode(token);
      if (decoded?.id) {
        const roadmap = await prisma.roadmap.findFirst({
          where: { userId: decoded.id, status: 'ACTIVE' },
          include: { nodes: true },
        });

        if (roadmap?.nodes && roadmap.nodes.length > 0) {
          const roadmapTopics = roadmap.nodes.map((n: any, i: number) => ({
            topicKey: n.nodeKey,
            title: n.title,
            category: n.nodeType === 'skill' ? 'programming' : 'project',
            estimatedMinutes: n.estimatedHours ? n.estimatedHours * 30 : 45,
            status: n.status,
            order: i + 5,
          }));
          activeTopics = [...activeTopics, ...roadmapTopics];
        }
      }
    } catch {
      // Fallback
    }
  }

  res.json({ data: activeTopics });
});

// 3. Complete Topic and Trigger Next Action
router.post('/complete-topic', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { topicKey, title } = req.body;

    if (!topicKey) {
      return res.status(400).json({ error: { message: 'topicKey is required' } });
    }

    // Log event in Career Twin
    await careerTwinEngine.logEvent(userId, 'TOPIC_LEARNED', {
      topicKey,
      title: title || topicKey,
      completedAt: new Date().toISOString(),
    });

    res.json({
      data: {
        success: true,
        topicKey,
        nextStep: 'QUIZ',
        message: `Topic "${title || topicKey}" completed! Personalized adaptive quiz is ready.`,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
