const envApiUrl = (import.meta as any).env?.VITE_API_URL;
const API_BASE = envApiUrl ? `${envApiUrl.replace(/\/$/, '')}/api/v1` : '/api/v1';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('pathiq_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || 'Request failed');
  }
  return data.data;
}

export const api = {
  // Auth
  async signup(payload: any) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<{ token: string; user: any }>(res);
  },

  async login(payload: any) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<{ token: string; user: any }>(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  // Student Profile & Onboarding
  async getProfile() {
    const res = await fetch(`${API_BASE}/profile`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  async updateProfile(payload: any) {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return handleResponse<any>(res);
  },

  async addEducation(payload: any) {
    const res = await fetch(`${API_BASE}/profile/education`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return handleResponse<any>(res);
  },

  async deleteEducation(id: string) {
    const res = await fetch(`${API_BASE}/profile/education/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  async addExperience(payload: any) {
    const res = await fetch(`${API_BASE}/profile/experience`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return handleResponse<any>(res);
  },

  async deleteExperience(id: string) {
    const res = await fetch(`${API_BASE}/profile/experience/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  async addCertification(payload: any) {
    const res = await fetch(`${API_BASE}/profile/certification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return handleResponse<any>(res);
  },

  async deleteCertification(id: string) {
    const res = await fetch(`${API_BASE}/profile/certification/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  async addProject(payload: any) {
    const res = await fetch(`${API_BASE}/profile/project`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return handleResponse<any>(res);
  },

  async deleteProject(id: string) {
    const res = await fetch(`${API_BASE}/profile/project/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  async addSkill(payload: any) {
    const res = await fetch(`${API_BASE}/profile/skill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return handleResponse<any>(res);
  },

  async deleteSkill(id: string) {
    const res = await fetch(`${API_BASE}/profile/skill/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  async submitOnboarding(payload: any) {
    const res = await fetch(`${API_BASE}/profile/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return handleResponse<any>(res);
  },

  // Goals
  async analyzeGoal(goalText: string) {
    const res = await fetch(`${API_BASE}/goals/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goalText }),
    });
    return handleResponse<any>(res);
  },

  // Discovery
  async getDiscoveryQuestions() {
    const res = await fetch(`${API_BASE}/discovery/questions`);
    return handleResponse<any>(res);
  },

  async evaluateDiscovery(answers: Record<string, string>) {
    const res = await fetch(`${API_BASE}/discovery/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    return handleResponse<any>(res);
  },

  // Domains
  async getDomainPacks() {
    const res = await fetch(`${API_BASE}/domains/packs`);
    return handleResponse<any[]>(res);
  },

  async getDomainPack(code: string) {
    const res = await fetch(`${API_BASE}/domains/packs/${code}`);
    return handleResponse<any>(res);
  },

  // Job DNA
  async getJobDna(role?: string) {
    const q = role ? `?role=${encodeURIComponent(role)}` : '';
    const res = await fetch(`${API_BASE}/job-dna/profile${q}`);
    return handleResponse<any>(res);
  },

  async analyzeJd(rawText: string, roleTitle?: string) {
    const res = await fetch(`${API_BASE}/job-dna/analyze-jd`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText, roleTitle }),
    });
    return handleResponse<any>(res);
  },

  // Gap & Reality Check
  async calculateGap(targetRole?: string, studentSkills?: any[]) {
    const res = await fetch(`${API_BASE}/gap/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetRole, studentSkills }),
    });
    return handleResponse<any>(res);
  },

  // Roadmap
  async generateRoadmap(payload: any) {
    const res = await fetch(`${API_BASE}/roadmaps/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return handleResponse<any>(res);
  },

  async getActiveRoadmap() {
    const res = await fetch(`${API_BASE}/roadmaps/active`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  async updateNodeStatus(nodeKey: string, status: string) {
    const res = await fetch(`${API_BASE}/roadmaps/nodes/${nodeKey}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status }),
    });
    return handleResponse<any>(res);
  },

  // Planning, ROI, Opportunity Cost
  async getSkillRoi(skill = 'SQL', effort = 16, gap = 2.2) {
    const res = await fetch(`${API_BASE}/planning/roi?skill=${encodeURIComponent(skill)}&effort=${effort}&gap=${gap}`);
    return handleResponse<any>(res);
  },

  async simulateOpportunityCost(skillA = 'SQL', skillB = 'AWS', hours = 20) {
    const res = await fetch(`${API_BASE}/planning/opportunity-cost`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillA, skillB, hours }),
    });
    return handleResponse<any>(res);
  },

  async getCareerBranches() {
    const res = await fetch(`${API_BASE}/planning/branching`);
    return handleResponse<{ branches: any[] }>(res);
  },

  async compareRoutes(roleA: string, roleB: string) {
    const res = await fetch(`${API_BASE}/planning/compare-routes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleA, roleB }),
    });
    return handleResponse<any>(res);
  },

  // Learn
  async getTopicContent(topicKey: string) {
    const res = await fetch(`${API_BASE}/learn/topic/${encodeURIComponent(topicKey)}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  async getActiveLearningTopics() {
    const res = await fetch(`${API_BASE}/learn/active-topics`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any[]>(res);
  },

  async completeLearningTopic(topicKey: string, title?: string) {
    const res = await fetch(`${API_BASE}/learn/complete-topic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ topicKey, title }),
    });
    return handleResponse<any>(res);
  },

  // Quiz
  async generateQuiz(topicKey: string, difficulty = 'INTERMEDIATE') {
    const res = await fetch(
      `${API_BASE}/quiz/generate?topicKey=${encodeURIComponent(topicKey)}&difficulty=${difficulty}`,
      { headers: { ...getAuthHeader() } }
    );
    return handleResponse<any>(res);
  },

  async submitQuiz(payload: any) {
    const res = await fetch(`${API_BASE}/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return handleResponse<any>(res);
  },

  async getMastery() {
    const res = await fetch(`${API_BASE}/quiz/mastery`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  // Proof & Sandbox
  async getProofTemplates() {
    const res = await fetch(`${API_BASE}/proof/templates`);
    return handleResponse<any[]>(res);
  },

  async submitSqlProof(queries: string) {
    const res = await fetch(`${API_BASE}/proof/submit-sql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ queries }),
    });
    return handleResponse<any>(res);
  },

  // Dashboard
  async getDashboardMetrics() {
    const res = await fetch(`${API_BASE}/dashboard/metrics`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  // Replan & What-If
  async previewReplan(triggerReason = 'MISSED_2_WEEKS', newWeeklyHours?: number) {
    const res = await fetch(`${API_BASE}/replan/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ triggerReason, newWeeklyHours }),
    });
    return handleResponse<any>(res);
  },

  async adoptReplan(diffId: string) {
    const res = await fetch(`${API_BASE}/replan/adopt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ diffId }),
    });
    return handleResponse<any>(res);
  },

  async simulateWhatIf(type: string, paramValue: any) {
    const res = await fetch(`${API_BASE}/replan/what-if`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, paramValue }),
    });
    return handleResponse<any>(res);
  },

  async getMarketAlerts() {
    const res = await fetch(`${API_BASE}/replan/market-alerts`);
    return handleResponse<{ alerts: any[] }>(res);
  },

  // Mentor Chat
  async getMentorMessages() {
    const res = await fetch(`${API_BASE}/mentor/messages`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any[]>(res);
  },

  async sendMentorMessage(text: string) {
    const res = await fetch(`${API_BASE}/mentor/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ text }),
    });
    return handleResponse<any>(res);
  },

  // Interview
  async getInterviewQuestions() {
    const res = await fetch(`${API_BASE}/interview/questions`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  async evaluateInterviewTurn(
    turnIndex: number,
    candidateResponse: string,
    questionText?: string,
    studentContext?: any
  ) {
    const res = await fetch(`${API_BASE}/interview/evaluate-turn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ turnIndex, candidateResponse, questionText, studentContext }),
    });
    return handleResponse<any>(res);
  },

  async getReadinessProfile() {
    const res = await fetch(`${API_BASE}/interview/readiness-profile`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  // Resume & Portfolio
  async generateResume(targetCareer?: string) {
    const q = targetCareer ? `?targetCareer=${encodeURIComponent(targetCareer)}` : '';
    const res = await fetch(`${API_BASE}/resume/generate${q}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  async testAts(resume: any) {
    const res = await fetch(`${API_BASE}/resume/ats-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume }),
    });
    return handleResponse<any>(res);
  },

  async saveResumeVersion(versionName: string, resumePayload: any) {
    const res = await fetch(`${API_BASE}/resume/save-version`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ versionName, resumePayload }),
    });
    return handleResponse<any>(res);
  },

  async getMyPortfolio() {
    const res = await fetch(`${API_BASE}/portfolio/my-portfolio`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  async updatePortfolioSettings(payload: any) {
    const res = await fetch(`${API_BASE}/portfolio/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return handleResponse<any>(res);
  },

  async getPublicPortfolio(slug: string) {
    const res = await fetch(`${API_BASE}/portfolio/public/${slug}`);
    return handleResponse<any>(res);
  },

  // Daily Plan & Study Tracking
  async getTodayPlan(minutes = 120) {
    const res = await fetch(`${API_BASE}/daily-plan/today?minutes=${minutes}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  async updateDailyBlock(payload: any) {
    const res = await fetch(`${API_BASE}/daily-plan/update-block`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return handleResponse<any>(res);
  },

  async addDailyTask(payload: any) {
    const res = await fetch(`${API_BASE}/daily-plan/add-task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return handleResponse<any>(res);
  },

  async deleteDailyBlock(id: string) {
    const res = await fetch(`${API_BASE}/daily-plan/delete-block/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  async saveDailyPerformance(payload: any) {
    const res = await fetch(`${API_BASE}/daily-plan/save-performance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return handleResponse<any>(res);
  },

  async getDailyHistory() {
    const res = await fetch(`${API_BASE}/daily-plan/history`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  async getDailyRecommendations() {
    const res = await fetch(`${API_BASE}/daily-plan/recommendations`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  // Admin
  async getAdminOverview() {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  async getAdminUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any[]>(res);
  },

  async getAdminResources() {
    const res = await fetch(`${API_BASE}/admin/resources`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any[]>(res);
  },

  async runAdminLinkCheck() {
    const res = await fetch(`${API_BASE}/admin/check-links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },
};
