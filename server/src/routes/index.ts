import { Router } from 'express';
import authRoutes from './auth.routes.js';
import goalRoutes from './goal.routes.js';
import discoveryRoutes from './discovery.routes.js';
import domainRoutes from './domain.routes.js';
import jobDnaRoutes from './jobDna.routes.js';
import gapRoutes from './gap.routes.js';
import roadmapRoutes from './roadmap.routes.js';
import planningRoutes from './planning.routes.js';
import learnRoutes from './learn.routes.js';
import quizRoutes from './quiz.routes.js';
import proofRoutes from './proof.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import replanRoutes from './replan.routes.js';
import mentorRoutes from './mentor.routes.js';
import interviewRoutes from './interview.routes.js';
import resumeRoutes from './resume.routes.js';
import portfolioRoutes from './portfolio.routes.js';
import dailyPlanRoutes from './dailyPlan.routes.js';
import adminRoutes from './admin.routes.js';
import profileRoutes from './profile.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/profile', profileRoutes);
apiRouter.use('/goals', goalRoutes);
apiRouter.use('/discovery', discoveryRoutes);
apiRouter.use('/domains', domainRoutes);
apiRouter.use('/job-dna', jobDnaRoutes);
apiRouter.use('/gap', gapRoutes);
apiRouter.use('/roadmaps', roadmapRoutes);
apiRouter.use('/planning', planningRoutes);
apiRouter.use('/learn', learnRoutes);
apiRouter.use('/quiz', quizRoutes);
apiRouter.use('/proof', proofRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/replan', replanRoutes);
apiRouter.use('/mentor', mentorRoutes);
apiRouter.use('/interview', interviewRoutes);
apiRouter.use('/resume', resumeRoutes);
apiRouter.use('/portfolio', portfolioRoutes);
apiRouter.use('/daily-plan', dailyPlanRoutes);
apiRouter.use('/admin', adminRoutes);

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    app: 'PathIQ - AI Career GPS',
    mode: process.env.NODE_ENV || 'development',
    aiProvider: process.env.AI_PROVIDER || 'mock',
    timestamp: new Date().toISOString(),
  });
});

export default apiRouter;
