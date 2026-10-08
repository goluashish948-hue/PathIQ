import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma, safeJsonParse, safeJsonStringify } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { careerTwinEngine } from '../engines/careerTwinEngine.js';
import { graphRoadmapEngine } from '../engines/graphRoadmapEngine.js';

const router = Router();

// GET /api/v1/profile - Get full student profile
router.get('/', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = req.user!.id;

    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: {
            educations: true,
            experiences: true,
            certifications: true,
            projects: true,
            studentSkills: {
              include: { skill: true },
            },
          },
        },
        careerTwin: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
      return;
    }

    // Ensure studentProfile exists
    if (!user.studentProfile) {
      const newProfile = await prisma.studentProfile.create({
        data: {
          userId,
          educationLevel: 'Undergraduate',
          courseDegree: 'B.Tech in Computer Science',
          yearSemester: '2nd Year / 4th Semester',
          targetCareer: 'Fraud Detection ML Engineer in FinTech',
          targetDomain: 'Technology & IT',
          availableWeeklyHours: 10,
          learningPreference: 'mixed',
          preferredLanguage: 'en',
          bio: 'Passionate student interested in machine learning and financial risk intelligence.',
        },
        include: {
          educations: true,
          experiences: true,
          certifications: true,
          projects: true,
          studentSkills: { include: { skill: true } },
        },
      });

      user = await prisma.user.findUnique({
        where: { id: userId },
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
    }

    res.json({
      data: {
        user: {
          id: user!.id,
          name: user!.name,
          email: user!.email,
          role: user!.role,
          avatarUrl: user!.avatarUrl,
          isUnder18: user!.isUnder18,
        },
        profile: user!.studentProfile,
        careerTwin: user!.careerTwin ? {
          ...user!.careerTwin,
          strengths: safeJsonParse(user!.careerTwin.strengths, []),
          weaknesses: safeJsonParse(user!.careerTwin.weaknesses, []),
          radarDimensions: safeJsonParse(user!.careerTwin.radarDimensions, {}),
        } : null,
      },
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/profile - Update personal and student profile info
router.put('/', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const {
      name,
      avatarUrl,
      bio,
      courseDegree,
      yearSemester,
      educationLevel,
      targetCareer,
      targetDomain,
      availableWeeklyHours,
      learningPreference,
      preferredLanguage,
      strengths,
      weaknesses,
    } = req.body;

    // Update User record
    if (name || avatarUrl !== undefined) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name ? { name } : {}),
          ...(avatarUrl !== undefined ? { avatarUrl } : {}),
        },
      });
    }

    // Update StudentProfile record
    const updatedProfile = await prisma.studentProfile.upsert({
      where: { userId },
      update: {
        ...(bio !== undefined ? { bio } : {}),
        ...(courseDegree !== undefined ? { courseDegree } : {}),
        ...(yearSemester !== undefined ? { yearSemester } : {}),
        ...(educationLevel !== undefined ? { educationLevel } : {}),
        ...(targetCareer !== undefined ? { targetCareer } : {}),
        ...(targetDomain !== undefined ? { targetDomain } : {}),
        ...(availableWeeklyHours !== undefined ? { availableWeeklyHours: Number(availableWeeklyHours) } : {}),
        ...(learningPreference !== undefined ? { learningPreference } : {}),
        ...(preferredLanguage !== undefined ? { preferredLanguage } : {}),
      },
      create: {
        userId,
        bio: bio || '',
        courseDegree: courseDegree || 'B.Tech CSE',
        yearSemester: yearSemester || '2nd Year',
        educationLevel: educationLevel || 'Undergraduate',
        targetCareer: targetCareer || 'Fraud Detection ML Engineer in FinTech',
        targetDomain: targetDomain || 'Technology & IT',
        availableWeeklyHours: Number(availableWeeklyHours) || 10,
        learningPreference: learningPreference || 'mixed',
        preferredLanguage: preferredLanguage || 'en',
      },
    });

    // Update CareerTwin strengths and weaknesses if provided
    if (strengths || weaknesses) {
      await prisma.careerTwin.upsert({
        where: { userId },
        update: {
          ...(strengths ? { strengths: safeJsonStringify(strengths) } : {}),
          ...(weaknesses ? { weaknesses: safeJsonStringify(weaknesses) } : {}),
        },
        create: {
          userId,
          strengths: safeJsonStringify(strengths || ['Python Foundations']),
          weaknesses: safeJsonStringify(weaknesses || ['Advanced System Design']),
          radarDimensions: safeJsonStringify({ technical: 60, domain: 50, practical: 40, projects: 40, communication: 70, interview: 50 }),
        },
      });
    }

    // Log event in CareerTwin
    await careerTwinEngine.logEvent(userId, 'PROFILE_UPDATED', { targetCareer, availableWeeklyHours });

    res.json({ data: updatedProfile });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/profile/education - Add education
