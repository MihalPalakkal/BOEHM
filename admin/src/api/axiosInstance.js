import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Update this based on the actual backend URL
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login'; // Hard redirect to clear state
    }
    return Promise.reject(error);
  }
);

export default api;
