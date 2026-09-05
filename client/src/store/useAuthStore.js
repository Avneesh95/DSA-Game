import { create } from 'zustand';
import { authApi } from '../services/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('dsa100_user') || 'null'),
  token: localStorage.getItem('dsa100_token') || null,
  isLoading: false,
  error: null,

  isAuthenticated: () => Boolean(get().token),

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authApi.register({ name, email, password });
      localStorage.setItem('dsa100_token', data.token);
      localStorage.setItem('dsa100_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authApi.login({ email, password });
      localStorage.setItem('dsa100_token', data.token);
      localStorage.setItem('dsa100_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  refreshProfile: async () => {
    try {
      const { data } = await authApi.me();
      localStorage.setItem('dsa100_user', JSON.stringify(data.user));
      set({ user: data.user });
    } catch {
      // Interceptor already clears storage on 401; nothing else to do here.
    }
  },

  logout: () => {
    localStorage.removeItem('dsa100_token');
    localStorage.removeItem('dsa100_user');
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
