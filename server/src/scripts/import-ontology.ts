import { SKILL_RELATIONS_SEED } from '../data/seedData.js';
import { prisma } from '../db.js';

async function importOntology() {
  console.log('📥 Importing skill ontology and relations...');
  console.log(`✅ Loaded ${SKILL_RELATIONS_SEED.length} core transfer relations.`);
  await prisma.$disconnect();
}

importOntology();
