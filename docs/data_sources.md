# Data Sources, Licensing & Domain Packs

## 1. Data Sources
- **Job Corpus**: 320 synthetic anonymized job postings modeled after FinTech fraud and ML engineering roles (CC0 license).
- **Taxonomy**: 20 domain packs covering Technology, Engineering, Healthcare, Law, Finance, Business, Civil Services, Design, Science, Education, Marketing, Media, Aviation, Hospitality, Sports, Entertainment, Agriculture, Biotech, Entrepreneurship, and Custom careers.
- **Resource Library**: Curated free educational resources (Coursera, Kaggle, Python Software Foundation, Mode Analytics, PyTorch).

## 2. Authoring New Domain Packs
To create a new domain pack:
1. Define unique `domainCode`, `domainName`, and `radarWeights`.
2. Provide at least 30 skill definitions with descriptors for levels 0–4.
3. Define typical roles, milestones, and assessment proof templates.
4. Run validation: `npm run validate:packs`.
