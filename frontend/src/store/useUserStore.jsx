import { create } from "zustand";
import { login, signup, API, getUsetdata } from "../services/api";

const useUserStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  error: "",
  userData: null,

  // Theme state
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
  //thene toggle
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

  // signin state
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
      const message = err.response?.data?.message || "Failed to sign in";
      set({ error: message });
      return { success: false, message: message };
    }
  },
  //signup state
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

  googleSignIn: async () => {
    window.location.href = "https://scripture-xi.vercel.app/user/auth/google/";
  },

  //signout state
  signOut: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("noteTypeOrder");
    set({ user: null, token: null, error: "" });
  },

  //Fetch User Profile
  fetchUsetdata: async () => {
    try {
      const res = await getUsetdata();
      set({ userData: res.data.user });
      return {
        success: true,
        userData: res.data.user,
        message: res.data.message,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  //error state
  clearError: () => set({ error: "" }),
}));

export default useUserStore;
