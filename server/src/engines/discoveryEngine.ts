export interface DiscoveryQuestion {
  id: string;
  category: 'interests' | 'strengths' | 'work_style' | 'creativity' | 'analytical' | 'interaction' | 'priorities';
  question: string;
  options: Array<{
    id: string;
    text: string;
    weights: Record<string, number>; // maps to career role scores
  }>;
}

export interface CareerSuggestion {
  roleTitle: string;
  domain: string;
  matchScore: number; // 0-100
  matchFactors: string[];
  mismatchFactors: string[];
  uncertaintyNotes: string;
  statusLabel: string; // e.g. "Strongly worth exploring"
}

export const DISCOVERY_QUESTIONS: DiscoveryQuestion[] = [
  {
    id: 'q1',
    category: 'analytical',
    question: 'How do you feel about uncovering hidden patterns inside massive spreadsheets or datasets?',
    options: [
      { id: 'q1_a', text: 'I love finding anomalies, calculating statistics, and proving hypotheses.', weights: { 'Fraud Detection ML Engineer in FinTech': 3, 'Data Scientist': 3, 'Healthcare Data Analyst': 2 } },
      { id: 'q1_b', text: 'I prefer visual and aesthetic balance rather than raw numbers.', weights: { 'UI/UX Product Designer': 3, 'Film Editor & Post-Production Specialist': 3 } },
      { id: 'q1_c', text: 'I prefer building physical machines or robotics.', weights: { 'Robotics Control Systems Engineer': 3 } },
      { id: 'q1_d', text: 'I prefer analyzing rules, policies, contracts, and governance.', weights: { 'Corporate Legal Counsel': 3, 'Civil Services Officer / Policy Analyst': 3 } },
    ],
  },
  {
    id: 'q2',
    category: 'creativity',
    question: 'When starting a new project, what excites you the most?',
    options: [
      { id: 'q2_a', text: 'Designing the user journey, visual wireframes, and interactive experiences.', weights: { 'UI/UX Product Designer': 3 } },
      { id: 'q2_b', text: 'Writing predictive algorithms that outsmart malicious actors or forecast trends.', weights: { 'Fraud Detection ML Engineer in FinTech': 3, 'Machine Learning Engineer': 3 } },
      { id: 'q2_c', text: 'Drafting structured arguments or negotiating high-stakes agreements.', weights: { 'Corporate Legal Counsel': 3, 'Investment Banking Analyst': 2 } },
      { id: 'q2_d', text: 'Launching a new venture and organizing resources to solve customer pain points.', weights: { 'Startup Founder / Venture Builder': 3, 'Product Manager': 2 } },
    ],
  },
  {
    id: 'q3',
    category: 'priorities',
    question: 'What is your primary career priority over the next 3-5 years?',
    options: [
      { id: 'q3_a', text: 'Deep technical craftsmanship and high-leverage algorithmic impact.', weights: { 'Fraud Detection ML Engineer in FinTech': 2, 'Machine Learning Engineer': 3 } },
      { id: 'q3_b', text: 'Shaping public policy and direct societal welfare administration.', weights: { 'Civil Services Officer / Policy Analyst': 3 } },
      { id: 'q3_c', text: 'Fast-paced financial deal execution and enterprise valuation.', weights: { 'Investment Banking Analyst': 3 } },
      { id: 'q3_d', text: 'Creative freedom, visual storytelling, and user delight.', weights: { 'UI/UX Product Designer': 3, 'Film Editor & Post-Production Specialist': 2 } },
    ],
  },
  {
    id: 'q4',
    category: 'work_style',
    question: 'What kind of daily environment brings out your best performance?',
    options: [
      { id: 'q4_a', text: 'Collaborating in cross-functional agile teams between engineering and design.', weights: { 'Product Manager': 3, 'UI/UX Product Designer': 2 } },
      { id: 'q4_b', text: 'Independent deep-work coding, training models, and debugging performance.', weights: { 'Fraud Detection ML Engineer in FinTech': 3, 'Machine Learning Engineer': 3 } },
      { id: 'q4_c', text: 'Fast-moving client meetings, financial analysis, and deck preparation.', weights: { 'Investment Banking Analyst': 3, 'Growth Marketing Manager': 2 } },
      { id: 'q4_d', text: 'Synthesizing evidence-based literature and conducting methodical experiments.', weights: { 'Healthcare Data Analyst': 3 } },
    ],
  },
];

export class DiscoveryEngine {
  public evaluateResponses(answers: Record<string, string>): {
    suggestions: CareerSuggestion[];
    driverExplanation: string;
  } {
    const scores: Record<string, number> = {
      'Fraud Detection ML Engineer in FinTech': 0,
      'Data Scientist': 0,
      'UI/UX Product Designer': 0,
      'Product Manager': 0,
      'Investment Banking Analyst': 0,
      'Civil Services Officer / Policy Analyst': 0,
      'Robotics Control Systems Engineer': 0,
      'Healthcare Data Analyst': 0,
      'Startup Founder / Venture Builder': 0,
    };

    const drivers: string[] = [];

    for (const q of DISCOVERY_QUESTIONS) {
      const selectedOptionId = answers[q.id];
      if (selectedOptionId) {
        const opt = q.options.find(o => o.id === selectedOptionId);
        if (opt) {
          drivers.push(`Selection: "${opt.text.slice(0, 40)}..."`);
          for (const [role, weight] of Object.entries(opt.weights)) {
            scores[role] = (scores[role] || 0) + weight;
          }
        }
      }
    }

    // Sort by score
    const sortedRoles = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const suggestions: CareerSuggestion[] = sortedRoles.map(([role, score]) => {
      const normalizedScore = Math.min(95, Math.round((score / 8) * 100) || 65);
      return {
        roleTitle: role,
        domain: role.includes('ML') || role.includes('Data') || role.includes('Product') || role.includes('UI') ? 'Technology & IT' : 'Specialized Professional',
        matchScore: normalizedScore,
        statusLabel: 'Worth exploring (evidence-aligned)',
        matchFactors: [
          'High correlation with your preference for structured problem solving and algorithmic reasoning.',
          'Aligns with your indicated work style and impact preferences.',
        ],
        mismatchFactors: [
          'Requires sustained commitment to quantitative practice and portfolio verification.',
        ],
        uncertaintyNotes: 'Calculated from 4 questionnaire signals. Exploring the Job DNA and reviewing real job descriptions will refine your route.',
      };
    });

    return {
      suggestions,
      driverExplanation: `Your suggestions were primarily driven by your answers indicating interest in: ${drivers.slice(0, 2).join('; ')}.`,
    };
  }
}

export const discoveryEngine = new DiscoveryEngine();
