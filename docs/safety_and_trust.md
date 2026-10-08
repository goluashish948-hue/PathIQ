# Safety, Trust & Hallucination Prevention Specifications

## 1. Non-Negotiable Principles
- **P1: Reliable AI Pipeline**: Inputs are sanitized, outputs are parsed with Zod schemas, validated against business logic, and persisted before reaching the client.
- **P2: No Fabrication Enforcement**: The system strictly refuses to manufacture job placement guarantees, salary figures without citations, student metrics, or unverified achievements.
- **P3: Evidence-First**: Recommendations require `Why + Evidence + Confidence`. Confidence is calculated mathematically from evidence count and agreement scores ($0.0 - 1.0$).
- **P4: Constructive Honesty**: Reality checks provide honest gap analysis and intermediate stepping stone milestones rather than false flattery.
- **P5: Verified vs Self-Reported**: Resumes strictly flag self-reported items and exclude them from verified technical skills blocks.
- **P6: Student Confirmation**: The AI proposes schedule changes; the student confirms via a visual diff before any mutation occurs.
- **P7: Universal Engine**: One engine serves all 20 domain packs.

## 2. Adversarial Injection Defenses
- Candidate and user-supplied strings are scanned for system prompt overriding triggers.
- Injections are logged in `SafetyEvent` and sanitized.
- All URL links are strictly stripped unless present in the admin-approved `ResourceLibrary`.
