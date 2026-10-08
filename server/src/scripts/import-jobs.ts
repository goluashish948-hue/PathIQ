import { generateSyntheticCorpus } from '../data/seedData.js';
import { prisma, safeJsonStringify } from '../db.js';

async function importJobs() {
  console.log('📥 Importing job postings into corpus...');
  const corpus = generateSyntheticCorpus();
  let count = 0;
  for (const [idx, jd] of corpus.entries()) {
    const textHash = `hash_import_${idx}_${jd.company.replace(/\s+/g, '')}`;
    const existing = await prisma.jobPosting.findFirst({ where: { textHash } });
    if (!existing) {
      await prisma.jobPosting.create({
        data: {
          title: jd.title,
          company: jd.company,
          source: 'admin_import',
          rawText: jd.rawText,
          textHash,
          seniority: jd.seniority,
          domain: jd.domain,
          extractedSkills: safeJsonStringify(jd.extractedSkills),
          licenseInfo: 'Public-Dataset',
          isSynthetic: true,
          postedAt: jd.postedAt,
        },
      });
      count++;
    }
  }
  console.log(`✅ Imported ${count} new job postings into corpus.`);
  await prisma.$disconnect();
}

importJobs();
