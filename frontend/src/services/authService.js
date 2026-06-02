import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const authService = {
  login: (email, password) => {
    return axios.post(`${API_BASE_URL}/auth/login`, { email, password });
  },

  register: (userData) => {
    return axios.post(`${API_BASE_URL}/auth/register`, userData);
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  setToken: (token) => {
    localStorage.setItem('token', token);
  }
};

export default authService;
