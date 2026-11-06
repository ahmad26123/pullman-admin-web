const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) throw new Error('API request failed');
  return res.json();
}

export const api = {
  auth: {
    login: (credentials: { username: string; password: string }) => 
      fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData: any) => 
      fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  },
  users: {
    getAll: () => fetchAPI('/users'),
    getById: (id: string) => fetchAPI(`/users/${id}`),
  },
  busModels: {
    getAll: () => fetchAPI('/bus-models'),
    create: (data: any) => fetchAPI('/bus-models', { method: 'POST', body: JSON.stringify(data) }),
  },
  trips: {
    getAll: () => fetchAPI('/trips'),
    create: (data: any) => fetchAPI('/trips', { method: 'POST', body: JSON.stringify(data) }),
  },
  bookings: {
    getAll: () => fetchAPI('/bookings'),
    create: (data: any) => fetchAPI('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  },
};
