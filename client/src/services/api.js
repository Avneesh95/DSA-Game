import axios from 'axios';

// In local dev, Vite proxies '/api' to the backend (see vite.config.js),
// so the relative path works with no config. In production, if the
// frontend and backend are deployed to different origins, set
// VITE_API_URL (e.g. https://api.yourapp.com/api) at build time.
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT to every request if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dsa100_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized 401 handling: clear stale auth state so ProtectedRoute
// bounces the user back to login instead of showing broken screens.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dsa100_token');
      localStorage.removeItem('dsa100_user');
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const doorApi = {
  getAll: () => api.get('/doors'),
  getByNumber: (doorNumber) => api.get(`/doors/${doorNumber}`),
};

export const problemApi = {
  getById: (id) => api.get(`/problems/${id}`),
  getHints: (id) => api.get(`/problems/${id}/hints`),
};

export const submissionApi = {
  run: (data) => api.post('/submissions/run', data),
  submit: (data) => api.post('/submissions/submit', data),
};

export const progressApi = {
  get: () => api.get('/progress'),
  update: (data) => api.put('/progress', data),
};

export const achievementApi = {
  getAll: () => api.get('/achievements'),
};

export default api;
