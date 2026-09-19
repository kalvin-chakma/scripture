import { create } from "zustand";
import {
  login,
  signup,
  getUsetdata,
  googleSignInWithCode,
  deleteAccount,
} from "../services/api";

const useUserStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  error: "",
  userData: null,

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
  signUp: async ({ name, username, password }) => {
    try {
      const res = await signup({ name, username, password });
      set({ error: "" });
      return { success: true, message: res.data.message || "User registered" };
    } catch (err) {
      const message = err.response?.data?.message || "Signup failed";
      set({ error: message });
      return { success: false, message: message };
    }
  },

  googleSignIn: () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      set({ error: "Google sign-in is not configured." });
      return;
    }

    const state = crypto.randomUUID();
    sessionStorage.setItem("google_oauth_state", state);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${window.location.origin}/auth/google/callback`,
      response_type: "code",
      scope: "openid email profile",
      access_type: "online",
      prompt: "select_account",
      state,
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  },

  googleSignInCallback: async (code) => {
    try {
      const res = await googleSignInWithCode(code);
      const token = res.data.token;

      localStorage.setItem("token", token);
      set({ token, error: "" });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Google sign-in failed";
      set({ error: message });
      return { success: false, message };
    }
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

  //delete account
  deleteAccount: async (password) => {
    try {
      await deleteAccount({ password });
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("noteTypeOrder");
      set({ user: null, token: null, userData: null, error: "" });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete account";
      return { success: false, message };
    }
  },

  //error state
  clearError: () => set({ error: "" }),
}));

export default useUserStore;
