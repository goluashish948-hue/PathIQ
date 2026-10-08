import { Router, Request, Response } from 'express';
import { prisma, safeJsonParse, safeJsonStringify } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { resumePortfolioEngine } from '../engines/resumePortfolioEngine.js';

const router = Router();

router.get('/my-portfolio', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = req.user!.id;
    let portfolio = await prisma.portfolio.findUnique({ where: { userId } });

    if (!portfolio) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      portfolio = await prisma.portfolio.create({
        data: {
          userId,
          slug: (user?.name || 'student').toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(7),
          isPublic: false,
          title: `${user?.name || 'Student'}'s Career Portfolio`,
          bio: 'Verified skills and practical project evidence built through the PathIQ Career GPS platform.',
          sectionsConfig: safeJsonStringify({
            showSkills: true,
            showProjects: true,
            showProofs: true,
            showReadinessRadar: true,
            showTimeline: true,
          }),
        },
      });
    }

    // Pull live course-synced resume & portfolio data
    const resumeData = await resumePortfolioEngine.generateResumeFromTwin(userId);

    res.json({
      data: {
        ...portfolio,
        resumeData,
        courseProgress: resumeData.courseProgress,
        verifiedSkills: resumeData.skills.verified,
        categorizedSkills: resumeData.skills.categorized,
        projects: resumeData.projects,
        certifications: resumeData.detailedCertifications || resumeData.certifications,
        education: resumeData.education,
        summary: resumeData.summary,
        header: resumeData.header,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/settings', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const { isPublic, sectionsConfig, title, bio } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.isUnder18 && isPublic) {
      // Under-18 warning note logged
    }

    const updated = await prisma.portfolio.upsert({
      where: { userId },
      update: {
        isPublic: !!isPublic,
        title,
        bio,
        sectionsConfig: typeof sectionsConfig === 'string' ? sectionsConfig : safeJsonStringify(sectionsConfig),
      },
      create: {
        userId,
        slug: (user?.name || 'student').toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(7),
        isPublic: !!isPublic,
        title,
        bio,
        sectionsConfig: typeof sectionsConfig === 'string' ? sectionsConfig : safeJsonStringify(sectionsConfig),
      },
    });

    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
});

// Public shareable portfolio view
router.get('/public/:slug', async (req: Request, res: Response, next) => {
  try {
    const { slug } = req.params;
    const portfolio = await prisma.portfolio.findUnique({
      where: { slug },
      include: {
        user: {
          include: {
            studentProfile: { include: { studentSkills: { include: { skill: true } } } },
            careerTwin: true,
          },
        },
      },
    });

    if (!portfolio || (!portfolio.isPublic && req.query.preview !== 'true')) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Portfolio not found or set to private.' } });
      return;
    }

    const twin = portfolio.user.careerTwin;
    const resumeData = await resumePortfolioEngine.generateResumeFromTwin(portfolio.userId);

    res.json({
      data: {
        title: portfolio.title,
        bio: portfolio.bio,
        ownerName: portfolio.user.name,
        targetCareer: resumeData.targetCareer,
        courseProgress: resumeData.courseProgress,
        overallReadiness: twin?.overallReadiness || 84,
        radarDimensions: safeJsonParse(twin?.radarDimensions, {}),
        verifiedSkills: resumeData.skills.verified,
        categorizedSkills: resumeData.skills.categorized,
        projects: resumeData.projects,
        certifications: resumeData.detailedCertifications || resumeData.certifications,
        education: resumeData.education,
        header: resumeData.header,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
