export const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const API_URL = `${BASE_URL}/api`;

export const api = {
  async get(endpoint: string, options: RequestInit = {}) {
    return fetchAPI(endpoint, { ...options, method: 'GET' });
  },
  
  async post(endpoint: string, data?: any, options: RequestInit = {}) {
    return fetchAPI(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  
  async put(endpoint: string, data?: any, options: RequestInit = {}) {
    return fetchAPI(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  
  async delete(endpoint: string, options: RequestInit = {}) {
    return fetchAPI(endpoint, { ...options, method: 'DELETE' });
  },

  /**
   * Upload a file via multipart/form-data.
   * Returns the parsed JSON response (e.g. { file_path: '...' }).
   */
  async uploadFile(endpoint: string, file: File, fieldName = 'file') {
    const formData = new FormData();
    formData.append(fieldName, file);
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw { status: res.status, message: data?.message || res.statusText };
    return data;
  },
};

async function fetchAPI(endpoint: string, options: RequestInit) {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers || {});
  
  headers.set('Accept', 'application/json');
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && token) {
      // Auto logout on token expire
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    throw {
      status: response.status,
      message: data?.message || response.statusText,
      errors: data?.errors
    };
  }

  return data;
}
