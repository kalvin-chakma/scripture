import axios from "axios";

//const API = import.meta.env.REACT_APP_API_URL || "http://localhost:3001";
const API = "https://scripture-xi.vercel.app/";

const apiClient = axios.create({
  baseURL: API,
});

// Add Authorization header if token exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const login = (credentials) =>
  apiClient.post("/user/signin", credentials);
export const signup = (credentials) =>
  apiClient.post("/user/signup", credentials);
export const handleGoogleCallback = (code) =>
  apiClient.get(`/user/google/callback?code=${code}`);

// Notes APIs
export const saveNote = (data) => apiClient.post("/note/save", data);
export const getNote = (data) => apiClient.get("/note/my-notes", data);
export const deleteNote = (id) => apiClient.delete(`/note/delete/${id}`);
