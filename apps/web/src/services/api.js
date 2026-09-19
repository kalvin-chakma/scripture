import axios from "axios";

export const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const WS_URL = API.replace(/^http/, "ws");

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
export const googleSignInWithCode = (code) =>
  apiClient.post("/user/auth/google", { code });

// Notes APIs
export const saveNote = (data) => apiClient.post("/note/save", data);
export const getNote = (data) => apiClient.get("/note/my-notes", data);
export const deleteNote = (id) => apiClient.delete(`/note/delete/${id}`);
export const updateNote = (id, data) =>
  apiClient.put(`/note/update/${id}`, data);

//User APIS
export const getUsetdata = () => apiClient.get("/user/userdata");
export const updateProfile = (data) => apiClient.put("/user/profile", data);
export const changePassword = (data) => apiClient.put("/user/password", data);
export const deleteAccount = (data) => apiClient.delete("/user/account", { data });

// Collaboration APIs
export const getCollaborators = (noteId) =>
  apiClient.get(`/note/${noteId}/collaborators`);
export const addCollaborator = (noteId, email) =>
  apiClient.post(`/note/${noteId}/collaborators`, { email });
export const removeCollaborator = (noteId, userId) =>
  apiClient.delete(`/note/${noteId}/collaborators/${userId}`);
