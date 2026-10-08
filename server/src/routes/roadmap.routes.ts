import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma, safeJsonParse, safeJsonStringify } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { graphRoadmapEngine } from '../engines/graphRoadmapEngine.js';
import { careerTwinEngine } from '../engines/careerTwinEngine.js';

const router = Router();

router.post('/generate', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const { targetCareer, targetDomain, weeklyHours, trackType } = req.body;

    const career = targetCareer || 'Fraud Detection ML Engineer in FinTech';
    const domain = targetDomain || 'Technology & IT';
    const hours = Number(weeklyHours) || 10;
    const track = (trackType as 'FAST' | 'STRONG') || 'STRONG';

    // Get student's current skills
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: { studentSkills: { include: { skill: true } } },
    });

    const studentSkills = (profile?.studentSkills || []).map(s => ({
      name: s.skill.name,
      effectiveLevel: s.effectiveLevel,
    }));

    const generated = graphRoadmapEngine.generateRoadmap({
      targetCareer: career,
      targetDomain: domain,
      weeklyHours: hours,
      trackType: track,
      studentSkills,
    });

    // Check if active roadmap exists
    let roadmap = await prisma.roadmap.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    if (roadmap) {
      // Archive old nodes or update
      await prisma.roadmapNode.deleteMany({ where: { roadmapId: roadmap.id } });
      await prisma.roadmapEdge.deleteMany({ where: { roadmapId: roadmap.id } });

      roadmap = await prisma.roadmap.update({
        where: { id: roadmap.id },
        data: {
          targetCareer: career,
          targetDomain: domain,
          trackType: track,
          weeklyHours: hours,
          totalEstimatedHours: generated.totalEstimatedHours,
          versionNumber: roadmap.versionNumber + 1,
        },
      });
    } else {
      roadmap = await prisma.roadmap.create({
        data: {
          userId,
          targetCareer: career,
          targetDomain: domain,
          trackType: track,
          weeklyHours: hours,
          totalEstimatedHours: generated.totalEstimatedHours,
          shareSlug: `roadmap-${Date.now().toString(36)}`,
        },
      });
    }

    // Persist nodes and edges
    for (const [index, n] of generated.nodes.entries()) {
      await prisma.roadmapNode.create({
        data: {
          roadmapId: roadmap.id,
          nodeKey: n.nodeKey,
          title: n.title,
          nodeType: n.nodeType,
          importance: n.importance,
          targetLevel: n.targetLevel,
          estimatedHours: n.estimatedHours,
          orderIndex: index,
          scheduledWeek: n.scheduledWeek || 1,
          learningObjectives: safeJsonStringify(n.learningObjectives),
          whyNeeded: safeJsonStringify(n.whyNeeded),
          practiceTasks: safeJsonStringify(n.practiceTasks),
          proofRequirement: n.proofRequirement,
          status: n.status,
          clusterGroup: n.clusterGroup,
        },
      });
    }

    for (const e of generated.edges) {
      await prisma.roadmapEdge.create({
        data: {
          roadmapId: roadmap.id,
          sourceNodeKey: e.sourceNodeKey,
          targetNodeKey: e.targetNodeKey,
        },
      });
    }

    await careerTwinEngine.logEvent(userId, 'GOAL_CHANGED', { targetCareer: career });

    res.json({
      data: {
        roadmapId: roadmap.id,
        plan: generated,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/active', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const roadmap = await prisma.roadmap.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: { nodes: true, edges: true },
    });

    if (!roadmap) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          studentProfile: {
            include: { studentSkills: { include: { skill: true } } },
          },
        },
      });
      const career = user?.studentProfile?.targetCareer || 'Fraud Detection ML Engineer in FinTech';
      const hours = user?.studentProfile?.availableWeeklyHours || 10;
      const studentSkills = (user?.studentProfile?.studentSkills || []).map(s => ({
        name: s.skill.name,
        effectiveLevel: s.effectiveLevel,
      }));
      const plan = graphRoadmapEngine.generateRoadmap({
        targetCareer: career,
        targetDomain: 'Technology & IT',
        weeklyHours: hours,
        trackType: 'STRONG',
        studentSkills,
      });

      const newRoadmap = await prisma.roadmap.create({
        data: {
          userId,
          targetCareer: career,
          targetDomain: 'Technology & IT',
          weeklyHours: hours,
          totalEstimatedHours: plan.totalEstimatedHours,
          shareSlug: `roadmap-${Date.now().toString(36)}`,
        },
      });

      for (const [index, n] of plan.nodes.entries()) {
        await prisma.roadmapNode.create({
          data: {
            roadmapId: newRoadmap.id,
            nodeKey: n.nodeKey,
            title: n.title,
            nodeType: n.nodeType,
            importance: n.importance,
            targetLevel: n.targetLevel,
            estimatedHours: n.estimatedHours,
            orderIndex: index,
            scheduledWeek: n.scheduledWeek || 1,
            learningObjectives: safeJsonStringify(n.learningObjectives),
            whyNeeded: safeJsonStringify(n.whyNeeded),
            practiceTasks: safeJsonStringify(n.practiceTasks),
            proofRequirement: n.proofRequirement,
            status: n.status,
            clusterGroup: n.clusterGroup,
          },
        });
      }

      for (const e of plan.edges) {
        await prisma.roadmapEdge.create({
          data: {
            roadmapId: newRoadmap.id,
            sourceNodeKey: e.sourceNodeKey,
            targetNodeKey: e.targetNodeKey,
          },
        });
      }

      const fresh = await prisma.roadmap.findUnique({
        where: { id: newRoadmap.id },
        include: { nodes: true, edges: true },
      });

      res.json({ data: fresh });
      return;
    }

    res.json({ data: roadmap });
  } catch (err) {
    next(err);
  }
});

router.post('/nodes/:nodeKey/status', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { status } = req.body;
    const { nodeKey } = req.params;
    const userId = req.user!.id;

    const roadmap = await prisma.roadmap.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    if (!roadmap) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'No active roadmap' } });
      return;
    }

    await prisma.roadmapNode.updateMany({
      where: { roadmapId: roadmap.id, nodeKey },
      data: {
        status,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      },
    });

    // If node was marked completed, unlock downstream dependents
    if (status === 'COMPLETED') {
      const edges = await prisma.roadmapEdge.findMany({
        where: { roadmapId: roadmap.id, sourceNodeKey: nodeKey },
      });

      for (const edge of edges) {
        await prisma.roadmapNode.updateMany({
          where: { roadmapId: roadmap.id, nodeKey: edge.targetNodeKey, status: 'LOCKED' },
          data: { status: 'AVAILABLE' },
        });
      }

      await careerTwinEngine.logEvent(userId, 'TOPIC_COMPLETED', { nodeKey });
    }

    res.json({ data: { success: true } });
  } catch (err) {
    next(err);
  }
});

export default router;
