const API_BASE = '/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('kodic_jwt_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || 'API Request Failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  auth: {
    login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    quickLogin: (role) => request('/auth/quick-login', { method: 'POST', body: JSON.stringify({ role }) }),
    me: () => request('/auth/me'),
    updateIntelligenceRole: (intelligenceRole) => request('/auth/profile/intelligence-role', { method: 'PUT', body: JSON.stringify({ intelligenceRole }) }),
    getPrivacyPolicy: () => request('/auth/privacy-policy')
  },
  classes: {
    getCurrent: () => request('/classes/current'),
    create: (classData) => request('/classes', { method: 'POST', body: JSON.stringify(classData) }),
    join: (code) => request('/classes/join', { method: 'POST', body: JSON.stringify({ code }) }),
    updateOnboarding: (classId, level) => request(`/classes/${classId}/onboarding`, { method: 'PUT', body: JSON.stringify({ level }) })
  },
  groups: {
    getShared: () => request('/groups/shared'),
    rotateDevice: (groupId) => request('/groups/rotate-device', { method: 'POST', body: JSON.stringify({ groupId }) }),
    getAll: () => request('/groups/all'),
    create: (groupData) => request('/groups', { method: 'POST', body: JSON.stringify(groupData) }),
    approve: (groupId) => request(`/groups/${groupId}/approve`, { method: 'PUT' })
  },
  quizzes: {
    getAll: () => request('/quizzes'),
    submit: (quizId, selectedIndex) => request('/quizzes/submit', { method: 'POST', body: JSON.stringify({ quizId, selectedIndex }) }),
    generateAi: (bnccCode, subject) => request('/quizzes/generate-ai', { method: 'POST', body: JSON.stringify({ bnccCode, subject }) }),
    getBnccCatalog: () => request('/quizzes/bncc-catalog'),
    publish: (quizData) => request('/quizzes', { method: 'POST', body: JSON.stringify(quizData) })
  },
  content: {
    getNotebooks: () => request('/content/notebooks'),
    uploadNotebook: (notebookData) => request('/content/notebooks', { method: 'POST', body: JSON.stringify(notebookData) }),
    getModerationQueue: () => request('/content/moderation'),
    approveModeration: (itemId) => request(`/content/moderation/${itemId}/approve`, { method: 'PUT' }),
    getImpactNotifications: () => request('/content/impact'),
    getHeatmap: () => request('/content/heatmap'),
    getAnnouncements: () => request('/content/announcements'),
    createAnnouncement: (annData) => request('/content/announcements', { method: 'POST', body: JSON.stringify(annData) })
  }
};
