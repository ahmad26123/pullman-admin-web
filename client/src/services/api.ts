const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getAuthHeaders(): HeadersInit {
  let token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Default fallback token for secretary or admin if not logged in
  if (!token && typeof window !== 'undefined') {
    const role = localStorage.getItem('user_role') || 'secretary';
    token = localStorage.getItem(`${role}_token`);
  }

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchAPI(endpoint: string, options?: RequestInit) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        ...getAuthHeaders(),
        ...options?.headers,
      },
      ...options,
    });
    
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json.message || `API Error: ${res.status}`);
    }
    return json;
  } catch (error) {
    console.warn(`[API fetchAPI fallback for ${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  auth: {
    login: async (credentials: { username: string; password: string }) => {
      const res = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (res.data?.token && typeof window !== 'undefined') {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user_role', res.data.user.role);
        localStorage.setItem('user_name', res.data.user.name);
        localStorage.setItem(`${res.data.user.role}_token`, res.data.token);
      }
      return res;
    },
    register: (userData: any) =>
      fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  },
  busModels: {
    getAll: () => fetchAPI('/bus-models'),
    create: (data: any) => fetchAPI('/bus-models', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchAPI(`/bus-models/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    updateFleet: (id: string, totalBusesCount: number) => 
      fetchAPI(`/bus-models/${id}/fleet`, { method: 'PATCH', body: JSON.stringify({ totalBusesCount }) }),
  },
  trips: {
    getAll: (params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchAPI(`/trips${query}`);
    },
    getById: (id: string) => fetchAPI(`/trips/${id}`),
    create: (data: any) => fetchAPI('/trips', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchAPI(`/trips/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    reschedule: (id: string, data: { newTripDate: string; newTripTime: string }) => 
      fetchAPI(`/trips/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`/trips/${id}`, { method: 'DELETE' }),
  },
  bookings: {
    getAll: () => fetchAPI('/bookings'),
    getById: (id: string) => fetchAPI(`/bookings/${id}`),
    create: (data: { tripId: string; seatNumbers: number[] }, customToken?: string) => 
      fetchAPI('/bookings', { 
        method: 'POST', 
        headers: customToken ? { Authorization: `Bearer ${customToken}` } : {},
        body: JSON.stringify(data) 
      }),
    confirm: (id: string, customToken?: string) => 
      fetchAPI(`/bookings/${id}/confirm`, { 
        method: 'PATCH',
        headers: customToken ? { Authorization: `Bearer ${customToken}` } : {},
      }),
    cancel: (id: string, customToken?: string) => 
      fetchAPI(`/bookings/${id}/cancel`, { 
        method: 'PATCH',
        headers: customToken ? { Authorization: `Bearer ${customToken}` } : {},
      }),
  },
  users: {
    getAll: () => fetchAPI('/users'),
    getById: (id: string) => fetchAPI(`/users/${id}`),
    update: (id: string, data: any) => fetchAPI(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`/users/${id}`, { method: 'DELETE' }),
  },
};
