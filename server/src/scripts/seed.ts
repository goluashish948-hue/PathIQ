import bcrypt from 'bcryptjs';
import { prisma, safeJsonStringify } from '../db.js';
import { DOMAIN_PACKS } from '../data/domainPacks.js';
import {
  SKILL_RELATIONS_SEED,
  RESOURCE_LIBRARY_SEED,
  generateSyntheticCorpus,
  DEMO_STUDENTS_SEED,
} from '../data/seedData.js';
import { graphRoadmapEngine } from '../engines/graphRoadmapEngine.js';
import { careerTwinEngine } from '../engines/careerTwinEngine.js';

async function seed() {
  console.log('🌱 Starting PathIQ Database Seeding...');

  // 1. Seed Admin User
  const adminPass = await bcrypt.hash('AdminPass123!', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@pathiq.dev' },
    update: { role: 'ADMIN' },
    create: {
      email: 'admin@pathiq.dev',
      passwordHash: adminPass,
      name: 'System Administrator',
      role: 'ADMIN',
      emailVerified: true,
      ageConfirmed: true,
      isUnder18: false,
    },
  });
  console.log(`✅ Admin account initialized: ${adminUser.email}`);

  // 2. Seed Domains and Domain Packs (All 20 domains)
  console.log(`📦 Seeding 20 Domain Packs...`);
  for (const pack of DOMAIN_PACKS) {
    const domain = await prisma.domain.upsert({
      where: { code: pack.domainCode },
      update: {
        name: pack.domainName,
        description: pack.description,
        icon: pack.icon,
        skillsCount: pack.skills.length,
        rolesCount: pack.roles.length,
      },
      create: {
        code: pack.domainCode,
        name: pack.domainName,
        description: pack.description,
        icon: pack.icon,
        skillsCount: pack.skills.length,
        rolesCount: pack.roles.length,
      },
    });

    await prisma.domainPack.upsert({
      where: { id: `pack_${pack.domainCode}` },
      update: {
        packData: safeJsonStringify(pack),
        reviewedByAdmin: true,
      },
      create: {
        id: `pack_${pack.domainCode}`,
        domainId: domain.id,
        version: '1.0.0',
        packData: safeJsonStringify(pack),
        reviewedByAdmin: true,
      },
    });

    // Seed Skills for this Domain
    for (const sk of pack.skills) {
      await prisma.skill.upsert({
        where: { name: sk.name },
        update: {
          domainId: domain.id,
          description: sk.description,
          type: sk.type,
          level0Desc: sk.level0Desc,
          level1Desc: sk.level1Desc,
          level2Desc: sk.level2Desc,
          level3Desc: sk.level3Desc,
          level4Desc: sk.level4Desc,
        },
        create: {
          name: sk.name,
          domainId: domain.id,
          description: sk.description,
          type: sk.type,
          level0Desc: sk.level0Desc,
          level1Desc: sk.level1Desc,
          level2Desc: sk.level2Desc,
          level3Desc: sk.level3Desc,
          level4Desc: sk.level4Desc,
        },
      });
    }

    // Seed Roles for this Domain
    for (const rl of pack.roles) {
      await prisma.occupation.upsert({
        where: { title: rl.title },
        update: {
          domainId: domain.id,
          description: rl.description,
          seniorityLevels: safeJsonStringify(rl.seniorityLevels),
          relatedRoles: safeJsonStringify(rl.relatedRoles),
        },
        create: {
          title: rl.title,
          domainId: domain.id,
          description: rl.description,
          seniorityLevels: safeJsonStringify(rl.seniorityLevels),
          relatedRoles: safeJsonStringify(rl.relatedRoles),
        },
      });
    }
  }
  console.log(`✅ 20 Domain Packs seeded successfully.`);

  // 3. Seed Skill Relations & Transfer Factors
  console.log(`🔗 Seeding Skill Relations and Transfer Factors...`);
  for (const rel of SKILL_RELATIONS_SEED) {
    const fromSkill = await prisma.skill.findUnique({ where: { name: rel.fromSkill } });
    const toSkill = await prisma.skill.findUnique({ where: { name: rel.toSkill } });

    if (fromSkill && toSkill) {
      const relId = `rel_${fromSkill.id}_${toSkill.id}`;
      await prisma.skillRelation.upsert({
        where: { id: relId },
        update: {
          relationType: rel.relationType,
          transferFactor: rel.transferFactor,
        },
        create: {
          id: relId,
          fromSkillId: fromSkill.id,
          toSkillId: toSkill.id,
          relationType: rel.relationType,
          transferFactor: rel.transferFactor,
        },
      });
    }
  }
  console.log(`✅ Skill relations and transfer factors mapped.`);

  // 4. Seed Resource Library
  console.log(`📚 Seeding Vetted Learning Resource Library...`);
  for (const res of RESOURCE_LIBRARY_SEED) {
    await prisma.resourceLibrary.upsert({
      where: { url: res.url },
      update: {
        title: res.title,
        provider: res.provider,
        associatedSkills: safeJsonStringify(res.associatedSkills),
        isAdminApproved: true,
        isLinkValid: true,
      },
      create: {
        title: res.title,
        provider: res.provider,
        url: res.url,
        type: res.type,
        cost: res.cost,
        language: res.language,
        associatedSkills: safeJsonStringify(res.associatedSkills),
        level: res.level,
        estimatedTimeMin: res.estimatedTimeMin,
        isAdminApproved: true,
        isLinkValid: true,
      },
    });
  }
  console.log(`✅ Resource library initialized.`);

  // 5. Seed 320 Synthetic Job Postings for Corpus
  console.log(`📰 Seeding 320 Job Postings into Corpus...`);
  const corpus = generateSyntheticCorpus();
  for (const [idx, jd] of corpus.entries()) {
    const textHash = `hash_${idx}_${jd.company.replace(/\s+/g, '')}`;
    const existing = await prisma.jobPosting.findFirst({ where: { textHash } });
    if (!existing) {
      await prisma.jobPosting.create({
        data: {
          title: jd.title,
          company: jd.company,
          source: jd.source,
          rawText: jd.rawText,
          textHash,
          seniority: jd.seniority,
          domain: jd.domain,
          extractedSkills: safeJsonStringify(jd.extractedSkills),
          licenseInfo: 'CC0-Synthetic-Benchmark',
          isSynthetic: true,
          postedAt: jd.postedAt,
        },
      });
    }
  }
  console.log(`✅ Job market corpus ready with 320 postings.`);

  // 6. Seed 8 Demo Students
  console.log(`🎓 Seeding 8 Demo Student Profiles...`);
  const studentPass = await bcrypt.hash('StudentPass123!', 10);

  for (const ds of DEMO_STUDENTS_SEED) {
    const user = await prisma.user.upsert({
      where: { email: ds.email },
      update: { name: ds.name },
      create: {
        email: ds.email,
        passwordHash: studentPass,
        name: ds.name,
        role: ds.role,
        emailVerified: true,
        ageConfirmed: true,
        isUnder18: false,
      },
    });

    const profile = await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {
        targetCareer: ds.targetCareer,
        targetDomain: ds.targetDomain,
        educationLevel: ds.educationLevel,
        courseDegree: ds.courseDegree,
        yearSemester: ds.yearSemester,
        availableWeeklyHours: ds.availableWeeklyHours,
        learningPreference: ds.learningPreference,
      },
      create: {
        userId: user.id,
        targetCareer: ds.targetCareer,
        targetDomain: ds.targetDomain,
        educationLevel: ds.educationLevel,
        courseDegree: ds.courseDegree,
        yearSemester: ds.yearSemester,
        availableWeeklyHours: ds.availableWeeklyHours,
        learningPreference: ds.learningPreference,
      },
    });

    // Seed student skills
    for (const sk of ds.skills) {
      const dbSkill = await prisma.skill.findUnique({ where: { name: sk.name } });
      if (dbSkill) {
        await prisma.studentSkill.upsert({
          where: { id: `ss_${user.id}_${dbSkill.id}` },
          update: {
            declaredLevel: sk.declaredLevel,
            effectiveLevel: sk.effectiveLevel,
            verificationState: sk.verificationState,
            verifiedAt: new Date(),
          },
          create: {
            id: `ss_${user.id}_${dbSkill.id}`,
            profileId: profile.id,
            skillId: dbSkill.id,
            declaredLevel: sk.declaredLevel,
            effectiveLevel: sk.effectiveLevel,
            verificationState: sk.verificationState,
            verifiedAt: new Date(),
          },
        });
      }
    }

    // Generate Roadmap for Demo Fraud Student
    if (ds.email === 'fraud.student@pathiq.dev') {
      const plan = graphRoadmapEngine.generateRoadmap({
        targetCareer: ds.targetCareer,
        targetDomain: ds.targetDomain,
        weeklyHours: ds.availableWeeklyHours,
        trackType: 'STRONG',
      });

      const roadmap = await prisma.roadmap.upsert({
        where: { id: `rm_${user.id}` },
        update: {
          targetCareer: ds.targetCareer,
          targetDomain: ds.targetDomain,
          weeklyHours: ds.availableWeeklyHours,
          totalEstimatedHours: plan.totalEstimatedHours,
        },
        create: {
          id: `rm_${user.id}`,
          userId: user.id,
          targetCareer: ds.targetCareer,
          targetDomain: ds.targetDomain,
          weeklyHours: ds.availableWeeklyHours,
          totalEstimatedHours: plan.totalEstimatedHours,
          shareSlug: `fraud-ml-path-${user.id.slice(0, 6)}`,
        },
      });

      await prisma.roadmapNode.deleteMany({ where: { roadmapId: roadmap.id } });
      await prisma.roadmapEdge.deleteMany({ where: { roadmapId: roadmap.id } });

      for (const [index, n] of plan.nodes.entries()) {
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

      for (const e of plan.edges) {
        await prisma.roadmapEdge.create({
          data: {
            roadmapId: roadmap.id,
            sourceNodeKey: e.sourceNodeKey,
            targetNodeKey: e.targetNodeKey,
          },
        });
      }

      // Record baseline quiz and twin events
      await prisma.quizAttempt.create({
        data: {
          userId: user.id,
          nodeKey: 'python_foundations',
          topicKey: 'python_oop_profiling',
          difficulty: 'INTERMEDIATE',
          score: 8,
          totalQuestions: 10,
          percentage: 80,
          passed: true,
          answersPayload: safeJsonStringify({ answers: '8/10 verified' }),
        },
      });

      // Recalculate twin
      await careerTwinEngine.recalculateTwin(user.id);
    }
  }
  console.log(`✅ 8 Demo Students seeded successfully.`);

  console.log(`
======================================================
🎉 SEED COMPLETE! DEMO LOGINS:
======================================================
1. ADMIN ACCOUNT:
   Email:    admin@pathiq.dev
   Password: AdminPass123!

2. DEMO STUDENT (Fraud Detection ML Engineer - 10h/week):
   Email:    fraud.student@pathiq.dev
   Password: StudentPass123!

3. OTHER DEMO STUDENTS:
   - Data Scientist:          data.scientist@pathiq.dev
   - Robotics Engineer:       robotics.engineer@pathiq.dev
   - Healthcare Analyst:      health.analyst@pathiq.dev
   - Corporate Counsel:       corp.counsel@pathiq.dev
   - Investment Banking:      ib.analyst@pathiq.dev
   - UI/UX Designer:          uiux.designer@pathiq.dev
   - Sports Data Analyst:     sports.analyst@pathiq.dev
   (All students password: StudentPass123!)
======================================================
`);
}

seed()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
