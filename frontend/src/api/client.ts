import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      toast.error('Session expired');
      window.location.href = '/login';
    } else if (status === 403) {
      toast.error('Forbidden');
    } else {
      toast.error('Server error');
    }
    return Promise.reject(error);
  },
);

export default api;
