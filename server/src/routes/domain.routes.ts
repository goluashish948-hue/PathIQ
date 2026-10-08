import { Router, Request, Response } from 'express';
import { DOMAIN_PACKS } from '../data/domainPacks.js';

const router = Router();

router.get('/packs', (req: Request, res: Response) => {
  const packs = DOMAIN_PACKS.map(p => ({
    domainCode: p.domainCode,
    domainName: p.domainName,
    description: p.description,
    icon: p.icon,
    skillsCount: p.skills.length,
    rolesCount: p.roles.length,
    radarWeights: p.radarWeights,
    safetyNotes: p.safetyNotes,
  }));
  res.json({ data: packs });
});

router.get('/packs/:domainCode', (req: Request, res: Response) => {
  const pack = DOMAIN_PACKS.find(p => p.domainCode === req.params.domainCode);
  if (!pack) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Domain pack not found.' } });
    return;
  }
  res.json({ data: pack });
});

export default router;
