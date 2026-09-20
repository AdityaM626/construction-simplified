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
  login: (email: string, role?: string) => apiFetch<{ user: any; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, role }) }),
  register: (data: any) => apiFetch<{ user: any; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => apiFetch('/auth/me'),

  // Project API
  getProjects: () => apiFetch<any[]>('/projects'),
  getProject: (projectId: string) => apiFetch(`/projects/${projectId}`),
  getHealth: (projectId: string) => apiFetch(`/projects/${projectId}/health`),
  getBOQ: (projectId: string) => apiFetch(`/projects/${projectId}/boq`),
  addBOQItem: (projectId: string, item: any) => apiFetch(`/projects/${projectId}/boq`, { method: 'POST', body: JSON.stringify(item) }),
  getBudgetVsActual: (projectId: string) => apiFetch(`/projects/${projectId}/budget-vs-actual`),
  getDailyReports: (projectId: string) => apiFetch(`/projects/${projectId}/daily-reports`),
  submitDailyReport: (projectId: string, report: any) => apiFetch(`/projects/${projectId}/daily-reports`, { method: 'POST', body: JSON.stringify(report) }),
  approveChangeRequest: (projectId: string, reqId: string) => apiFetch(`/projects/${projectId}/change-requests/${reqId}/approve`, { method: 'POST' }),
  rejectChangeRequest: (projectId: string, reqId: string) => apiFetch(`/projects/${projectId}/change-requests/${reqId}/reject`, { method: 'POST' }),
  getChangeRequests: (projectId: string) => apiFetch(`/projects/${projectId}/change-requests`),
  getMessages: (entityType: string, entityId: string) => apiFetch(`/messages/${entityType}/${entityId}`),
  sendMessage: (data: any) => apiFetch('/messages', { method: 'POST', body: JSON.stringify(data) })
};
