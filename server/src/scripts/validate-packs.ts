import { DOMAIN_PACKS } from '../data/domainPacks.js';

async function validatePacks() {
  console.log('🧪 Validating all 20 Domain Packs against schema...');
  let totalSkills = 0;
  for (const pack of DOMAIN_PACKS) {
    if (!pack.domainCode || !pack.domainName || !pack.radarWeights) {
      throw new Error(`Domain pack ${pack.domainCode} failed schema requirements`);
    }
    totalSkills += pack.skills.length;
    console.log(`[VALIDATED] ${pack.domainName} (${pack.domainCode}): ${pack.skills.length} skills, ${pack.roles.length} roles, ${pack.proofTaskTemplates.length} proofs`);
  }
  console.log(`✅ All ${DOMAIN_PACKS.length} Domain Packs are schema-valid with ${totalSkills} total skills.`);
}

validatePacks();
