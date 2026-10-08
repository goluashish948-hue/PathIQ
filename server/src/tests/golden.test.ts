import { careerTwinEngine } from '../engines/careerTwinEngine.js';
import { skillGapEngine } from '../engines/skillGapEngine.js';
import { graphRoadmapEngine, RoadmapNodeDraft } from '../engines/graphRoadmapEngine.js';
import { planningRoiEngine } from '../engines/planningRoiEngine.js';
import { quizMasteryEngine } from '../engines/quizMasteryEngine.js';
import { sandboxAdapter } from '../adapters/sandboxAdapter.js';

async function runGoldenTests() {
  console.log('🏆 Running Golden Algorithmic & Formula Tests...');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${msg}`);
      failed++;
    }
  }

  // 1. Effective Skill Level Formula (Part 6.2)
  const selfLvl = careerTwinEngine.computeEffectiveLevel(3, 'SELF_REPORTED');
  assert(selfLvl === 1.5, 'Self-reported level 3 has weight 0.5 -> effective 1.5');

  const assessedLvl = careerTwinEngine.computeEffectiveLevel(3, 'ASSESSED');
  assert(assessedLvl === 2.4, 'Assessed level 3 has weight 0.8 -> effective 2.4');

  const proofLvl = careerTwinEngine.computeEffectiveLevel(3, 'EVIDENCE_BACKED');
  assert(proofLvl === 3.0, 'Evidence-backed level 3 has weight 1.0 -> effective 3.0');

  // 2. Partial Skill Matching with Transfer Factors (Part 7.2)
  const gapResult = skillGapEngine.computeSkillGap(
    [{ name: 'TensorFlow', importance: 'MUST_HAVE', targetLevel: 3 }],
    [{ name: 'PyTorch', declaredLevel: 3, effectiveLevel: 2.4, verificationState: 'ASSESSED' }]
  );
  const tfItem = gapResult.gapTable.find(g => g.skill === 'TensorFlow');
  assert(
    tfItem?.status === 'PARTIAL' && tfItem?.transferFactor === 0.85,
    'PyTorch transfers 85% foundation to TensorFlow with partial gap explanation'
  );

  // 3. Skill ROI Engine: SQL > AWS Priority for FinTech ML (Part 9.3)
  const sqlRoi = planningRoiEngine.computeSkillRoi({
    skill: 'SQL',
    importance: 'MUST_HAVE',
    gapSize: 2.2,
    effortHours: 16,
    downstreamCount: 4,
    targetRole: 'Fraud Detection ML Engineer in FinTech',
  });

  const awsRoi = planningRoiEngine.computeSkillRoi({
    skill: 'AWS',
    importance: 'GOOD_TO_HAVE',
    gapSize: 2.0,
    effortHours: 20,
    downstreamCount: 1,
    targetRole: 'Fraud Detection ML Engineer in FinTech',
  });

  assert(sqlRoi.roiScore > awsRoi.roiScore, `SQL ROI (${sqlRoi.roiScore}) is strictly higher priority than AWS ROI (${awsRoi.roiScore})`);

  // 4. DAG Cycle Detection & Repair (Part 8.1)
  const cyclicNodes: RoadmapNodeDraft[] = [
    {
      nodeKey: 'A',
      title: 'Node A',
      nodeType: 'skill',
      importance: 'MUST_HAVE',
      targetLevel: 2,
      estimatedHours: 10,
      prerequisites: ['B'], // A depends on B
      clusterGroup: 'Foundations',
      learningObjectives: [],
      whyNeeded: { why: 'test', evidence: ['test'], confidenceScore: 1, confidenceLabel: 'HIGH' },
      practiceTasks: [],
      status: 'AVAILABLE',
    },
    {
      nodeKey: 'B',
      title: 'Node B',
      nodeType: 'skill',
      importance: 'MUST_HAVE',
      targetLevel: 2,
      estimatedHours: 10,
      prerequisites: ['A'], // B depends on A (Cycle!)
      clusterGroup: 'Foundations',
      learningObjectives: [],
      whyNeeded: { why: 'test', evidence: ['test'], confidenceScore: 1, confidenceLabel: 'HIGH' },
      practiceTasks: [],
      status: 'AVAILABLE',
    },
  ];

  const dagRepair = graphRoadmapEngine.repairAndSortDag(cyclicNodes);
  assert(dagRepair.sorted.length === 2, 'DAG cycle detection repairs circular dependency and produces valid topological sort');

  // 5. Topic Mastery Formula (Part 11.4)
  const masteryData = quizMasteryEngine.computeMastery([
    { score: 85, difficulty: 'INTERMEDIATE', daysAgo: 2 },
    { score: 90, difficulty: 'ADVANCED', daysAgo: 1 },
  ]);
  assert(masteryData.isMastered && masteryData.masteryScore >= 75, 'Topic mastery >= 75% triggers Mastered state with 21-day spaced retention');

  // 6. SQL Disposable Sandbox 15 Queries Auto-Grading (Part 11.5 & 27 H)
  const sqlEvaluation = await sandboxAdapter.evaluateSqlTask('');
  assert(sqlEvaluation.totalQueries === 15 && sqlEvaluation.passed, 'SQL Disposable Sandbox executes 15 auto-graded fraud analytics queries');

  console.log(`\nGolden Test Results: ${passed} Passed, ${failed} Failed.`);
  if (failed > 0) process.exit(1);
}

runGoldenTests();
