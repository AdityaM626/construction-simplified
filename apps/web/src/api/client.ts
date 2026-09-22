const API_BASE_URL = 'http://localhost:4000/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('construction_os_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('construction_os_token', token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('construction_os_token');
};

export const apiFetch = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || `HTTP ${response.status} error`);
  }

  return response.json();
};

export const api = {
  // Auth
  login: (email: string, password?: string, role?: string) =>
    apiFetch<{ user: any; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, role }) }),
  register: (data: any) =>
    apiFetch<{ user: any; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
  getMe: () => apiFetch('/auth/me'),

  // File Storage Upload
  uploadFile: (fileName: string, fileData: string) =>
    apiFetch<{ fileUrl: string; fileName: string; sizeBytes: number }>('/upload', { method: 'POST', body: JSON.stringify({ fileName, fileData }) }),

  // Project API
  getHealth: (projectId: string) => apiFetch(`/projects/${projectId}/health`),
  getBOQ: (projectId: string) => apiFetch(`/projects/${projectId}/boq`),
  addBOQItem: (projectId: string, item: any) => apiFetch(`/projects/${projectId}/boq`, { method: 'POST', body: JSON.stringify(item) }),
  getMilestones: (projectId: string) => apiFetch(`/projects/${projectId}/milestones`),
  approveMilestone: (projectId: string, milestoneId: string) => apiFetch(`/projects/${projectId}/milestones/${milestoneId}/approve`, { method: 'POST' }),
  getBudgetVsActual: (projectId: string) => apiFetch(`/projects/${projectId}/budget-vs-actual`),
  getDailyReports: (projectId: string) => apiFetch(`/projects/${projectId}/daily-reports`),
  submitDailyReport: (projectId: string, report: any) => apiFetch(`/projects/${projectId}/daily-reports`, { method: 'POST', body: JSON.stringify(report) }),
  getChangeRequests: (projectId: string) => apiFetch(`/projects/${projectId}/change-requests`),
  createChangeRequest: (projectId: string, data: any) => apiFetch(`/projects/${projectId}/change-requests`, { method: 'POST', body: JSON.stringify(data) }),
  approveChangeRequest: (projectId: string, reqId: string) => apiFetch(`/projects/${projectId}/change-requests/${reqId}/approve`, { method: 'POST' }),
  getDefects: (projectId: string) => apiFetch(`/projects/${projectId}/defects`),
  createDefect: (projectId: string, data: any) => apiFetch(`/projects/${projectId}/defects`, { method: 'POST', body: JSON.stringify(data) }),
  verifyDefect: (projectId: string, defectId: string) => apiFetch(`/projects/${projectId}/defects/${defectId}/verify`, { method: 'POST' }),
  getDocuments: (projectId: string) => apiFetch(`/projects/${projectId}/documents`),
  uploadDocumentRecord: (projectId: string, doc: any) => apiFetch(`/projects/${projectId}/documents`, { method: 'POST', body: JSON.stringify(doc) }),
  getMessages: (entityType: string, entityId: string) => apiFetch(`/messages/${entityType}/${entityId}`),
  sendMessage: (data: any) => apiFetch('/messages', { method: 'POST', body: JSON.stringify(data) })
};
