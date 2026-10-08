# PathIQ Scoring Formulas & Mathematical Specifications

## 1. Effective Skill Level Formula (Part 6.2)
To differentiate between self-declared claims and verified abilities:
$$\text{Effective Level} = \text{Declared or Assessed Level} \times W_{\text{verification}}$$

Where $W_{\text{verification}}$ is defined as:
- **Self-Reported**: $0.5$
- **Assessed (Passed Quiz Bank)**: $0.8$
- **Evidence-Backed (Practical Proof / Sandbox / Project Verified)**: $1.0$

## 2. Overall Career Readiness Formula (Part 12.1)
Readiness is computed as a transparent weighted sum of 6 domain-tailored dimensions:
$$\text{Readiness} = w_{\text{tech}} S_{\text{tech}} + w_{\text{domain}} S_{\text{domain}} + w_{\text{pract}} S_{\text{pract}} + w_{\text{proj}} S_{\text{proj}} + w_{\text{comm}} S_{\text{comm}} + w_{\text{interview}} S_{\text{interview}}$$

For Technology & IT:
- $w_{\text{tech}} = 0.30$
- $w_{\text{domain}} = 0.15$
- $w_{\text{pract}} = 0.25$
- $w_{\text{proj}} = 0.15$
- $w_{\text{comm}} = 0.08$
- $w_{\text{interview}} = 0.07$

## 3. Skill ROI Formula (Part 9.3)
$$\text{ROI} = \frac{\text{Importance Weight} \times \text{Gap Size} \times \text{Unlock Value} \times \text{Transferability} \times \text{Career Impact}}{\text{Effort Hours}}$$

- **Importance Weight**: Must Have = 3, Good To Have = 2, Differentiator = 1
- **Unlock Value**: Count of downstream DAG nodes directly unblocked
- **Transferability**: $0.5 - 1.0$ factor from ontology relations
- **Career Impact**: $1.0 - 5.0$

## 4. Topic Mastery & Spaced Revision Formula (Part 11.4)
$$\text{Mastery} = \frac{\sum_{i=1}^n \text{Score}_i \times W_{\text{diff}, i} \times 0.5^{(\text{DaysAgo}_i / 30)}}{\sum_{i=1}^n W_{\text{diff}, i} \times 0.5^{(\text{DaysAgo}_i / 30)}}$$
- **Difficulty Weights**: Beginner = $0.7$, Intermediate = $1.0$, Advanced = $1.3$
- **Half-life**: 30 days
- **Mastered Threshold**: $\ge 75\%$
- **Spaced Revision Schedule**: 3 days, 7 days, 21 days.
