import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../db.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = Router();

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  ageConfirmed: z.boolean().default(true),
  isUnder18: z.boolean().default(false),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/signup', async (req: Request, res: Response, next) => {
  try {
    const body = SignupSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      res.status(400).json({ error: { code: 'USER_EXISTS', message: 'An account with this email already exists.' } });
      return;
    }

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash,
        name: body.name,
        role: 'STUDENT',
        ageConfirmed: body.ageConfirmed,
        isUnder18: body.isUnder18,
        emailVerified: true,
      },
    });

    // Create default StudentProfile and CareerTwin
    await prisma.studentProfile.create({
      data: {
        userId: user.id,
        educationLevel: 'Undergraduate',
        courseDegree: 'B.Tech in Computer Science',
        yearSemester: '2nd Year / 4th Semester',
        targetCareer: 'Fraud Detection ML Engineer in FinTech',
        targetDomain: 'Technology & IT',
        availableWeeklyHours: 10,
        learningPreference: 'mixed',
        preferredLanguage: 'en',
        bio: 'Passionate computer science student targeting ML engineering in FinTech.',
      },
    });

    await prisma.careerTwin.create({
      data: {
        userId: user.id,
        overallReadiness: 45,
        roadmapCompletion: 15,
        knowledgeScore: 50,
        quizMasteryScore: 60,
        practicalScore: 35,
        projectsScore: 40,
        interviewScore: 40,
        radarDimensions: JSON.stringify({ technical: 55, domain: 45, practical: 40, projects: 35, communication: 65, interview: 40 }),
        weaknesses: JSON.stringify(['SQL Window Functions & CTEs', 'XGBoost Hyperparameter Tuning']),
        strengths: JSON.stringify(['Python Foundations', 'Basic Data Analysis']),
      },
    });

    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isUnder18: user.isUnder18,
    });

    res.status(201).json({
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isUnder18: user.isUnder18,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req: Request, res: Response, next) => {
  try {
    const body = LoginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' } });
      return;
    }

    const isValid = await bcrypt.compare(body.password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' } });
      return;
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isUnder18: user.isUnder18,
    });

    res.json({
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isUnder18: user.isUnder18,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        studentProfile: {
          include: {
            educations: true,
            experiences: true,
            certifications: true,
            projects: true,
            studentSkills: { include: { skill: true } },
          },
        },
        careerTwin: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found.' } });
      return;
    }

    res.json({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isUnder18: user.isUnder18,
        studentProfile: user.studentProfile,
        careerTwin: user.careerTwin,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
