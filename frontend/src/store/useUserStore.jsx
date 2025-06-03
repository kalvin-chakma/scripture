import { create } from "zustand";
import { login, signup } from "../services/api";

const useUserStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  error: "",

  // 🌗 Theme state
  theme: localStorage.getItem("theme") || "light",

  setTheme: (newTheme) => {
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    set({ theme: newTheme });
  },

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme);

      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      return { theme: newTheme };
    });
  },

  // 🔐 Authentication methods
  signIn: async ({ username, password }) => {
    try {
      const res = await login({ username, password });
      const token = res.data.token;
      const userData = { username };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);

      set({ user: userData, token, error: "" });
      return { success: true, message: res.data.message };
    } catch (err) {
      const message = err.response?.data?.message || "Invalid credentials";
      set({ error: message });
      return { success: false, message: message };
    }
  },

  signUp: async ({ username, password }) => {
    try {
      const res = await signup({ username, password });
      set({ error: "" });
      return { success: true, message: res.data.message || "User registered" };
    } catch (err) {
      const message = err.response?.data?.message || "Signup failed";
      set({ error: message });
      return { success: false, message: message };
    }
  },

  signOut: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null, error: "" });
  },

  clearError: () => set({ error: "" }),
}));

export default useUserStore;
