
import axios from 'axios';

const API = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001';


const apiClient = axios.create({
  baseURL: API,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (credentials) => apiClient.post('/user/signin', credentials);
export const signup = (credentials) => apiClient.post('/user/signup', credentials);
export const saveNote = (data) => apiClient.post('/save', data);
