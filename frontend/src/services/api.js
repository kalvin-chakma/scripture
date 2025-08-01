import axios from "axios";

export const API = "https://scripture-xi.vercel.app";
//export const API = "http://localhost:3000";

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

// Notes APIs
export const saveNote = (data) => apiClient.post("/note/save", data);
export const getNote = (data) => apiClient.get("/note/my-notes", data);
export const deleteNote = (id) => apiClient.delete(`/note/delete/${id}`);
export const updateNote = (id, data) =>
  apiClient.put(`/note/update/${id}`, data);

//User APIS
export const getUsetdata = () => apiClient.get("/user/userdata");