router.post('/education', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const { institution, degree, fieldOfStudy, startYear, endYear, gradeGpa } = req.body;

    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Profile not found' } });
      return;
    }

    const education = await prisma.education.create({
      data: {
        profileId: profile.id,
        institution: institution || 'University',
        degree: degree || 'Bachelor of Technology',
        fieldOfStudy: fieldOfStudy || 'Computer Science',
        startYear: startYear ? Number(startYear) : new Date().getFullYear() - 2,
        endYear: endYear ? Number(endYear) : new Date().getFullYear() + 2,
        gradeGpa: gradeGpa || '8.5 CGPA',
      },
    });

    res.status(201).json({ data: education });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/profile/education/:id - Delete education
router.delete('/education/:id', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    await prisma.education.delete({ where: { id } });
    res.json({ data: { success: true } });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/profile/project - Add project
router.post('/project', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const { title, description, skillsUsed, repoUrl, liveUrl } = req.body;

    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Profile not found' } });
      return;
    }

    const skillsArray = Array.isArray(skillsUsed)
      ? skillsUsed
      : typeof skillsUsed === 'string'
      ? skillsUsed.split(',').map(s => s.trim())
      : ['Python'];

    const project = await prisma.project.create({
      data: {
        profileId: profile.id,
        title: title || 'New Project',
        description: description || '',
        skillsUsed: safeJsonStringify(skillsArray),
        repoUrl: repoUrl || '',
        liveUrl: liveUrl || '',
        analysisScore: 80,
      },
    });

    await careerTwinEngine.logEvent(userId, 'PROJECT_ADDED', { projectId: project.id, title });

    res.status(201).json({ data: project });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/profile/project/:id - Delete project
router.delete('/project/:id', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    res.json({ data: { success: true } });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/profile/certification - Add certification
router.post('/certification', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const { name, issuer, issueDate, credentialUrl } = req.body;

    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Profile not found' } });
      return;
    }

    const cert = await prisma.certification.create({
      data: {
        profileId: profile.id,
        name: name || 'Professional Certificate',
        issuer: issuer || 'Online Platform',
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        credentialUrl: credentialUrl || '',
        isVerified: true,
      },
    });

    res.status(201).json({ data: cert });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/profile/certification/:id - Delete certification
router.delete('/certification/:id', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    await prisma.certification.delete({ where: { id } });
    res.json({ data: { success: true } });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/profile/experience - Add experience
router.post('/experience', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const { title, company, location, startDate, endDate, isCurrent, description } = req.body;

    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Profile not found' } });
      return;
    }

    const exp = await prisma.experience.create({
      data: {
        profileId: profile.id,
        title: title || 'Software Intern',
        company: company || 'Tech Corp',
        location: location || 'Remote',
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent: isCurrent || false,
        description: description || '',
      },
    });

    res.status(201).json({ data: exp });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/profile/experience/:id - Delete experience
router.delete('/experience/:id', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    await prisma.experience.delete({ where: { id } });
    res.json({ data: { success: true } });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/profile/skill - Add or update skill
router.post('/skill', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const { skillName, declaredLevel, verificationState } = req.body;

    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Profile not found' } });
      return;
    }

    // Find or create skill in ontology
    let skill = await prisma.skill.findFirst({
      where: { name: { equals: skillName } },
    });

    if (!skill) {
      skill = await prisma.skill.create({
        data: {
          name: skillName,
          description: `Skill in ${skillName}`,
          type: 'technical',
        },
      });
    }

    const level = Number(declaredLevel) || 1;
    const state = verificationState || 'SELF_REPORTED';
    const effective = careerTwinEngine.computeEffectiveLevel(level, state);

    // Upsert StudentSkill
    const existing = await prisma.studentSkill.findFirst({
      where: { profileId: profile.id, skillId: skill.id },
    });

    let studentSkill;
    if (existing) {
      studentSkill = await prisma.studentSkill.update({
        where: { id: existing.id },
        data: {
          declaredLevel: level,
          effectiveLevel: effective,
          verificationState: state,
        },
        include: { skill: true },
      });
    } else {
      studentSkill = await prisma.studentSkill.create({
        data: {
          profileId: profile.id,
          skillId: skill.id,
          declaredLevel: level,
          effectiveLevel: effective,
          verificationState: state,
        },
        include: { skill: true },
      });
    }

    await careerTwinEngine.logEvent(userId, 'SKILL_DECLARED', { skillName, level });

    res.json({ data: studentSkill });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/profile/skill/:id - Remove skill
router.delete('/skill/:id', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    await prisma.studentSkill.delete({ where: { id } });
    res.json({ data: { success: true } });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/profile/onboarding - Complete comprehensive student onboarding questionnaire
router.post('/onboarding', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const {
      // Academic
      courseDegree,
      yearSemester,
      educationLevel,
      institution,
      // Skills & Learning
      currentSkills, // Array of { name: string, level: number }
      currentlyLearning,
      enjoyedSubjects,
      // Self-Assessment
      strengths, // Array of strings or comma-separated
      weaknesses, // Array of strings or comma-separated
      projects, // Array of { title, description, skills }
      // Career Ambitions
      targetCareer,
      targetDomain,
      workInterests,
      shortTermGoal,
      longTermGoal,
      // Time & Preference
      availableWeeklyHours,
      learningPreference,
    } = req.body;

    const career = targetCareer || 'Fraud Detection ML Engineer in FinTech';
    const domain = targetDomain || 'Technology & IT';
    const hours = Number(availableWeeklyHours) || 10;
    const preference = learningPreference || 'mixed';

    // 1. Update Student Profile
    const profile = await prisma.studentProfile.upsert({
      where: { userId },
      update: {
        courseDegree: courseDegree || 'B.Tech in Computer Science',
        yearSemester: yearSemester || '2nd Year / 4th Semester',
        educationLevel: educationLevel || 'Undergraduate',
        targetCareer: career,
        targetDomain: domain,
        availableWeeklyHours: hours,
        learningPreference: preference,
        bio: `Pursuing ${courseDegree || 'B.Tech'}. Focused on ${career}. Enjoys ${Array.isArray(enjoyedSubjects) ? enjoyedSubjects.join(', ') : enjoyedSubjects || 'problem solving'}.`,
      },
      create: {
        userId,
        courseDegree: courseDegree || 'B.Tech in Computer Science',
        yearSemester: yearSemester || '2nd Year / 4th Semester',
        educationLevel: educationLevel || 'Undergraduate',
        targetCareer: career,
        targetDomain: domain,
        availableWeeklyHours: hours,
        learningPreference: preference,
        bio: `Pursuing ${courseDegree || 'B.Tech'}. Focused on ${career}.`,
      },
    });

    // 2. Add or update Education
    if (institution) {
      await prisma.education.deleteMany({ where: { profileId: profile.id } });
      await prisma.education.create({
        data: {
          profileId: profile.id,
          institution,
          degree: courseDegree || 'Bachelor of Technology',
          fieldOfStudy: courseDegree?.includes('CSE') || courseDegree?.includes('Computer') ? 'Computer Science' : 'Engineering',
          startYear: new Date().getFullYear() - 1,
          endYear: new Date().getFullYear() + 3,
          gradeGpa: '8.5 CGPA',
        },
      });
    }

    // 3. Add Skills
    if (Array.isArray(currentSkills) && currentSkills.length > 0) {
      for (const item of currentSkills) {
        const sName = typeof item === 'string' ? item : item.name;
        const sLevel = typeof item === 'object' && item.level ? Number(item.level) : 2;

        let skill = await prisma.skill.findFirst({
          where: { name: { equals: sName } },
        });

        if (!skill) {
          skill = await prisma.skill.create({
            data: {
              name: sName,
              description: `Skill in ${sName}`,
              type: 'technical',
            },
          });
        }

        const effective = careerTwinEngine.computeEffectiveLevel(sLevel, 'SELF_REPORTED');
        await prisma.studentSkill.upsert({
          where: { id: `${profile.id}_${skill.id}` },
          update: {
            declaredLevel: sLevel,
            effectiveLevel: effective,
          },
          create: {
            id: `${profile.id}_${skill.id}`,
            profileId: profile.id,
            skillId: skill.id,
            declaredLevel: sLevel,
            effectiveLevel: effective,
            verificationState: 'SELF_REPORTED',
          },
        });
      }
    }

    // 4. Add Projects if provided
    if (Array.isArray(projects) && projects.length > 0) {
      for (const prj of projects) {
        if (prj.title) {
          await prisma.project.create({
            data: {
              profileId: profile.id,
              title: prj.title,
              description: prj.description || 'Student project',
              skillsUsed: safeJsonStringify(prj.skills || ['Python', 'SQL']),
              repoUrl: prj.repoUrl || '',
              analysisScore: 82,
            },
          });
        }
      }
    }

    // 5. Update CareerTwin
    const strengthsArr = Array.isArray(strengths)
      ? strengths
      : typeof strengths === 'string'
      ? strengths.split(',').map(s => s.trim())
      : ['Python Foundations', 'Data Analysis'];

    const weaknessesArr = Array.isArray(weaknesses)
      ? weaknesses
      : typeof weaknesses === 'string'
      ? weaknesses.split(',').map(s => s.trim())
      : ['SQL Window Functions', 'System Design'];

    await prisma.careerTwin.upsert({
      where: { userId },
      update: {
        strengths: safeJsonStringify(strengthsArr),
        weaknesses: safeJsonStringify(weaknessesArr),
        lastEventAt: new Date(),
      },
      create: {
        userId,
        strengths: safeJsonStringify(strengthsArr),
        weaknesses: safeJsonStringify(weaknessesArr),
        radarDimensions: safeJsonStringify({ technical: 55, domain: 45, practical: 40, projects: 35, communication: 70, interview: 40 }),
      },
    });

    // 6. Generate Roadmap directly based on student inputs
    const studentSkillsData = (currentSkills || []).map((s: any) => ({
      name: typeof s === 'string' ? s : s.name,
      effectiveLevel: typeof s === 'object' && s.level ? Number(s.level) * 0.5 : 1.0,
    }));

    const plan = graphRoadmapEngine.generateRoadmap({
      targetCareer: career,
      targetDomain: domain,
      weeklyHours: hours,
      trackType: 'STRONG',
      studentSkills: studentSkillsData,
    });

    // Archive old active roadmap
    await prisma.roadmap.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: { status: 'ARCHIVED' },
    });

    const newRoadmap = await prisma.roadmap.create({
      data: {
        userId,
        targetCareer: career,
        targetDomain: domain,
        trackType: 'STRONG',
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

    await careerTwinEngine.logEvent(userId, 'ONBOARDING_COMPLETED', {
      targetCareer: career,
      skillsCount: currentSkills?.length || 0,
    });

    res.json({
      data: {
        profile,
        roadmapId: newRoadmap.id,
        success: true,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
