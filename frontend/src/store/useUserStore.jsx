import { create } from 'zustand';
import { login, signup } from '../services/api';

const useUserStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  error: '',

  signIn: async ({ username, password }) => {
    try {
      const res = await login({ username, password });
      const token = res.data.token;
      const userData = { username }; // You can customize this if backend sends full user info

      // Save token and user
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);

      set({ user: userData, token, error: '' });
      return { success: true, message: res.data.message };
    } catch (err) {
      set({ error: 'Invalid credentials' });
      return { success: false, message: 'Invalid credentials' };
    }
  },

  signUp: async ({ username, password }) => {
    try {
      const res = await signup({ username, password });
      const token = res.data.token;
      const userData = { username };

      // Save token and user
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);

      set({ user: userData, token, error: '' });
      return { success: true, message: res.data.message || 'User registered' };
    } catch (err) {
      set({ error: 'Signup failed' });
      return { success: false, message: 'Signup failed' };
    }
  },

  signOut: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null, error: '' });
  },

  clearError: () => set({ error: '' }),
}));

export default useUserStore;
