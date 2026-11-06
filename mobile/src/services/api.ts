const API_BASE_URL = 'http://localhost:5000/api';

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
  trips: {
    getAll: () => fetchAPI('/trips'),
  },
  bookings: {
    getAll: () => fetchAPI('/bookings'),
    create: (data: { tripId: string; seatNumber: number }) => 
      fetchAPI('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  },
};
