const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

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
  login: (email: string, password: string) =>
    apiFetch<{ user: any; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data: any) =>
    apiFetch<{ user: any; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => apiFetch('/auth/me'),

  getProjects: () => apiFetch<any[]>('/projects'),
  createProject: (data: any) => apiFetch<any>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  getProject: (id: string) => apiFetch<any>(`/projects/${id}`),
  addMember: (id: string, data: { email: string; role: string }) =>
    apiFetch(`/projects/${id}/members`, { method: 'POST', body: JSON.stringify(data) })
};
